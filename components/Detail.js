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
import Generator from './Generator'
import Icon from 'react-native-vector-icons/FontAwesome';
import {showMessage} from "react-native-flash-message";
import modes from '../consts/modes'
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';
import crypt from '../consts/crypt';
import salt from '../db/salt';

export default class Detail extends React.Component {
    state = {
        mode: this.props.screenData.isNew
            ? modes.edit
            : modes.read,
        savedArr: [],
        newRowArr: [],
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
        const obj = {mode};
        if (mode === modes.read){
            obj.hasMadeEdits = false
        }
        this.setState(obj)
    }

    rmObj = obj => {
        const arrName = obj.id
            ? "savedArr"
            : "newRowArr";

        this.setState({
            [arrName]: this
                .state[arrName]
                .filter(x => x !== obj)
        })
    }

    backupBeforeEdit = callback => {
        const beforeEditArr = [];
        const {savedArr} = this.state;
        for (const obj of savedArr) {
            beforeEditArr.push({
                ...obj
            });
        }
        this.setState({
            beforeEditArr
        }, callback)
    }

    restore = () => {
        const {beforeEditArr} = this.state;
        this.setState({savedArr: beforeEditArr, newRowArr: []})
    }

    getDetailsFromDB = () => {
        this.setState({isLoading: true})
        const {accountId} = this.props.screenData;
        const afterGettingDetailsDo = async savedArr => {
            let decryptedArr = [];
            if (savedArr.length > 0) {
                decryptedArr = await crypt.deDetails(savedArr);
            }

            this.setState({savedArr: decryptedArr, isLoading: false})
        }
        detailApi.getDetailByAccountId(accountId, afterGettingDetailsDo)
    }

    doChange = (obj, name, txt) => {
        const clone = [];
        const arrName = obj.id
            ? "savedArr"
            : "newRowArr";
        for (const x of this.state[arrName]) {
            if (x === obj) {
                clone.push({
                    ...obj,
                    [name]: txt,
                    modified: true
                })
            } else {
                clone.push(obj)
            }
        }

        this.setState({hasMadeEdits: true, [arrName]: clone})
    }

    addRow = label => {
        this.setState({
            newRowArr: [
                ...this.state.newRowArr, {
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
        const {newRowArr, savedArr} = this.state;

        const modifiedArr = savedArr.length > 0
            ? savedArr.filter(x => x.modified)
            : [];
        const {screenData} = this.props;
        const {accountId, accountTitle} = screenData;

        const needSaveArr = newRowArr.concat(modifiedArr);

        if (needSaveArr.length === 0) {
            this.toMode(modes.read);
            this.setState({newRowArr: [], isLoading: false})
            return;
        }

        const toSend = {
            accountId,
            newRowArr: needSaveArr
        }

        const saltSuffix = await salt.getSalt();
        if (!saltSuffix) {
            alert("Failed getting encryption salt");
            return;
        }

        toSend.newRowArr = crypt.enDetails(toSend.newRowArr, saltSuffix);

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
                newRowArr: [],
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
                key={row.id || `i_${index}`}
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
        const {savedArr} = this.state;
        const savedArrLen = savedArr.length;

        Alert.alert(`Delete ${accountTitle}?`, `${savedArrLen > 1
            ? "All "
            : ""}${savedArrLen} item ${savedArr > 1
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
        const {generatorVisible, savedArr, newRowArr, mode, hasMadeEdits} = this.state;
        const {screenData, toScreen, lockApp} = this.props;
        const {isNew, accountTitle} = screenData;

        return (
            <View
                style={{
                flex: 1,
                flexDirection: "column",
                alignContent: "flex-start"
            }}>

                <View
                    style={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>

                    {mode === modes.edit || <Icon
                        name="home"
                        size={30}
                        color="grey"
                        onPress={() => {
                        toScreen(screens.all)
                    }}/>}

                    {mode === modes.edit && < Button title = "Generator" onPress = {
                        () => {
                            this.toggleGenerator(true)
                        }
                    } />}

                    {mode === modes.edit || <Icon name="lock" size={30} color="grey" onPress={lockApp}/>}

                </View>

                <View
                    style={{
                    paddingTop: 20,
                    paddingBottom: 20,
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>

                    <View>
                        <Text
                            style={{
                            paddingRight: 20,
                            fontWeight: "bold",
                            fontSize: 25
                        }}>
                            {accountTitle}
                        </Text>
                    </View>

                    {mode === modes.read && <View>

                        <Menu>
                            <MenuTrigger>
                                <Icon name="ellipsis-v" size={30} color="grey"/>
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption
                                    style={styles.menuOption}
                                    onSelect={() => {
                                    this.backupBeforeEdit(() => {
                                        this.toMode(modes.edit);
                                    });
                                }}>
                                    <Text
                                        style={{
                                        fontSize: 20
                                    }}>Edit mode</Text>
                                </MenuOption>

                                <MenuOption
                                    style={styles.menuOption}
                                    onSelect={() => {
                                    this.toMode(modes.delete);
                                }}>
                                    <Text
                                        style={{
                                        color: 'red',
                                        fontSize: 20
                                    }}>Deletion mode</Text>
                                </MenuOption>

                            </MenuOptions>
                        </Menu>

                    </View>
}

                </View>

                <ScrollView>
                    {this.renderRows(savedArr.concat(newRowArr))}
                </ScrollView>

                {mode === modes.edit && <View
                    style={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <Icon name="plus" size={30} color="grey" onPress={this.addRow}/>
                </View>
}

                <View style={{
                    padding: 20
                }}></View>

                {mode === modes.edit && !isNew && <Button onPress={this.cancelEdits} title="Cancel edits"/>
}

                {mode === modes.edit && <Button disabled={!hasMadeEdits} onPress={this.saveRows} title="Save"/>}

                {mode === modes.delete && <Button
                    onPress={() => {
                    this.toMode(modes.read);
                }}
                    title="Done"/>
}

                {mode === modes.delete && <TouchableOpacity
                    onLongPress={this.confirmDeleteAccount}
                    style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20
                }}>
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
    }
});