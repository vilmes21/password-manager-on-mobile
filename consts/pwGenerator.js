import isaac from "isaac";

function shuffle(array) {
    let counter = array.length;

    while (counter > 0) {
        let index = Math.floor(isaac.random() * counter);
        counter--;
        const temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

const specialChars = "~`!@#$%^&*()[]{};:?.,<>-_=+";
const digits = "0123456789";
const lowLetters = "abcdefghijklmnopqrstuvwxyz";
const upLetters = lowLetters.toUpperCase();

const pwGenerator = (len, includeSpecialChar) => {
    const groupCount = includeSpecialChar
        ? 4
        : 3;
    let groups = [digits, lowLetters, upLetters];
    if (includeSpecialChar) {
        groups.push(specialChars);
    }

    const finalArr = [];
    let i = groupCount;

    while (finalArr.length < len) {
        i %= groupCount;
        const group = groups[i];
        const index = Math.floor(group.length * isaac.random());
        finalArr.push(group[index]);
        i++;
    }

    return shuffle(finalArr).join("")
}

export default pwGenerator