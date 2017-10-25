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
                var idLine = response.data.connections[0].legs[0].idLine;
                //from = response.data.connections[0].legs[0].name;
                to = response.data.connections[0].legs[0].terminal;
                findDepartureFromLineAndTerminal(idLine, to).then(function (stationsToAdd) {
                    resolve(stationsToAdd);
                }).catch(function (error) {
                    reject(error);
                })
            }
            else {
                var error = '';
                var errorArray = [];
                var promises = [];

                for (var i = 0; i < response.data.connections[0].legs.length - 1; i++) {

                    var type = response.data.connections[0].legs[i].type;
                    if (type == 'bus' || type == 'post')
                    {
                        var idLine = response.data.connections[0].legs[i].line;
                        var correctTo = response.data.connections[0].legs[i].terminal;
                        promises.push(findDepartureFromLineAndTerminal(idLine, correctTo));
                    }
                }
                Promise.all(promises).then(function (response) {
                    for(var i = 0; i < response.length; i++)
                    {
                        error += response[i][0][0].name + ' | '
                            + response[i][0][1].name + '\n';
                        errorArray.push([response[i][0][0].name, response[i][0][response[i][0].length-1].name]);
                        console.log("putain : "+[response[i][0][0].name, response[i][0][response[i][0].length-1].name])
                    }
                })
                reject([error,errorArray]);
            }
        }).catch(function (error) {
            console.log(error);
            reject(error);
        })
    })
}

function findDepartureFromLineAndTerminal(idLine, to) {
    return new Promise(function (resolve, reject) {
        let url = "https://timetable.search.ch/api/stationboard.en.json?stop=";

        axios.get(url+to).then(function (response) {
            console.log("API QUERRY :"+url+to);
            var data = response.data.connections;
            var from;

            for(var i = 0; i < data.length; i++)
            {
                if(data[i].line == idLine){
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
    return new Promise(function (resolve, reject) {
        getLinesFromAPI(from, to)
            .then(function (stationsToAdd) {
                console.log("Success  : " + stationsToAdd);
                return dbStation.insertStationInDatabase(stationsToAdd);
            }).then(function (stationsAdded) {
                return dbLine.insertLineInDatabase(stationsAdded, idZone);
            }).then(function (stationsAndLinesArray) {
                return dbLineStation.insertLineStationInDatabase(stationsAndLinesArray);
            }).then(function (lineStation) {
                var promises = [];
                promises.push(dbRole.createRole("admin"));
                promises.push(dbRole.createRole("zoneadmin"));
                promises.push(dbRole.createRole("driver"));

                return Promise.all(promises)

            }).then(function () {
                resolve("Success");
            }).catch(function (error) {
                console.error(error + "youlou");
                reject(error);
            })
    })
}


module.exports.getZonesAndLines = getZonesAndLines;
module.exports.createLine = createLine;