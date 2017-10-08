var models = require('../models');
var dbLine = require('../db/line');
var dbZone = require('../db/zone');



function getStationIdByName(name)
{
    return Promise.resolve(
        models.Station.findOne
        ({
            where: {name: name}
        })
    )
}


// function insertStation(id, name)
// {
//     models.Station.create({
//         id:id,
//         name: name
//     }).then(function() {
//         console.error(`${name} station saved successfully in database`);
//     }).catch(function(err) {
//         console.log(`${err}`);
//     });
// }

function insertStation(id, name)
{
    return Promise.resolve(
        models.Station.upsert
        ({
                id: id,
                name: name
        })
    )
}

// function insertStationInDatabase(stationsArray)
// {
//     var stops = stationsArray;
//
//     return new Promise(function (resolve, reject) {
//         var promises = [];
//
//         for (let i = 0; i < stops.length; i++)
//         {
//             var stop = stops[i];
//             console.log(stop.line+"line ici");
//             promises.push(insertStation(stop.stopid, stop.name));
//         }
//
//         Promise.all(promises).then(function () {
//             console.log("PROCESS FINISHED : INSERTION OF ALL STATIONS");
//             //dbLine.insertLineInDatabase(stationsArray, 1);
//         })
//
//     })
// }

function insertStationInDatabase(stationsToAdd)
{
    return Promise.resolve().then(function () {

        var promises = [];
        var stops = stationsToAdd;

        for (let i = 0; i < stops.length; i++)
        {
            var stop = stops[i];
            promises.push(insertStation(stop.stopid, stop.name));
        }

        //TEST PURPOSE A SUPPRIMER QUAND PLUS BESOIN !
        promises.push(insertStation(8583435,"Zinal, village de vacances"));
        promises.push(dbZone.createZone("Anniviers"));
        //TEST PURPOSE A SUPPRIMER QUAND PLUS BESOIN !


        return Promise.all(promises).then(function () {
            console.log("PROCESS FINISHED : INSERTION OF ALL STATIONS");
            return stationsToAdd;
        })

    })
}

module.exports.insertStation = insertStation;
module.exports.insertStationInDatabase = insertStationInDatabase;
module.exports.getStationIdByName = getStationIdByName;
