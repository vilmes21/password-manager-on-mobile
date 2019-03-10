import salt from '../db/salt';

export default async (input, saltPrefix) => {
    const saltSuffix = await salt.getSalt();
    return input + saltPrefix + saltSuffix;
}