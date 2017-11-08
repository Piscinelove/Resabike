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
