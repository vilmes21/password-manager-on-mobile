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
        Clipboard.setString('hello je suis copier');

        this.setState({
            showPW: !this.state.showPW
        })
    }

    tryUnlock = () => {
        if (true){
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
                <Text style={styles.whiteTxt}>
                    Bonjour! 
                </Text>
                <TextInput
                    style={styles.whiteTxt}
                    secureTextEntry={showPW}
                    type="password"
                    name="masterPW"
                    value={masterPW}
                    onChangeText={this.handleChange}
                    placeholder="Say something..."/>

                <Button onPress={this.makeVisible} title="Make visible"/>
                <Button onPress={this.tryUnlock} title="Done"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        color: 'white',
        // backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    whiteTxt: {
        color: 'white'
    }
});
