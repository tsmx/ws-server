var mongoose = require('../utils/db').mongoose;
const conf = require('../conf/config').server.dataAggregation;

var dailyValues = mongoose.Schema({
    _id: String,
    tempMax: Number,
    tempMin: Number,
    tempMaxDates: [Date],
    tempMinDates: [Date]
});

module.exports = mongoose.model('dailyvalues', dailyValues, conf.dailyValues.collection); 