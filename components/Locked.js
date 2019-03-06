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

export default class Locked extends React.Component {
    render() {
        const {handleChange, masterPW, toggleVisibility, tryUnlock, visible} = this.props;

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
                        onChangeText={handleChange}
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
                        onPress={toggleVisibility}/>
                </View>

                <Button onPress={tryUnlock} title="Done"/>
            </View>
        );
    }
}
