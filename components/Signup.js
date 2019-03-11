import screens from '../consts/screens'
import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {showMessage} from 'react-native-flash-message';
import isStringBad from '../consts/isStringBad'
import userApi from '../db/userApi'
import bcrypt from '../consts/bcryptConfig'
import salt from '../db/salt';
import pwGenerator from '../consts/pwGenerator';
import saltPassword from '../consts/saltPassword';
import consts from '../consts/consts';

export default class Signup extends React.Component {
    state = {
        email: "",
        password: "",
        confirmPW: "",
        visible: false
    }

    handleChange = (txt, name) => {
        if (txt.indexOf(" ") === -1){
            this.setState({[name]: txt})
        }
    }

    submitForm = async () => {
        const {password, confirmPW, email} = this.state;
        if (password !== confirmPW) {
            showMessage({message: "Password must match", type: "danger"});
            return;
        }

        const saltPrefix = pwGenerator(consts.saltPrefixLength, true);
        var hashedPW = bcrypt.hashSync(await saltPassword(password, saltPrefix), bcrypt.genSaltSync(consts.saltRounds));

        const afterInsert = insertId => {
            this
                .props
                .unlockApp(insertId);
        };

        userApi.insert({
            email: email.toLowerCase(),
            password: hashedPW,
            saltPrefix
        }, afterInsert)

    }

    render() {
        const {lockApp} = this.props;
        const {email, password, confirmPW, visible} = this.state;

        const disableNext = isStringBad(email) || isStringBad(password) || isStringBad(confirmPW);

        return (
            <View >
                <View
                    style={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>

                    <Button onPress={lockApp} title="Cancel"/>

                </View>

                <Text>
                    Sign up
                </Text>

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

                <TextInput
                    style={{
                    fontSize: 25
                }}
                    secureTextEntry={!visible}
                    type="password"
                    name="password"
                    value={password}
                    onChangeText={txt => {
                    this.handleChange(txt, "password")
                }}
                    placeholder="Set new password"/>

                <TextInput
                    style={{
                    fontSize: 25
                }}
                    secureTextEntry={!visible}
                    type="password"
                    name="confirmPW"
                    value={confirmPW}
                    onChangeText={txt => {
                    this.handleChange(txt, "confirmPW")
                }}
                    placeholder="Confirm password"/>

                <Button onPress={this.submitForm} disabled={disableNext} title="Next"/>

            </View>
        );
    }
}
