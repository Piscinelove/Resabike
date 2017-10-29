$(document).ready(function(){
    $('.stepper').activateStepper();

    $('.collapsible.suggestions').collapsible({
        onOpen: function(el) {
            var id = $(el).data('id');
            $('#booking-register-trip'+id).attr('checked', 'checked');


        }, // Callback for Collapsible open
        onClose: function(el) {
            var id = $(el).data('id');
            $('#booking-register-trip'+id).removeAttr('checked', 'checked');
        } // Callback for Collapsible close
    });
})

function getBookingSuggestions()
{
    var departure = $('#booking-register-departure').val();
    var terminal = $('#booking-register-terminal').val();

    superagent
        .post("/booking")
        .send({departure:departure, terminal:terminal})
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

    var trip = $('ul.collapsible.suggestions .collapsible-header.active').data("trip");
    console.log(JSON.stringify(trip));
}

function buildSuggestions(res) {
    var suggestions = "";

    for(var i = 0; i < res.body.length; i++)
    {
        var stops = "";
        var suggestion = res.body[i];
        var data = JSON.stringify(suggestion).replace(/'/g, "\\'");
        suggestions += '<li data-id="'+i+'"><div class="collapsible-header" data-trip=\''+data+'\'><div class="choice"><input name="trips" required="required" aria-required="true" type="radio" id="booking-register-trip'+i+'"/><label class="black-text" for="test'+i+'"></label><i class="material-icons" style="vertical-align: middle">directions_bus</i>';

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
        suggestions += ' ' + suggestion.departure + '<i class="material-icons direction">keyboard_arrow_right</i> ' + suggestion.arrival + ' <span class="not-highlight">' + suggestion.datetime + ' ' + duration + '\'</span></div></div>' +
            '<div class="collapsible-body"><span><ol class="line-stops">'+stops+'</ol></span></div></li>';



    }

    $('ul.collapsible.suggestions').empty();
    $('ul.collapsible.suggestions').append(suggestions);

}