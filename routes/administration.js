var express = require('express');
var router = express.Router();
var dbZone = require('../db/zone');
var dbUser = require('../db/user');
var dbRole = require('../db/role');
var userManagement = require('../module/user-management');

/* GET home page. */
router.get('/admin/zone', function(req, res, next) {
    dbZone.getAllZones().then(function (zones) {
        res.render('administration/admin/zone',{zones:zones});
    })

});

router.get('/admin/users', function(req, res, next) {

    userManagement.getUsersAndRoleAndZone()
        .then(function (result) {
            res.render('administration/admin/users',{zones:result[0], roles:result[1], users:result[2]});
        })
});

router.post('/admin/zone', function(req, res){

    let name = req.body.name;

    dbZone.createZone(name).then(function (result) {
        if(!result[1])
            res.status(500).send("Zone already exist");
        else
            res.status(200).send("Success");
    })
});

router.post('/admin/users', function(req, res){

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;
    let idRole = req.body.idRole;
    let idZone = req.body.idZone;

    dbUser.createUser(username, email, password, idRole, idZone).then(function (result) {
        if(!result[1])
            res.status(500).send("User already exist");
        else
            res.status(200).send("Success");
    })
});

router.put('/admin/zone', function(req, res){

    let id = req.body.id;
    let name = req.body.name;

    dbZone.getZoneByName(name).then(function (zoneFounded) {
        if(zoneFounded === null)
            dbZone.updateZone(id, name).then(
                function () {
                    res.status(200).send("Zone updated");

                }
            )
        else
            res.status(500).send("Zone with same already exist");

    })

});

router.put('/admin/users', function(req, res){

    let id = req.body.id;
    let email = req.body.email;
    let chpassword = req.body.chpassword;
    let idRole = req.body.idRole;
    let idZone = req.body.idZone;

    dbUser.getUserByEmail(email).then(function (userFounded) {
        if(userFounded === null)
            return dbUser.updateUser(id, email, chpassword, idRole, idZone).then(
                function () {
                    res.status(200).send("User updated");

                }
            )
        else
            res.status(500).send("User with same email already exist");

    })

});

router.delete("/admin/zone/:id", function(req,res){
    let id = req.params.id;

    dbZone.deleteZone(id).then(
        function () {
            res.status(200).send("Zone deleted");

        }
    )

});

router.delete("/admin/users/:id", function(req,res){
    let id = req.params.id;

    dbUser.deleteUser(id).then(
        function () {
            res.status(200).send("Zone deleted");

        }
    )

});

module.exports = router;