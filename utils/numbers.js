module.exports.roundToOne = function (num) {
    if (num === null) return null;
    return +(Math.round(num + "e+1") + "e-1");
}

module.exports.NaNtoNull = function (num) {
    if (isNaN(num)) {
        return null;
    }
    else {
        return num;
    }
}