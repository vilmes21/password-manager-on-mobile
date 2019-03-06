import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button,
    ScrollView
} from 'react-native';
import screens from '../consts/screens'
import detailApi from '../db/detailApi'
import mixedApi from '../db/mixedApi'
import DetailItem from './DetailItem'
import Icon from 'react-native-vector-icons/FontAwesome';
import {showMessage, hideMessage} from "react-native-flash-message";

export default class Detail extends React.Component {
    state = {
        savedArr: [],
        newRowArr: [],
        beforeEditArr: [],
        hasMadeEdits: false
    }

    rmItemFromNewArr = obj => {
        this.setState({
            newRowArr: this
                .state
                .newRowArr
                .filter(x => x !== obj)
        })
    }

    rmItemFromSavedArr = id => {
        this.setState({
            savedArr: this
                .state
                .savedArr
                .filter(x => x.id !== id)
        })
    }

    markEditsMade = () => {
        this.setState({hasMadeEdits: true})
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

    restoreBeforeEdit = () => {
        const {beforeEditArr} = this.state;
        this.setState({savedArr: beforeEditArr})
    }

    componentDidMount() {

        const {isNew} = this.props.screenData;

        if (isNew) {
            this.addRow();
            return;
        }
        this.getDetailsFromDB()
    }

    getDetailsFromDB = () => {
        const {accountId} = this.props.screenData;

        const setStateDetail = savedArr => {
            this.setState({savedArr})
        }
        detailApi.getDetailByAccountId(accountId, setStateDetail)
    }

    handleChangeGeneric = (index, name, txt) => {
        const {newRowArr} = this.state;
        const cloneArr = [];
        for (let i = 0; i < newRowArr.length; i++) {
            const obj = newRowArr[i];
            if (i === index) {
                cloneArr.push({
                    ...obj,
                    [name]: txt
                })
            } else {
                cloneArr.push(obj)
            }
        }
        this.setState({hasMadeEdits: true, newRowArr: cloneArr})
    }

    addRow = () => {
        this.setState({
            newRowArr: [
                ...this.state.newRowArr, {
                    key: "Username",
                    value: ""
                }
            ],
            hasMadeEdits: true
        })
    }

    showNewRows = newRowArr => {

        if (newRowArr.length === 0) {
            return null;
        }

        const {editable, isNew} = this.props.screenData;

        return newRowArr.map((row, index) => {
            return <DetailItem
                markEditsMade={this.markEditsMade}
                rmItemFromNewArr={this.rmItemFromNewArr}
                rmItemFromSavedArr={this.rmItemFromSavedArr}
                isNew={isNew}
                editable={editable}
                handleChange={this.handleChangeGeneric}
                key={row.id || `i_${index}`}
                index={index}
                data={row}/>
        })
    }

    saveRows = () => {
        const {newRowArr, savedArr} = this.state;

        const modifiedArr = savedArr.length > 0
            ? savedArr.filter(x => x.modified)
            : [];
        const {screenData, toggleEditable} = this.props;
        const {accountId, accountTitle} = screenData;

        const toSend = {
            accountId,
            newRowArr: newRowArr.concat(modifiedArr)
        }

        const changedRowCount = toSend.newRowArr.length;

        if (changedRowCount === 0){
            this.getDetailsFromDB();
            toggleEditable(false);
            this.setState({
                newRowArr: [],
                hasMadeEdits: false
            })
            //since 0 item no need to alert
            return;
        }

        const afterSaveDo = () => {
            this.getDetailsFromDB();
            toggleEditable(false);
            this.setState({
                newRowArr: [],
                hasMadeEdits: false
            }, () => {
                Alert.alert(`Saved for: ${accountTitle}`, `${changedRowCount} item${changedRowCount > 1
                    ? "s"
                    : ""}`, [
                    {
                        text: 'OK',
                        onPress: () => {}
                    }
                ], {
                    cancelable: true
                },);
            });
        }
        detailApi.saveMany(toSend, afterSaveDo)
    }

    modifyExisting = (detailId, name, txt) => {
        const {savedArr} = this.state;
        const cloneArr = [];
        for (let i = 0; i < savedArr.length; i++) {
            const obj = savedArr[i];
            if (obj.id === detailId) {
                cloneArr.push({
                    ...obj,
                    [name]: txt,
                    modified: true
                })
            } else {
                cloneArr.push(obj)
            }
        }
        this.setState({hasMadeEdits: true, savedArr: cloneArr})
    }

    renderSavedRows = savedArr => {
        if (savedArr.length === 0) {
            return null;
        }

        const {editable} = this.props.screenData;

        return savedArr.map(row => {
            return <DetailItem
                markEditsMade={this.markEditsMade}
                rmItemFromNewArr={this.rmItemFromNewArr}
                rmItemFromSavedArr={this.rmItemFromSavedArr}
                isNew={false}
                editable={editable}
                handleChange={this.handleChangeGeneric}
                key={row.id}
                data={row}
                modifyExisting={this.modifyExisting}/>
        })
    }

    cancelEdits = () => {
        const {hasMadeEdits} = this.state;
        const {toggleEditable} = this.props;

        if (!hasMadeEdits) {
            toggleEditable(false);
            return;
        }

        Alert.alert('Giving up edits?', 'If so, data will be the same as before you clicked "Edit".', [
            {
                text: 'Give up edits',
                onPress: () => {
                    this.restoreBeforeEdit();
                    toggleEditable(false);
                }
            }, {
                text: 'Keep editing',
                onPress: () => {}
            }
        ], {cancelable: true});
    }

    confirmDeleteAccount = () => {
        const {screenData, showScreen} = this.props;
        const {isNew, accountId, editable, accountTitle} = screenData;
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
                        showScreen(screens.all);
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
        const {savedArr, newRowArr, hasMadeEdits} = this.state;
        const {screenData, showScreen, toggleEditable, lock} = this.props;
        const {isNew, accountId, editable, accountTitle} = screenData;

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

                    {editable || <Icon
                        name="home"
                        size={30}
                        color="grey"
                        onPress={() => {
                        showScreen(screens.all)
                    }}/>}

                    {editable || <Icon name="lock" size={30} color="grey" onPress={lock}/>}

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
                            {accountId}. {accountTitle}
                        </Text>
                    </View>

                    <View>
                        {editable || <Icon
                            name="pencil"
                            size={25}
                            color="grey"
                            onPress={() => {
                            this.backupBeforeEdit(() => {
                                toggleEditable(true);
                            });
                        }}/>}

                        {editable && !isNew && <Button onPress={this.cancelEdits} title="Cancel edits"/>
}
                    </View>
                </View>

                <ScrollView>

                    {this.renderSavedRows(savedArr)}

                    {this.showNewRows(newRowArr)}

                </ScrollView>

                {editable && <View
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

                {editable && <Button disabled={!hasMadeEdits} onPress={this.saveRows} title="Save"/>}

                {editable && <TouchableOpacity
                    onLongPress={this.confirmDeleteAccount}
                    style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20
                }}>
                    <Icon name="trash" size={15} color="red"/>
                </TouchableOpacity>}

            </View>
        );
    }
}
