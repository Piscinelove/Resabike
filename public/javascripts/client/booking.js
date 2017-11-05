$(document).ready(function(){
    $('.stepper').activateStepper({
        linearStepsNavigation: false,
    });

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        today: 'Aujourd\'hui',
        clear: 'Annuler',
        close: 'Ok',
        closeOnSelect: true ,// Close upon selecting a date,
        format: 'mm/dd/yyyy',
        min:true

    });

    //HOURS
    $('.timepicker').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Annuler', // text for clear-button
        canceltext: 'Fermer', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function(){
            Materialize.updateTextFields();
        } //Function for after opening timepicker
    });

    $('.booking-button').on('click', function (e) {
        e.stopPropagation();
    })

})

function getBookingSuggestions()
{
    var departure = $('#booking-register-departure').val();
    var terminal = $('#booking-register-terminal').val();
    var date = $('#booking-register-date').val();
    var time = $('#booking-register-time').val();

    superagent
        .post("/booking")
        .send({departure:departure, terminal:terminal, date:date, time:time})
        .end(function(err, res)
        {
            if (err || !res.ok)
            {
                $('.stepper').destroyFeedback();
                errorToast('Une erreur interne est survenu.'+'</br>'+'Veillez bien à choisir un arrêt de départ et de destination valide');
            }
            else
            {
                console.log(res.body);
                buildSuggestions(res);
                successToast("User mise à jour");
                $('.stepper').nextStep();
            }
        });
}

function createBooking() {

    var trip = $("#"+event.target.id).data("trip");
    event.stopPropagation();



    var personaldata = {
        firstname : $('#booking-register-firstname').val(),
        lastname : $('#booking-register-lastname').val(),
        group : $('#booking-register-group').val(),
        phone : $('#booking-register-phone').val(),
        email : $('#booking-register-email').val(),
        datetime : trip.datetime,
        nbBikes: $('#booking-register-bikes').val(),
        remark : $('#booking-register-email').val(),
        departure: trip.departure,
        arrival : trip.arrival
    }

    superagent
        .post("/booking/add")
        .send({personaldata: personaldata, trip:trip})
        .end(function(err, res)
        {
            if (err || !res.ok)
            {
                $('.stepper').destroyFeedback();
                errorToast('Une erreur interne est survenu.'+'</br>'+'Veillez bien à choisir un arrêt de départ et de destination valide');
            }
            else
            {
                var resume = '<ul class="collection"><li class="collection-item ebony-clay white-text"><div class="choice"><i class="material-icons" style="vertical-align: middle">directions_bus</i>';

                for(var i = 0; i < trip.changes.length; i++)
                {
                    resume +=
                        '<span class="highlight-line">'+trip.changes[i].idLine+'</span>';
                }
                resume += ' ' + trip.departure + '<i class="material-icons direction">keyboard_arrow_right</i> ' + trip.arrival + ' <span class="not-highlight">' + trip.datetime + ' ' + trip.duration/60 + '\'</span><span class="register-bikes-available"><i class="material-icons register-bikes-available-icon">directions_bike</i>'+personaldata.nbBikes+' vélo(s)</span></div></ul></li> ';
                if(personaldata.nbBikes > trip.nbBikes)
                {
                    successToast("Succès de la réservation !");
                    $('.confirmation-message').empty();
                    $('.confirmation-message').append("<p>Votre réservation a bien été placée en file d'attente.</p>" +
                        "<p>Le nombre de vélos réservés étant supérieur aux nombres de places  disponibles, la confirmation " +
                        "d'un administrateur est nécessaire.</p><p>Vous serez contacté par e-mail dans les plus brefs délais.</p>")
                }
                else
                {
                    successToast("Succès de la réservation !");
                    $('.confirmation-message').empty();
                    $('.confirmation-message').append("<p>Bonjour "+personaldata.firstname+" "+personaldata.lastname+",</p>" +
                        '<p>Un email de confirmation a été envoyée à l\'adresse ' +
                        'suivante : '+personaldata.email+'</p><p>La réservation suivante a bien été traitée : </p>')
                    $('.resume').empty();
                    $('.resume').append(resume);
                }

                setTimeout("$('.stepper').nextStep();", 2000);

            }
        });
}

function buildSuggestions(res) {
    var suggestions = "";

    for(var i = 0; i < res.body.length; i++)
    {
        var stops = "";
        var suggestion = res.body[i];
        var data = JSON.stringify(suggestion).replace(/'/g, "\\'");
        suggestions += '<li data-id="'+i+'"><div class="collapsible-header"><div class="choice"><i class="material-icons" style="vertical-align: middle">directions_bus</i>';

        console.log(suggestion);
        if(suggestion.changes.length > 1)
            for(var j = 0; j < suggestion.changes.length; j++)
            {
                suggestions += ' <span class="highlight-line">'+suggestion.changes[j].idLine+'</span>';
                var startTime = suggestion.changes[j].departureTime.split(' ')[1].split(':')[0]+":"+suggestion.changes[j].departureTime.split(' ')[1].split(':')[1];

                    if(j != suggestion.changes.length - 1)

                        stops +='<li>'+suggestion.changes[j].departureStation+'</br><span class="light-hour"> '+startTime+' </span></li>';
                    else
                    {
                        var exitTime = suggestion.changes[j].exitTime.split(' ')[1].split(':')[0]+":"+suggestion.changes[j].exitTime.split(' ')[1].split(':')[1];
                        var previousExitTime = suggestion.changes[j-1].exitTime.split(' ')[1].split(':')[0]+":"+suggestion.changes[j-1].exitTime.split(' ')[1].split(':')[1];
                        stops += '<li>'+suggestion.changes[j].departureStation+'</br><span class="light-hour"> '+previousExitTime+'-'+ startTime +' </span></li><li>'+suggestion.changes[j].exitStation+'</br><span class="light-hour"> '+exitTime+' </span></li>';
                    }
            }
        else
        {
            suggestions += ' <span class="highlight-line">'+suggestion.changes[0].idLine+'</span>';
            var startTime = suggestion.changes[0].departureTime.split(' ')[1].split(':')[0]+":"+suggestion.changes[0].departureTime.split(' ')[1].split(':')[1];
            var exitTime = suggestion.changes[0].exitTime.split(' ')[1].split(':')[0]+":"+suggestion.changes[0].exitTime.split(' ')[1].split(':')[1];
            stops += '<li>'+suggestion.changes[0].departureStation+'</br><span class="light-hour"> '+ startTime +' </span></li><li>'+suggestion.changes[0].exitStation+'</br><span class="light-hour"> '+exitTime+' </span></li>';
        }

        var duration = suggestion.duration / 60;
        suggestions += ' ' + suggestion.departure + '<i class="material-icons direction">keyboard_arrow_right</i> ' + suggestion.arrival + ' <span class="not-highlight">' + suggestion.datetime + ' ' + duration + '\'</span><span class="register-bikes-available"><i class="material-icons register-bikes-available-icon">directions_bike</i>'+suggestion.nbBikes+' place(s)</span></div>' +
            '<button class="waves-effect waves-light btn booking-button" id="booking-button-'+i+'" data-trip=\''+data+'\' data-feedback="createBooking">réserver<i class="material-icons left">timeline</i></button></div>' +
            '<div class="collapsible-body"><span><ol class="line-stops">'+stops+'</ol></span></div></li>';



    }

    $('ul.collapsible.suggestions').empty();
    $('ul.collapsible.suggestions').append(suggestions);

}

function newBooking() {
    $('.stepper').destroyFeedback();
    $('.stepper').resetStepper();
}