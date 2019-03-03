import React from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import screens from '../consts/screens'

export default class Detail extends React.Component {
    state = {
        key: "",
        value: ""
    }

    handleChange = txt => {
        this.setState({key: txt})
    }

    handleChangeVal = txt => {
        this.setState({value: txt})
    }

    render() {
        const {key, value} = this.props;
        const {screenData, showScreen, makeEditable} = this.props;
        const {accountId, editable} = screenData;

        return (
            <View>
                <Text>
                    This is detail
                </Text>

                <TextInput
                    name="accountId"
                    editable={false}
                    value={accountId.toString()}
                    placeholder="account id"/>

                <TextInput
                    name="key"
                    value={key}
                    editable={editable}
                    onChangeText={this.handleChange}
                    placeholder="Say Username or Password Or?"/>

                <TextInput
                    name="value"
                    value={value}
                    editable={editable}
                    onChangeText={this.handleChange}
                    placeholder="Value"/>

                <Button
                    onPress={() => {
                    showScreen(screens.all)
                }}
                    title="Cancel"/>

                <View style={{
                    padding: 50
                }}></View>

                <Button onPress={() => {}} title="Save"/>


                <View style={{
                    padding: 50
                }}></View>

                {editable || <Button onPress={makeEditable} title="Edit"/>}
            </View>
        );
    }
}
