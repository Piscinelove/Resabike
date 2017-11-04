var dbUser = require('../db/user');
var dbRole = require('../db/role');
var dbZone = require('../db/zone');
var dbLine = require('../db/line');
var dbLineStation = require('../db/linestation');
var dbStation = require('../db/station');
var axios = require("axios");

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
                //usersDetails = users;
            })
        }).then(function () {
            return result;
        })
    )
}

function getZoneAndLines(idZone) {
    // List of zones, list of and lines available
    var result = [];

    return Promise.resolve(
        dbZone.getZoneById(idZone)
            .then(function (zone) {
                console.log(JSON.parse(JSON.stringify(zone)) + " tididid");
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
                //usersDetails = users;
            })
        }).then(function () {
            return result;
        })
    )
}

function getLinesFromAPI(from, to) {
    return new Promise(function (resolve, reject) {

        let url = "https://timetable.search.ch/api/route.en.json?from="+from+"&to="+to;

        axios.get(url).then(function (response) {
            console.log(url);

            if(response.data.count == 0 || response.data.messages != null)
                reject("Ligne(s) introuvable(s) entre "+from+" et "+to);

            var promises = [];
            var stationsToAdd = [];

            //cleanAPI(response).then(function (response) {
                var linesArray = response.data.connections[0].legs;
                for(var i = 0; i < linesArray.length; i++)
                {
                    if(linesArray[i].type == "post" || linesArray[i].type == "bus")
                    {
                        var idLine = linesArray[i].line;
                        to = linesArray[i].terminal;
                        promises.push(findDepartureFromLineAndTerminal(idLine, to));

                        // findDepartureFromLineAndTerminal(idLine, to).then(function (response) {
                        //     stationsToAdd.push(response);
                        //     //resolve(response);
                        // }).catch(function (error) {
                        //     reject(error);
                        // })
                        console.log("Enough lines");
                    }

                }
                Promise.all(promises).then(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        for(var j = 0; j < response[i].length; j++)
                        {
                            stationsToAdd.push(response[i][j]);
                            console.log("putain : " + JSON.stringify([response[i][0].name, response[i][response[i].length - 1].name]));
                        }

                    }
                    resolve(stationsToAdd);
                })


                // if (linesArray.length == 1) {
                //     var idLine = linesArray[0].line;
                //     to = linesArray[0].terminal;
                //     findDepartureFromLineAndTerminal(idLine, to).then(function (response) {
                //         resolve(response);
                //     }).catch(function (error) {
                //         reject(error);
                //     })
                //     console.log("Enough lines");
                // }
                // else {
                //     var suggestions = [];
                //     var promises = [];
                //     console.log("Too many lines");
                //     for (var i = 0; i < linesArray.length; i++) {
                //         var idLine = linesArray[i].line;
                //         var correctTo = linesArray[i].terminal;
                //         console.log("aleks : "+JSON.stringify(linesArray[i]));
                //         promises.push(findDepartureFromLineAndTerminal(idLine, correctTo));
                //     }
                //     Promise.all(promises).then(function (response) {
                //         for (var i = 0; i < response.length; i++) {
                //             suggestions.push([response[i][0].name, response[i][response[i].length - 1].name]);
                //             console.log("putain : " + JSON.stringify([response[i][0].name, response[i][response[i].length - 1].name]));
                //         }
                //         reject(suggestions);
                //     })
                // }
            })
        })
    //})
}

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

function createLine(from, to, idZone) {
    return new Promise(function (resolve, reject) {
        getLinesFromAPI(from, to)
            .then(function (stationsToAdd) {
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
                console.log(error);
                console.log("youlu");
                reject(error);
            })
    })
}

// function createLine(from, to, idZone) {
//     return new Promise(function (resolve, reject) {
//         getLinesFromAPI(from, to)
//             .then(function (stationsToAdd) {
//                 console.log("Success  : " + stationsToAdd);
//             }).catch(function (error) {
//                 console.error("youlou");
//                 console.error(error);
//                 reject(error);
//         })
//     })
// }

function cleanAPI(response) {
    // return new Promise(function (resolve, reject) {
    //     for (var i = 0; i < response.data.connections.length; i++) {
    //         for (var j = 0; j < response.data.connections[i].legs.length; j++) {
    //             var type = response.data.connections[i].legs[j].type;
    //
    //             if(type == undefined)
    //                 type = "lol";
    //
    //             if(type != "bus" && type != "post")
    //             {
    //                 console.log(type);
    //                 response.data.connections[i].legs.splice(j, 1);
    //             }
    //
    //         }
    //
    //     }
    //
    //     resolve(response);
    // })
}


module.exports.getZonesAndLines = getZonesAndLines;
module.exports.getZoneAndLines = getZoneAndLines;
module.exports.createLine = createLine;

