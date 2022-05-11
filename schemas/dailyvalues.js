var mongoose = require('../utils/db').mongoose;
const conf = require('../conf/config').server.dataAggregation;

var dailyValues = mongoose.Schema({
    _id: String,
    date: { type: Date, index: true },
    tempMax: Number,
    tempMin: Number,
    tempMaxDates: [Date],
    tempMinDates: [Date],
    rain: Number,
    rainWeekly: Number,
    rainYearly: Number,
    windMax: Number,
    windMaxDates: [Date],
    windGust: Number,
    windGustDates: [Date],
    uvMax: Number,
    uvMaxDates: [Date],
    uvAvg: Number,
    solarMax: Number,
    solarMaxDates: [Date],
    solarAvg: Number,
    humidityMax: Number,
    humidityMaxDates: [Date],
    humidityAvg: Number
});

module.exports = mongoose.model('dailyvalues', dailyValues, conf.dailyValues.collection); 