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
    render() {
        const {toScreen}=this.props;

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
                        toScreen(screens.add)
                    }}/>

                    <Icon name="lock" size={30} color="grey" onPress={()=>{
                        toScreen(screens.login);
                    }}/>

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
                    <Accounts toScreen={toScreen}/>
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

                </View>
            </View>
        );
    }
}