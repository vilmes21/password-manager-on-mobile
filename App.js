import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Parent from './components/Parent'
import Vault from './components/Vault'
import {MenuProvider} from 'react-native-popup-menu';

export default class App extends React.Component {
    render() {
        return (
            <MenuProvider>
                <Parent/>
            </MenuProvider>
        )
    }
}
