var dbUser = require('../db/user');
var dbRole = require('../db/role');
var dbZone = require('../db/zone');
var dbLine = require('../db/line');
var dbLineStation = require('../db/linestation');
var dbStation = require('../db/station');
var axios = require("axios");

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

function getLinesFromAPI(from, to) {



    return new Promise(function (resolve, reject) {
        let url = "https://timetable.search.ch/api/route.en.json?";
        axios.get(url + "from=" + from + "&to=" + to).then(function (response) {
            console.log("API QUERRY : https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to);
            console.log(response.data.connections);
            // GET ALL LINES ARRAY FROM API
            // ONLY FOR ONE TIME
            var linesArray = response.data.connections[0].legs;

            if (linesArray.length <= 2) {
                from = response.data.connections[0].legs[0].name;
                to = response.data.connections[0].legs[0].terminal;
                findCorrectLine(from, to).then(function (stationsToAdd) {
                    resolve(stationsToAdd);
                }).catch(function (error) {
                    reject(error);
                })
            }
            else {
                var error = '';
                var errorArray = [];
                for (var i = 0; i < response.data.connections[0].legs.length - 1; i++) {

                    var type = response.data.connections[0].legs[i].type;
                    if (type == 'bus' || type == 'post') {
                        error += response.data.connections[0].legs[i].name + ' | '
                            + response.data.connections[0].legs[i].terminal + '\n';
                        errorArray.push([response.data.connections[0].legs[i].name, response.data.connections[0].legs[i].terminal]);
                    }
                }
                reject([error,errorArray]);
            }
        }).catch(function (error) {
            console.log(error);
        })
    })
}

//equivalent of initially getStationsToAddFromAPI
function findCorrectLine(from, to) {
    return new Promise(function (resolve, reject) {
        let url = "https://timetable.search.ch/api/route.en.json?";
        var stationsToAdd = [];
        var idLine;

        axios.get(url+"from="+from+"&to="+to).then(function (response) {
            console.log("API QUERRY : https://timetable.search.ch/api/route.en.json?from="+from+"&to="+to);
            console.log(response.data.connections);
            // GET ALL LINES ARRAY FROM API
            // ONLY FOR ONE TIME
            var linesArray = response.data.connections[0].legs;
            console.log(linesArray[0].type +" icicicicicici");
            //DELETE USELESS FIRST LEG / LINE
            if(linesArray[0].type == "post" || linesArray[0].type == "bus")
            {
                stationsToAdd.push(linesArray[0]);

                if(linesArray[0].stops != null)
                {
                    for (var j = 0; j < linesArray[0].stops.length; j++)
                    {
                        let station = linesArray[0].stops[j];
                        stationsToAdd.push(station);
                    }
                }

                stationsToAdd.push(linesArray[0].exit);
                resolve(stationsToAdd);
            }
            else
            {
                reject("This isn't a bus line");
            }
        })
    })
}

function createLine(from, to, idZone) {
    return Promise.resolve(
        getLinesFromAPI(from,to)
            .then(function (stationsToAdd) {
                console.log("Success  : "+stationsToAdd);
                return dbStation.insertStationInDatabase(stationsToAdd);
            }).then(function (stationsAdded) {
            return dbLine.insertLineInDatabase(stationsAdded, idZone);
        }).then(function (stationsAndLinesArray) {
            return dbLineStation.insertLineStationInDatabase(stationsAndLinesArray);
        }).then(function (lineStation) {
            return Promise.all(dbRole.createRole("admin"),dbRole.createRole("zoneadmin"),dbRole.createRole("driver"));
        }).catch(function (error) {
            console.error(error+"youlou");

        })
    )
}


module.exports.getZonesAndLines = getZonesAndLines;
module.exports.createLine = createLine;