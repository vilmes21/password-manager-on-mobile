import React, {Component} from 'react';
import {
    Text,
    Button,
    TextInput,
    TouchableHighlight,
    View,
    Alert,
    Clipboard
} from 'react-native';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/FontAwesome';
import pwGenerator from '../consts/pwGenerator';
import CheckBox from 'react-native-check-box'

const placeholder = "Refresh to generate";

export default class Generator extends Component {
    state = {
        len: 20,
        includeSpecialChar: true,
        txt: placeholder
    }

    toggleSpecialChar = () => {
        this.setState({
            includeSpecialChar: !this.state.includeSpecialChar,
            txt: placeholder
        })
    }

    generateNew = () => {
        const {len, includeSpecialChar} = this.state;
        const txt = pwGenerator(len, includeSpecialChar);
        this.setState({txt})
    }

    copy = () => {
        Clipboard.setString(this.state.txt);
        this
            .props
            .toggleGenerator(false);
        this.setState({txt: placeholder})
    }

    changeLen = len => {
        if (len.toString().length < 3) {
            this.setState({len})
        }
    }

    clickLen = isAdding => {
        let {len} = this.state;
        len = isAdding
            ? len + 1
            : len - 1;
        this.setState({len, txt: placeholder})
    }

    render() {
        const {generatorVisible, toggleGenerator} = this.props;
        const {txt, len, includeSpecialChar} = this.state;

        return (
            <View>
                <Modal
                    backdropColor="white"
                    backdropOpacity={0.9}
                    isVisible={generatorVisible}
                    onBackdropPress={() => {
                    this.toggleModal(true)
                }}>

                    <View
                        style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: "center"
                    }}>
                        <Text
                            style={{
                            fontSize: 25,
                            fontWeight: "bold",
                            paddingBottom: 30
                        }}>Password Generater</Text>

                        <View
                            style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Text
                                style={{
                                paddingRight: 25
                            }}>Length:
                            </Text>
                            <TextInput
                                type="number"
                                name="len"
                                value={len.toString()}
                                onChangeText={this.changeLen}
                                placeholder="Length of password"/>

                            <Icon
                                style={{
                                paddingLeft: 50
                            }}
                                name="minus"
                                size={20}
                                color="grey"
                                onPress={() => {
                                this.clickLen(false)
                            }}/>

                            <Icon
                                style={{
                                paddingLeft: 50
                            }}
                                name="plus"
                                size={20}
                                color="grey"
                                onPress={() => {
                                this.clickLen(true)
                            }}/>
                        </View>

                        <View
                            style={{
                            flexDirection: "row",
                            justifyContent: "flex-start"
                        }}>
                            <CheckBox
                                style={{
                                flex: 1,
                                paddingRight: 10
                            }}
                                onClick={this.toggleSpecialChar}
                                isChecked={includeSpecialChar}
                                rightText={"Include @#$ etc."}/>
                        </View>
                        <Icon
                            style={{
                            paddingTop: 100,
                            paddingBottom: 20
                        }}
                            name="refresh"
                            size={30}
                            color="grey"
                            onPress={this.generateNew}/>

                        <Text
                            style={{
                            fontSize: 30
                        }}>{txt}</Text>

                        <Icon
                            style={{
                            paddingTop: 20
                        }}
                            name="copy"
                            size={30}
                            color="grey"
                            onPress={this.copy}
                            title="Copy to clipboard"/>

                    </View>

                    <Button
                        onPress={() => {
                        toggleGenerator(false)
                    }}
                        title="Close"/>
                </Modal>
            </View>
        )
    }
}