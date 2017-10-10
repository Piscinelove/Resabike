$(document).ready(function(){
    $('input.autocomplete').autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "https://timetable.search.ch/api/completion.en.json?show_ids=1&nofavorites=1&term="+request.term,
                dataType: "jsonp",
                success: function (data) {
                    alert("ici");
                    return response(data);
                }
            });
        },
        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
        onAutocomplete: function(val) {
            // Callback function when value is autcompleted.
        },
        minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
    });
});