import React from 'react';
import {StyleSheet, Text, TextInput, View, Button} from 'react-native';
import screens from '../consts/screens'
import db from '../db/db'
import accountApi from '../db/accountApi'
import isStringBad from '../consts/isStringBad'
import pwGenerator from '../consts/pwGenerator';
import crypt from '../consts/crypt';
import consts from '../consts/consts';
import salt from '../db/salt';

export default class Add extends React.Component {
    state = {
        title: ""
    }

    handleChange = txt => {
        this.setState({title: txt})
    }

    submit = async() => {
        const {toScreen, userId} = this.props;
        const {title} = this.state;
        const saltPrefix = pwGenerator(consts.saltPrefixLength, true);
        const saltSuffix = await salt.getSalt();
        if (!saltSuffix){
            alert("Failed getting encryption salt");
            return;
        }
        
        const encryptedTitle = crypt.en(title, saltPrefix + saltSuffix);

        if (!encryptedTitle){
            alert("Encryption error");
            return;
        }

        const callback = insertId => {
            toScreen(screens.detail, {
                accountId: insertId,
                editable: true,
                accountTitle: title,
                isNew: true
            })
        }

        accountApi.addAccount({
            title: encryptedTitle,
            userId,
            saltPrefix
        }, callback);
    }

    render() {
        const {title} = this.state;
        const {toScreen, userId} = this.props;
        const disableNext = isStringBad(title);

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <TextInput
                        style={{
                        fontSize: 25
                    }}
                        name="title"
                        value={title}
                        autoFocus={true}
                        onChangeText={this.handleChange}
                        placeholder="Title of account, e.g. Facebook"/>
                </View>

                <View
                    style={{
                    position: "absolute",
                    bottom: 30
                }}>
                    <Button
                        onPress={() => {
                        toScreen(screens.all)
                    }}
                        title="Cancel"/>

                    <Button disabled={disableNext} onPress={this.submit} title="Next"/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    whiteTxt: {
        color: 'white'
    }
});