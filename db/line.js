var models = require('../models');
var station = require('../db/station');


var insertLine = function(number, zone, departure, arrival)
{
        var departureId = station.getStationIdByName(departure);
        var arrivalId = station.getStationIdByName(arrival);

        Promise.all([departureId, arrivalId]).then(function (result) {
            createLine(number, zone, result[0], result[1]);
            console.log("Line has been inserted !");
        });
}

var createLine = function(number, zone, departureId, arrivalId)
{
    return new Promise(function (resolve, reject) {
        models.Line.create
        ({
                number: number,
                zone: zone,
                departureStation: departureId,
                arrivalStation: arrivalId
        }).then(function () {
            resolve();
        }).catch(function (err) {
            console.log("Error : "+err.message);
        });
    });
}

module.exports.insertLine = insertLine;
module.exports.createLine = createLine;

