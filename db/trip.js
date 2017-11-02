var models = require('../models');

function getNumberOfBikes(trip)
{
    return new Promise(function (resolve, reject) {
        models.Trip.sum('nbBikes',
            {
                where:{
                    idLine:trip.idLine,
                    startHour:trip.departureTime
                },
                include : [{model : models.Booking}]
            }).then(function (totalBikes) {
                totalBikes = totalBikes || 0;
                trip.nbBikes -= totalBikes;
                resolve(trip);
            })
    })
}

function createTrip(startHour, idBooking, idLine, idStartStation, idEndstation)
{
    return Promise.resolve(
        models.Trip.create({
            startHour : startHour,
            idBooking : idBooking,
            idLine : idLine,
            idStartStation : idStartStation,
            idEndStation : idEndstation
        })
    )
}

function getAllTripForWaitingBookings()
{
    return Promise.resolve(
        models.Trip.findAll
        ({
            where : {
                "$WaitingBooking.validated$" : 1
            },
            include : [{model : models.Booking, as : "WaitingBooking"},{model : models.Line, as : "WaitingBookingLine"},{model : models.Station, as : "WaitingBookingStation"}]
        })
    )
}

module.exports.getNumberOfBikes = getNumberOfBikes;
module.exports.createTrip = createTrip;
module.exports.getAllTripForWaitingBookings = getAllTripForWaitingBookings;