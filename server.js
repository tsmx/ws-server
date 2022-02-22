const express = require('express');
const persist = require('./functions/persist');
const { roundToOne } = require('./utils/numbers');
const { logger } = require('./utils/logging');

var app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/data', (req, res) => {
    console.log(new Date().toISOString(), 'GET /data called from', req.ip, 'data:', JSON.stringify(req.query));
    res.sendStatus(200);
});

app.post('/data', (req, res) => {
    console.log(new Date().toISOString(), 'POST /data called from', req.ip, 'data:', JSON.stringify(req.body));
    persist.fromPostBody(req.body).then((doc) => { 
        logger.info('Weather data saved with ObjectID: ' + doc.id);
        res.sendStatus(200);
    });
});

module.exports = app;