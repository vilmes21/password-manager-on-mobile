import React from 'react';
import {
    Clipboard,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    View,
    Button,
    Alert
} from 'react-native';
import FlashMessage from "react-native-flash-message";
import {showMessage, hideMessage} from "react-native-flash-message";
import Icon from 'react-native-vector-icons/FontAwesome';
import detailApi from '../db/detailApi'
import modes from '../consts/modes';

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

    confirmDeleteDetail = () => {
        const {data, rmObj, accountTitle} = this.props;

        /*
      data =  {
  "accountId": 22,
  "id": 65,
  "key": "Username",
  "value": "asdfasfddddd",
}
        */

        const {key, id} = data;

        Alert.alert(`Delete ${key}?`, `Other items under ${accountTitle} will remain.`, [
            {
                text: 'Delete',
                onPress: () => {
                    const afterDeleteDo = () => {
                        rmObj(data)
                    };

                    // it is currenlty in db
                    if (id) {
                        detailApi.deleteDetail(id, afterDeleteDo);
                    } else {
                        rmObj(data)
                    }
                }
            }, {
                text: 'No',
                onPress: () => {}
            }
        ], {cancelable: true});
    }

    render() {
        const {mode, data, handleChange,index} = this.props;
        const {id}=data;
        const {visible} = this.state;

        const minusCircle = mode === modes.delete
            ? <TouchableOpacity
                    style={{
                    position: "relative",
                    top: 8
                }}
                    onLongPress={this.confirmDeleteDetail}>
                    <Icon name="minus-circle" size={15} color="red"/>
                </TouchableOpacity>
            : null;

        return (
            <View style={{
                flex: 1
            }}>

                <View>
                    <View style={styles.out}>
                        <View style={styles.rowStart}>
                            <TextInput
                                style={styles.input}
                                name="key"
                                value={data.key}
                                editable={mode === modes.edit}
                                autoFocus={mode === modes.edit}
                                onChangeText={txt => {
                                handleChange(id, index, "key", txt)
                            }}
                                placeholder="Label"/>

                            <View>{minusCircle}</View>
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

                    <View style={styles.rowSpaceBtw}>

                        {mode === modes.read && <View>
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
                                editable={mode === modes.edit}
                                onChangeText={txt => {
                                handleChange(id, index, "value", txt)
                            }}
                                placeholder="Value"/>
                        </View>

                    </View>

                    <View style={styles.pad}/>

                    <FlashMessage position="top" ref="detailItemFlash"/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    out: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10
    },
    rowStart: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    input: {
        fontSize: 25,
        paddingRight: 30
    },
    rowSpaceBtw: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    pad: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        marginTop: 20,
        marginBottom: 20
    }
});