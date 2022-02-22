const wt = require('@tsmx/weather-tools');
const { NaNtoNull, roundToOne } = require('../utils/numbers');
const weatherdata = require('../schemas/weatherdata');

module.exports.fromPostBody = async function (body) {
    // create a new weather data object
    let wd = new weatherdata();
    // calculate missing values
    const windSpeedKmh = wt.mphToKmh(body.windspeedmph);
    const tempC = wt.fahrenheitToCelsius(body.tempf);
    const windChillC = wt.windchillCelsius(tempC, windSpeedKmh);
    const windChillF = wt.windchillFahrenheit(body.tempf, body.windspeedmph);
    const dewPointC = wt.dewPoint(tempC, body.humidity);
    const direction = wt.degreesToDirection(body.winddir);
    const heatIndexC = wt.heatIndexCelsius(tempC, body.humidity);
    const heatIndexF = wt.heatIndexFahrenheit(body.tempf, body.humidity);
    // fill object
    wd.tempF = roundToOne(body.tempf);
    wd.tempC = roundToOne(tempC);
    wd.humidity = body.humidity;
    wd.dewPointC = roundToOne(dewPointC);
    wd.windChillF = roundToOne(NaNtoNull(windChillF));
    wd.windChillC = roundToOne(NaNtoNull(windChillC));
    wd.heatIndexF = roundToOne(NaNtoNull(heatIndexF));
    wd.heatIndexC = roundToOne(NaNtoNull(heatIndexC));
    wd.windSpeedMph = roundToOne(body.windspeedmph);
    wd.windSpeedKmh = roundToOne(windSpeedKmh);
    wd.windGustMph = roundToOne(body.windgustmph);
    wd.windGustKmh = roundToOne(wt.mphToKmh(body.windgustmph));
    wd.windGustDailyMaxMph = roundToOne(body.maxdailygust);
    wd.windGustDailyMaxKmh = roundToOne(wt.mphToKmh(body.maxdailygust));
    wd.windDirDegrees = body.winddir;
    wd.windDir = direction;
    wd.uv = body.uv;
    wd.solarRadiation = roundToOne(body.solarradiation);
    wd.rainRateIn = roundToOne(body.rainratein);
    wd.rainEventIn = roundToOne(body.eventrainin);
    wd.rainHourlyIn = roundToOne(body.hourlyrainin);
    wd.rainDailyIn = roundToOne(body.dailyrainin);
    wd.rainWeeklyIn = roundToOne(body.weeklyrainin);
    wd.rainMonthlyIn = roundToOne(body.monthlyrainin);
    wd.rainYearlyIn = roundToOne(body.yearlyrainin);
    wd.rainTotalIn = roundToOne(body.totalrainin);
    // save & return promise
    return wd.save();
}