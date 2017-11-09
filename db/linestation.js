var models = require('../models');

/**
 * Insert a line station
 * @param order
 * @param idLine
 * @param idStation
 * @returns {Promise.<Promise.<Model, created>>}
 */
function insertLineStation(order, idLine, idStation)
{
    return Promise.resolve(
        models.LineStation.findCreateFind
        ({
            where:{
                order: order,
                idLine: idLine,
                idStation: idStation
            }
        })
    )
}

/**
 *
 * @param stationsAndLinesArray
 * @returns {Promise.<TResult>}
 */
function insertLineStationInDatabase(stationsAndLinesArray)
{
    return Promise.resolve().then(function () {
        var lineStation = stationsAndLinesArray;
        var promises = [];

        var lastLine = null;


        for (let i = 0, orderIndex = 0; i < lineStation.length; i++, orderIndex++)
        {
            if(lastLine != lineStation[i].idLine)
            {
                orderIndex = 0;
            }

            promises.push(insertLineStation(orderIndex, lineStation[i].idLine, lineStation[i].idStop));

            lastLine = lineStation[i].idLine;
        }

        return Promise.all(promises).then(function () {
            return lineStation;
        });
    })
}

module.exports.insertLineStation = insertLineStation;
module.exports.insertLineStationInDatabase = insertLineStationInDatabase;