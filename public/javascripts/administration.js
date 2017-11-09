$(document).ready(function(){
    $('.scroll-to').click( function() { // Au clic sur un �l�ment
        var section = $(this).attr('href'); // Page cible
        var speed = 700; // Dur�e de l'animation (en ms)
        $('html, body').animate( { scrollTop: $(section).offset().top }, speed ); // Go
        return false;
    });

    $('.parallax').parallax();
    $('.modal').modal();
    $('textarea#taContact').characterCounter();
    $('select').material_select();
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();

    if($_LANG() == 'fr')
    {
        $('.lang-button').removeClass('amber-text text-lighten-2');
        $('.lang-fr.lang-button').addClass('amber-text text-lighten-2');
    }
    else if($_LANG() == 'de')
    {
        $('.lang-button').removeClass('amber-text text-lighten-2');
        $('.lang-de.lang-button').addClass('amber-text text-lighten-2');
    }
    else if($_LANG() == 'en')
    {
        $('.lang-button').removeClass('amber-text text-lighten-2');
        $('.lang-en.lang-button').addClass('amber-text text-lighten-2');
    }





});

