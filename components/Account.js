import React from 'react';
import screens from '../consts/screens'
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

export default class Vault extends React.Component {
    render() {
        const {id, title} = this.props.data;
        const {showScreen} = this.props;

        return (
            <View >
                <TouchableOpacity
                    onPress={() => {
                    console.log("PRESSED id: ", id);showScreen(screens.detail, {accountId: id, editable: false})
                }}>
                    <Text>
                        {id}. {title}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
