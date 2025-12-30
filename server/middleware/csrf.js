const { doubleCsrf } = require('csrf-csrf');
const { isProduction, forContext } = require('../config');
const csrfSecret = forContext('csrfSecret');

const { doubleCsrfProtection } = doubleCsrf({
    getSecret: (_req) => csrfSecret,
    getSessionIdentifier: (req) => req.user?.id ?? 'unauthorized',
    getCsrfTokenFromRequest: (req) => req.body?._csrf ?? req.headers['x-csrf-token'],
    cookieName: `${isProduction ? '__Host-' : ''}management-ui.x-csrf-token`,
    cookieOptions: {
        sameSite: 'strict',
        path: '/',
        httpOnly: true,
        secure: isProduction
    },
});

module.exports = { csrfMiddleware: doubleCsrfProtection };
