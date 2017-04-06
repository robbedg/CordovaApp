var $settings = new Object();

$(document).ready(function () {
    //check if settings available
    var $check_settings = localStorage.getItem('settings');
    if ($check_settings !== null) {
        $settings = JSON.parse($check_settings);

        $('#address input').val($settings.address);
    }
});


$("#save a").click(function ($event) {
    //prevent default
    $event.preventDefault();

    //set values
    $settings.address = $("#address input").val();
    console.log($settings.address);

    //save
    localStorage.setItem('settings', JSON.stringify($settings));

});