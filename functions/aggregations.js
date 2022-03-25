const weatherdata = require('../schemas/weatherdata');
const { logger } = require('../utils/logging');
const conf = require('../conf/config').server.dataAggregation;

module.exports.valuesOfDay = function (day) {
    if (!day) day = new Date();
    let todayStart = new Date(day.getTime());
    let todayEnd = new Date(day.getTime());
    todayStart.setHours(0, 0, 0, 0);
    todayEnd.setHours(23, 59, 59, 999);
    weatherdata.aggregate(
        [
            { $match: { date: { $gte: todayStart, $lte: todayEnd } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date', timezone: 'Europe/Berlin' } }, tempMax: { $max: '$tempC' }, tempMin: { $min: '$tempC' }, items: { $push: '$$CURRENT' } } },
            {
                $project: {
                    tempMax: 1,
                    tempMaxDates: { $map: { input: { $filter: { input: '$items', as: 'x', cond: { $eq: ['$$x.tempC', '$tempMax'] } } }, as: 'xx', in: '$$xx.date' } },
                    tempMin: 1,
                    tempMinDates: { $map: { input: { $filter: { input: '$items', as: 'x', cond: { $eq: ['$$x.tempC', '$tempMin'] } } }, as: 'xx', in: '$$xx.date' } }
                }
            },
            { $merge: { into: conf.dailyValues.collection, on: '_id', whenMatched: 'replace', whenNotMatched: 'insert' } }
        ],
        (err, result) => {
            if (err) {
                logger.error('valuesOfDay - failed to generate for ' + day.toLocaleDateString() + ' : ' + err);
                throw new Error();
            }
            else {
                logger.info('valuesOfDay - successfully generated for ' + day.toLocaleDateString());
            }
        }
    );
}