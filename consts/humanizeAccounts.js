import crypt from './crypt'

const humanizeAccounts = async arr => {
    const outArr = [];
    for (const obj of arr) {
        const {id, title, saltPrefix} = obj;

        outArr.push({
            id,
            title: await crypt.de(title, saltPrefix)
        })
    }
    return outArr;
}

export default humanizeAccounts