var dbRole = require('../db/role');

function createRoles() {
    return new Promise(function (resolve, reject) {
        var promises = [];
        promises.push(dbRole.createRole("admin"));
        promises.push(dbRole.createRole("zoneadmin"));
        promises.push(dbRole.createRole("driver"));
        return Promise.all(promises).then(function () {
            resolve("Roles created successfully");
        })
    })

}

module.exports.createRoles = createRoles;