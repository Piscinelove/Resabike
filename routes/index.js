var express = require('express');
var router = express.Router();
var bookingManagement = require('../module/booking-management');
var mailManagement = require('../module/mail-management');


/* GET home page. */
router.get('/', function(req, res, next) {

      res.render('index');
});

router.get('/delete=:token', function(req, res, next) {

    res.render('index');
});

router.post('/booking', function (req, res, next) {

    let departure = req.body.departure;
    let terminal = req.body.terminal;
    let time = req.body.time;
    let date = req.body.date;

    bookingManagement.getTrip(departure, terminal, date, time).then(function (response) {

        console.log("bah oui");
        res.status(200).send(response);
    }).catch(function (error) {
        res.status(500).send("Erreur interne");
    })
});

router.post('/booking/add', function (req, res, next) {

    bookingManagement.createBooking(req.body).then(function (response) {
        res.status(200).send("Réservation créee");
    }).catch(function (error) {
        res.status(500).send("Erreur interne");
    })
});

router.post('/contact', function (req, res, next) {

    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;

    mailManagement.sendContactEmail(name, email, message).then(function (response) {

        res.status(200).send(response);
    }).catch(function (error) {
        res.status(500).send("Erreur interne");
    })
});

module.exports = router;
