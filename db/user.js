var models = require('../models');

function createUser(username, email, password, idRole, idZone)
{
    return Promise.resolve(
        models.User.findOrCreate({
            where:{
                username:username
            },
            defaults:{
                email:email,
                password:password,
                idRole:idRole,
                idZone:idZone
            }
        })
    )
}

function getUserByEmail(email)
{
    return Promise.resolve(
        models.User.findOne
        ({
            where: {email: email}
        })
    )
}

function deleteUser(id)
{
    return Promise.resolve(
        models.User.destroy
        ({
            where:{
                id:id
            }
        })
    )
}

function updateUser(id, email, idRole, idZone)
{
    return Promise.resolve(
        models.User.update
        (
            {
              email:email,
              idRole:idRole,
              idZone:idZone
            },
            {where:{id:id}}
        )
    )
}

function updateUserPassword(id, email, password, idRole, idZone)
{
    return Promise.resolve(
        models.User.update
        (
            {
                email:email,
                password:password,
                idRole:idRole,
                idZone:idZone
            },
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
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.getUserByEmail = getUserByEmail;
module.exports.updateUserPassword = updateUserPassword;