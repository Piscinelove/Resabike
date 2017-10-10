$(document).ready(function(){

    var stations = {};
    var stationsString;

    $('input.autocomplete').on('input',function(e){
        var input = $('input.autocomplete').val();
        $.getJSON( "https://timetable.search.ch/api/completion.en.json?show_ids=1&nofavorites=1&term="+input, function( data ) {

        }).done(function (data) {
            $.each(data, function( id, val ) {
                if (val.iconclass.toLowerCase().indexOf("bus") >= 0)
                {
                    stations[val.label] = null;
                }
            });

            $('input.autocomplete').autocomplete({
                data: stations,
                limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
                onAutocomplete: function(val) {
                    alert(stations);
                    // Callback function when value is autcompleted.
                },
                minLength: 3, // The minimum length of the input for the autocomplete to start. Default: 1.
                on
            });

            stationsString = JSON.stringify(stations);
        });
    });
});