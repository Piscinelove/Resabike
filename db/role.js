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

function getAllRoles()
{
    return Promise.resolve(
        models.Role.findAll()
    )
}

function getRoleById(id)
{
    return Promise.resolve(
        models.Role.findOne
        ({
            where: {id: id}
        })
    )
}

module.exports.createRole = createRole;
module.exports.getAllRoles = getAllRoles;
module.exports.getRoleById = getRoleById;