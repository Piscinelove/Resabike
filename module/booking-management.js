var dbUser = require('../db/user');
var dbRole = require('../db/role');
var dbZone = require('../db/zone');
var dbLine = require('../db/line');
var dbLineStation = require('../db/linestation');
var dbStation = require('../db/station');
var axios = require("axios");

const MAXIMUMBIKES = 6;
var departureStation = "sierre";
var arrivalStation = "zinal";
var date = new Date();
var time = "16:25";

/*
   date format : 10/28/2017
   time format : 16:25
 */
function getTripHourAndDateFromAPI(departureStation, arrivalStation, date, time) {
    let url = "https://timetable.search.ch/api/route.en.json?from="+departureStation+"&to="+arrivalStation+"&date="+date+"&time="+time;
    return new Promise(function (resolve, reject) {

        axios.get(url).then(function (response) {
            console.log("BOOKING API QUERRY 1 : "+url);
            resolve([departureStation, arrivalStation, response]);
        })
    })
}

function getTripFromClientBooking(connection) {
    return new Promise(function (resolve, reject) {
        var legs = connection.legs;
        var trip = [];
        var idLine = -1;

        for(var i = 0; i < legs.length; i++)
        {
            var leg = legs[i];
            if(leg.type == "bus" || leg.type == "post"){
                var legDetails = {
                    idLine : leg.line,
                    departureStation : leg.name,
                    exitStation : leg.exit.name,
                    departureTime : leg.departure,
                    exitTime : leg.exit.arrival,
                }

                trip.push(legDetails);
            }
        }
        console.log(JSON.stringify(trip));
        resolve(trip);
    })

}

function getTrip(departureStation, arrivalStation, date, time) {
    return new Promise(function (resolve, reject) {
        getTripHourAndDateFromAPI(departureStation, arrivalStation, date, time).then(function (response) {
            var departureStation = response[0];
            var arrivalStation = response[1];

            var promises = [];

            console.log(response[2].data.connections);
            for(var i = 0; i < response[2].data.connections.length; i++)
            {
                promises.push(getTripFromClientBooking(response[2].data.connections[i]));
            }

            Promise.all(promises).then(function(connections)
            {
                var timetablesAvailable = [];
                for(var i = 0; i < connections.length; i++)
                {
                    timetablesAvailable.push(connections[i]);
                }

                console.log(timetablesAvailable);
            })


        })
    })
    
}

getTrip(departureStation, arrivalStation, "10/28/2017", time);