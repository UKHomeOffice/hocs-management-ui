const { isAxiosErrorWithCode } = require('../responseHelpers');

describe('Response helper', () => {
    describe('isAxiosErrorWithCode', () => {
        const axios409Error = new Error();

        axios409Error.isAxiosError = true;
        axios409Error.response = { status: 409, data: {} };

        const nonAxios409Error = new Error();
        nonAxios409Error.isAxiosError = false;
        nonAxios409Error.response = { status: 409, data: {} };

        it('should return true if the error is from axios and code matches', () => {
            // when
            const result = isAxiosErrorWithCode(axios409Error, 409);

            expect(result).toBeTruthy();
        });

        it('should return false if the error is from axios and code doesn\'t match', () => {
            // when
            const result = isAxiosErrorWithCode(axios409Error, 404);

            expect(result).toBeFalsy();
        });

        it('should return false if the error is not from axios and code matches', () => {
            // when
            const result = isAxiosErrorWithCode(nonAxios409Error, 409);

            expect(result).toBeFalsy();
        });

        it('should return false if the error is not from axios and code doesn\'t match', () => {
            // when
            const result = isAxiosErrorWithCode(nonAxios409Error, 404);

            expect(result).toBeFalsy();
        });
    });
});
