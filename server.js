const express = require('express');
const { saveEcowittData } = require('./functions/persist');
const { logger } = require('./utils/logging');

var app = express();

app.use(express.urlencoded({ extended: true }));

// for Wunderground protocol type
app.get('/data', (req, res) => {
    console.log(new Date().toISOString(), 'GET /data called from', req.ip, 'data:', JSON.stringify(req.query));
    res.sendStatus(200);
});

// for Ecowitt protocol type
app.post('/data', (req, res) => {
    console.log(new Date().toISOString(), 'POST /data called from', req.ip, 'data:', JSON.stringify(req.body));
    saveEcowittData(req.body)
        .then((doc) => {
            logger.info('Weather data saved with ObjectID: ' + doc.id);
            res.sendStatus(200);
        })
        .catch((err) => {
            logger.error('Error while saving document: ' + err.message);
            res.sendStatus(500);
        });
});

module.exports = app;