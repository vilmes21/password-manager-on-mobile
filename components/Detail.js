import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    Button,
    ScrollView
} from 'react-native';
import screens from '../consts/screens'
import detailApi from '../db/detailApi'
import mixedApi from '../db/mixedApi'
import DetailItem from './DetailItem'
import DetailMenu from './DetailMenu'
import Generator from './Generator'
import Icon from 'react-native-vector-icons/FontAwesome';
import {showMessage} from "react-native-flash-message";
import modes from '../consts/modes'
import crypt from '../consts/crypt';
import salt from '../db/salt';

export default class Detail extends React.Component {
    state = {
        mode: this.props.screenData.isNew
            ? modes.edit
            : modes.read,
        arr: [],
        hasMadeEdits: false,
        beforeEditArr: [],
        generatorVisible: false,
        isLoading: true
    }

    componentDidMount() {
        const {isNew} = this.props.screenData;

        if (isNew) {
            this.addRow("Username");
            this.setState({isLoading: false})
        } else {
            this.getDetailsFromDB()
        }
    }

    toggleGenerator = generatorVisible => {
        this.setState({generatorVisible})
    }

    toMode = mode => {
        const obj = {
            mode
        };
        if (mode === modes.read) {
            obj.hasMadeEdits = false
        }
        this.setState(obj)
    }

    rmObj = obj => {
        this.setState({
            arr: this
                .state
                .arr
                .filter(x => x !== obj)
        })
    }

    backupBeforeEdit = callback => {
        const beforeEditArr = [];
        const {arr} = this.state;
        for (const obj of arr) {
            beforeEditArr.push({
                ...obj
            });
        }
        this.setState({
            beforeEditArr
        }, callback)
    }

    restore = () => {
        this.setState({arr: this.state.beforeEditArr})
    }

    getDetailsFromDB = () => {
        this.setState({isLoading: true})
        const {accountId} = this.props.screenData;
        const afterGettingDetailsDo = async arr => {
            let decryptedArr = [];
            if (arr.length > 0) {
                decryptedArr = await crypt.deDetails(arr);
            }

            this.setState({arr: decryptedArr, isLoading: false})
        }
        detailApi.getDetailByAccountId(accountId, afterGettingDetailsDo)
    }

    doChange = (id, index, name, txt) => {
        const clone = [];
        const {arr} = this.state;

        const decider = id
            ? (i, x) => x.id === id
            : (i, x) => index === i;

        for (let i = 0; i < arr.length; i++) {
            const x = arr[i];
            if (decider(i, x)) {
                clone.push({
                    ...x,
                    [name]: txt,
                    modified: true
                })
            } else {
                clone.push(x)
            }
        }

        this.setState({hasMadeEdits: true, arr: clone})
    }

    addRow = label => {
        this.setState({
            arr: [
                ...this.state.arr, {
                    key: typeof(label) === "string"
                        ? label
                        : "Password",
                    value: ""
                }
            ],
            hasMadeEdits: true
        })
    }

    saveRows = async() => {
        this.setState({isLoading: true});
        const {arr} = this.state;
        const modifiedArr = arr.length > 0
            ? arr.filter(x => x.modified)
            : [];
        const {screenData} = this.props;
        const {accountId, accountTitle} = screenData;

        if (modifiedArr.length === 0) {
            this.toMode(modes.read);
            this.setState({isLoading: false})
            return;
        }

        const toSend = {
            accountId,
            arr: modifiedArr
        }

        const saltSuffix = await salt.getSalt();
        if (!saltSuffix) {
            alert("Failed getting encryption salt");
            return;
        }

        toSend.arr = crypt.enDetails(toSend.arr, saltSuffix);

        /*
        toSendShape=[
     {
      "key": "Pw",
      "value": "123d",
      {
    },
      "accountId": 13,
      "id": 25,
      "key": "Username2",
      "modified": true,
      "saltPrefix": null,
      "value": "dsaf",
    },
  ]
        */

        const afterSaveDo = changedRowCount => {
            this.toMode(modes.read);
            this.getDetailsFromDB();

            this.setState({
                isLoading: false
            }, () => {
                showMessage({
                    type: "success",
                    message: `${changedRowCount} item${changedRowCount > 1
                        ? "s"
                        : ""} under ${accountTitle} saved`
                })
            });
        }
        detailApi.saveMany(toSend, afterSaveDo)
    }

