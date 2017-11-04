var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var dbUser = require('../db/user');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function (err) {
    })

    res.redirect('/login');
});

router.post('/', function(req, res, next) {

    let username = req.body.username;
    let password = req.body.password;
    
    dbUser.getUserByUsername(username).then(function (user) {
        bcrypt.compare(password, user.password_hash).then(function(correct)
        {
            if(correct)
            {
                req.session.authenticated = true;
                req.session.username = user.username;
                req.session.idRole = user.idRole;
                req.session.idZone = user.idZone;
                req.session.email = user.email;
                res.status(200).send("Login success");

            }
            else
            {
                res.status(500).send("User not found");
            }
        })
    })
});

module.exports = router;
