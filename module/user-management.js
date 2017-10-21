var dbUser = require('../db/user');
var dbRole = require('../db/role');
var dbZone = require('../db/zone');

function getUsersAndRoleAndZone(){
    // List of zones, list of roles availables with list of all users
    var result = [];
    var usersDetails;

    return Promise.resolve(
        dbZone.getAllZones()
            .then(function (zones) {
                result.push(zones);
                return dbRole.getAllRoles();
            }).then(function (roles) {
                result.push(roles);
                return dbUser.getAllUsers();
            }).then(function (users) {
                var promises = [];

                for(let i = 0; i < users.length; i++)
                {
                    promises.push(dbRole.getRoleById(users[i].idRole).then(function (role) {
                        users[i].role = role.name;
                    }));
                    promises.push(dbZone.getZoneById(users[i].idZone).then(function (zone) {
                        users[i].zone = zone.name;
                    }));
                }

                return Promise.all(promises).then(function () {
                    result.push(users);
                    //usersDetails = users;
                })
            }).then(function () {
                return result;
            })
    )
}

function test(){
    // List of zones, list of roles availables with list of all users
    var result = [];
    var usersDetails;

    return Promise.resolve(
        dbUser.getAllUsers()
            .then(function (users) {
                var promises = [];

                for(let i = 0; i < users.length; i++)
                {
                    promises.push(dbRole.getRoleById(users[i].idRole).then(function (role) {
                        users[i].role = role.name;
                    }));
                    promises.push(dbZone.getZoneById(users[i].idZone).then(function (zone) {
                        users[i].zone = zone.name;
                    }));
                }

                return Promise.all(promises).then(function () {
                    result.push(users);
                    //usersDetails = users;
                })
            }).then(function () {
            return result;
        })
    )
}

module.exports.getUsersAndRoleAndZone = getUsersAndRoleAndZone;