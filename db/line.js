var models = require('../models');
var station = require('../db/station');

// function insertLine(number, zone, departure, arrival)
// {
//     console.log("fdp2 : "+number+" "+zone+" "+departure+" "+arrival);
//     return new Promise(function (resolve, reject) {
//         var promises = [];
//
//         promises.push(models.Station.findOne
//         ({
//             where: {name: departure}
//         }));
//         promises.push(models.Station.findOne
//         ({
//             where: {name: arrival}
//         }));
//
//         Promise.all(promises).then(function (results) {
//             console.log("fdp6 : "+number);
//             createLine(number, zone, results[0].id, results[1].id);
//             console.log("Line has been inserted ! Very important");
//             console.log("fdp5 : "+results[0].id);
//         })
//     })
// }

function insertLine(number, zone, departure, arrival)
{
    return Promise.resolve().then(function () {

        var promises = [];

        promises.push(models.Station.findOne
        ({
            where: {name: departure}
        }));
        promises.push(models.Station.findOne
        ({
            where: {name: arrival}
        }));

        return Promise.all(promises).then(function (results) {
            console.log("fdp6 : "+number);
            console.log("Line has been inserted ! Very important");
            console.log("fdp5 : "+results[0].id);
            return createLine(number, zone, results[0].id, results[1].id);
        })
    })
}

// function insertLineStationInDatabase(stationsAndLinesArray)
// {
//     return new Promise(function (resolve, reject) {
//         var lineStation = stationsAndLinesArray;
//
//
//         for (let i = 0; i < lineStation.length; i++)
//         {
//             models.LineStation.create
//             ({
//                 order: i,
//                 idLine: lineStation[i].idLine,
//                 idStation: lineStation[i].idStop
//             }).then(function () {
//                 resolve();
//             }).catch(function (err) {
//                 console.log("Error : "+err.message);
//             });
//         }
//     })
// }



// var createLine = function(number, zone, departureId, arrivalId)
// {
//     return new Promise(function (resolve, reject) {
//         models.Line.create
//         ({
//                 id: number,
//                 idZone: zone,
//                 idStartStation: departureId,
//                 idEndStation: arrivalId
//         }).then(function () {
//             resolve();
//         }).catch(function (err) {
//             console.log("Error : "+err.message);
//         });
//     });
// }

function createLine(number, zone, departureId, arrivalId)
{
    return Promise.resolve(
        models.Line.create
        ({
            id: number,
            idZone: zone,
            idStartStation: departureId,
            idEndStation: arrivalId
        })
    )
}


// function insertLineInDatabase(stationsArray, idZone)
// {
//     var stops = stationsArray;
//     var stationsAndLinesArray = [];
//     console.log("Y'a quoi : "+stationsArray[0].line);
//
//     return new Promise(function (resolve, reject) {
//         var promises = [];
//
//         for (let i = 0; i < stops.length; i++)
//         {
//             var stop = stops[i];
//             if(stop.line != null)
//             {
//                 stationsAndLinesArray.push({'idLine':stop.line,'idStop':stop.stopid});
//
//                 for(let j = i+1; j < stops.length-1; j++)
//                 {
//                    if(stops[j].line == null)
//                        stationsAndLinesArray.push({'idLine':stop.line,'idStop':stops[j].stopid});
//                 }
//                 console.log(stop.line + " "+ idZone + " "+ stop.name+" "+ stop.terminal+" fdp");
//                 //promises.push(insertLine(stop.line, idZone, stop.name, stop.terminal));
//
//             }
//         }
//         for (let i = 0; i < stationsAndLinesArray.length; i++)
//         {
//             console.log("linestationtest : " + stationsAndLinesArray[i].idLine +" et "+stationsAndLinesArray[i].idStop);
//         }
//
//         Promise.all(promises).then(function () {
//             insertLineStationInDatabase(stationsAndLinesArray).then(function () {
//                 console.log("LineStation Inserted !");
//             });
//         });
//
//     })
// }

function insertLineInDatabase(stationsArray, idZone)
{
    return Promise.resolve().then(function () {

        var stops = stationsArray;
        var stationsAndLinesArray = [];
        var promises = [];

        for (let i = 0; i < stops.length; i++)
        {
            var stop = stops[i];
            if(stop.line != null)
            {
                stationsAndLinesArray.push({'idLine':stop.line,'idStop':stop.stopid});

                for(let j = i+1; j < stops.length-1; j++)
                {
                    if(stops[j].line == null)
                        stationsAndLinesArray.push({'idLine':stop.line,'idStop':stops[j].stopid});
                }
                console.log(stop.line + " "+ idZone + " "+ stop.name+" "+ stop.terminal+" fdp");
                promises.push(insertLine(stop.line, idZone, stop.name, stop.terminal));

            }
        }

        return Promise.all(promises).then(function () {
            return stationsAndLinesArray;
        });
    })
}

module.exports.insertLine = insertLine;
module.exports.createLine = createLine;
module.exports.insertLineInDatabase = insertLineInDatabase;

