$(document).ready(function(){

    $('.parallax').parallax();
    $('.modal').modal();
    $('textarea#taContact').characterCounter();
    $('select').material_select();
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
    
    // $('.lang-en').on('click', function () {
    //     alert();
    //     defaultLang = 'en';
    // })
    //
    // $('.lang-fr').on('click', function () {
    //     defaultLang = 'fr';
    // })
    //
    // $('.lang-de').on('click', function () {
    //     defaultLang = 'de';
    // })

    if($_LANG() == 'fr')
    {
        $('.lang-button').removeClass('ebony-text');
        $('.lang-fr.lang-button').addClass('ebony-text');
    }
    else if($_LANG() == 'de')
    {
        $('.lang-button').removeClass('ebony-text');
        $('.lang-de.lang-button').addClass('ebony-text');
    }
    else if($_LANG() == 'en')
    {
        $('.lang-button').removeClass('ebony-text');
        $('.lang-en.lang-button').addClass('ebony-text');
    }

    //alert(translation[$_GET('clang')].TEST);



});




