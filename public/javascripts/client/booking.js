$(document).ready(function(){
    $('.stepper').activateStepper();
})

function getBookingSuggestions()
{
    superagent
        .post("/booking")
        .send()
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

function buildSuggestions(res) {
    var suggestions = "";
    for(var i = 0; i < res.body.length; i++)
    {
        var suggestion = res.body[i];
        suggestions+=     '<li><div class="collapsible-header">'+suggestion.idLine
                                + ' '+ suggestion.departureStation + ' ' + suggestion.exitStation
                                + ' ' + suggestion.departureTime + ' ' + suggestion.exitTime + '</div></li>';
    }

    $('ul.collapsible.suggestions').append(suggestions);

}