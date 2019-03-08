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

export default class Signup extends React.Component {
    state = {
        email: "",
        password: "",
        confirmPW: "",
        visible: false
    }

    handleChange = (txt, name) => {
        this.setState({
            [name]: txt
        }, () => {
            console.log(this.state)
        })
    }

    submitForm = () => {
        const {password, confirmPW, email} = this.state;
        if (password !== confirmPW) {
            showMessage({message: "Password must match", type: "danger"});
            return;
        }

        const saltRounds = 10;
        var hashedPW = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));

        const afterInsert = insertId =>{
            this.props.unlockApp(insertId);
        };

        userApi.insert({
            email: email.toLowerCase(),
            password: hashedPW
        }, afterInsert)

    }

    render() {
        const {lockApp} = this.props;
        const {email, password, confirmPW, visible} = this.state;

        const disableNext = isStringBad(email) || isStringBad(password) || isStringBad(confirmPW);

        return (
            <View
                >
                <View
                    style={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>

                    <Button
                        onPress={lockApp}
                        title="Cancel"/>

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
