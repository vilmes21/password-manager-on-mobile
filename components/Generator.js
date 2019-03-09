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

export default class Generator extends Component {
    state = {
        len: 20,
        includeSpecialChar: true,
        txt: "Generating..."
    }

    componentDidMount() {
        setTimeout(this.generateNew, 3000)
    }

    toggleSpecialChar = () => {
        this.setState({
            includeSpecialChar: !this.state.includeSpecialChar
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
            .toggleGenerator(false)
    }

    changeLen = len => {
        if (len.toString().length < 3) {
            this.setState({len})
        }
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
                            fontWeight: "bold"
                        }}>Password Generater</Text>

                        <View
                            style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start"
                        }}>
                            <Text>Length</Text>
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
                                onPress={() => {}}/>

                            <Icon
                                style={{
                                paddingLeft: 50
                            }}
                                name="plus"
                                size={20}
                                color="grey"
                                onPress={() => {}}/>
                        </View>

                        <View
                            style={{
                            flexDirection: "row",
                            justifyContent: "flex-start"
                        }}>
                            <CheckBox
                                style={{
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