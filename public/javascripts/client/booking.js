$(document).ready(function(){
    $('.stepper').activateStepper();
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
                errorToast("Cet user existe déjà");
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

}

function buildSuggestions(res) {
    var suggestions = "";

    for(var i = 0; i < res.body.length; i++)
    {
        var stops = "";
        var suggestion = res.body[i];
        suggestions += '<li><div class="collapsible-header valign-wrapper"><input name="trips" required="required" aria-required="true" type="radio" id="test'+i+'"/><label class="black-text" for="test'+i+'"><i class="material-icons" style="vertical-align: middle">directions_bus</i>';

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
            var startTime = suggestion.changes[0].departureTime.split(' ')[1].split(':')[0]+":"+suggestion.changes[0].departureTime.split(' ')[1].split(':')[1];
            var exitTime = suggestion.changes[0].exitTime.split(' ')[1].split(':')[0]+":"+suggestion.changes[0].exitTime.split(' ')[1].split(':')[1];
            stops += '<li>'+suggestion.changes[0].departureStation+'</br><span class="light-hour"> '+ startTime +' </span></li><li>'+suggestion.changes[0].exitStation+'</br><span class="light-hour"> '+exitTime+' </span></li>';
        }

        var duration = suggestion.duration / 60;
        suggestions += ' ' + suggestion.departure + '<i class="material-icons direction">keyboard_arrow_right</i> ' + suggestion.arrival + ' <span class="not-highlight">' + suggestion.datetime + ' ' + duration + '\'</span></label></div>' +
            '<div class="collapsible-body"><span><ol class="line-stops">'+stops+'</ol></span></div></li>';



    }

    $('ul.collapsible.suggestions').empty();
    $('ul.collapsible.suggestions').append(suggestions);

}