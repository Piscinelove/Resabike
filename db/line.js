var models = require('../models');
var station = require('../db/station');


var insertLine = function(number, zone, departure, arrival)
{
    console.log("fdp2 : "+number+" "+zone+" "+departure+" "+arrival);
    return new Promise(function (resolve, reject) {
        var promises = [];

        promises.push(models.Station.findOne
        ({
            where: {name: departure}
        }));
        promises.push(models.Station.findOne
        ({
            where: {name: arrival}
        }));

        Promise.all(promises).then(function (results) {
            console.log("fdp6 : "+number);
            createLine(number, zone, results[0].id, results[1].id);
            console.log("Line has been inserted ! Very important");
            console.log("fdp5 : "+results[0].id);
        })
    })
}

var createLine = function(number, zone, departureId, arrivalId)
{
    return new Promise(function (resolve, reject) {
        models.Line.create
        ({
                id: number,
                idZone: zone,
                idStartStation: departureId,
                idEndStation: arrivalId
        }).then(function () {
            resolve();
        }).catch(function (err) {
            console.log("Error : "+err.message);
        });
    });
}


function insertLineInDatabase(stationsArray, idZone)
{
    var stops = stationsArray;
    var stopsLines = [];
    console.log("Y'a quoi : "+stationsArray[0].line);

    return new Promise(function (resolve, reject) {
        var promises = [];

        for (let i = 0; i < stops.length; i++)
        {
            var stop = stops[i];
            if(stop.line != null)
            {
                stopsLines.push({'idLine':stop.line,'idStop':stop.stopid});

                for(let j = i+1; j < stops.length-1; j++)
                {
                   if(stops[j].line == null)
                       stopsLines.push({'idLine':stop.line,'idStop':stops[j].stopid});
                }
                console.log(stop.line + " "+ idZone + " "+ stop.name+" "+ stop.terminal+" fdp");
                //promises.push(insertLine(stop.line, idZone, stop.name, stop.terminal));

            }
        }
        for (let i = 0; i < stopsLines.length; i++)
        {
            console.log("linestationtest : " + stopsLines[i].idLine +" et "+stopsLines[i].idStop);
        }

        Promise.all(promises);

    })
}

module.exports.insertLine = insertLine;
module.exports.createLine = createLine;
module.exports.insertLineInDatabase = insertLineInDatabase;

