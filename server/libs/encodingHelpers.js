const doubleEncodeSlashes = (stringToEncode) => {
    return stringToEncode.split('%2F').join('%252F');
};

const encodeCaseReference = (referenceToEncode) => {
    if (referenceToEncode === undefined) {
        return undefined;
    }
    return doubleEncodeSlashes(encodeURIComponent(referenceToEncode));
};

module.exports = encodeCaseReference;
