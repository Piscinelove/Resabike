$(document).ready(function(){
    $('.scroll-to').click( function() { // Au clic sur un �l�ment
        var section = $(this).attr('href'); // Page cible
        var speed = 700; // Dur�e de l'animation (en ms)
        $('html, body').animate( { scrollTop: $(section).offset().top }, speed ); // Go
        return false;
    });
});