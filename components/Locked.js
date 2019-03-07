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
import screens from '../consts/screens';

export default class Locked extends React.Component {
    state = {
        masterPW: "",
        visible: false,
    }
    
    handleChange = txt => {
        this.setState({masterPW: txt})
    }

    toggleVisibility = () => {
        this.setState({
            visible: !this.state.visible
        })
    }

    tryUnlock = () => {
        if (true) {
            this.setState({masterPW: ""});
            this.props.toScreen(screens.all);
        } else {
            showMessage({
                message: "Wrong credentials!",
                type: "danger",
              });
        }
    }
    
    render() {
        const {masterPW, visible} = this.state;
        const {toScreen}= this.props;

        return (
            <View>
                <View
                    style={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <Icon name="lock" size={150} color="grey"/>
                </View>

                <View
                    style={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>

                    <TextInput
                        style={{
                        fontSize: 25
                    }}
                        secureTextEntry={!visible}
                        type="password"
                        name="masterPW"
                        value={masterPW}
                        onChangeText={this.handleChange}
                        placeholder="Open Sesame..."/>

                    <Icon
                        style={{
                        marginLeft: 25
                    }}
                        name={visible
                        ? "eye-slash"
                        : "eye"}
                        size={30}
                        color="grey"
                        onPress={this.toggleVisibility}/>
                </View>

                <Button onPress={this.tryUnlock} title="Done"/>
                <Button onPress={()=>{
                    toScreen(screens.signup)
                }} title="Sign up"/>
            </View>
        );
    }
}
