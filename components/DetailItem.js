import React from 'react';
import {StyleSheet, TextInput, Text, View, Button} from 'react-native';

export default class DetailItem extends React.Component {
    render() {
        const {editable, data, handleChange, index, modifyExisting } = this.props;

        return (
            <View style={{padding: 10}}>
                <TextInput
                 style={{fontSize: 25}}
                    name="key"
                    value={data.key}
                    editable={editable}
                    onChangeText={txt => {
                        if (data.id){
                            modifyExisting(data.id, "key", txt)
                        } else {
                            handleChange(index, "key", txt)
                        }
                }}
                    placeholder="Say Username or Password Or?"/>

                <TextInput
                 style={{fontSize: 25}}
                    name="value"
                    value={data.value}
                    editable={editable}
                    onChangeText={txt => {
                        if (data.id){
                            modifyExisting(data.id, "value", txt)
                        } else {
                            handleChange(index,"value", txt)
                        }
                }}
                    placeholder="Value"/>

                <View
                    style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1
                }}/>
            </View>
        );
    }
}
