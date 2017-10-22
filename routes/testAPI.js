var axios = require("axios");
var async = require("async");
var dbStation = require('../db/station');
var dbLine = require('../db/line');
var dbLineStation = require('../db/linestation');
var dbRole = require('../db/role');

var line = require('../db/line');
var url = "https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal";
var from = "sierre";
var to = "crans";



function getAutocompleteFromAPI(input) {

    let url = "https://timetable.search.ch/api/completion.en.json?show_ids=1&nofavorites=0&";

    return Promise.resolve
    (
        axios.get(url+input).then(function (response) {
            console.log(response.data);

            var data = response.data;

            return data;

        }).catch(function (error) {
            console.log(error);
        })
    )
}

// backup méthode sans derniers changements
// function getStationsToAddFromAPI(linesArray) {
//     return Promise.resolve().then(function () {
//
//         var stationsToAdd = [];
//
//         for (var i = 0; i < linesArray.length; i++)
//         {
//             if(linesArray[i].type == "post" || linesArray[i].type == "bus")
//             {
//                 stationsToAdd.push(linesArray[i]);
//
//                 if(linesArray[i].stops != null)
//                 {
//                     for (var j = 0; j < linesArray[i].stops.length; j++)
//                     {
//                         let station = linesArray[i].stops[j];
//                         stationsToAdd.push(station);
//                     }
//                 }
//             }
//         }
//         return stationsToAdd;
//     })
// }



function getLinesFromAPI(from, to) {

    let url = "https://timetable.search.ch/api/route.en.json?";

    return Promise.resolve
    (
        axios.get(url+"from="+from+"&to="+to).then(function (response) {
            console.log(url+"from="+from+"&to="+to);
            console.log(response.data.connections);
            // GET ALL LINES ARRAY FROM API
            // ONLY FOR ONE TIME
            var linesArray = response.data.connections[0].legs;
            //DELETE USELESS FIRST LEG / LINE
            if(linesArray[0].type !== "post" || linesArray[0].type !== "bus")
                linesArray.splice(0,1);

            // RETURN LINES FROM API SPLICED
            return linesArray;

        }).then(function (linesArray) {
            return getStationsToAddFromAPI(linesArray);
        }).then(function (stationsToAdd) {
            console.log("Success  : "+stationsToAdd);
            return dbStation.insertStationInDatabase(stationsToAdd);
        }).then(function (stationsAdded) {
            return dbLine.insertLineInDatabase(stationsAdded, 1);
        }).then(function (stationsAndLinesArray) {
            return dbLineStation.insertLineStationInDatabase(stationsAndLinesArray);
        }).then(function (lineStation) {
            return Promise.all(dbRole.createRole("admin"),dbRole.createRole("zoneadmin"),dbRole.createRole("driver"));
        }).catch(function (error) {
            console.log(error);
        })
    )
}

function getStationsToAddFromAPI(linesArray) {
    return Promise.resolve().then(function () {

        var stationsToAdd = [];

        for (var i = 0; i < linesArray.length; i++)
        {
            if(linesArray[i].type == "post" || linesArray[i].type == "bus")
            {
                if(linesArray[i].terminal !== linesArray[i].exit.name)
                {
                    getLinesFromAPI(linesArray[i].name, linesArray[i].terminal);
                }

                stationsToAdd.push(linesArray[i]);
                if(linesArray[i].stops != null)
                {
                    for (var j = 0; j < linesArray[i].stops.length; j++)
                    {
                        let station = linesArray[i].stops[j];
                        stationsToAdd.push(station);
                    }
                }
            }
        }
        return stationsToAdd;
    })
}

getLinesFromAPI(from,to);

// function getLinesFromAPI(from, to) {
//
//     let url = "https://timetable.search.ch/api/route.en.json?";
//
//     return Promise.resolve
//     (
//         axios.get(url+"from="+from+"&to="+to).then(function (response) {
//             console.log(url+"from="+from+"&to="+to);
//             console.log(response.data.connections);
//             // GET ALL LINES ARRAY FROM API
//             // ONLY FOR ONE TIME
//             var linesArray = response.data.connections[0].legs;
//             //DELETE USELESS FIRST LEG / LINE
//             if(linesArray[0].type !== "post" || linesArray[0].type !== "bus")
//                 linesArray.splice(0,1);
//
//             // RETURN LINES FROM API SPLICED
//             return linesArray;
//
//         }).catch(function (error) {
//             console.log(error);
//         })
//     )
// }
//
// function getStationsToAddFromAPI(linesArray) {
//     return Promise.resolve().then(function () {
//
//         var stationsToAdd = [];
//
//         for (var i = 0; i < linesArray.length; i++)
//         {
//             if(linesArray[i].type == "post" || linesArray[i].type == "bus")
//             {
//                 stationsToAdd.push(linesArray[i]);
//
//                 if(linesArray[i].stops != null)
//                 {
//                     for (var j = 0; j < linesArray[i].stops.length; j++)
//                     {
//                         let station = linesArray[i].stops[j];
//                         stationsToAdd.push(station);
//                     }
//                 }
//             }
//         }
//         return stationsToAdd;
//     })
// }
//
//
//
// getLinesFromAPI(from,to)
//     .then(function (linesArray) {
//         return getStationsToAddFromAPI(linesArray);
//     }).then(function (stationsToAdd) {
//         console.log("Success  : "+stationsToAdd);
//         return dbStation.insertStationInDatabase(stationsToAdd);
//     }).then(function (stationsAdded) {
//         return dbLine.insertLineInDatabase(stationsAdded, 1);
//     }).then(function (stationsAndLinesArray) {
//         return dbLineStation.insertLineStationInDatabase(stationsAndLinesArray);
//     }).then(function (lineStation) {
//         return Promise.all(dbRole.createRole("admin"),dbRole.createRole("zoneadmin"),dbRole.createRole("driver"));
//     }).catch(function (error) {
//             console.error(error+"youlou");
//
//         })







