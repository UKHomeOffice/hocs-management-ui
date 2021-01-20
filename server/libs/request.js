const axios = require('axios');
const https = require('https');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';

const getHttpsClient = () => {
    try {
        return new https.Agent({
            cert: fs.readFileSync('/certs/tls.pem'),
            key: fs.readFileSync('/certs/tls-key.pem'),
            ca: fs.readFileSync('/etc/ssl/certs/ca-bundle.crt'),
            rejectUnauthorized: false
        });
    } catch (e) {
        process.on('uncaughtException', (err) => {
            console.error('There was an uncaught error', err);
            console.error('/certs:',fs.readdir('/certs'));
            console.error('/etc/ssl/certs:',fs.readdir('/etc/ssl/certs'));
            process.exit(1)
        })
    }
    
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
        put: (endpoint, body, config) => client.put(endpoint, body, config)
    };

}

module.exports = {
    createClient
};