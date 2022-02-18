var express = require('express');
var app = express();

const wt = require('@tsmx/weather-tools');

function roundToOne(num) {
    return +(Math.round(num + "e+1")  + "e-1");
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

app.listen(3000, () => {
    console.log('ws-server listening on port 3000...');
});