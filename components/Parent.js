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
import Detail from './Detail';
import screens from '../consts/screens';

export default class Parent extends React.Component {

    state = {
        screen: screens.login,
        screenData: null
    }

    toScreen = (screen, screenData) => {
        this.setState({screen, screenData})
    }

    render() {
        const {screen, screenData} = this.state;

        let page = <View>Error</View>;

        switch (screen) {
            case screens.login:
                page = <Locked toScreen={this.toScreen}/>;
                break;
            case screens.all:
                page = <Vault toScreen={this.toScreen}/>;
                break;
            case screens.add:
                page = <Add toScreen={this.toScreen}/>;
                break;
            case screens.detail:
                page = <Detail toScreen={this.toScreen} screenData={screenData}/>
                break;
            default:
                page = <Locked/>;
                break;
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