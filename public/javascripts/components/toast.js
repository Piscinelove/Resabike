/**
 * Custom error toast message
 * @param message
 */
function errorToast(message)
{
    var toastContent = $('<span class="red-text">'+message+'</span>');
    Materialize.toast(toastContent, 2000);
}

/**
 * Custom success toast message
 * @param message
 */
function successToast(message)
{
    var toastContent = $('<span class="">'+message+'</span>');
    Materialize.toast(toastContent, 2000);
}