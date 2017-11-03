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