const weatherdata = require('../schemas/weatherdata');
const { logger } = require('../utils/logging');

module.exports.todayMinMaxTemp = function (req, res) {
    let todayStart = new Date();
    let todayEnd = new Date();
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
            }
        ],
        (err, result) => {
            if (err) {
                logger.error('Error while generating min-max temp for today: ' + err);
                res.status(500).json({ error: 'could not generate min-max temp' });
            }
            else {
                logger.info('Min-max temp for today generated');
                res.status(200).json(result);
            }
        }
    );
}