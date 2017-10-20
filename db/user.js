var models = require('../models');

function createUser(pseudo, password, email, idRole, idZone)
{
    return Promise.resolve(
        models.User.findOrCreate({
            where:{
                name:name
            }
        })
    )
}

function getZoneByName(name)
{
    return Promise.resolve(
        models.Zone.findOne
        ({
            where: {name: name}
        })
    )
}

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