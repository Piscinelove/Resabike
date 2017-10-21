function errorToast(message)
{
    var toastContent = $('<span class="red-text">'+message+'</span>');
    Materialize.toast(toastContent, 2000);
}

function successToast(message)
{
    var toastContent = $('<span class="">'+message+'</span>');
    Materialize.toast(toastContent, 2000);
}