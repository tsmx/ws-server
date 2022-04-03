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
    rainRateMm: Number,
    rainEventIn: Number,
    rainEventMm: Number,
    rainHourlyIn: Number,
    rainHourlyMm: Number,
    rainDailyIn: Number,
    rainDailyMm: Number,
    rainWeeklyIn: Number,
    rainWeeklyMm: Number,
    rainMonthlyIn: Number,
    rainMonthlyMm: Number,
    rainYearlyIn: Number,
    rainYearlyMm: Number,
    rainTotalIn: Number,
    rainTotalMm: Number
});

module.exports = mongoose.model('weatherdata', weatherdata, dbconfig.collection); 