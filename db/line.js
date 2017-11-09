var models = require('../models');
var dbStation = require('../db/station');

function deleteLine(id)
{
    return Promise.resolve(
        models.Line.destroy
        ({
            where:{
                id:id
            }
        })
    )
}

function insertLine(number, zone, departure, arrival)
{
    return Promise.resolve().then(function () {

        var promises = [];

        promises.push(dbStation.getStationIdByName(departure));
        promises.push(dbStation.getStationIdByName(arrival));

        return Promise.all(promises).then(function (results) {

            // Test if the arrival don't exist yet in db
            if(results[1] === null)
                return dbStation.getStationIdByNameFromAPI(arrival).then(function (id) {
                    return createLine(number, zone, results[0].id, id);
                })
            else
                return createLine(number, zone, results[0].id, results[1].id);
        })
    })
}

function createLine(id, idZone, idStartStation, idEndStation)
{
    return Promise.resolve(
        models.Line.findOrCreate
        ({
            where:{
                id:id
            },
            defaults:{
                idZone: idZone,
                idStartStation: idStartStation,
                idEndStation: idEndStation
            }

        }).then(function (line) {
            //IF LINE ALREAY CREATED REJECT
            if(!line[1])
                return Promise.reject(line[1]);
            else
                return line[0]
        })
    )
}

function insertLineInDatabase(stationsArray, idZone)
{
    return new Promise(function (resolve, reject) {

        var stops = stationsArray;
        var stationsAndLinesArray = [];
        var promises = [];

        console.log(JSON.stringify(stationsArray)+"ben");

        for (let i = 0; i < stops.length; i++)
        {
            var stop = stops[i];
            console.log(stop.line+"ben2");
            if(stop.line != null)
            {
                console.log(stop.line+" "+stop.name+"dan");
                stationsAndLinesArray.push({'idLine':stop.line,'idStop':stop.stopid});
                
                for(let j = 0; j < stop.stops.length; j++)
                {
                    console.log(stop.line+" "+stop.stops[j].name+"dan");
                    stationsAndLinesArray.push({'idLine':stop.line,'idStop':stop.stops[j].stopid});
                }

                console.log("ped"+stop.line+" "+stop.exit.name);
                console.log("odry3 : "+stop.line+" "+stop.exit.stopid);
                stationsAndLinesArray.push({'idLine':stop.line,'idStop':stop.exit.stopid});

                promises.push(insertLine(stop.line, idZone, stop.name, stop.terminal));

            }
        }

        Promise.all(promises).then(function () {
            console.log(JSON.stringify(stationsAndLinesArray)+"odry5");
            resolve(stationsAndLinesArray);
        });
    })
}

// function insertLineInDatabase(stationsArray, idZone)
// {
//     return Promise.resolve().then(function () {
//
//         var stops = stationsArray;
//         var stationsAndLinesArray = [];
//         var promises = [];
//
//         console.log(JSON.stringify(stationsArray)+"ben");
//
//         for (let i = 0; i < stops.length; i++)
//         {
//             var stop = stops[i];
//             console.log(stop.line+"ben2");
//             if(stop.line != null)
//             {
//                 stationsAndLinesArray.push({'idLine':stop.line,'idStop':stop.stopid});
//
//                 for(let j = 0; j < stops.length; j++)
//                 {
//                     console.log("ped"+stop.line+" "+stops[j].name);
//                     stationsAndLinesArray.push({'idLine':stop.line,'idStop':stops[j].stopid});
//                 }
//
//                 console.log("ped"+stop.line+" "+stop.exit.name);
//                 console.log("odry3 : "+stop.line+" "+stop.exit.stopid);
//                 stationsAndLinesArray.push({'idLine':stop.line,'idStop':stop.exit.stopid});
//
//                 promises.push(insertLine(stop.line, idZone, stop.name, stop.terminal));
//
//             }
//         }
//
//         return Promise.all(promises).then(function () {
//             console.log(JSON.stringify(stationsAndLinesArray)+"odry5");
//             return stationsAndLinesArray;
//         });
//     })
// }

function stopExists(idLine, idStop, array) {
    return array.some(function (el) {
        return el.idLine == idLine && el.idStop == idStop;
    })
}

function getAllLines()
{
    return Promise.resolve(
        models.Line.findAll()
    )
}

function findLineById(id) {
    return Promise.resolve(
        models.Line.findOne({
            where:{
                id:id
            }
        })
    )
}

module.exports.insertLine = insertLine;
module.exports.createLine = createLine;
module.exports.insertLineInDatabase = insertLineInDatabase;
module.exports.getAllLines = getAllLines;
module.exports.deleteLine = deleteLine;
module.exports.findLineById = findLineById;


