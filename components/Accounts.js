import React from 'react';
import {StyleSheet,Alert, Text, View, Button} from 'react-native';
import Add from './Add'
import Detail from './Detail'
import Account from './Account'
import screens from '../consts/screens'
import accountApi from '../db/accountApi'
import {showMessage, hideMessage} from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";


export default class Accounts extends React.Component {
    state = {
        accounts: []
    }

    componentDidMount() {
        const setStateAccounts = accountArr => {
            this.setState({accounts: accountArr})
        }

        accountApi.getAll(setStateAccounts)
    }

    toggleEditable = isEditable => {
        this.setState({
            screenData: {
                ...this.state.screenData,
                editable: isEditable
            }
        })
    }

    renderAccounts = accounts => {
        if (!accounts || accounts.length === 0) {
            return <Text>0 item</Text>
        }

        const {showScreen}=this.props;

        return accounts.map(x => <Account key={x.id} data={x} showScreen={showScreen}/>)
    }

    render() {
        const {accounts} = this.state;

        const {showScreen}=this.props;

        return (
            <View>
                {this.renderAccounts(accounts)}

                <FlashMessage position="top" ref="accountsFlash"/>
            </View>
        );
    }
}
