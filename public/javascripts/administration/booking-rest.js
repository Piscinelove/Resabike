$(document).ready(function(){
    var table = $('.tab-bookings-list').DataTable({
        "autoWidth": false,
        "iDisplayLength": 5,
        responsive:true,
        rowGroup: {
            startRender: function ( rows, group ) {

                var sumBikes = rows
                    .data()
                    .pluck(4)
                    .reduce( function (a, b) {
                        return a + b.replace(/[^\d]/g, '')*1;
                    }, 0);

                if(sumBikes > 6)
                    return ' <span id="booking-header-total-bikes" class="correct"><i class="material-icons table-group-icon">access_time</i> '+ group +'</span><span id="booking-header-total-bikes" class="correct"><i class="material-icons table-group-icon">directions_bike</i>'+sumBikes+' vélos</span>';
                else
                    return ' <span id="booking-header-total-bikes" class="correct"><i class="material-icons table-group-icon">access_time</i> '+ group +'</span><span id="booking-header-total-bikes" class="waiting"><i class="material-icons table-group-icon">directions_bike</i>'+sumBikes+' vélos</span>';
            },
            dataSrc: 0
        }

    });
});


/**
 * Accept booking
 * @param bookingId
 * @param firstname
 * @param lastname
 * @param group
 * @param departure
 * @param exit
 * @param date
 * @param bikes
 * @param token
 * @param email
 */
function acceptBooking(bookingId, firstname, lastname, group, departure, exit, date, bikes, token, email){

    superagent
        .put("/administration/admin/bookings")
        .send({id: bookingId, firstname: firstname, lastname:lastname, group:group, departure: departure, exit:exit, date:date, bikes:bikes, token:token, email:email})
        .end(function(err, res)
        {

            if (err || !res.ok)
            {
                errorToast(translation[$_LANG()].BOOKINGRESTERROR);
            }
            else
            {
                refreshBookingsList();
                successToast(translation[$_LANG()].BOOKINGRESTCONFIRM);
            }
        });
}

/**
 * Refuse booking
 * @param bookingId
 * @param firstname
 * @param lastname
 * @param group
 * @param departure
 * @param exit
 * @param date
 * @param bikes
 * @param token
 * @param email
 */
function refuseBooking(bookingId, firstname, lastname, group, departure, exit, date, bikes, token, email){

    superagent
        .delete("/administration/admin/bookings/"+bookingId)
        .send({firstname: firstname, lastname:lastname, group:group, departure: departure, exit:exit, date:date, bikes:bikes, token:token, email:email})
        .end(function(err, res)
        {

            if (err || !res.ok)
            {
                errorToast(translation[$_LANG()].BOOKINGRESTINTERNERROR);
            }
            else
            {
                refreshBookingsList();
                successToast(translation[$_LANG()].BOOKINGRESTDELAY);
            }
        });
}

/**
 * Refresh table of bookings
 */
function refreshBookingsList() {
    //$("#tab-bookings-list").load(" #tab-bookings-list");
    window.location.href = '/administration/admin/bookings';
}