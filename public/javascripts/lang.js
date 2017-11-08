var translation = {
    fr: {
        TEST: "yeah",
        DATA_UPDATE: "Données mises à jour",
        INTERNAL_ERROR: "Une erreur interne est survenu.",
        CORRECT_STOP: "Veillez bien à choisir un arrêt de départ et de destination valide",
        JANUARY : "Janvier",
        FEBRUARY : "Février",
        MARS : 'Mars',
        APRIL : 'Avril',
        MAY : 'Mai',
        JUNE : 'Juin',
        JULY : 'Juillet',
        AUGUST : 'Août',
        SEPTEMBER : 'Septembre',
        OCTOBER : 'Octobre',
        NOVEMBER : 'Novembre',
        DECEMBER : 'Décembre',
        MON :'Lun',
        WED :'Mer',
        FRI :'Ven',
        TUES :'Mar',
        THURS:'Jeu',
        SUN:'Dim',
        SAT:'Sam',
        TODAY:'Aujourd\'hui',
        CANCEL:'Annuler',
        OK:'Ok',
        CLEAR:'Effacer',
        HELLO: 'Bonjour',
        CONFIRMATIONWAITINGLIST : 'Votre réservation a bien été placée en file d\'attente.',
        CONFIRMATIONWAITINGLIST2 : 'Le nombre de vélos réservés étant supérieur aux nombres de places  disponibles, la confirmation d\'un administrateur est nécessaire.',
        CONFIRMATIONWAITINGLIST3 : 'Vous serez contacté par e-mail dans les plus brefs délais.',
        CONFIRMATIONBOOKING : 'Un email de confirmation a été envoyée à l\'adresse suivante :',
        CONFIRMATIONBOOKING2: 'La réservation suivante a bien été traitée : '





    },
    en: {
        TEST: "yeah2",
        DATA_UPDATE: "Data updated",
        INTERNAL_ERROR: "An internal error has occurred.",
        CORRECT_STOP: "Make sure to choose a valid start and destination stop",
        JANUARY : "January",
        FEBRUARY : "February",
        MARS : 'Mars',
        APRIL : 'April',
        MAY : 'May',
        JUNE : 'June',
        JULY : 'Juillet',
        AUGUST : 'August',
        SEPTEMBER : 'September',
        OCTOBER : 'October',
        NOVEMBER : 'November',
        DECEMBER : 'December',
        MON :'Mon',
        WED :'Wed',
        FRI :'Fri',
        TUES :'Tues',
        THURS:'Thurs',
        SUN:'Sun',
        SAT:'Sat',
        TODAY:'Today',
        CANCEL:'Cancel',
        OK:'Ok',
        CLEAR : 'Clear'
    },
    de: {
        TEST: "yeah3",
        DATA_UPDATE:"Daten aktualisiert",
        INTERNAL_ERROR: "Ein interner Fehler ist aufgetreten.",
        CORRECT_STOP: "Stellen Sie sicher, dass Sie einen gültigen Start- und Zielstopp wählen",
        JANUARY : "Januar",
        FEBRUARY : "Februar",
        MARS : 'März',
        APRIL : 'April',
        MAY : 'Mai',
        JUNE : 'Juni',
        JULY : 'July',
        AUGUST : 'August',
        SEPTEMBER : 'September',
        OCTOBER : 'October',
        NOVEMBER : 'November',
        DECEMBER : 'Dezember',
        MON :'Mon',
        WED :'Mitt',
        FRI :'Frei',
        TUES :'Diens',
        THURS:'Don',
        SUN:'Son',
        SAT:'Sam',
        TODAY:'Heute',
        CANCEL:'Stornieren',
        OK:'Ok',
        CLEAR:'Auslöschen'
    }
}
var defaultLang = 'fr';

var $_LANG = function() {
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if ( 'clang' ) {
        //return vars['clang'] ? vars['clang'] : null;
        if(vars['clang'] != null)
            defaultLang = vars['clang'];

        return vars['clang'] ? vars['clang'] : defaultLang;

    }
    return vars;
}