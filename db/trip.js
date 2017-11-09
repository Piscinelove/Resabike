var models = require('../models');

/**
 * Calculate number of bikes in a trip
 * @param trip
 * @returns {Promise}
 */
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

/**
 * Create a trip
 * @param startHour
 * @param idBooking
 * @param idLine
 * @param idStartStation
 * @param idEndstation
 * @returns {Promise.<T>}
 */
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

/**
 * Get all bookings
 * @returns {Promise.<Promise.<Array.<Model>>>}
 */
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

/**
 * Get all bookings from a zone
 * @param idZone
 * @returns {Promise.<Promise.<Array.<Model>>>}
 */
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


/**
 * Get all accepted bookings from a zone
 * Only where the date is after now
 * @param idZone
 * @returns {Promise.<Promise.<Array.<Model>>>}
 */
function getAllAcceptedBookingsByZoneId(idZone)
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