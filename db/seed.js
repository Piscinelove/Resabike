var models = require("../models");
var roleManagement = require("../module/role-management");
var dbUser = require("../db/user");
var dbZone = require("../db/zone");

models.sequelize.sync().then(function () {
    roleManagement.createRoles().then(function (roles) {
        dbZone.createZone("Val d'Anniviers").then(function (zone) {
            dbUser.createUser("root", "root@root.ch", "root", 1, 1);
        })
    })
});