var express = require('express');
var router = express.Router();
var dbZone = require('../db/zone');

/* GET home page. */
router.get('/admin/zone', function(req, res, next) {
    dbZone.getAllZones().then(function (zones) {
        res.render('administration/admin/zone',{zones:zones});
    })

});

router.get('/admin/users', function(req, res, next) {
    dbZone.getAllZones().then(function (zones) {
        res.render('administration/admin/users',{zones:zones});
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

router.delete("/admin/zone/:id", function(req,res){
    let id = req.params.id;

    dbZone.deleteZone(id).then(
        function () {
            res.status(200).send("Zone deleted");

        }
    )

});

module.exports = router;