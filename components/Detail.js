import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    Button
} from 'react-native';
import screens from '../consts/screens'
import detailApi from '../db/detailApi'
import DetailItem from './DetailItem'

export default class Detail extends React.Component {
    state = {
        savedArr: [],
        newRowArr: []
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
        this.setState({
            newRowArr: cloneArr
        }, () => {
            console.log(this.state)
        })
    }

    addRow = () => {
        this.setState({
            newRowArr: [
                ...this.state.newRowArr, {
                    key: "",
                    value: ""
                }
            ]
        })
    }

    showNewRows = newRowArr => {

        if (newRowArr.length === 0) {
            return null;
        }

        const {editable} = this.props.screenData;

        return newRowArr.map((row, index) => {
            return <DetailItem
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
            savedArr: cloneArr
        }, () => {
            console.log(this.state)
        })
    }

    renderSavedRows = savedArr => {
        if (savedArr.length === 0) {
            return null;
        }

        const {editable} = this.props.screenData;

        return savedArr.map(row => {
            return <DetailItem
                editable={editable}
                handleChange={this.handleChangeGeneric}
                key={row.id}
                data={row}
                modifyExisting={this.modifyExisting}/>
        })
    }

    render() {
        const {savedArr, newRowArr} = this.state;
        const {screenData, showScreen, toggleEditable, cancelEdits, backupCurrent} = this.props;
        const {isNew,accountId, editable, accountTitle} = screenData;

        return (
            <View style={{
                paddingTop: 80
            }}>
                <Text
                    style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 25
                }}>
                    Account - {accountId}. {accountTitle}
                </Text>

                {editable || <Button
                    onPress={() => {
                    backupCurrent(() => {
                        toggleEditable(true)
                    });
                }}
                    title="Edit"/>}

                {editable && !isNew && <Button onPress={cancelEdits} title="Cancel edits"/>
}

                {this.renderSavedRows(savedArr)}

                {this.showNewRows(newRowArr)}

                {editable && <Button onPress={this.addRow} title="Add row"/>
}

                <View style={{
                    padding: 20
                }}></View>

                {editable || <Button
                    onPress={() => {
                    showScreen(screens.all)
                }}
                    title="Back"/>}

                <View style={{
                    padding: 20
                }}></View>

                {editable && <Button onPress={this.saveRows} title="Save"/>}

            </View>
        );
    }
}
