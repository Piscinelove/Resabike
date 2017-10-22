var dbUser = require('../db/user');
var dbRole = require('../db/role');
var dbZone = require('../db/zone');
var dbLine = require('../db/line');
var dbStation = require('../db/station');

function getZonesAndLines(){
    // List of zones, list of and lines available
    var result = [];

    return Promise.resolve(
        dbZone.getAllZones()
            .then(function (zones) {
                result.push(zones);
                return dbLine.getAllLines();
            }).then(function (lines) {

                var promises = [];

                for(let i = 0; i < lines.length; i++)
                {
                    promises.push(dbStation.getStationById(lines[i].idStartStation).then(function (station) {
                        lines[i].departure = station.name;
                    }));
                    promises.push(dbStation.getStationById(lines[i].idEndStation).then(function (station) {
                        lines[i].arrival = station.name;
                    }));
                    promises.push(dbZone.getZoneById(lines[i].idZone).then(function (zone) {
                        lines[i].zone = zone.name;
                    }));
                }

                return Promise.all(promises).then(function () {
                    result.push(lines);
                    //usersDetails = users;
                })
            }).then(function () {
                return result;
            })
        )
}

module.exports.getZonesAndLines = getZonesAndLines;