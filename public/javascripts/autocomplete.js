$(document).ready(function(){

    var stations = {};
    var stationsString;

    $('input.autocomplete').on('input',function(e){
        var input = $(this).val();
        getAutocompleteStationsFromAPI(input);

    });

    $('input.autocomplete-db').on('input',function(e){
        var input = $(this).val();
        getAutocompleteStationsFromDB(input);

    });

    // $('input.autocomplete').change(function() {
    //     $(this).val(Object.keys(stations)[0]);
    // });
});


function getAutocompleteStationsFromAPI(input) {
    var stations = {};

    $.getJSON( "https://timetable.search.ch/api/completion.en.json?show_ids=1&nofavorites=1&term="+input, function( data ) {

    }).done(function (data) {
        $.each(data, function( id, val ) {
            stations[val.label] = null;
        });

        $('input.autocomplete').autocomplete({
            data: stations,
            limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
                // Callback function when value is autcompleted.
            },
            minLength: 2, // The minimum length of the input for the autocomplete to start. Default: 1.
        });
    });
}

function getAutocompleteStationsFromDB(input) {
    var stations = {};

    $.getJSON( "/autocomplete/search="+input, function( data ) {

    }).done(function (data) {
        $.each(data, function( id, val ) {
            stations[val.name] = null;
        });
        $('input.autocomplete-db').autocomplete({
            data: stations,
            limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
                // Callback function when value is autcompleted.
            },
            minLength: 2, // The minimum length of the input for the autocomplete to start. Default: 1.
        });
    });
}