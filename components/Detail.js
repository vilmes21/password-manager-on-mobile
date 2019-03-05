import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    Button,
    ScrollView
} from 'react-native';
import screens from '../consts/screens'
import detailApi from '../db/detailApi'
import DetailItem from './DetailItem'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Detail extends React.Component {
    state = {
        savedArr: [],
        newRowArr: [],
        beforeEditArr: [],
        hasMadeEdits: false
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
            ]
        })
    }

    showNewRows = newRowArr => {

        if (newRowArr.length === 0) {
            return null;
        }

        const {editable, isNew} = this.props.screenData;

        return (
            <ScrollView>
                {newRowArr.map((row, index) => {
                    return <DetailItem
                        isNew={isNew}
                        editable={editable}
                        handleChange={this.handleChangeGeneric}
                        key={row.id || `i_${index}`}
                        index={index}
                        data={row}/>
                })}
            </ScrollView>
        )
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

        const afterSaveDo = () => {
            this.getDetailsFromDB();
            toggleEditable(false);
            this.setState({
                newRowArr: []
            }, () => {
                Alert.alert('Saved for: ' + accountTitle, changedRowCount + ' items', [
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
        this.setState({
            hasMadeEdits: true,
            savedArr: cloneArr
        })
    }

    renderSavedRows = savedArr => {
        if (savedArr.length === 0) {
            return null;
        }

        const {editable} = this.props.screenData;

        return savedArr.map(row => {
            return <DetailItem
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

        console.log("2222222 hasMadeEdits: ", hasMadeEdits)
        
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

    render() {
        const {savedArr, newRowArr} = this.state;
        const {screenData, showScreen, toggleEditable, lock} = this.props;
        const {isNew, accountId, editable, accountTitle} = screenData;

        return (
            <View
                style={{
                paddingTop: 80,
                paddingRight: 20,
                paddingLeft: 20
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
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingTop: 10,
                    paddingBottom: 35
                }}>
                    <View>
                        <Text
                            style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 25
                        }}>
                            Account - {accountId}. {accountTitle}
                        </Text>
                    </View>

                    <View>
                        {editable || <Icon
                            name="pencil"
                            size={30}
                            color="grey"
                            onPress={() => {
                            this.backupBeforeEdit(() => {
                                toggleEditable(true)
                            });
                        }}/>}

                        {editable && !isNew && <Button onPress={this.cancelEdits} title="Cancel edits"/>
}
                    </View>
                </View>

                {this.renderSavedRows(savedArr)}

                {this.showNewRows(newRowArr)}

                {editable && <Icon name="plus" size={30} color="grey" onPress={this.addRow}/>
}

                <View style={{
                    padding: 20
                }}></View>

                {editable && <Button onPress={this.saveRows} title="Save"/>}

            </View>
        );
    }
}
