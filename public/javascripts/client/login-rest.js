$(document).ready(function() {
    $('#stepper-login.stepper').activateStepper();
})

function login() {
    var username = $("#login-username").val();
    var password = $("#login-password").val();

    if($("#login-signin-form").valid())
        superagent
            .post("/login")
            .send({username: username, password: password})
            .end(function(err, res)
            {

                if (err || !res.ok)
                {
                    errorToast("Cet utilisateur n'existe pas");
                    $('#stepper-login.stepper').destroyFeedback();

                }
                else
                {
                    successToast("Connecté");
                    window.location.href = '/administration/admin/bookings';
                }
            });
}