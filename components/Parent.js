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
import Icon from 'react-native-vector-icons/FontAwesome';

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
        this.setState({
            showPW: !this.state.showPW
        })
    }

    tryUnlock = () => {
        if (true) {
            //if (this.state.masterPW === "a") {
            this.setState({unlocked: true, masterPW: ""})
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

                    <View
                        style={{
                        display: "flex",
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingBottom: 10
                    }}>
                        <Icon name="lock" size={150} color="grey"/>
                    </View>

                    <View
                        style={{
                        display: "flex",
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>

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

                        <Icon
                            style={{
                            marginLeft: 25
                        }}
                            name={showPW
                            ? "eye"
                            : "eye-slash"}
                            size={30}
                            color="grey"
                            onPress={this.makeVisible}/>
                    </View>

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
