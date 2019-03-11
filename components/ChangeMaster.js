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
import {showMessage, hideMessage} from "react-native-flash-message";
import userApi from '../db/userApi';
import pwGenerator from '../consts/pwGenerator';
import consts from '../consts/consts';
import screens from '../consts/screens';

export default class ChangeMaster extends React.Component {

    state = {
        isProcessing: false,
        current: "",
        neww: "",
        newwAgain: "",
        currentVisible: false,
        newwVisible: false,
        newwAgainVisible: false
    }

    submit = () => {
        const {
            current,
            neww,
            newwAgain,
            currentVisible,
            newwVisible,
            newwAgainVisible,
            isProcessing
        } = this.state;

        const {lockApp, userId} = this.props;

        if (neww !== newwAgain) {
            showMessage({message: "Password must match", type: "danger"});
            this.setState({newwVisible: true, newwAgainVisible: true})
            return;
        }

        this.setState({isProcessing: true})

        const afterChange = ({message, type, toLogout}) => {
            if (toLogout) {
                this.setState({current: "", neww: "", newwAgain: ""});
                lockApp();
            } else {
                this.setState({isProcessing: false})
            }
            showMessage({message, type})
        }

        userApi.changeMasterPW({
            userId,
            current,
            neww
        }, afterChange)
    }

    toggleVisibility = key => {
        this.setState({
            [key]: !this.state[key]
        })
    }

    handleChange = (txt, name) => {
        if (txt.indexOf(" ") === -1) {
            this.setState({[name]: txt})
        }
    }

    render() {

        const {
            current,
            neww,
            newwAgain,
            currentVisible,
            newwVisible,
            newwAgainVisible,
            isProcessing
        } = this.state;

        const disableSubmit = isProcessing || !current || !neww || !newwAgain;

        return (
            <View>
                <Text
                    style={{
                    paddingRight: 20,
                    fontWeight: "bold",
                    fontSize: 25
                }}>
                    Change master password
                </Text>

                <View >
                    <TextInput
                        style={{
                        fontSize: 25
                    }}
                        name="current"
                        value={current}
                        secureTextEntry={!currentVisible}
                        autoFocus={true}
                        onChangeText={txt => {
                        this.handleChange(txt, "current")
                    }}
                        placeholder="Current master password"/>

                    <Icon
                        style={{
                        marginLeft: 25
                    }}
                        name={currentVisible
                        ? "eye-slash"
                        : "eye"}
                        size={30}
                        color="grey"
                        onPress={() => {
                        this.toggleVisibility("currentVisible")
                    }}/>

                    <TextInput
                        style={{
                        fontSize: 25
                    }}
                        name="neww"
                        secureTextEntry={!newwVisible}
                        value={neww}
                        onChangeText={txt => {
                        this.handleChange(txt, "neww")
                    }}
                        placeholder="New password"/>

                    <Icon
                        style={{
                        marginLeft: 25
                    }}
                        name={newwVisible
                        ? "eye-slash"
                        : "eye"}
                        size={30}
                        color="grey"
                        onPress={() => {
                        this.toggleVisibility("newwVisible")
                    }}/>

                    <TextInput
                        style={{
                        fontSize: 25
                    }}
                        name="newwAgain"
                        value={newwAgain}
                        secureTextEntry={!newwAgainVisible}
                        onChangeText={txt => {
                        this.handleChange(txt, "newwAgain")
                    }}
                        placeholder="Confirm new password"/>

                    <Icon
                        style={{
                        marginLeft: 25
                    }}
                        name={newwAgainVisible
                        ? "eye-slash"
                        : "eye"}
                        size={30}
                        color="grey"
                        onPress={() => {
                        this.toggleVisibility("newwAgainVisible")
                    }}/>

                </View>

                <View style={{
                    paddingTop: 50
                }}>

                    <Button
                        disabled={disableSubmit}
                        onPress={this.submit}
                        title={isProcessing
                        ? "Processing..."
                        : "Submit"}/>
                </View>

            </View>
        );
    }
}
