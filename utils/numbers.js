module.exports.roundToOne = function (num) {
    if (isNaN(num) || num === null) return null;
    return +(Math.round(num + 'e+1') + 'e-1');
};

module.exports.roundToZero = function (num) {
    if (isNaN(num) || num === null) return null;
    return Math.round(num);
};
