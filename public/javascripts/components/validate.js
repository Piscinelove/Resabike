$(document).ready(function(){


    validateForms();
})

/**
 * Validation of all the forms
 */
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
        },
        messages:{
            username:{
                required: translation[$_LANG()].VALIDATEENTERUSER,
                minlength: translation[$_LANG()].VALIDATEENTERUSER2
            },
            firstname: {
                required: translation[$_LANG()].VALIDATEENTERFIRSTNAME
            },
            lastname: {
                required: translation[$_LANG()].VALIDATEENTERLASTNAME
            },
            email:{
                required: translation[$_LANG()].VALIDATEENTERMAIL,
                minlength: translation[$_LANG()].VALIDATEENTERMAIL2
            },
            password:{
                required: translation[$_LANG()].VALIDATEENTERPSW ,
                minlength: translation[$_LANG()].VALIDATEENTERPSW2
            },
            chpassword:{
                required: translation[$_LANG()].VALIDATEENTERCHPSW,
                minlength: translation[$_LANG()].VALIDATEENTERCHPSW2
            },
            password2:{
                required: translation[$_LANG()].VALIDATECONFPSW ,
                minlength: translation[$_LANG()].VALIDATECONFPSW2 ,
                equalTo: translation[$_LANG()].VALIDATECONFPSW3
            },
            chpassword2:{
                required: translation[$_LANG()].VALIDATECONFCHPSW  ,
                minlength: translation[$_LANG()].VALIDATECONFCHPSW2 ,
                equalTo: translation[$_LANG()].VALIDATECONFCHPSW3
            },
            role:{
                required: translation[$_LANG()].VALIDATECHOOSEROLE,
            },
            zone:{
                required: translation[$_LANG()].VALIDATECHOOSEZONE ,
            },
            zonename:{
                required: translation[$_LANG()].VALIDATECHOOSENAMEZONE ,
                minlength: translation[$_LANG()].VALIDATECHOOSENAMEZONE2,
            },
            departure:{
                required: translation[$_LANG()].VALIDATEENTERNAMEZONE
            },
            trips:{
                required: translation[$_LANG()].VALIDATECHOOSETRIP ,
            },
            phone:{
                required: translation[$_LANG()].VALIDATEENTERPHONE ,
                isSwissPhoneNumber: translation[$_LANG()].VALIDATEENTERPHONE2
            },
            departureBooking:{
                required: translation[$_LANG()].VALIDATEENTERSTART,
                isValidStation: translation[$_LANG()].VALIDATEENTERSTART2
            },
            terminalBooking:{
                required: translation[$_LANG()].VALIDATEENTEREND,
                isValidStation: translation[$_LANG()].VALIDATEENTEREND2
            },
            dateBooking:{
                required:"",
            },
            timeBooking:{
                required:""
            },
            bikesBooking:{
                required: translation[$_LANG()].VALIDATEENTERNBBIKE,
                min: translation[$_LANG()].VALIDATEMINBIKE,
                max: translation[$_LANG()].VALIDATEMAXBIKE
            },
            conditions:{
                required:"<br /> "+translation[$_LANG()].VALIDATETERM +""
            }
        }
    });

}
