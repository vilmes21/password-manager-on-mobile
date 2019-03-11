import React from 'react';
import {showMessage, hideMessage} from "react-native-flash-message";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Clipboard
} from 'react-native';
import Vault from './Vault'
import Icon from 'react-native-vector-icons/FontAwesome';
import FlashMessage from "react-native-flash-message";
import Locked from './Locked';
import Add from './Add';
import Signup from './Signup';
import Detail from './Detail';
import ChangeMaster from './ChangeMaster';
import screens from '../consts/screens';

export default class Parent extends React.Component {

    state = {
        userId: 0,
        screen: screens.login,
        screenData: null
    }

    toScreen = (screen, screenData) => {
        this.setState({screen, screenData})
    }

    lockApp = () => {
        this.setState({userId: 0, screen: screens.login})
    }

    unlockApp = userId => {
        this.setState({userId, screen: screens.all})
    }

    render() {
        const {userId, screen, screenData} = this.state;

        let page = null;
        if (userId < 1) {
            page = screen === screens.signup
                ? <Signup lockApp={this.lockApp} toScreen={this.toScreen} unlockApp={this.unlockApp}/>
                : <Locked toScreen={this.toScreen} unlockApp={this.unlockApp}/>;
        } else {

            switch (screen) {
                case screens.all:
                    page = <Vault 
                    userId={userId}
                    lockApp={this.lockApp} toScreen={this.toScreen}/>;
                    break;
                case screens.detail:
                    page = <Detail toScreen={this.toScreen} screenData={screenData}
                    lockApp={this.lockApp}/>
                    break;
                case screens.add:
                    page = <Add userId={userId} toScreen={this.toScreen}/>;
                    break;
                    case screens.changeMaster:
                    page = <ChangeMaster userId={userId} lockApp={this.lockApp} />;
                    break;
                default:
                    page = <Locked/>;
                    break;
            }
        }

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    {page}
                    
                </View>
                <FlashMessage position="bottom"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingTop: 50,
        paddingBottom: 40,
        paddingLeft: 20,
        paddingRight: 20
    },
    whiteTxt: {
        color: 'white'
    }
});