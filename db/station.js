var models = require('../models');
var axios = require("axios");
var dbLine = require('../db/line');
var dbZone = require('../db/zone');


/**
 * Get station id by his name
 * @param name
 * @returns {Promise.<Promise.<Model>>}
 */
function getStationIdByName(name)
{
    return Promise.resolve(
        models.Station.findOne
        ({
            where: {name: name}
        })
    )
}

/**
 * Get sation by its id
 * @param id
 * @returns {Promise.<Promise.<Model>>}
 */
function getStationById(id)
{
    return Promise.resolve(
        models.Station.findOne
        ({
            where: {id: id}
        })
    )
}

/**
 * Insert station
 * @param id
 * @param name
 * @returns {Promise.<Promise.<created>>}
 */
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

/**
 * Get station id from api if the insertion fails
 * @param name
 * @returns {Promise.<Promise.<TResult>>}
 */
function  getStationIdByNameFromAPI(name) {
    var url = "https://timetable.search.ch/api/stationboard.en.json?show_subsequent_stops=1&stop="

    return Promise.resolve
    (
        axios.get(url+name).then(function (response) {
            var id = response.data.stop.id;
            return id;
        }).then(function (id) {
            insertStation(id, name);
            return id;
        }).catch(function (error) {
            console.log(error);
        })
    )
}

/**
 * Insert array of stations in database
 * @param stationsToAdd
 * @returns {Promise.<TResult>}
 */
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

        return Promise.all(promises).then(function () {
            console.log("PROCESS FINISHED : INSERTION OF ALL STATIONS");
            return stationsToAdd;
        })

    })
}

/**
 * Search stations from client input
 * @param term
 * @returns {Promise.<Promise.<Array.<Model>>>}
 */
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

/**
 * Get all stations from database
 * @returns {Promise.<Promise.<Array.<Model>>>}
 */
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