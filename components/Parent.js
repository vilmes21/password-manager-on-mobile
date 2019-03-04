import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Clipboard
} from 'react-native';
import Vault from './Vault'

export default class Parent extends React.Component {

    state = {
        masterPW: '',
        showPW: true,
        unlocked: false
    }

    handleChange = txt => {
        this.setState({masterPW: txt})
    }

    makeVisible = () => {
        //Clipboard.setString('hello je suis copier');

        this.setState({
            showPW: !this.state.showPW
        })
    }

    tryUnlock = () => {
        if (true) {
            //if (this.state.masterPW === "a") {
            this.setState({unlocked: true})
        }
    }

    lock = () => {
        this.setState({unlocked: false})
    }

    render() {
        const {showPW, masterPW, unlocked} = this.state;

        if (unlocked) {
            return <Vault lock={this.lock}/>
        }

        return (

            <View style={styles.container}>
                <View style={styles.content}>

                    <TextInput
                        style={{
                        fontSize: 25
                    }}
                        secureTextEntry={showPW}
                        type="password"
                        name="masterPW"
                        value={masterPW}
                        onChangeText={this.handleChange}
                        placeholder="Say something..."/>

                    <Button onPress={this.makeVisible} title="Visibility"/>
                    <Button onPress={this.tryUnlock} title="Done"/>
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
