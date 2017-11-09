var models = require('../models');

/**
 * Create a user
 * @param username
 * @param email
 * @param password
 * @param idRole
 * @param idZone
 * @returns {Promise.<Promise.<Model, created>>}
 */
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

/**
 * Get user by email
 * @param email
 * @returns {Promise.<Promise.<Model>>}
 */
function getUserByEmail(email)
{
    return Promise.resolve(
        models.User.findOne
        ({
            where: {email: email}
        })
    )
}

/**
 * Get user by username
 * @param username
 * @returns {Promise.<Promise.<Model>>}
 */
function getUserByUsername(username)
{
    return Promise.resolve(
        models.User.findOne
        ({
            where: {username: username}
        })
    )
}

/**
 * Delete user by its id
 * @param id
 * @returns {Promise.<T>}
 */
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

/**
 * Update user
 * @param id
 * @param email
 * @param idRole
 * @param idZone
 * @returns {Promise.<T>}
 */
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

/**
 * Update user and change its password
 * @param id
 * @param email
 * @param password
 * @param idRole
 * @param idZone
 * @returns {Promise.<T>}
 */
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

/**
 * Get all users
 * @returns {Promise.<Promise.<Array.<Model>>>}
 */
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
module.exports.getUserByUsername = getUserByUsername;