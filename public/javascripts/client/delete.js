function refuseBookingFromClient(token){

    superagent
        .post("/delete")
        .send({token:token})
        .end(function(err, res)
        {

            if (err || !res.ok)
            {
                errorToast("Erreur interne");
            }
            else
            {
                successToast("Réservation annulée");
                $('#booking-client').empty();
                setTimeout(1000);
                window.location.href = '/';
            }
        });
}