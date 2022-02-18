const isAxiosErrorWithCode = (error, code) => {
    return error.isAxiosError && error.response.status === code;
};

module.exports = {
    isAxiosErrorWithCode
};
