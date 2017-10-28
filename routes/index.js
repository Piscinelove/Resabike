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

    bookingManagement.getTrip(departureStation, arrivalStation, date, time).then(function (response) {
        res.status(200).send(response);
    })
})

module.exports = router;
