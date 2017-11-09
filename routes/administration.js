var express = require('express');
var router = express.Router();
var dbZone = require('../db/zone');
var dbUser = require('../db/user');
var dbBooking = require('../db/booking');
var dbLine = require('../db/line');
var userManagement = require('../module/user-management');
var lineManagement = require('../module/line-management');
var bookingManagement = require('../module/booking-management');
var mailManagement = require('../module/mail-management');

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

router.get('/admin/lines', function(req, res, next) {

    if(req.session.idRole == 2)
        lineManagement.getZoneAndLines(req.session.idZone)
            .then(function (result) {
                var zone  = [];
                zone.push(result[0]);
                res.render('administration/admin/lines',{zones:zone, lines:result[1]});
            })
    else
        lineManagement.getZonesAndLines()
            .then(function (result) {
                res.render('administration/admin/lines',{zones:result[0], lines:result[1]});
            })
});

router.get('/admin/bookings', function(req, res, next) {

    if(req.session.idRole == 2)
        bookingManagement.getBookingsByZoneId(req.session.idZone)
            .then(function (bookinglist) {
                res.render('administration/admin/bookings',{bookinglist:bookinglist});
            })
    else if(req.session.idRole == 3)
        bookingManagement.getAcceptedBookingsByZoneId(req.session.idZone)
            .then(function (bookinglist) {
                res.render('administration/admin/bookings',{bookinglist:bookinglist});
            })
    else
        bookingManagement.getBookings()
            .then(function (bookinglist) {
                res.render('administration/admin/bookings',{bookinglist:bookinglist});
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

router.post('/admin/lines', function(req, res){

    let idZone = req.body.idZone;
    let departure = req.body.departure;
    let terminal = req.body.terminal;

    lineManagement.createLine(departure,terminal,idZone)
        .then(function (success) {
            res.status(200).send("Success");
        }).catch(function (error) {
            if(Array.isArray(error))
                res.status(503).send(error);
            else
                res.status(500).send(error);
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

router.put('/admin/bookings', function(req, res){

    let id = req.body.id;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let group = req.body.group;
    let departure = req.body.departure;
    let exit = req.body.exit;
    let date = req.body.date;
    let bikes = req.body.bikes;
    let token = req.body.token;
    let email = req.body.email;

    console.log(firstname+" "+lastname+" "+group+" "+departure+" "+exit+" "+date+" "+token+" "+email);
    dbBooking.acceptBooking(id).then(function () {
        res.status(200).send("Booking confirmed");
        mailManagement.sendConfirmationEmail(firstname, lastname, group, departure, exit, date, bikes, token, email, true)
    })

});

router.put('/admin/users', function(req, res){

    let id = req.body.id;
    let email = req.body.email;
    let chpassword = req.body.chpassword;
    let chpassword2 = req.body.chpassword2;
    let idRole = req.body.idRole;
    let idZone = req.body.idZone;

    if((chpassword === null || chpassword === "")&&(chpassword2 === null || chpassword === ""))
        dbUser.updateUser(id, email, idRole, idZone).then(function () {
                res.status(200).send("User updated");
            }
        );
    else
        dbUser.updateUserPassword(id,email,chpassword,idRole,idZone).then(function () {
                res.status(200).send("User updated");
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

router.delete("/admin/lines/:id", function(req,res){
    let id = req.params.id;

    dbLine.deleteLine(id).then(
        function () {
            res.status(200).send("Line deleted");

        }
    )

});

router.delete("/admin/bookings/:id", function(req,res){
    let id = req.params.id;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let group = req.body.group;
    let departure = req.body.departure;
    let exit = req.body.exit;
    let date = req.body.date;
    let token = req.body.token;
    let email = req.body.email;

    dbBooking.refuseBooking(id).then(
        function () {
            res.status(200).send("Booking refused");

        }
    )

});

module.exports = router;