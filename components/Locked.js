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
import saltPassword from '../consts/saltPassword';

export default class Locked extends React.Component {
    state = {
        masterPW: "",
        visible: false,
        email: "test@test.com2",
        isProcessing: false
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

    submit = () => {
        this.setState({isProcessing: true});

        const {email, masterPW} = this.state;
        const {toScreen, unlockApp} = this.props;

        const afterFindingUser = async user => {
            if (user) {
                const saltedPW = await saltPassword(masterPW, user.saltPrefix);

                if (bcrypt.compareSync(saltedPW, user.password)) {
                    this.setState({masterPW: ""});
                    unlockApp(user.id);
                    return;
                }
            }

            showMessage({message: "Wrong credentials!", type: "danger"});
            this.setState({isProcessing: false});
        }

        userApi.getByEmail(email.toLowerCase(), afterFindingUser);
    }

    render() {
        const {isProcessing, masterPW, email, visible} = this.state;
        const {toScreen} = this.props;
        const disableSubmit = isProcessing || isStringBad(email) || email.indexOf("@") === -1 || isStringBad(masterPW);

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

                    <Button
                        disabled={disableSubmit}
                        onPress={this.submit}
                        title={isProcessing
                        ? "Processing..."
                        : "Enter"}/>
                </View>

                <View>
                    <Button
                        disabled={isProcessing}
                        onPress={() => {
                        toScreen(screens.signup)
                    }}
                        title="Sign up"/>
                </View>

                <View style={{
                    paddingTop: 40
                }}>
                    <Button
                        onPress={() => {
                        Clipboard.setString("Nothing here");
                        showMessage({message: "Cleared", type: "success"})
                    }}
                        title="Clear copied"/>
                </View>
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