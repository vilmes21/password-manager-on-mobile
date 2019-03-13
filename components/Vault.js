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
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Vault extends React.Component {
    render() {
        const {toScreen, lockApp, userId} = this.props;

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

                    <Menu>
                        <MenuTrigger>
                            <Icon style={styles.ell} name="ellipsis-v" size={30} color="grey"/>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption
                                style={styles.menuOption}
                                onSelect={() => {
                                toScreen(screens.add)
                            }}>
                                <Text
                                    style={{
                                    fontSize: 20
                                }}>Add item</Text>
                            </MenuOption>

                            <MenuOption
                                style={styles.menuOption}
                                onSelect={() => {
                                toScreen(screens.changeMaster)
                            }}>
                                <Text
                                    style={{
                                    fontSize: 20
                                }}>Change master password</Text>
                            </MenuOption>

                        </MenuOptions>
                    </Menu>

                    <Icon name="lock" size={30} color="grey" onPress={lockApp}/>

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
                    <Accounts toScreen={toScreen} userId={userId}/>
                </ScrollView>

                <View
                    style={{
                    marginBottom: 30,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    position: 'absolute',
                    top: 45,
                    right: 10
                }}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    menuOption: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 70
    },
    ell: {
        paddingLeft: 10,
        paddingRight: 20
    }
});
