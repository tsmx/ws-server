const express = require('express');
const wt = require('@tsmx/weather-tools');
const logger = require('./utils/logging').logger;
const db = require('./utils/db');

var app = express();

function roundToOne(num) {
    return +(Math.round(num + "e+1") + "e-1");
}

app.use(express.urlencoded({ extended: true }));

app.get('/data', (req, res) => {
    console.log(new Date().toISOString(), 'GET /data called from', req.ip, 'data:', JSON.stringify(req.query));
    res.sendStatus(200);
});

app.post('/data', (req, res) => {
    console.log(new Date().toISOString(), 'POST /data called from', req.ip, 'data:', JSON.stringify(req.body));
    const wind = wt.mphToKmh(req.body.windspeedmph);
    const temp = wt.fahrenheitToCelsius(req.body.tempf);
    const chill = wt.windchillCelsius(temp, wind);
    const dewPoint = wt.dewPoint(temp, req.body.humidity);
    const direction = wt.degreesToDirection(req.body.winddir);
    const heatIndex = wt.heatIndexCelsius(temp, req.body.humidity);
    console.log('Temperatur:          ' + roundToOne(temp));
    console.log('Windgeschwindigkeit: ' + roundToOne(wind));
    console.log('Gefühlte Temperatur: ' + roundToOne(chill));
    console.log('Taupunkt:            ' + roundToOne(dewPoint));
    console.log('Windrichtung:        ' + direction);
    console.log('Hitzeindex:          ' + Math.round(heatIndex));
    res.sendStatus(200);
});

db.connect(() => {
    logger.info('Connected to MongoDB');
    app.listen(3000, () => {
        logger.info('ws-server listening on port 3000...');
    });
});