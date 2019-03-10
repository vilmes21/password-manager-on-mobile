import salt from '../db/salt';

export default async (input, saltPrefix) => {
    const saltSuffix = await salt.getSalt();
    if (!saltSuffix){
        alert("saltPassword fn !saltSuffix");
        return "";
    }
    return input + saltPrefix + saltSuffix;
}