import React from 'react';
import screens from '../consts/screens'
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

export default class Account extends React.Component {
    render() {
        const {id, title} = this.props.data;
        const {showScreen} = this.props;

        return (
            <View style={{
                padding: 10,
                borderBottomColor: "lightgrey",
                borderStyle: "dotted",
                borderWidth: 1
            }}>
                <TouchableOpacity
                    onPress={() => {
                    console.log("PRESSED id: ", id);
                    showScreen(screens.detail, {
                        accountId: id,
                        editable: false,
                        accountTitle: title,
                        isNew: false
                    })
                }}>
                    <Text style={{fontSize: 30}}>
                        {id}. {title}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
