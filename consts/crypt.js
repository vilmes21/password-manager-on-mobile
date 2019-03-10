import CryptoJS from "react-native-crypto-js";
import salt from '../db/salt';
import pwGenerator from "./pwGenerator";
import consts from '../consts/consts';

const en = (input, salt) => {
    if (!input || !input.replace(/\s/g, "")) {
        return false;
    }

    try {
        return CryptoJS
            .AES
            .encrypt(input, salt)
            .toString();
    } catch (e) {
        console.log("ENCRYPTION ERROR. e:\n", e);
        return false;
    }
}

const de = (input, salt) => {
    const err = "DECRYPTION ERROR";
    try {
        let bytes = CryptoJS
            .AES
            .decrypt(input, salt);
        const result = bytes.toString(CryptoJS.enc.Utf8);
        return result
            ? result
            : err
    } catch (e) {
        console.log(err, ". e:\n", e);
        return err;
    }
}

const deAccounts = async arr => {
    const saltSuffix = await salt.getSalt();
    const outArr = [];
    for (const obj of arr) {
        const {id, title, saltPrefix} = obj;

        outArr.push({
            id,
            title: de(title, saltPrefix + saltSuffix)
        })
    }
    return outArr;
}

const enDetails =(arr, saltSuffix)=>{
    const outArr = [];
    
    for (const obj of arr) {
        const {key, value}=obj;
        const saltPrefix = pwGenerator(consts.saltPrefixLength, true)

        const salt =saltPrefix + saltSuffix;

        let encryptedObj = {
            key: en(key, salt),
            value: en(value, salt),
            saltPrefix
        };

        if (obj.id){
            encryptedObj = {
                ...obj,
                key: en(key, salt),
                value: en(value, salt),
                saltPrefix
            }
        } 

        outArr.push(encryptedObj);
    }
    return outArr;
}

const deDetails=async (arr)=>{
    const saltSuffix = await salt.getSalt();
    const outArr = [];
    for (const obj of arr) {
        const {id, accountId, key, value, saltPrefix} = obj;
        const salt = saltPrefix + saltSuffix;

        outArr.push({
            id,
            accountId,
            key: de(key, salt),
            value: de(value, salt)
        })
    }
    return outArr;
}

export default {
    en,
    deAccounts,
    enDetails,
    deDetails
}