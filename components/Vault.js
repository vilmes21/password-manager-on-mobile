import React from 'react';
import {StyleSheet,Alert, Text, View, Button} from 'react-native';
import Add from './Add'
import Detail from './Detail'
import Account from './Account'
import screens from '../consts/screens'
import accountApi from '../db/accountApi'

export default class Vault extends React.Component {
    state = {
        screenNow: screens.all,
        screenData: null,
        accounts: []
    }

    componentDidMount() {
        const setStateAccounts = accountArr => {
            this.setState({accounts: accountArr})
        }

        accountApi.getAll(setStateAccounts)
    }

    backupCurrent = () =>{}

    showScreen = (screenNow, screenData) => {
        this.setState({screenNow, screenData})
    }

    toggleEditable = isEditable => {
        this.setState({
            screenData: {
                ...this.state.screenData,
                editable: isEditable
            }
        })
    }

    showList = accounts => {
        if (!accounts || accounts.length === 0) {
            return <Text>0 item</Text>
        }

        return accounts.map(x => <Account key={x.id} data={x} showScreen={this.showScreen}/>)
    }

    cancelEdits = () => {
        Alert.alert('Giving up edits?', 'If so, data will be the same as before you clicked "Edit".', [
            {
                text: 'Give up edits',
                onPress: () => {this.toggleEditable(false)}
            },
            {
                text: 'Keep editing',
                onPress: () => {}
            }
        ], {
            cancelable: true
        },);
    }

    render() {
        const {screenNow, screenData, accounts} = this.state;

        if (screenNow === screens.add) {
            return <Add showScreen={this.showScreen}/>
        } else if (screenNow === screens.detail) {
            return <Detail
            backupCurrent={this.backupCurrent}
                showScreen={this.showScreen}
                screenData={screenData}
                toggleEditable={this.toggleEditable}
                cancelEdits={this.cancelEdits}
                />
        }

        return (
            <View style={{
                padding: 50
            }}>

                <Text
                    style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 25
                }}>
                    My Vault
                </Text>

                {this.showList(accounts)}

                <Button
                    onPress={() => {
                    this.showScreen(screens.add)
                }}
                    title="Add"/>

                <Button onPress={this.props.lock} title="Lock"/>
            </View>
        );
    }
}
