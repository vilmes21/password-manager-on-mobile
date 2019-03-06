import React from 'react';
import {
    Clipboard,
    StyleSheet,
    TextInput,
    Text,
    View,
    Button
} from 'react-native';
import FlashMessage from "react-native-flash-message";
import {showMessage, hideMessage} from "react-native-flash-message";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class DetailItem extends React.Component {
    state = {
        visible: false
    }

    clipCopy = () => {
        const {data} = this.props;
        Clipboard.setString(data.value);
        showMessage({
            message: "Copied " + data.key,
            type: "success"
        });
    }

    toggleEye = () => {
        this.setState({
            visible: !this.state.visible
        })
    }

    render() {
        const {
            editable,
            data,
            handleChange,
            index,
            modifyExisting,
            isNew
        } = this.props;

        const {visible} = this.state;

        return (
            <View style={{
                flex: 1
            }}>

                <View>
                    <View
                        style={{
                        display: "flex",
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: 10
                    }}>
                        <View>
                            <TextInput
                                style={{
                                fontSize: 25
                            }}
                                name="key"
                                value={data.key}
                                editable={editable}
                                autoFocus={editable && true}
                                onChangeText={txt => {
                                if (data.id) {
                                    modifyExisting(data.id, "key", txt)
                                } else {
                                    handleChange(index, "key", txt)
                                }
                            }}
                                placeholder="Label"/>
                        </View>
                        <View>
                            <Icon
                                name={visible
                                ? "eye-slash"
                                : "eye"}
                                size={30}
                                color="grey"
                                onPress={this.toggleEye}/>
                        </View>

                    </View>

                    <View
                        style={{
                        display: "flex",
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>

                        {!isNew && !editable && <View>
                            <Icon
                                name="copy"
                                size={30}
                                color="grey"
                                onPress={this.clipCopy}
                                title="Copy to clipboard"/>
                        </View>}

                        <View>
                            <TextInput
                                style={{
                                fontSize: 25
                            }}
                                name="value"
                                secureTextEntry={!visible}
                                value={data.value}
                                editable={editable}
                                onChangeText={txt => {
                                if (data.id) {
                                    modifyExisting(data.id, "value", txt)
                                } else {
                                    handleChange(index, "value", txt)
                                }
                            }}
                                placeholder="Value"/>
                        </View>

                    </View>

                    <View
                        style={{
                        borderBottomColor: 'lightgrey',
                        borderBottomWidth: 1,
                        marginTop: 20,
                        marginBottom: 20
                    }}/>

                    <FlashMessage position="top" ref="detailItemFlash"/>
                </View>
            </View>
        );
    }
}