    renderRows = arr => {
        if (arr.length === 0) {
            return <Text>No details</Text>
        }

        const {mode} = this.state;
        const {accountTitle} = this.props.screenData;

        return arr.map((row, index) => {

            return <DetailItem
                key={row.id
                ? row.id
                : `i_${index}`}
                index={index}
                accountTitle={accountTitle}
                rmObj={this.rmObj}
                mode={mode}
                handleChange={this.doChange}
                data={row}/>
        })
    }

    cancelEdits = () => {
        const {hasMadeEdits} = this.state;

        if (!hasMadeEdits) {
            this.toMode(modes.read);
            return;
        }

        Alert.alert('Giving up edits?', 'Data will be the same as before you clicked "Edit".', [
            {
                text: 'Give up edits',
                onPress: () => {
                    this.restore();
                    this.toMode(modes.read);
                }
            }, {
                text: 'Keep editing',
                onPress: () => {}
            }
        ], {cancelable: true});
    }

    confirmDeleteAccount = () => {
        const {screenData, toScreen} = this.props;
        const {accountId, accountTitle} = screenData;
        const {arr} = this.state;
        const arrLen = arr.length;

        Alert.alert(`Delete ${accountTitle}?`, `${arrLen > 1
            ? "All "
            : ""}${arrLen} item ${arrLen > 1
                ? "s"
                : ""} under ${accountTitle} will be deleted.`, [
            {
                text: 'Delete',
                onPress: () => {
                    const afterDeleteDo = () => {
                        toScreen(screens.all);
                        showMessage({message: `${accountTitle} deleted`, type: "success"});
                    };
                    mixedApi.deleteAccountCascade(accountId, afterDeleteDo);
                }
            }, {
                text: 'No',
                onPress: () => {}
            }
        ], {cancelable: true});
    }

    render() {
        const {generatorVisible, arr, mode, hasMadeEdits} = this.state;
        const {screenData, toScreen, lockApp} = this.props;
        const {isNew, accountTitle} = screenData;

        return (
            <View style={styles.colStart}>
                <View style={styles.rowSpaceBtw}>
                    {mode === modes.edit || <Icon
                        name="home"
                        size={30}
                        color="grey"
                        onPress={() => {
                        toScreen(screens.all)
                    }}/>}

                    {mode === modes.edit && <Button title="Generator" onPress= { () => { this.toggleGenerator(true) } }/>}

                    {mode === modes.edit || <Icon name="lock" size={30} color="grey" onPress={lockApp}/>}
                </View>

                <View style={styles.rowCenter}>
                    <View>
                        <Text style={styles.title}>
                            {accountTitle}
                        </Text>
                    </View>

                    {mode === modes.read && <DetailMenu backupBeforeEdit={this.backupBeforeEdit} toMode={this.toMode}/>
}

                </View>

                <ScrollView>
                    {this.renderRows(arr)}
                </ScrollView>

                {mode === modes.edit && <View style={styles.addRow}>
                    <Icon name="plus" size={30} color="grey" onPress={this.addRow}/>
                </View>
}

                <View style={styles.cancelEdits}></View>

                {mode === modes.edit && !isNew && <Button onPress={this.cancelEdits} title="Cancel edits"/>
}

                {mode === modes.edit && <Button disabled={!hasMadeEdits} onPress={this.saveRows} title="Save"/>}

                {mode === modes.delete && <Button
                    onPress={() => {
                    this.toMode(modes.read);
                }}
                    title="Done"/>
}

                {mode === modes.delete && <TouchableOpacity onLongPress={this.confirmDeleteAccount} style={styles.trash}>
                    <Icon name="trash" size={15} color="red"/>
                </TouchableOpacity>}

                <Generator
                    toggleGenerator={this.toggleGenerator}
                    generatorVisible={generatorVisible}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    menuOption: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 70
    },
    colStart: {
        flex: 1,
        flexDirection: "column",
        alignContent: "flex-start"

    },
    rowSpaceBtw: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowCenter: {
        paddingTop: 20,
        paddingBottom: 20,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center'
    },
    title: {
        paddingRight: 20,
        fontWeight: "bold",
        fontSize: 25
    },
    modeOption: {
        fontSize: 20
    },
    addRow: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center'
    },
    cancelEdits: {
        padding: 20
    },
    trash: {
        position: "absolute",
        bottom: 20,
        left: 20
    }
});