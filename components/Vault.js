import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Alert,
    Text,
    View,
    Button
} from 'react-native';
import Add from './Add'
import Detail from './Detail'
import Accounts from './Accounts'
import Account from './Account'
import screens from '../consts/screens'
import accountApi from '../db/accountApi'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Vault extends React.Component {
    state = {
        screenNow: screens.all,
        screenData: null
    }

    showScreen = (screenNow, screenData) => {
        this.setState({screenNow, screenData})
    }

    showList = accounts => {
        if (!accounts || accounts.length === 0) {
            return <Text>0 item</Text>
        }

        return accounts.map(x => <Account key={x.id} data={x} showScreen={this.showScreen}/>)
    }

    render() {
        const {screenNow, screenData, accounts} = this.state;
        const {lock} = this.props;

        if (screenNow === screens.add) {
            return <Add showScreen={this.showScreen}/>
        } else if (screenNow === screens.detail) {
            return <Detail
                lock={lock}
                showScreen={this.showScreen}
                screenData={screenData}
                />
        }

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

                    <Icon
                        name="plus"
                        size={30}
                        color="grey"
                        onPress={() => {
                        this.showScreen(screens.add)
                    }}/>

                    <Icon name="lock" size={30} color="grey" onPress={lock}/>

                </View>

                <Text
                    style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 25
                }}>
                    My Vault
                </Text>

                <ScrollView
                    style={{
                    marginTop: 20,
                    marginBottom: 40
                }}>
                    <Accounts showScreen={this.showScreen}/>
                </ScrollView>

                <View
                    style={{
                    marginBottom: 30,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    position: 'absolute',
                    top: 45,
                    right: 10
                }}>

                    {/* <Icon
                        name="plus"
                        size={30}
                        color="grey"
                        onPress={() => {
                        this.showScreen(screens.add)
                    }}/> */}

                    {/* <Icon name="lock" size={30} color="grey" onPress={lock}/> */}

                </View>
            </View>
        );
    }
}
