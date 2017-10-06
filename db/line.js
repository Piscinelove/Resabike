var models = require('../models');


var insertLine = function insertLine(number, zone, departure, arrival)
{
    models.Line.create
    ({
        number: number,
        zone: zone,
        departureStation: departure,
        arrivalStation: arrival
    }).then(function()
        {
            console.log(`${number} ${zone} ${departure} ${arrival} station saved successfully in database`);
        }
    ).catch(function(err)
        {
            console.log(`${err}`);
        }
    );
}

module.exports.insertLine = insertLine;

