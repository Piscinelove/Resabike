var models = require('../models');

/**
 * Create a role
 * @param name
 * @returns {Promise.<Promise.<Model, created>>}
 */
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

/**
 * Get all roles
 * @returns {Promise.<Promise.<Array.<Model>>>}
 */
function getAllRoles()
{
    return Promise.resolve(
        models.Role.findAll()
    )
}

/**
 * Get role by id
 * @param id
 * @returns {Promise.<Promise.<Model>>}
 */
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