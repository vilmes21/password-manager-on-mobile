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
            <View style={{
                padding: 50,
                paddingTop: 80
            }}>
              
                <TextInput
                    style={{fontSize: 25}}
                    name="title"
                    value={title}
                    onChangeText={this.handleChange}
                    placeholder="Title of account"/>

                <Button
                    onPress={() => {
                    showScreen(screens.all)
                }}
                    title="Cancel"/>

                <Button
                    onPress={() => {
                    const callback = insertId => {
                        showScreen(screens.detail, {
                            accountId: insertId,
                            editable: true,
                            accountTitle: title,
                            isNew: true
                        })
                    }
                    accountApi.addAccount(title, callback);
                }}
                    title="Next"/>
            </View>
        );
    }
}
