import React from 'react';
import {StyleSheet, Text, TextInput, View, Button} from 'react-native';
import screens from '../consts/screens'
import db from '../db/db'
import accountApi from '../db/accountApi'

export default class Add extends React.Component {
    state = {
        title: ""
    }

    handleChange = txt => {
        this.setState({title: txt})
    }

    render() {
        const {title} = this.state;
        const {showScreen} = this.props;

        return (
            <View>
                <Text>
                    Title?
                </Text>

                <TextInput
                    name="title"
                    value={title}
                    onChangeText={this.handleChange}
                    placeholder="Title"/>

                <Button
                    onPress={() => {
                    showScreen(screens.all)
                }}
                    title="Cancel"/>

                <Button
                    onPress={ () => {
                        const callback = insertId => {
                            showScreen(screens.detail, {accountId: insertId, editable: true})
                        }

                    accountApi.addAccount(title, callback);
                    console.log("CODE IS AFTER API")
                    
                }}
                    title="Next"/>
            </View>
        );
    }
}
