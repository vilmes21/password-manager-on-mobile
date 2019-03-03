import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
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

    componentDidMount(){
        const setStateAccounts = accountArr => {
            this.setState({accounts: accountArr })
        }

        accountApi.getAll(setStateAccounts)
    }

    showScreen = (screenNow, screenData) => {
        this.setState({screenNow, screenData})
    }

    makeEditable = () => {
        this.setState({
            screenData: {
                ...this.state.screenData,
                editable: true
            }
        })
    }

    showList = accounts => {
        if (!accounts || accounts.length === 0){
            return null;
        }

        return accounts.map(x => <Account key={x.id} data={x} showScreen={this.showScreen}/>)
    }
    
    render() {
        const {screenNow, screenData, accounts} = this.state;

        if (screenNow === screens.add) {
            return <Add showScreen={this.showScreen}/>
        } else if (screenNow === screens.detail) {
            return <Detail showScreen={this.showScreen} screenData={screenData}
            makeEditable={this.makeEditable}/>
        }

        return (
            <View>
                {this.showList(accounts)}

                <Button
                    onPress={() => {
                    this.showScreen(screens.add)
                }}
                    title="Add"/>
                {this.props.lock && <Button onPress={this.props.lock} title="Lock"/>}
            </View>
        );
    }
}
