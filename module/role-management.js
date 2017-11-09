var dbRole = require('../db/role');

/**
 * Create aall needed roles
 * @returns {Promise}
 */
function createRoles() {
    return new Promise(function (resolve, reject) {
        var promises = [];
        promises.push(dbRole.createRole("admin",1));
        promises.push(dbRole.createRole("zoneadmin",2));
        promises.push(dbRole.createRole("driver", 3));
        return Promise.all(promises).then(function () {
            resolve("Roles created successfully");
        })
    })

}

module.exports.createRoles = createRoles;