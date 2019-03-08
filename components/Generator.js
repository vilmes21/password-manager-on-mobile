import React, {Component} from 'react';
import { Text,Button, TouchableHighlight, View, Alert} from 'react-native';
import Modal from "react-native-modal";

export default class Generator extends Component {
    state={
      txt: ""
    }
  
    render () {
      const {generatorVisible,toggleGenerator}=this.props;
      
        return (
          <View>
            <Modal isVisible={generatorVisible}
              onBackdropPress={()=>{
                  this.toggleModal(true)
              }}>
        
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text>I am the modal content!</Text>
              </View>

              <Button onPress={()=>{
                toggleGenerator(false)
              }} title="Done"/>
            </Modal>
          </View>
        )
      }
}