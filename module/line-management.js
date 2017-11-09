var dbRole = require('../db/role');
var dbZone = require('../db/zone');
var dbLine = require('../db/line');
var dbLineStation = require('../db/linestation');
var dbStation = require('../db/station');
var axios = require("axios");

/**
 * Get zones and lines
 * @returns {Promise.<Promise.<TResult>>}
 */
function getZonesAndLines() {
    // List of zones, list of and lines available
    var result = [];

    return Promise.resolve(
        dbZone.getAllZones()
            .then(function (zones) {
                result.push(zones);
                return dbLine.getAllLines();
            }).then(function (lines) {

            var promises = [];

            for (let i = 0; i < lines.length; i++) {
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
            })
        }).then(function () {
            return result;
        })
    )
}
/**
  * Get zone and lines
  * @param idZone
  * @returns {Promise.<Promise.<TResult>>}
  */
function getZoneAndLines(idZone) {
    // List of zones, list of and lines available
    var result = [];

    return Promise.resolve(
        dbZone.getZoneById(idZone)
            .then(function (zone) {
                result.push(zone);
                return dbLine.getAllLines();
            }).then(function (lines) {

            var promises = [];

            for (let i = 0; i < lines.length; i++) {
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
            })
        }).then(function () {
            return result;
        })
    )
}


/**
 * Get all lines from api
 * @param from
 * @param to
 * @returns {Promise}
 */
function getLinesFromAPI(from, to) {
    return new Promise(function (resolve, reject) {

        let url = "https://timetable.search.ch/api/route.en.json?from="+from+"&to="+to;

        axios.get(url).then(function (response) {

            if(response.data.count == 0 || response.data.messages != null)
                reject("Ligne(s) introuvable(s) entre "+from+" et "+to);

            var promises = [];
            var stationsToAdd = [];

            var linesArray = response.data.connections[0].legs;
            for(var i = 0; i < linesArray.length; i++)
            {
                if(linesArray[i].type == "post" || linesArray[i].type == "bus")
                {
                    var idLine = linesArray[i].line;
                    to = linesArray[i].terminal;
                    promises.push(findDepartureFromLineAndTerminal(idLine, to));

                    console.log("Enough lines");
                }

            }
            Promise.all(promises).then(function (response) {
                for (var i = 0; i < response.length; i++) {
                    for(var j = 0; j < response[i].length; j++)
                    {
                        stationsToAdd.push(response[i][j]);
                    }

                }
                resolve(stationsToAdd);
            })
            })
        })
}

/**
 * Find departure from line and terminal
 * @param idLine
 * @param to
 * @returns {Promise}
 */
function findDepartureFromLineAndTerminal(idLine, to) {
    return new Promise(function (resolve, reject) {
        let url = "https://timetable.search.ch/api/stationboard.en.json?stop=";

        axios.get(url + to).then(function (response) {
            console.log("API QUERRY 2 :" + url + to);
            var data = response.data.connections;
            var from;

            for (var i = 0; i < data.length; i++) {
                if (data[i].line == idLine) {
                    from = data[i].terminal.name;
                    i = data.length;
                }
            }

            findCorrectLine(from, to).then(function (response) {
                resolve(response);
            })
        })
    })
}

/**
 * Find correct line from a departure and a destination
 * @param from
 * @param to
 * @returns {Promise}
 */
function findCorrectLine(from, to) {
    return new Promise(function (resolve, reject) {
        let url = "https://timetable.search.ch/api/route.en.json?";
        var stationsToAdd = [];
        var idLine;

        axios.get(url + "from=" + from + "&to=" + to).then(function (response) {
            console.log("API QUERRY 3 : https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to);
            console.log(response.data.connections);
            // GET ALL LINES ARRAY FROM API
            // ONLY FOR ONE TIME
            var linesArray = response.data.connections[0].legs;
            idLine = response.data.connections[0].legs[0].line;
            //DELETE USELESS FIRST LEG / LINE
            stationsToAdd.push(linesArray[0]);

            if (linesArray[0].stops != null) {
                for (var j = 0; j < linesArray[0].stops.length; j++) {
                    let station = linesArray[0].stops[j];
                    stationsToAdd.push(station);
                }
            }

            stationsToAdd.push(linesArray[0].exit);
            resolve(stationsToAdd);
        })
    })
}

/**
 * Create a line with from to and the id of the zone
 * @param from
 * @param to
 * @param idZone
 * @returns {Promise}
 */
function createLine(from, to, idZone) {
    return new Promise(function (resolve, reject) {
        getLinesFromAPI(from, to)
            .then(function (stationsToAdd) {
                return dbStation.insertStationInDatabase(stationsToAdd);
            }).then(function (stationsAdded) {
                return dbLine.insertLineInDatabase(stationsAdded, idZone);
            }).then(function (stationsAndLinesArray) {
                return dbLineStation.insertLineStationInDatabase(stationsAndLinesArray);
            }).then(function () {
                resolve("Success");
            }).catch(function (error) {
                console.log(error);
                reject(error);
            })
    })
}

module.exports.getZonesAndLines = getZonesAndLines;
module.exports.getZoneAndLines = getZoneAndLines;
module.exports.createLine = createLine;

