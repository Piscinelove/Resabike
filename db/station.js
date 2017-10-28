var models = require('../models');
var axios = require("axios");
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

function getStationById(id)
{
    return Promise.resolve(
        models.Station.findOne
        ({
            where: {id: id}
        })
    )
}

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

function  getStationIdByNameFromAPI(name) {
    var url = "https://timetable.search.ch/api/stationboard.en.json?show_subsequent_stops=1&stop="

    return Promise.resolve
    (
        axios.get(url+name).then(function (response) {
            var id = response.data.stop.id;
            console.log(response.data.stop.id+"apiidstation");
            return id;
        }).then(function (id) {
            insertStation(id, name);
            return id;
        }).catch(function (error) {
            console.log(error);
        })
    )
}

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
        //promises.push(insertStation(8583435,"Zinal, village de vacances"));
        //promises.push(dbZone.createZone("Anniviers"));
        //TEST PURPOSE A SUPPRIMER QUAND PLUS BESOIN !


        return Promise.all(promises).then(function () {
            console.log("PROCESS FINISHED : INSERTION OF ALL STATIONS");
            return stationsToAdd;
        })

    })
}

function getAllStationsByTerm(term)
{
    return Promise.resolve(
        models.Station.findAll(
            {
                where:{
                    name : {$like:'%'+term+'%'}
                }
            }
        )
    )
}

function getAllStations()
{
    return Promise.resolve(
        models.Station.findAll()
    )
}

module.exports.insertStation = insertStation;
module.exports.insertStationInDatabase = insertStationInDatabase;
module.exports.getStationIdByName = getStationIdByName;
module.exports.getStationIdByNameFromAPI = getStationIdByNameFromAPI;
module.exports.getStationById = getStationById;
module.exports.getAllStations = getAllStations;
module.exports.getAllStationsByTerm = getAllStationsByTerm;
