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
                if(trip.nbBikes < 0)
                    trip.nbBikes = 0;
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

// function getAllTripForWaitingBookings()
// {
//     return Promise.resolve(
//         models.Trip.findAll
//         ({
//             where : {
//
//                 '$Booking.validated$' : 0
//             },
//             include :
//                 [
//                     {model : models.Booking},
//                     {model : models.Line, include : [{model : models.Station},{model : models.Zone}]}
//                 ]
//         })
//     )
// }

// function getAllTripForWaitingBookings()
// {
//     return Promise.resolve(
//         models.Zone.findAll
//         ({
//             include :
//                 [
//                     {
//                         model : models.Line,
//                         include :
//                             [
//                                 {model : models.Station, as : 'departureStationLine'},
//                                 {model : models.Station, as : 'terminalStationLine'},
//                                 {model : models.Trip, include : [{model : models.Booking, where:{validated:0}},{model : models.Station, as : 'departureStationTrip'},{model : models.Station, as : 'terminalStationTrip'}]}
//                             ]
//                     }
//                 ]
//         })
//     )
// }

function getAllBookings()
{
    return Promise.resolve(
        models.Zone.findAll
        ({
            include :
                [
                    {
                        model : models.Line,
                        include :
                            [
                                {model : models.Station, as : 'departureStationLine'},
                                {model : models.Station, as : 'terminalStationLine'},
                                {model : models.Trip, include : [{model : models.Booking},{model : models.Station, as : 'departureStationTrip'},{model : models.Station, as : 'terminalStationTrip'}]}
                            ]
                    }
                ]
        })
    )
}

function getAllBookingsByZoneId(idZone)
{
    return Promise.resolve(
        models.Zone.findAll
        ({
            where:{
                id:idZone
            },
            include :
                [
                    {
                        model : models.Line,
                        include :
                            [
                                {model : models.Station, as : 'departureStationLine'},
                                {model : models.Station, as : 'terminalStationLine'},
                                {model : models.Trip, include : [{model : models.Booking},{model : models.Station, as : 'departureStationTrip'},{model : models.Station, as : 'terminalStationTrip'}]}
                            ]
                    }
                ]
        })
    )
}



function getAllAcceptedBookingsByZoneId(idZone)
{
    console.log(new Date()+"test");
    return Promise.resolve(
        models.Zone.findAll
        ({
            where:{
                id:idZone
            },
            include :
                [
                    {
                        model : models.Line,
                        include :
                            [
                                {model : models.Station, as : 'departureStationLine'},
                                {model : models.Station, as : 'terminalStationLine'},
                                {model : models.Trip, include : [{model : models.Booking, where:{validated:1,date:{$gte:new Date()}}},{model : models.Station, as : 'departureStationTrip'},{model : models.Station, as : 'terminalStationTrip'}]}
                            ]
                    }
                ]
        })
    )
}

module.exports.getNumberOfBikes = getNumberOfBikes;
module.exports.createTrip = createTrip;
module.exports.getAllBookings = getAllBookings;
module.exports.getAllBookingsByZoneId = getAllBookingsByZoneId;
module.exports.getAllAcceptedBookingsByZoneId = getAllAcceptedBookingsByZoneId;