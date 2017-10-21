var models = require('../models');

function createUser(pseudo, password, email, idRole, idZone)
{
    return Promise.resolve(
        models.User.findOrCreate({
            where:{
                pseudo:pseudo,
                email:email
            },
            defaults:{
                password:password,
                idRole:idRole,
                idZone:idZone
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

function getAllUsers()
{
    return Promise.resolve(
        models.User.findAll()
    )
}

module.exports.createUser = createUser;
module.exports.getAllUsers = getAllUsers;
module.exports.updateZone = updateZone;
module.exports.deleteZone = deleteZone;
module.exports.getZoneByName = getZoneByName;