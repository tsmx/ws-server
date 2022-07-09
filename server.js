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
    const dailyValuesPath = conf.server.dataDelivery.dailyValues.path;
    app.get(dailyValuesPath + '/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})', (req, res) => {
        logger.info('GET ' + dailyValuesPath + ' called from ' + req.ip +
            ' (Year: ' + req.params.year + ' Month: ' + req.params.month + ' Day: ' + req.params.day + ')');
        dailyValues
            .find({ _id: { '$eq': req.params.year + '-' + req.params.month + '-' + req.params.day } })
            .exec((err, result) => {
                res.status(200).json(result);
            });
    });
}

app.get("/datetest/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", (req, res) => {
    // req.params.year, req.params.month and req.params.day
    res
      .status(200)
      .json({
        queryDate: new Date(+req.params.year,+(req.params.month)-1, +req.params.day)
      });
  });

// Periodic data aggregation jobs
logger.info('Starting data aggregation jobs...');
new cron.CronJob('0 */' + conf.server.dataAggregation.dailyValues.minutesInterval + ' * * * *', valuesOfDay, null, true);
logger.info('Generation of dailyValues started with interval: ' + conf.server.dataAggregation.dailyValues.minutesInterval + ' minute(s)');
logger.info('Data aggregation jobs started.');

module.exports = app;