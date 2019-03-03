import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Clipboard
} from 'react-native';
import db from '../db/db'

export default class Parent extends React.Component {

    state = {
        masterPW: '',
        showPW: true,
        dbReady: false
    }

    componentDidMount() {
    this.setState({dbReady: true});
      
      }
 
    handleChange = ev => {
        this.setState({masterPW: ev})
    }

    makeVisible = () => {
        Clipboard.setString('hello je suis copier');

        this.setState({
            showPW: !this.state.showPW
        })
    }

    render() {
        const {showPW, masterPW, dbReady} = this.state;

        if (dbReady){
            
            const myNote = "\n*****************my note **************\n";

            console.log(myNote + "db is ready!")

            const callback = tx => {
                const sqlStatement = "select * from items";
                const args = [];
                const suc2 = (tx, resultSet) =>{
                    console.log(myNote + "suc2 fn, resultSet: ", resultSet)
                }
    
                const err2 = (tx, e) => {
                    console.log(myNote + "err2 fn, e: ", e)
                }
    
                tx.executeSql(sqlStatement, args, suc2, err2)
            };
    
            const error = e => {
                console.log(myNote + "Error fn, e: ", e)
            };
    
            const success = s => {
                console.log(myNote + "success fn, s: ", s)
            };
    
            db.transaction(callback, error, success)
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
