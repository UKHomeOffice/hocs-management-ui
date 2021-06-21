const usersAdapter = require('../users');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('User Adapter', () => {

    it('should transform and sort user data', async () => {
        const mockData = [
            { firstName: 'User', lastName: 'A', email: 'user.a@example.com', id: 1 },
            { firstName: 'User', lastName: 'C', email: 'user.c@example.com', id: 3 },
            { firstName: 'User', lastName: 'B', email: 'user.b@example.com', id: 2 }
        ];

        const results = await usersAdapter(mockData, { user: { id: 1 }, logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should correctly transform null values', async () => {
        const mockData = [
            { firstName: null, lastName: 'A', email: 'user.a@example.com', id: 1 },
            { firstName: 'User', lastName: null, email: 'user.b@example.com', id: 2 },
            { username: 'userC', firstName: 'User', lastName: 'C', email: null, id: 3 },
            { username: 'userD', firstName: null, lastName: null, email: 'user.D@example.com', id: 4 },
            { username: 'userE', firstName: null, lastName: null, email: null, id: 5 }
        ];

        // Use an id of 0 here to fetch all of the users
        const results = await usersAdapter(mockData, { user: { id: 0 }, logger: mockLogger });
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
        expect(results[0].label).toEqual('A (user.a@example.com)');
        expect(results[1].label).toEqual('User (user.b@example.com)');
        expect(results[2].label).toEqual('User C (userC)');
        expect(results[3].label).toEqual('user.D@example.com');
        expect(results[4].label).toEqual('userE');
    });
});
