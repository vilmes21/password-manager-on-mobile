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
import modes from '../consts/modes'


export default class Detail extends React.Component {
    state = {
        savedArr: [],
        newRowArr: [],
        beforeEditArr: [],
        hasMadeEdits: false,
        mode: modes.read
    }

    toMode = mode => {
        this.setState({mode})
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
        this.setState({savedArr: beforeEditArr, newRowArr: []})
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

        const {mode}= this.state;
        const { isNew, accountTitle} = this.props.screenData;

        return newRowArr.map((row, index) => {
            return <DetailItem
            accountTitle= {accountTitle}
                markEditsMade={this.markEditsMade}
                rmItemFromNewArr={this.rmItemFromNewArr}
                rmItemFromSavedArr={this.rmItemFromSavedArr}
                isNew={isNew}
                mode={mode}
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
        const {screenData} = this.props;
        const {accountId, accountTitle} = screenData;

        const toSend = {
            accountId,
            newRowArr: newRowArr.concat(modifiedArr)
        }

        const changedRowCount = toSend.newRowArr.length;

        if (changedRowCount === 0){
            this.toMode(modes.read);
            this.getDetailsFromDB();
            
            this.setState({
                newRowArr: [],
                hasMadeEdits: false
            })
            //since 0 item no need to alert
            return;
        }

        const afterSaveDo = () => {
            this.toMode(modes.read);
            this.getDetailsFromDB();
            
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

        const {mode}=this.state;

        const { accountTitle} = this.props.screenData;

        return savedArr.map(row => {
            return <DetailItem
            accountTitle={accountTitle}
                markEditsMade={this.markEditsMade}
                rmItemFromNewArr={this.rmItemFromNewArr}
                rmItemFromSavedArr={this.rmItemFromSavedArr}
                isNew={false}
                mode={mode}
                handleChange={this.handleChangeGeneric}
                key={row.id}
                data={row}
                modifyExisting={this.modifyExisting}/>
        })
    }

    cancelEdits = () => {
        const {hasMadeEdits} = this.state;

        if (!hasMadeEdits) {
            this.toMode(modes.read);
            return;
        }

        Alert.alert('Giving up edits?', 'If so, data will be the same as before you clicked "Edit".', [
            {
                text: 'Give up edits',
                onPress: () => {
                    this.restoreBeforeEdit();
                    this.toMode(modes.read);
                }
            }, {
                text: 'Keep editing',
                onPress: () => {}
            }
        ], {cancelable: true});
    }

    confirmDeleteAccount = () => {
        const {screenData, showScreen} = this.props;
        const {isNew, accountId, accountTitle} = screenData;
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
        const {savedArr, newRowArr, mode,hasMadeEdits} = this.state;
        const {screenData, showScreen, lock} = this.props;
        const {isNew, accountId, accountTitle} = screenData;

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
                        showScreen(screens.all)
                    }}/>}

                    {mode === modes.edit || <Icon name="lock" size={30} color="grey" onPress={lock}/>}

                </View>

                <View
                    style={{
                    paddingTop: 20,
                    paddingBottom: 20,
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>

{
    mode === modes.read &&
<Button onPress={()=>{
                    this.toMode(modes.delete);
                }} title="del mode"/>
}

                
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
                        {mode === modes.read && <Icon
                            name="pencil"
                            size={25}
                            color="grey"
                            onPress={() => {
                            this.backupBeforeEdit(() => {
                                this.toMode(modes.edit);
                            });
                        }}/>}

                        {mode === modes.edit && !isNew && <Button onPress={this.cancelEdits} title="Cancel edits"/>
}
                    </View>
                </View>

                <ScrollView>

                    {this.renderSavedRows(savedArr)}

                    {this.showNewRows(newRowArr)}

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

                {mode === modes.edit && <Button disabled={!hasMadeEdits} onPress={this.saveRows} title="Save"/>}

{
    mode === modes.delete &&
<Button onPress={()=>{
                    this.toMode(modes.read);
                }} title="Done"/>
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

            </View>
        );
    }
}
