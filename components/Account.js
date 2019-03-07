import React from 'react';
import screens from '../consts/screens'
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

export default class Account extends React.Component {
    render() {
        const {toScreen,data} = this.props;
        const {id, title} = data;

        return (
            <View>
                <TouchableOpacity
                    style={{
                    paddingTop: 10,
                    paddingBottom: 10
                }}
                    onPress={() => {
                    toScreen(screens.detail, {
                        accountId: id,
                        editable: false,
                        accountTitle: title,
                        isNew: false
                    })
                }}>
                    <Text style={{
                        fontSize: 30
                    }}>
                        {id}. {title}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}