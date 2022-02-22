var mongoose = require('../utils/db').mongoose;
const dbconfig = require('../conf/config').db;

var weatherdata = mongoose.Schema({
    date: { type: Date, default: Date.now, index: true },
    tempF: Number,
    tempC: Number,
    humidity: Number,
    dewPointC: Number,
    windChillF: Number,
    windChillC: Number,
    heatIndexF: Number,
    heatIndexC: Number,
    windSpeedMph: Number,
    windSpeedKmh: Number,
    windGustMph: Number,
    windGustKmh: Number,
    windGustDailyMaxMph: Number,
    windGustDailyMaxKmh: Number,
    windDirDegrees: Number,
    windDir: String,
    uv: Number,
    solarRadiation: Number,
    rainRateIn: Number,
    rainEventIn: Number,
    rainHourlyIn: Number,
    rainDailyIn: Number,
    rainWeeklyIn: Number,
    rainMonthlyIn: Number,
    rainYearlyIn: Number,
    rainTotalIn: Number
});

module.exports = mongoose.model('weatherdata', weatherdata, dbconfig.collection); 