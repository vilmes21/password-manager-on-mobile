import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import modes from '../consts/modes'
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';

export default class DetailMenu extends React.Component {
    render() {
        const {backupBeforeEdit, toMode} = this.props;
        return (
            <View>
                <Menu>
                    <MenuTrigger>
                        <Icon style={styles.ell} name="ellipsis-v" size={30} color="grey"/>
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption
                            style={styles.menuOption}
                            onSelect={() => {
                            backupBeforeEdit(() => {
                                toMode(modes.edit);
                            });
                        }}>
                            <Text style={styles.modeOption}>Edit mode</Text>
                        </MenuOption>

                        <MenuOption
                            style={styles.menuOption}
                            onSelect={() => {
                            toMode(modes.delete);
                        }}>
                            <Text
                                style={{
                                ...styles.modeOption,
                                color: 'red'
                            }}>Deletion mode</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    menuOption: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 70
    },
    ell: {
        paddingLeft: 10,
        paddingRight: 20
    }
});