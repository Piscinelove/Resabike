var models = require('../models');
var dbLine = require('../db/line');



var getStationIdByName = function(name)
{
    models.Station.findOne
    ({
        where: {name: name}
    }).then(function (station) {
        console.log("Id : "+station.id);
    }).catch(function (err) {
        console.log("Error : "+err.message);
    });
}



function insertStation(id, name)
{
    models.Station.create({
        id:id,
        name: name
    }).then(function() {
        console.error(`${name} station saved successfully in database`);
    }).catch(function(err) {
        console.log(`${err}`);
    });
}

function insertStationInDatabase(stationsArray)
{
    var stops = stationsArray;

    return new Promise(function (resolve, reject) {
        var promises = [];

        for (let i = 0; i < stops.length; i++)
        {
            var stop = stops[i];
            console.log(stop.line+"line ici");
            promises.push(insertStation(stop.stopid, stop.name));
        }

        Promise.all(promises).then(function () {
            console.log("PROCESS FINISHED : INSERTION OF ALL STATIONS");
            //dbLine.insertLineInDatabase(stationsArray, 1);
        })

    })
}

module.exports.insertStation = insertStation;
module.exports.insertStationInDatabase = insertStationInDatabase;
module.exports.getStationIdByName = getStationIdByName;
