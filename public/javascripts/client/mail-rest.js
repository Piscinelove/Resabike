function sendContactEmail(){
    var name = $("#contact-name").val();
    var email = $("#contact-email").val();
    var message = $("#contact-message").val();

    if($("#contact-form").valid())
        superagent
            .post("/contact")
            .send({name: name, email:email, message:message})
            .end(function(err, res)
            {
                if (err || !res.ok)
                {
                    errorToast("Cette zone existe déjà");
                }
                else
                {
                    $("#modal-add-zone").modal('close');
                    refreshZones();
                    resetForm("#add-zone-form");
                    successToast("Zone ajoutée");
                }
            });
}