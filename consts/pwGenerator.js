import isaac from "isaac";

const specialChars = "~`!@#$%^&*()[]{};:?.,<>-_=+";
const digits = "0123456789";
const lowLetters = "abcdefghijklmnopqrstuvwxyz";
const upLetters = lowLetters.toUpperCase();

const generatePW = (len, includeSpecialChar) => {
    const groupCount = includeSpecialChar
        ? 4
        : 3;
    let groups = [digits, lowLetters, upLetters];
    if (includeSpecialChar) {
        groups.push(specialChars);
    }

    const finalArr = [];
    let i = groupCount;

    let yesTerminal = 0;
    let yesStart = 0;

    while (finalArr.length <= len) {
        i %= groupCount;
        const group = groups[i];

        const index = Math.floor(group.length * isaac.random());

        finalArr.push(group[index]);

        if (group[index] === group[group.length - 1]) {
            yesTerminal++;
        } else if (group[index] === group[0]) {
            yesStart++
        }

        i++;
    }

    console.log(yesTerminal, " <<< yesTerminal")
    console.log(yesStart, " <<< yesStart")

    //todo: shuffle here before join
    console.log(finalArr.join(""))
}

// console.log(generatePW(len))

generatePW(len)