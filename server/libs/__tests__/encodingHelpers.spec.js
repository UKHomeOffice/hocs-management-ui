const encodeCaseReference = require('../encodingHelpers');

describe('Encoding helper', () => {
    describe('encodeCaseReference', () => {
        it('should replace all single encoded slashes with double encoded slashes', () => {
            const singleEncoded = '01/1000002/aaa';
            const doubleEncoded = encodeCaseReference(singleEncoded);

            expect(doubleEncoded).toBeDefined;
            expect(doubleEncoded).toEqual('01%252F1000002%252Faaa');
        });

        it('should return undefined if input is undefined', () => {
            const singleEncoded = undefined;
            const doubleEncoded = encodeCaseReference(singleEncoded);

            expect(doubleEncoded).toBeUndefined();
        });
    });
});
