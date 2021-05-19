const axios = require('axios');
const https = require('https');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';

const getHttpsClient = () => {
    return new https.Agent({
        cert: fs.readFileSync('/certs/tls.pem'),
        key: fs.readFileSync('/certs/tls-key.pem'),
        ca: fs.readFileSync('/etc/ssl/certs/ca-bundle.crt'),
        rejectUnauthorized: false
    });
};

function createClient({ baseURL, auth }) {

    const client = axios.create({
        baseURL,
        auth,
        httpsAgent: isProduction ? getHttpsClient() : null
    });

    return {
        get: (endpoint, config) => client.get(endpoint, config),
        post: (endpoint, body, config) => client.post(endpoint, body, config),
        delete: (endpoint, config) => client.delete(endpoint, config),
        put: (endpoint, body, config) => client.put(endpoint, body, config),
        patch: (endpoint, body, config) => client.patch(endpoint, body, config)
    };

}

module.exports = {
    createClient
};