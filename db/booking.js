var models = require('../models');

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

module.exports.createBooking = createBooking;