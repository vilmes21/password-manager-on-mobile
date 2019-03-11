import {SecureStore} from 'expo';
import pwGenerator from '../consts/pwGenerator';
import {AsyncStorage, Platform, StyleSheet} from 'react-native';
import SInfo from 'react-native-sensitive-info'

const isIOSFn = () => {
    return Platform.OS === 'ios';
}

const isIOS = isIOSFn();

const ratLoverSaltName = "ratLoverSalt";

const setSaltIOS = async() => {
    try {
        return await SecureStore.setItemAsync(ratLoverSaltName, pwGenerator(25, true), {keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY})
    } catch (e) {
        alert("init setting salt failed!")
        console.log("SecureStore.setItemAsync, e:\n", e)
    }
    return false;
};

const setSaltAndroid = async() => {
    try {
        await AsyncStorage.setItem(ratLoverSaltName, pwGenerator(25, true));
        return true;
    } catch (e) {
        alert("setSaltAndroid e block")
    }
    return false;
};

const setSalt = isIOS
    ? setSaltIOS
    : setSaltAndroid;

const getSaltISO = async() => {
    try {
        const ratLoverSalt = await SecureStore.getItemAsync(ratLoverSaltName, {});
        return ratLoverSalt;
    } catch (e) {
        console.log("SecureStore.getItemAsync, e:\n", e);
    }
    return false;
}

const getSaltAndroid = async () => {
    try {
      const value = await AsyncStorage.getItem(ratLoverSaltName);
      return true;
    } catch (e) {
      alert("getSaltAndroid e: " + e)
    }
    return false;
  };

const getSalt = isIOS
    ? getSaltISO
    : getSaltAndroid;

export default {
    setSalt,
    getSalt
}