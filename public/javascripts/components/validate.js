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


    $.validator.addMethod("isSwissPhoneNumber", function(value, element) {
        return /^(0041|041|\+41|\+\+41|41)?(0|\(0\))?([1-9]\d{1})(\d{3})(\d{2})(\d{2})$/.test($(element).val().replace(/\s+/g, '')); // return true if field is ok or should be ignored
    });

    $.validator.addMethod("isValidStation", function(value, element) {
        var stations = [];
        
        $.ajax({
            type: "GET",
            url: "/autocomplete/search="+$(element).val().replace('/', '%2F'),
            async:false,
            success:function (data) {
                $.each(data, function( id, val ) {
                    stations.push(val.name);
                });
            }
        })
        console.log(stations.indexOf($(element).val()) !== -1);
        return stations.indexOf($(element).val()) !== -1;
    });

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
            else if(element.prop('name') == 'conditions')
            {
                error.appendTo($('#conditions-booking'));
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
            firstname: {
                required: true
            },
            lastname: {
                required: true
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
            phone:{
                required:true,
                isSwissPhoneNumber:true
            },
            departureBooking:{
                required:true,
                isValidStation:true
            },
            terminalBooking:{
                required:true,
                isValidStation:true
            },
            dateBooking:{
                required:true,
            },
            timeBooking:{
                required:true
            },
            bikesBooking:{
                required:true,
                min:1,
                max:6
            },
            conditions:{
                required:true
            }
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
            firstname: {
                required: "Veuillez saisir votre prénom"
            },
            lastname: {
                required: "Veuillez saisir votre nom"
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
            },
            phone:{
                required:"Veuillez saisir un numéro de téléphone",
                isSwissPhoneNumber:"Veuillez saisir un numéro de téléphone valide"
            },
            departureBooking:{
                required:"Veuillez saisir une station de départ",
                isValidStation:"Veuillez saisir une station de départ valide"
            },
            terminalBooking:{
                required:"Veuillez saisir une station d'arrivée",
                isValidStation:"Veuillez saisir une station d'arrivée valide"
            },
            dateBooking:{
                required:"",
            },
            timeBooking:{
                required:""
            },
            bikesBooking:{
                required:"Veuillez saisir le nombre de vélos",
                min:"Un vélo minimum est requis",
                max:"Le nombre de vélos de peut être supérieur à 6"
            },
            conditions:{
                required:"<br />Veuillez accépter les conditions générales"
            }
        }
    });

}
