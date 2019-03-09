import CryptoJS from "react-native-crypto-js";
import salt from '../db/salt';

const en = async(input, saltPrefix) => {
    if (!input || !input.replace(/\s/g, "")){
        return false;
    }

    try {
        const saltSuffix = await salt.getSalt();
        return CryptoJS
            .AES
            .encrypt(input, saltPrefix + saltSuffix)
            .toString();
    } catch (e) {
        console.log("ENCRYPTION ERROR. e:\n", e);
        return false;
    }
}

const de = async(input, saltPrefix) => {
    const err = "DECRYPTION ERROR";
    try {
        const saltSuffix = await salt.getSalt();

        let bytes = CryptoJS
            .AES
            .decrypt(input, saltPrefix + saltSuffix);
        const result = bytes.toString(CryptoJS.enc.Utf8);
        return result? result: err
    } catch (e) {
        console.log(err, ". e:\n", e);
        return err;
    }
}

export default {
    en,
    de
}