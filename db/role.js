var models = require('../models');

function createRole(name)
{
    return Promise.resolve(
        models.Role.findCreateFind
        ({
            where:{
                name:name
            }
        })
    )
}

module.exports.createRole = createRole;