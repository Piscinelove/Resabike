$(document).ready(function(){


    validateForms();
})

function validateForms() {
    $('select').material_select();

    $('select[required]').css({
        display: 'inline',
        position: 'absolute',
        float: 'left',
        padding: 0,
        margin: 0,
        border: '1px solid rgba(255,255,255,0)',
        height: 0,
        width: 0,
        top: '2em',
        left: '3em',
        opacity: 0,
        pointerEvents: 'none'
    });


    // $.validator.addMethod("isStation", function (value, element) {
    //     var stops = [];
    //
    //     var bool = getValidStopsFromAPI(value, function (stations) {
    //
    //         Object.keys(stations).forEach(function (key) {
    //             stops.push(key);
    //         });
    //
    //         // if(stops.indexOf(element) !== -1)
    //         // {
    //         //     console.log(stops.indexOf(element)+" "+element);
    //         //     console.log("yeah");
    //         //     return true;
    //         // }
    //         // else
    //         // {
    //         //     console.log(stops.indexOf(element)+" "+element);
    //         //     return false;
    //         // }
    //
    //         console.log(value);
    //         console.log(stops.indexOf(value) !== -1);
    //         return stops.indexOf(value) !== -1;
    //     });
    //     return bool;
    //
    // }, "Veuillez saisir un arrêt valide");


    $.validator.setDefaults({
        //ignore: [],
        errorClass: 'invalid',
        validClass: "valid",
        errorPlacement: function (error, element) {
            if (element.prop('tagName')  === 'SELECT') {
                // alternate placement for select error
                error.appendTo( element.parent() );
                error.addClass('active');
            }
            else if(element.prop('name') == 'trips')
            {
                error.insertAfter($('ul.collapsible.suggestions'));
            }
            else {
                $(element)
                    .closest("form")
                    .find("label[for='" + element.attr("id") + "']")
                    .attr('data-error', error.text());
            }

        },
        submitHandler: function(form) {
            $(form).ajaxSubmit();
        },
        highlight: function(element, errorClass, validClass) {
            if (element.tagName === 'SELECT')
                $(element).closest('.select-wrapper').addClass('invalid');
            else
                $(element).removeClass(validClass).addClass(errorClass);
        },
        unhighlight: function(element, errorClass, validClass) {
            if (element.tagName === 'SELECT')
                $(element).closest('.select-wrapper').removeClass('invalid');
            else
                $(element).removeClass(errorClass).addClass(validClass);
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
                required:"#user-edit-chpassword2:filled",
                minlength:2
            },
            password2:{
                required:true,
                minlength:2,
                equalTo:"#user-add-password"
            },
            chpassword2:{
                required:"#user-edit-chpassword:filled",
                minlength:2,
                equalTo:"#user-edit-chpassword"
            },
            role:{
                required:true
            },
            zone:{
                required:true
            },
            zonename:{
                required:true,
                minlength:2,
            },
            trips:{
                required:true,
            },
            // term:{
            //     remote:{
            //         url:"https://timetable.search.ch/api/completion.en.json?",
            //         dataType:'json',
            //         success:function (data) {
            //             alert(data);
            //
            //             var stops = [];
            //             $.each(data, function( id, val ) {
            //                 stops.push(val.label);
            //             });
            //             return stops.indexOf($("input[name='term']").val()) !== -1
            //         }
            //     }
            // }
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
                required:"Veuillez saisir un mot de passe identique",
                minlength:"Veuillez saisir un mot de passe de 2 caractères minimum"
            },
            password2:{
                required:"Veuillez confirmer votre mot de passe",
                minlength:"Veuillez confirmer votre mot de passe de 2 caractères minimum",
                equalTo:"Veuillez saisir un mot de passe identique au premier"
            },
            chpassword2:{
                required:"Veuillez saisir un mot de passe identique",
                minlength:"Veuillez confirmer votre mot de passe de 2 caractères minimum",
                equalTo:"Veuillez saisir un mot de passe identique au premier"
            },
            role:{
                required:"Veuillez choisir un rôle",
            },
            zone:{
                required:"Veuillez choisir une zone",
            },
            zonename:{
                required:"Veuillez saisir un nom de zone",
                minlength:"Veuillez sisair un nom de zone de 2 caractères minimum",
            },
            departure:{
                required:"Veuillez saisir un nom de zone"
            },
            trips:{
                required:"Veuillez choisir un voyage",
            }
        }
    });

}
