import React from 'react';
import {StyleSheet, Alert, Text, View, Button} from 'react-native';
import Add from './Add'
import Detail from './Detail'
import Account from './Account'
import screens from '../consts/screens'
import accountApi from '../db/accountApi'
import {showMessage, hideMessage} from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import Icon from 'react-native-vector-icons/FontAwesome';
import crypt from '../consts/crypt';

export default class Accounts extends React.Component {
    state = {
        accounts: []
    }

    componentDidMount = () => {
        const {userId} = this.props;

        const setStateAccounts = async accountArr => {
            if (accountArr.length > 0) {
                const accounts = await crypt.deAccounts(accountArr);
                this.setState({accounts})
            }
        }

        accountApi.getAll(userId, setStateAccounts)
    }

    renderAccounts = accounts => {
        if (!accounts || accounts.length === 0) {
            return <Text>0 item</Text>
        }

        const {toScreen} = this.props;

        return accounts.map(x => <Account key={x.id} data={x} toScreen={toScreen}/>)
    }

    render() {
        const {accounts} = this.state;

        return (
            <View>
                {this.renderAccounts(accounts)}
            </View>
        );
    }
}
