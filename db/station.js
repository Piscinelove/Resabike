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
        models.Station.findOrCreate
        ({
            where:{
                id:id
            },
            defaults:{
                name:name
            }

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
    return new Promise(function (resolve, reject) {

        stationsToAdd = JSON.parse(JSON.stringify(stationsToAdd));
        var promises = [];
        var stops =stationsToAdd;
        var stationsAdded = [];

        for (let i = 0; i < stops.length; i++)
        {
            var stop = stops[i];
            //promises.push(insertStation(stop.stopid, stop.name));
            if(stop.line != null)
            {
                promises.push(insertStation(stop.stopid, stop.name).then(function (station) {
                    station = JSON.parse(JSON.stringify(station));
                    console.log(station);
                    stationsAdded.push({'line':stop.line,'stopid':station.stopid,'name':station.name});
                }));

                for(let j= 0; j<stop.stops.length;j++)
                {
                    if(stop.stops[j].stopid != null)
                        promises.push(insertStation(stop.stops[j].stopid, stop.stops[j].name));
                }
                if(stop.exit.stopid != null)
                    promises.push(insertStation(stop.exit.stopid, stop.exit.name));
            }
        }


        //TEST PURPOSE A SUPPRIMER QUAND PLUS BESOIN !
        //promises.push(insertStation(8583435,"Zinal, village de vacances"));
        //promises.push(dbZone.createZone("Anniviers"));
        //TEST PURPOSE A SUPPRIMER QUAND PLUS BESOIN !


        return Promise.all(promises).then(function (result) {
            console.log("PROCESS FINISHED : INSERTION OF ALL STATIONS");
            console.log(JSON.stringify(result));
            console.log(JSON.stringify(stationsAdded));
            resolve(stationsAdded);
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
                },
                include : [{model : models.LineStation, where:{id:{$ne:null}}}]
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
