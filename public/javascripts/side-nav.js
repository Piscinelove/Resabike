$(document).ready(function(){
    $('.parallax').parallax();
    $('.modal').modal();
    $('textarea#taContact').characterCounter();
    $('select').material_select();

});

$(".button-collapse").sideNav();

//DATE
$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    today: 'Aujourd\'hui',
    clear: 'Annuler',
    close: 'Ok',
    closeOnSelect: true ,// Close upon selecting a date,
    formatSubmit: 'dd/mm/yyyy',

});

//HOURS
$('.timepicker').pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Annuler', // text for clear-button
    canceltext: 'Fermer', // Text for cancel-button
    autoclose: false, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
    aftershow: function(){
        Materialize.updateTextFields();
    } //Function for after opening timepicker
});


