const isStringBad = txt => {
    if (!txt) {
        return true;
    }

    if (txt.replace(/\s/g, "")) {
        return false;
    }

    return true;
}

export default isStringBad