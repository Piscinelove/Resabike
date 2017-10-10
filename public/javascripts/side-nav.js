$(document).ready(function(){
    $('.parallax').parallax();

    $('input.autocomplete')

    $('input.autocomplete').autocomplete({
        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
        minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
        data: function () {
            return {
                "Apple": null,
                "Microsoft": null,
                "Google": 'http://placehold.it/250x250',
            }
        }
    });
});

$(".button-collapse").sideNav();

