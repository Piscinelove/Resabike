var dbUser = require('../db/user');
var dbRole = require('../db/role');
var dbZone = require('../db/zone');
var dbLine = require('../db/line');
var dbLineStation = require('../db/linestation');
var dbStation = require('../db/station');
var dbTrip = require('../db/trip');
var dbBooking = require('../db/booking');
var axios = require("axios");
var bcrypt = require('bcrypt');
const saltRounds = 10;
var mailManagement = require('../module/mail-management');

const MAXIMUMBIKES = 6;
var departureStation = "sierre";
var arrivalStation = "Niouc, village";
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
            if(response.data.count == 0 && response.data.messages != null)
                reject(response);
            else
                resolve([departureStation, arrivalStation, response]);
        })
    })
}

function getTripFromClientBooking(connection) {
    return new Promise(function (resolve, reject) {
        var legs = connection.legs;
        var trip = [];
        var idLine = -1;


        var legDetails = {};

        for(var i = 0; i < legs.length; i++)
        {
            var leg = legs[i];
            if(leg.type == "bus" || leg.type == "post")
            {
                var legDetails = {
                    idLine : leg.line,
                    departureStation : leg.name,
                    exitStation : leg.exit.name,
                    departureTime : leg.departure,
                    nbBikes : MAXIMUMBIKES,
                    exitTime : leg.exit.arrival,
                }

                trip.push(dbTrip.getNumberOfBikes(legDetails));
            }
        }
        Promise.all(trip).then(function (lines) {
            var trip = [];
            for(var i = 0; i < lines.length; i++)
            {
                trip.push(lines[i]);
            }
            resolve(trip);
        })
        //console.log(JSON.stringify(trip));

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
                var trips = [];
                var trip = null;
                for(var i = 0; i < connections.length; i++)
                {
                    var datetime = response[2].data.connections[i].departure;
                    var duration = response[2].data.connections[i].duration;

                    var totalBikes = [];
                    for(var j = 0; j < connections[i].length; j++)
                    {
                        totalBikes.push(connections[i][j].nbBikes);
                    }

                    var nbBikes = Math.min(...totalBikes);

                    trip = {
                        departure : departureStation,
                        arrival : arrivalStation,
                        datetime : datetime,
                        duration : duration,
                        changes : connections[i],
                        nbBikes : nbBikes
                    };
                    trips.push(trip);
                }
                //
                // console.log(connections);
                // connections = connections.reduce(function(a, b) {
                //     return a.concat(b);
                // }, []);
                console.log(trips);
                resolve(trips);

                // Array.prototype.groupBy = function (prop) {
                //     return this.reduce(function (groups, item) {
                //         var val = item[prop];
                //         groups[val] = groups[val] || [];
                //         groups[val].push(item);
                //         return groups;
                //     },{});
                // }
                //
                // var test = connections.reduce(function(a, b) {
                //     return a.concat(b);
                // }, []);
                // console.log(test);
                // var groups = test.groupBy('idLine');
            })


        }).catch(function (error) {
            reject(error);
        })
    })
    
}

function createBooking(body) {
    return new Promise(function (resolve, reject) {
        var trips = body.trip;
        var personaldata = body.personaldata;
        console.log("salut : " + JSON.stringify(body.trip));
        console.log("salut : " + JSON.stringify(body.personaldata));
        var token = personaldata.firstname + personaldata.date + Math.random();

        bcrypt.hash(token, saltRounds, function (err, hash) {
            console.log(hash+"test1");
            hash = hash.replace('/', '1');
            hash = hash.replace('\\', '2');
            console.log(hash+"test2");

            var validated = false;

            if(personaldata.nbBikes <= trips.nbBikes)
                validated = true;

            var promises = [];

            promises.push(dbStation.getStationIdByName(personaldata.departure).then(function (station) {
                personaldata.idStartStation = station.id;
            }));
            promises.push(dbStation.getStationIdByName(personaldata.arrival).then(function (station) {
                personaldata.idEndStation = station.id;
            }));

            Promise.all(promises).then(function () {
                dbBooking.createBooking(personaldata.firstname, personaldata.lastname, personaldata.group, personaldata.email, personaldata.phone, 
                    personaldata.remark, personaldata.datetime, personaldata.nbBikes, hash, validated,
                    personaldata.idStartStation, personaldata.idEndStation).then(function (booking) {
                    console.log(booking);

                    var promises = [];

                    for(let i = 0; i < trips.changes.length; i++)
                    {
                        var trip = {
                            startHour : trips.datetime,
                            idBooking : booking.id,
                            idLine: trips.changes[i].idLine,
                        }

                        promises.push(getStartStationEndStationId(trip, trips.changes[i].departureStation, trips.changes[i].exitStation));
                    }
                    
                    Promise.all(promises).then(function (trips) {

                        var promises = [];

                        for(let i = 0; i < trips.length; i++)
                        {
                            promises.push(dbTrip.createTrip(trips[i].startHour, trips[i].idBooking, trips[i].idLine, trips[i].idStartStation, trips[i].idEndStation));
                        }
                        
                        Promise.all(promises).then(function () {

                            mailManagement.sendConfirmationEmail(personaldata.firstname, personaldata.lastname,
                                personaldata.group, personaldata.departure, personaldata.arrival, personaldata.datetime, personaldata.nbBikes, hash, personaldata.email, validated).then(function () {
                                resolve("Booking(s) création success");
                            })
                        })

                    })

                })
            })
        })
    })
}

