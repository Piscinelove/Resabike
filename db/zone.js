var models = require('../models');

function createZone(name)
{
    return Promise.resolve(
        models.Zone.findCreateFind
        ({
            where:{
                name:name
            }
        })
    )
}

function getAllZones()
{
    return Promise.resolve(
        models.Zone.findAll()
    )
}

module.exports.createZone = createZone;
module.exports.getAllZones = getAllZones;