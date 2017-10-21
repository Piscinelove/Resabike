$(document).ready(function(){
    validateForms();
})

function validateForms() {
    $.validator.setDefaults({
        ignore: [],
        errorClass: 'invalid',
        validClass: "valid",
        errorPlacement: function (error, element) {
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .attr('data-error', error.text());
        },
        rules: {
            username: {
                required: true,
                minlength:2
            },
            email:{
                required:true,
                minlength:4
            },
            password:{
                required:true,
                minlength:2
            },
            chpassword:{
                minlength:2
            },
            password2:{
                required:true,
                minlength:2,
                equalTo:"#user-add-password"
            },
            chpassword2:{
                minlength:2,
                equalTo:"#user-edit-chpassword"
            },
            role:{
                required:true
            },
            zone:{
                required:true
            }
        },
        messages:{
            username:{
                required:"Veuillez saisir un nom d'utilisateur",
                minlength:"Veuillez saisir un nom d'utilisateur de 2 caractères minimum"
            },
            email:{
                required:"Veuillez saisir un email valide",
                minlength:"Veuillez saisir un email valide de 4 caractères minimum"
            },
            password:{
                required:"Veuillez saisir un mot de passe",
                minlength:"Veuillez saisir un mot de passe de 2 caractères minimum"
            },
            chpassword:{
                minlength:"Veuillez saisir un mot de passe de 2 caractères minimum"
            },
            password2:{
                required:"Veuillez confirmer votre mot de passe",
                minlength:"Veuillez confirmer votre mot de passe de 2 caractères minimum",
                equalTo:"Veuillez saisir un mot de passe identique au premier"
            },
            chpassword2:{
                minlength:"Veuillez confirmer votre mot de passe de 2 caractères minimum",
                equalTo:"Veuillez saisir un mot de passe identique au premier"
            },
            role:{
                required:"Veuillez choisir un rôle",
            },
            zone:{
                required:"Veuillez choisir une zone",
            }
        }
    });
}
