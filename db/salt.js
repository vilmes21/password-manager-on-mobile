import { SecureStore} from 'expo';
import pwGenerator from '../consts/pwGenerator';

const ratLoverSaltName = "ratLoverSalt";

const setSalt = () => {
    try {
        SecureStore.setItemAsync(ratLoverSaltName, pwGenerator(25, true), {
            keychainService: "Alias",
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY})
        .then(x => {})
    } catch (e) {
        alert("init setting salt failed!")
        console.log("SecureStore.setItemAsync, e:\n", e)
    }
}

const getSalt = async() => {
    try {
        const ratLoverSalt = await SecureStore.getItemAsync(ratLoverSaltName, {});
        return ratLoverSalt;
    } catch (e) {
        console.log("SecureStore.getItemAsync, e:\n", e);
    }
    return false;
}

export default {setSalt, getSalt}