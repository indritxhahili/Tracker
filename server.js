process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require('express');
const https = require('https');

const app = express();

const visits = [];

app.get('/', (req, res) => {

    https.get('https://ipwho.is/', (response) => {

        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {

            const location = JSON.parse(data);

            console.log(location);

            const info = {
                ip: location.ip || 'Unknown',
                city: location.city || 'Unknown',
                region: location.region || 'Unknown',
                country: location.country || 'Unknown',
                latitude: location.latitude || 'Unknown',
                longitude: location.longitude || 'Unknown',
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