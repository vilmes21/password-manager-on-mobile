import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Parent from './components/Parent'
import Vault from './components/Vault'


export default class App extends React.Component {
  render() {
    return (
      <Parent style={{padding: 50}}/>
      // <Vault />
    );
  }
}
