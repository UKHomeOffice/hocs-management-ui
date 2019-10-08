const unitsAdapter = require('../units');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Units Adapter', () => {

    it('should transform and sort user data', async () => {
        const mockData = [
            { displayName: 'displayName1', shortCode: '1', type: 'type1' },
            { displayName: 'displayName2', shortCode: '2', type: 'type2' },
            { displayName: 'displayName2', shortCode: '3', type: 'type3' }
        ];

        const results = await unitsAdapter(mockData, { user: { type: 'type1' }, logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});