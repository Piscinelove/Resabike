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
                    errorToast(translation[$_LANG()].LOGINRESTUSERDONTEXIST);
                    $('#stepper-login.stepper').destroyFeedback();

                }
                else
                {
                    successToast(translation[$_LANG()].LOGINRESTCONNECT);
                    window.location.href = '/administration/admin/bookings';
                }
            });
}