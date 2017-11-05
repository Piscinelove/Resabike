var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');

/* GET home page. */
router.get('/', function(req, res, next) {

  dbStation.getAllStations().then(function (stations) {
      res.json(stations);
  })
});

router.get('/search=:input', function(req, res, next) {

    var input = req.params.input;
    console.log(input);
    dbStation.getAllStationsByTerm(input).then(function (stations) {
        res.json(stations);
    })
});

module.exports = router;
