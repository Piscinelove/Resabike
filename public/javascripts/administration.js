$(document).ready(function(){
    $('.scroll-to').click( function() { // Au clic sur un �l�ment
        var section = $(this).attr('href'); // Page cible
        var speed = 700; // Dur�e de l'animation (en ms)
        $('html, body').animate( { scrollTop: $(section).offset().top }, speed ); // Go
        return false;
    });

    $('.modal.modal-edit-zone').modal({
        ready: function(modal, trigger) {
            modal.find('input[name="zone-edit-id"]').val(trigger.data('id'));
            modal.find('input[name="zone-edit-name"]').val(trigger.data('name'));
            Materialize.updateTextFields();
        }
    });

});