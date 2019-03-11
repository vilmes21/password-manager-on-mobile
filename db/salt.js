import {SecureStore} from 'expo';
import pwGenerator from '../consts/pwGenerator';
import {Platform, StyleSheet} from 'react-native';
import SInfo from 'react-native-sensitive-info'

const isIOSFn = () => {
    return Platform.OS === 'ios';
}

const isIOS = isIOSFn();

// alert("isIOS 777778: "+ isIOS)

const ratLoverSaltName = "ratLoverSalt";

const setSaltIOS = async() => {
    try {
        return await SecureStore.setItemAsync(ratLoverSaltName, pwGenerator(25, true), {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
        })
    } catch (e) {
        alert("init setting salt failed!")
        console.log("SecureStore.setItemAsync, e:\n", e)
    }
    return false;
};

const setSaltAndroid = () => {
    return SInfo.setItem(ratLoverSaltName, pwGenerator(25, true), {});
}

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

const getSaltAndroid = () => {
    return SInfo.getItem(ratLoverSaltName, {});
}

const getSalt = isIOS
    ? getSaltISO
    : getSaltAndroid;

export default {
    setSalt,
    getSalt
}