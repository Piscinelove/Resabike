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



module.exports.createBooking = createBooking;
module.exports.acceptBooking = acceptBooking;