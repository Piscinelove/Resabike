var express = require('express');
var router = express.Router();
var bookingManagement = require('../module/booking-management');
var departureStation = "sierre";
var arrivalStation = "Niouc, village";
var time = "16:25";
var date = "10/28/2017";

/* GET home page. */
router.get('/', function(req, res, next) {

      res.render('index');
});

router.post('/booking', function (req, res, next) {

    let departure = req.body.departure;
    let terminal = req.body.terminal;

    bookingManagement.getTrip(departure, terminal, date, time).then(function (response) {

        res.status(200).send(response);
    }).catch(function (error) {
        res.status(500).send("Erreur interne");
    })
})

module.exports = router;
