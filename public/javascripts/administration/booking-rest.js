$(document).ready(function(){
    $('.tab-waiting-bookings').DataTable({
        "autoWidth": false,
        responsive:true,
        rowGroup: {
            // endRender: function ( rows, group ) {
            //     var sumBikes = rows
            //         .data()
            //         .pluck(6)
            //         .reduce( function (a, b) {
            //             var cell1;
            //             var cell2;
            //
            //             rows.data().pluck(9).reduce(function (c, d) {
            //                 cell1 = c;
            //                 cell2 = d;
            //                 console.log(c+" ........... "+d);
            //
            //             })
            //
            //             if(cell1 == "accepté" || cell2 == "accepté")
            //                 return a + b.replace(/[^\d]/g, '')*1;
            //             else
            //                 return 6-a;
            //         }, 0);
            //
            //     return $.fn.dataTable.render.number(',', '.', 0).display( sumBikes );
            // },
            startRender: function ( rows, group ) {

                var sumBikes = rows
                    .data()
                    .pluck(6)
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




function acceptBooking(bookingId){

    superagent
        .put("/administration/admin/waitings")
        .send({id: bookingId})
        .end(function(err, res)
        {

            if (err || !res.ok)
            {
                errorToast("Cet user existe déjà");
            }
            else
            {
                refreshUsers();
                $("#modal-edit-user").modal('close');
                resetForm("#edit-user-form");
                successToast("User mise à jour");
            }
        });
}