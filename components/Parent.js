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

export default class Parent extends React.Component {

    state = {
        masterPW: "",
        visible: false,
        unlocked: false
    }

    toggleVisibility = () => {
        this.setState({
            visible: !this.state.visible
        })
    }

    handleChange = txt => {
        this.setState({masterPW: txt})
        // showMessage({message: `test`, type: "success"});
    }

    tryUnlock = () => {
        if (true) {
            this.setState({unlocked: true, masterPW: ""})
        }
    }

    lock = () => {
        this.setState({unlocked: false})
    }

    render() {
        const {visible, masterPW, unlocked} = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.content}>

                    {unlocked
                        ? <Vault lock={this.lock}/>
                        : <Locked
                            toggleVisibility={this.toggleVisibility}
                            tryUnlock={this.tryUnlock}
                            handleChange={this.handleChange}
                            visible={visible}
                            masterPW={masterPW}/>
}
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
