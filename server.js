const express = require('express');
const cron = require('cron');
const conf = require('./conf/config');
const { saveEcowittData } = require('./functions/persistence');
const { valuesOfDay } = require('./functions/aggregations');
const { logger } = require('./utils/logging');
const dailyValues = require('./schemas/dailyvalues');

const ecowittEnabled = conf.server.dataReception.ecowitt.enabled === true;
const wundergroundEnabled = conf.server.dataReception.wunderground.enabled === true;
const dataDeliveryEnabled = conf.server.dataDelivery.enabled === true;

var app = express();

app.use(express.urlencoded({ extended: true }));

// Wunderground protocol type
if (wundergroundEnabled) {
    const wundergroundPath = conf.server.dataReception.wunderground.path;
    logger.info('Wunderground enabled, data reception on path: ' + wundergroundPath);
    app.get(wundergroundPath, (req, res) => {
        console.log(new Date().toISOString(), 'GET', wundergroundPath, 'called from', req.ip, 'data:', JSON.stringify(req.query));
        res.sendStatus(200);
    });
}

// Ecowitt protocol type
if (ecowittEnabled) {
    const ecowittPath = conf.server.dataReception.ecowitt.path;
    logger.info('Ecowitt enabled, data reception on path: ' + ecowittPath);
    app.post(ecowittPath, (req, res) => {
        console.log(new Date().toISOString(), 'POST', ecowittPath, 'called from', req.ip, 'data:', JSON.stringify(req.body));
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
}

// Data delivery
if (dataDeliveryEnabled) {
    const todaysValuesPath = conf.server.dataDelivery.todaysValues.path;
    app.get(todaysValuesPath, (req, res) => {
        logger.info('GET ' + todaysValuesPath + ' called from ' + req.ip);
        dailyValues
            .find({ _id: { '$eq': '2022-03-05' } })
            .exec((err, result) => {
                res.status(200).json(result);
            });
    });
}

logger.info('Starting data aggregation jobs...');
new cron.CronJob('0 */' + conf.server.dataAggregation.dailyValues.minutesInterval +' * * * *', valuesOfDay, null, true);
logger.info('Generation of dailyValues started with interval: ' + conf.server.dataAggregation.dailyValues.minutesInterval + ' minute(s)');
logger.info('Data aggregation jobs started.');

module.exports = app;