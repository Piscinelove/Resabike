var models = require('../models');

function insertStation(name)
{
    models.Station.create
    ({
        name: name
    }).then(function()
        {
            console.log(`${name} station saved successfully in database`);
        }
    ).catch(function(err)
        {
            console.log(`${err}`);
        }
    );
}

var getStationIdByName = function(name)
{
    return new Promise((resolve, reject) => {
        models.Station.findOne
        ({
            where: {name: name}
        }).then(function (station)
        {
            resolve(station.id);
            console.log(departureId + "raaaaaf");
        }).catch(function(err)
            {
                console.log(`${err}`);
            }
        );
    })

}

module.exports.insertStation = insertStation;
module.exports.getStationIdByName = getStationIdByName;
