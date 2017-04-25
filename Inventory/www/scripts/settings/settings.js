var $settings = new Object();

$(document).ready(function () {
    //check if settings available
    var $check_settings = localStorage.getItem('settings');
    if ($check_settings !== null) {
        $settings = JSON.parse($check_settings);

        $('#address input').val($settings.address);
        $('#username input').val($settings.username);
    }
});


$("#save a").click(function ($event) {
    //prevent default
    $event.preventDefault();

    //set values
    $settings.address = $("#address input").val();
    $settings.username = $("#username input").val();
    $settings.password = $("#password input").val();

    //save
    localStorage.setItem('settings', JSON.stringify($settings));

});