function getStartStationEndStationId(trip, departureStation, exitStation) {
    return new Promise(function (resolve, reject) {
        var promises = [];
        promises.push(dbStation.getStationIdByName(departureStation).then(function (station) {
            trip.idStartStation = station.id;
        }));

        promises.push(dbStation.getStationIdByName(exitStation).then(function (station) {
            trip.idEndStation = station.id;
        }));
        
        Promise.all(promises).then(function () {
            resolve(trip);
        })
    })
}

function getBookings()
{
    return new Promise(function (resolve, reject) {
        dbTrip.getAllBookings().then(function (bookinglist) {
            bookinglist = JSON.parse(JSON.stringify(bookinglist));
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    var val = item[prop];
                    groups[val] = groups[val] || [];
                    groups[val].push(item);
                    return groups;
                },{});
            }

            for(var i = 0; i < bookinglist.length; i++)
            {

                for(var j = 0; j < bookinglist[i].Lines.length; j++)
                {
                    var tripsToGroup = JSON.parse(JSON.stringify(bookinglist[i].Lines[j].Trips));
                    var tripsGrouped = tripsToGroup.groupBy('startHour')
                    bookinglist[i].Lines[j].Trips = [];
                    bookinglist[i].Lines[j].Trips.push(tripsGrouped);
                    //console.log(JSON.stringify(bookinglist[i].Lines[j].Trips))
                    //console.log(JSON.stringify(bookinglist[i].Lines[j].Trips));
                    //console.log(JSON.stringify(bookinglist[i].Lines[j].Trips))
                    //console.log(JSON.stringify(lines.Trips.groupBy('startHour')));

                }
            }

            console.log(JSON.stringify(bookinglist));
            //console.log(JSON.stringify(bookinglist));

            //var groups = bookinglist.groupBy('startHour');
            //console.log("waiting : "+JSON.stringify(bookinglist));

            resolve(JSON.parse(JSON.stringify(bookinglist)));

        })
    })
}

function getBookingsByZoneId(idZone)
{
    return new Promise(function (resolve, reject) {
        dbTrip.getAllBookingsByZoneId(idZone).then(function (bookinglist) {
            bookinglist = JSON.parse(JSON.stringify(bookinglist));
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    var val = item[prop];
                    groups[val] = groups[val] || [];
                    groups[val].push(item);
                    return groups;
                },{});
            }

            for(var i = 0; i < bookinglist.length; i++)
            {

                for(var j = 0; j < bookinglist[i].Lines.length; j++)
                {
                    var tripsToGroup = JSON.parse(JSON.stringify(bookinglist[i].Lines[j].Trips));
                    var tripsGrouped = tripsToGroup.groupBy('startHour')
                    bookinglist[i].Lines[j].Trips = [];
                    bookinglist[i].Lines[j].Trips.push(tripsGrouped);
                    //console.log(JSON.stringify(bookinglist[i].Lines[j].Trips))
                    //console.log(JSON.stringify(bookinglist[i].Lines[j].Trips));
                    //console.log(JSON.stringify(bookinglist[i].Lines[j].Trips))
                    //console.log(JSON.stringify(lines.Trips.groupBy('startHour')));

                }
            }

            console.log(JSON.stringify(bookinglist));
            //console.log(JSON.stringify(bookinglist));

            //var groups = bookinglist.groupBy('startHour');
            //console.log("waiting : "+JSON.stringify(bookinglist));

            resolve(JSON.parse(JSON.stringify(bookinglist)));

        })
    })
}

function getAcceptedBookingsByZoneId(idZone)
{
    return new Promise(function (resolve, reject) {
        dbTrip.getAllAcceptedBookingsByZoneId(idZone).then(function (bookinglist) {
            bookinglist = JSON.parse(JSON.stringify(bookinglist));
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    var val = item[prop];
                    groups[val] = groups[val] || [];
                    groups[val].push(item);
                    return groups;
                },{});
            }

            for(var i = 0; i < bookinglist.length; i++)
            {

                for(var j = 0; j < bookinglist[i].Lines.length; j++)
                {
                    var tripsToGroup = JSON.parse(JSON.stringify(bookinglist[i].Lines[j].Trips));
                    var tripsGrouped = tripsToGroup.groupBy('startHour')
                    bookinglist[i].Lines[j].Trips = [];
                    bookinglist[i].Lines[j].Trips.push(tripsGrouped);
                    //console.log(JSON.stringify(bookinglist[i].Lines[j].Trips))
                    //console.log(JSON.stringify(bookinglist[i].Lines[j].Trips));
                    //console.log(JSON.stringify(bookinglist[i].Lines[j].Trips))
                    //console.log(JSON.stringify(lines.Trips.groupBy('startHour')));

                }
            }

            console.log(JSON.stringify(bookinglist));
            //console.log(JSON.stringify(bookinglist));

            //var groups = bookinglist.groupBy('startHour');
            //console.log("waiting : "+JSON.stringify(bookinglist));

            resolve(JSON.parse(JSON.stringify(bookinglist)));

        })
    })
}


module.exports.getTrip = getTrip;
module.exports.createBooking = createBooking;
module.exports.getBookings = getBookings;
module.exports.getBookingsByZoneId = getBookingsByZoneId;
module.exports.getAcceptedBookingsByZoneId = getAcceptedBookingsByZoneId;