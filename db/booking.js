var models = require('../models');

/**
 * Create a booking in the database
 * @param firstname
 * @param lastname
 * @param group
 * @param email
 * @param phone
 * @param remark
 * @param date
 * @param nbBikes
 * @param token
 * @param validated
 * @param idStartStation
 * @param idEndstation
 * @returns {Promise.<T>}
 */
function createBooking(firstname, lastname, group, email, phone, remark, date, nbBikes, token, validated, idStartStation, idEndstation)
{
    return Promise.resolve(
        models.Booking.create({
            firstname : firstname,
            lastname : lastname,
            group : group,
            email : email,
            phone : phone,
            remark : remark,
            date : date,
            nbBikes : nbBikes,
            token : token,
            validated:validated,
            idStartStation:idStartStation,
            idEndStation:idEndstation
        })
    )
}

/**
 * Accept a booking
 * @param id
 * @returns {Promise.<T>}
 */
function acceptBooking(id)
{
    return Promise.resolve(
        models.Booking.update
        (
            { validated : 1},
            {where:{id:id}}
        )
    )
}

/**
 * Refuse a booking
 * @param id
 * @returns {Promise.<T>}
 */
function refuseBooking(id)
{
    return Promise.resolve(
        models.Booking.destroy
        ({
            where:{
                id:id
            }
        })
    )
}

/**
 * Refuse a booking with token
 * Method for users
 * @param token
 * @returns {Promise.<T>}
 */
function refuseBookingFromClient(token)
{
    return Promise.resolve(
        models.Booking.destroy
        ({
            where:{
                token:token
            }
        })
    )
}

/**
 * Get a booking using his token
 * @param token
 * @returns {Promise.<Promise.<Model>>}
 */
function getBookingByToken(token)
{
    return Promise.resolve(
        models.Booking.findOne
        ({
            where:{
                token:token
            },
            include :
                [
                    {model : models.Station, as : 'departureStationBooking'},
                    {model : models.Station, as : 'terminalStationBooking'}
                ]
        })
    )
}



module.exports.createBooking = createBooking;
module.exports.acceptBooking = acceptBooking;
module.exports.refuseBooking = refuseBooking;
module.exports.getBookingByToken = getBookingByToken;
module.exports.refuseBookingFromClient = refuseBookingFromClient;
