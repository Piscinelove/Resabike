var axios = require("axios");
var async = require("async");
var dbStation = require('../db/station');
var dbLine = require('../db/line');
var dbLineStation = require('../db/linestation');
var dbRole = require('../db/role');

var line = require('../db/line');
var url = "https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal";
var from = "Sierre, poste/gare";
var to = "Mollens VS";



// function getLinesFromAPI(from, to) {
//
//
//
//     return new Promise(function (resolve, reject) {
//         let url = "https://timetable.search.ch/api/route.en.json?";
//         axios.get(url + "from=" + from + "&to=" + to).then(function (response) {
//             console.log("API QUERRY : https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to);
//             console.log(response.data.connections);
//             // GET ALL LINES ARRAY FROM API
//             // ONLY FOR ONE TIME
//             var linesArray = response.data.connections[0].legs;
//
//             if (linesArray.length <= 2) {
//                 from = response.data.connections[0].legs[0].name;
//                 to = response.data.connections[0].legs[0].terminal;
//                 findCorrectLine(from, to).then(function (stationsToAdd) {
//                     resolve(stationsToAdd);
//                 }).catch(function (error) {
//                     reject(error);
//                 })
//             }
//             else {
//                 var error = '';
//                 var errorArray = [];
//                 for (var i = 0; i < response.data.connections[0].legs.length - 1; i++) {
//
//                     var type = response.data.connections[0].legs[i].type;
//                     if (type == 'bus' || type == 'post') {
//                         error += response.data.connections[0].legs[i].name + ' | '
//                             + response.data.connections[0].legs[i].terminal + '\n';
//                         errorArray.push([response.data.connections[0].legs[i].name, response.data.connections[0].legs[i].terminal]);
//                     }
//                 }
//                 reject([error,errorArray]);
//             }
//         }).catch(function (error) {
//             console.log(error);
//         })
//     })
// }

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
                var idLine = response.data.connections[0].legs[0].line;
                to = response.data.connections[0].legs[0].terminal;
                findDeparture(idLine, to).then(function (stationsToAdd) {
                    resolve(stationsToAdd);
                }).catch(function (error) {
                    reject(error);
                })
            }
            else {
                var error = '';
                var errorArray = [];
                var linePromises = [];
                for (var i = 0; i < response.data.connections[0].legs.length - 1; i++)
                {

                    var type = response.data.connections[0].legs[i].type;
                    if (type == 'bus' || type == 'post') {
                        console.log("trululu");
                        var idLine = response.data.connections[0].legs[i].line;
                        var toTemp = response.data.connections[0].legs[i].terminal;
                        linePromises.push(findDeparture(idLine, toTemp));
                    }
                }
                Promise.all(linePromises).then((response) => {
                    console.log("icicicici");
                    console.log(response);
                    for (var i = 0; i < response.length; i++) {
                        error += response[i][0].name + ' | '
                            + response[i][0].terminal + '\n';
                        errorArray.push([response[i][0].name, response[i][0].terminal]);
                    }
                    console.log(errorArray)
                    reject([error, errorArray]);
                })
            }
        }).catch(function (error) {
            console.log(error);
        })
    })
}

function findDeparture(idLine, to) {
    return new Promise((resolve, reject) => {
        axios.get("https://timetable.search.ch/api/stationboard.en.json?stop=" + to).then((response) => {
            console.log("https://timetable.search.ch/api/stationboard.en.json?stop=" + to);
            var info = response.data.connections;
            var nameToFind = 0;
            for (var i = 0; i < info.length; i++) {
                if (info[i].line == idLine) {
                    nameToFind = info[i].terminal.name;
                    i = info.length;
                }
            }
            findCorrectLine(nameToFind, to).then((response) => {
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

getLinesFromAPI(from,to)
    .then(function (stationsToAdd) {
        console.log("Success  : "+stationsToAdd);
        return dbStation.insertStationInDatabase(stationsToAdd);
    }).then(function (stationsAdded) {
        return dbLine.insertLineInDatabase(stationsAdded, 1);
    }).then(function (stationsAndLinesArray) {
        return dbLineStation.insertLineStationInDatabase(stationsAndLinesArray);
    }).then(function (lineStation) {
        var promises = [];
        promises.push(dbRole.createRole("admin"));
        promises.push(dbRole.createRole("zoneadmin"));
        promises.push(dbRole.createRole("driver"));

        return Promise.all(promises);
    }).catch(function (error) {
        console.error(error+"youlou");

    })