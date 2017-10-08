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

module.exports.createZone = createZone;