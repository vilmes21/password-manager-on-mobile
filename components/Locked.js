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
import bcrypt from '../consts/bcryptConfig'
import userApi from '../db/userApi'
import isStringBad from '../consts/isStringBad'

export default class Locked extends React.Component {
    state = {
        masterPW: "",
        visible: false,
        email: "test@test.com"
    }

    handleChange = (txt, name) => {
        if (txt.indexOf(" ") === -1) {
            this.setState({[name]: txt})
        }
    }

    toggleVisibility = () => {
        this.setState({
            visible: !this.state.visible
        })
    }

    tryUnlock = () => {
        const {email, masterPW} = this.state;
        const {toScreen, unlockApp} = this.props;

        const afterPWCompare = user => {
            if (user && bcrypt.compareSync(masterPW, user.password)) {
                this.setState({masterPW: ""});
                unlockApp(user.id);
            } else {
                showMessage({message: "Wrong credentials!", type: "danger"});
            }
        }

        userApi.getByEmail(email.toLowerCase(), afterPWCompare);
    }

    render() {
        const {masterPW, email, visible} = this.state;
        const {toScreen} = this.props;
        const disableSubmit = isStringBad(email) || email.indexOf("@") === -1 || isStringBad(masterPW);

        return (
            <View>
                <View style={styles.rowCenter}>
                    <Icon name="lock" size={150} color="grey"/>
                </View>

                <View style={styles.colCenter}>

                    <View style={styles.rowCenter}>
                        <TextInput
                            style={{
                            fontSize: 25
                        }}
                            type="email"
                            name="email"
                            value={email}
                            onChangeText={txt => {
                            this.handleChange(txt, "email")
                        }}
                            placeholder="your@email.com"/>
                    </View>

                    <View style={styles.rowCenter}>

                        <TextInput
                            style={{
                            fontSize: 25
                        }}
                            secureTextEntry={!visible}
                            type="password"
                            name="masterPW"
                            value={masterPW}
                            onChangeText={txt => {
                            this.handleChange(txt, "masterPW")
                        }}
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
                </View>

                <View
                    style={{
                    paddingTop: 30,
                    paddingBottom: 80
                }}>

                    <Button disabled={disableSubmit} onPress={this.tryUnlock} title="Done"/>
                </View>

                <Button
                    onPress={() => {
                    toScreen(screens.signup)
                }}
                    title="Sign up"/>

<Button
                    onPress={() => {
                    Clipboard.setString("Nothing here");
                    showMessage({message: "Cleared", type: "success"})
                }}
                    title="Clear copied"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowCenter: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center'
    },
    colCenter: {
        display: "flex",
        flexDirection: 'column',
        justifyContent: 'center'
    }
})