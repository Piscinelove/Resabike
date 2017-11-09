var models = require("../models");
var roleManagement = require("../module/role-management");
var dbUser = require("../db/user");
var dbZone = require("../db/zone");
var lineManagement = require("../module/line-management");

models.sequelize.sync({force:true}).then(function () {
    roleManagement.createRoles().then(function (roles) {
        dbZone.createZone("Val d'Anniviers").then(function (zone) {
            dbUser.createUser("root", "root@root.ch", "root", 1, 1).then(function () {
                //lineManagement.createLine("Sierre, poste/gare","Zinal, village de vacances",1);
            })
        })
    })
});