var express = require('express');
var router = express.Router();
var dbZone = require('../db/zone');

/* GET home page. */
router.get('/', function(req, res, next) {
    dbZone.getAllZones().then(function (zones) {
        res.render('zoneadmin',{zones:zones});
    });


    // res.render('login');
});

router.post('/', function(req, res){

    let zoneName = req.body.zone_name;
    dbZone.createZone(zoneName).then(
        function () {
            res.redirect('/zoneadmin');

        }
    )
});

router.put('/', function(req, res){

    let id = req.body.id;
    let name = req.body.name;
    console.log(id +" "+name+" heeeeeeeeee");

    dbZone.updateZone(id, name).then(
        function () {
            res.send(JSON.stringify("Success update"));

        }
    )
});

router.delete('/', function(req, res){

    let zoneName = req.body.zone_name;
    dbZone.createZone(zoneName).then(
        function () {
            res.redirect('/zoneadmin');

        }
    )
});

module.exports = router;