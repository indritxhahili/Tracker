const express = require('express');
const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

app.set('trust proxy', true);

const visits = [];

app.get('/', (req, res) => {

    const ip =
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.socket.remoteAddress;

    https.get(`https://ipwhois.app/json/${ip}`, (response) => {

        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {

            const location = JSON.parse(data);

            const info = {
                ip: ip,
                city: location.city,
                region: location.region,
                country: location.country,
                latitude: location.latitude,
                longitude: location.longitude,
                time: new Date()
            };

            visits.push(info);

            console.log(info);

            res.send(`
                <h1>Hello</h1>
                <p>Page loaded successfully.</p>
            `);

        });

    }).on('error', (err) => {

        console.log(err);

        res.send('Error');

    });

});

app.get('/admin', (req, res) => {
    res.json(visits);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});