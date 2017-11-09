var models = require('../models');

/**
 * Create a zone
 * @param name
 * @returns {Promise.<Promise.<Model, created>>}
 */
function createZone(name)
{
    return Promise.resolve(
        models.Zone.findOrCreate({
            where:{
                name:name
            }
        })
    )
}

/**
 * Get zone using its name
 * @param name
 * @returns {Promise.<Promise.<Model>>}
 */
function getZoneByName(name)
{
    return Promise.resolve(
        models.Zone.findOne
        ({
            where: {name: name}
        })
    )
}

/**
 * Get zone by its id
 * @param id
 * @returns {Promise.<Promise.<Model>>}
 */
function getZoneById(id)
{
    return Promise.resolve(
        models.Zone.findOne
        ({
            where: {id: id}
        })
    )
}

/**
 * Delete zone by its id
 * @param id
 * @returns {Promise.<T>}
 */
function deleteZone(id)
{
    return Promise.resolve(
        models.Zone.destroy
        ({
            where:{
                id:id
            }
        })
    )
}

/**
 * Update zone
 * @param id
 * @param name
 * @returns {Promise.<T>}
 */
function updateZone(id, name)
{
    return Promise.resolve(
        models.Zone.update
        (
            { name : name},
            {where:{id:id}}
        )
    )
}

/**
 * Get all zones
 * @returns {Promise.<Promise.<Array.<Model>>>}
 */
function getAllZones()
{
    return Promise.resolve(
        models.Zone.findAll()
    )
}

module.exports.createZone = createZone;
module.exports.getAllZones = getAllZones;
module.exports.updateZone = updateZone;
module.exports.deleteZone = deleteZone;
module.exports.getZoneByName = getZoneByName;
module.exports.getZoneById = getZoneById;
