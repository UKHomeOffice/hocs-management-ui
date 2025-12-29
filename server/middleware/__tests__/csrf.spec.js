const { csrfMiddleware } = require('../csrf.js');

describe('CSRF middleware', () => {
    let req = {};
    let res = {};
    const cookie = jest.fn();
    const next = jest.fn();
    beforeEach(() => {
        req = {
            cookies: {},
            headers: [],
            user: { id: 'user_id' }
        };
        res = {
            cookie,
        };
        next.mockReset();
        cookie.mockReset();
    });

    it('should add the csrfToken method', async () => {
        csrfMiddleware(req, res, next);
        expect(req.csrfToken).toBeDefined();
    });

    it('should add the csrf cookie', async () => {
        csrfMiddleware(req, res, next);
        req.csrfToken();
        expect(res.cookie).toHaveBeenCalledWith(
            'management-ui.x-csrf-token',
            expect.any(String),
            expect.objectContaining({ httpOnly: true, path: '/', sameSite: 'strict' })
        );
    });

    it('should call the next handler', async () => {
        csrfMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
