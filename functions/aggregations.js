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
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date', timezone: 'Europe/Berlin' } },
                    tempMax: { $max: '$tempC' },
                    tempMin: { $min: '$tempC' },
                    rain: { $max: '$rainDailyMm' },
                    rainWeekly: { $max: '$rainWeeklyMm' },
                    rainMonthly: { $max: '$rainMonthlyMm' },
                    rainYearly: { $max: '$rainYearlyMm' },
                    windMax: { $max: '$windSpeedKmh' },
                    windAvg: { $avg: '$windSpeedKmh' },
                    windGust: { $max: '$windGustDailyMaxKmh' },
                    uvMax: { $max: '$uv' },
                    uvAvg: { $avg: '$uv' },
                    solarMax: { $max: '$solarRadiation' },
                    solarAvg: { $avg: '$solarRadiation' },
                    humidityMax: { $max: '$humidity' },
                    humidityAvg: { $avg: '$humidity' },
                    items: { $push: '$$CURRENT' }
                }
            },
            {
                $project: {
                    date: todayStart,
                    tempMax: 1,
                    tempMaxDates: { $map: { input: { $filter: { input: '$items', as: 'x', cond: { $eq: ['$$x.tempC', '$tempMax'] } } }, as: 'xx', in: '$$xx.date' } },
                    tempMin: 1,
                    tempMinDates: { $map: { input: { $filter: { input: '$items', as: 'x', cond: { $eq: ['$$x.tempC', '$tempMin'] } } }, as: 'xx', in: '$$xx.date' } },
                    rain: 1,
                    rainWeekly: 1,
                    rainMonthly: 1,
                    rainYearly: 1,
                    windMax: 1,
                    windMaxDates: { $map: { input: { $filter: { input: '$items', as: 'x', cond: { $eq: ['$$x.windSpeedKmh', '$windMax'] } } }, as: 'xx', in: '$$xx.date' } },
                    windGust: 1,
                    windGustDates: { $map: { input: { $filter: { input: '$items', as: 'x', cond: { $eq: ['$$x.windGustDailyMaxKmh', '$windGust'] } } }, as: 'xx', in: '$$xx.date' } },
                    uvMax: 1,
                    uvMaxDates: { $map: { input: { $filter: { input: '$items', as: 'x', cond: { $eq: ['$$x.uv', '$uvMax'] } } }, as: 'xx', in: '$$xx.date' } },
                    uvAvg: 1,
                    solarMax: 1,
                    solarMaxDates: { $map: { input: { $filter: { input: '$items', as: 'x', cond: { $eq: ['$$x.solarRadiation', '$solarMax'] } } }, as: 'xx', in: '$$xx.date' } },
                    solarAvg: 1,
                    humidityMax: 1,
                    humidityMaxDates: { $map: { input: { $filter: { input: '$items', as: 'x', cond: { $eq: ['$$x.humidity', '$humidityMax'] } } }, as: 'xx', in: '$$xx.date' } },
                    humidityAvg: 1
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