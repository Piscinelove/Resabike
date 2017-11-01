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

module.exports.getNumberOfBikes = getNumberOfBikes;