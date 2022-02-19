var mongoose = require('../utils/db').mongoose;
const dbconfig = require('../conf/config').database;

var weatherdata = mongoose.Schema({
    date: { type: Date, default: Date.now, index: true },
    tempf: Number
});

// compile & export the master data model
module.exports = mongoose.model('weatherdata', weatherdata, dbconfig.collection); 