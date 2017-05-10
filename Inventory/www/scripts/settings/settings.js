var $settings = new Object();

$(document).ready(function () {
    //check if settings available
    var $check_settings = localStorage.getItem('settings');
    if ($check_settings !== null) {
        $settings = JSON.parse($check_settings);

        $('#address input').val($settings.address);
        $('#username input').val($settings.username);
    }

    //show page when load is done
    $('html').css('visibility', 'visible');
});


$("#save a").click(function ($event) {
    //prevent default
    $event.preventDefault();

    //hide errors
    $("#errors").addClass('hidden');
    $("#errors p").empty();

    //authentication data
    var $authdata = new Object();
    $authdata.username = $("#username input").val();
    $authdata.password = $("#password input").val();

    //check authentication
    $.ajax({
        url: $("#address input").val() + '/index.php/authenticate',
        crossDomain: true,
        contentType: 'text/plain',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify($authdata)
    }).done(function ($response) {
        //if successfull
        if ($response.success === true) {
            //set values
            $settings.address = $("#address input").val();
            $settings.username = $("#username input").val();
            $settings.password = $("#password input").val();

            //save
            localStorage.setItem('settings', JSON.stringify($settings));

            //redirect
            window.location = 'index.html';
        } else {
            $("#errors").removeClass('hidden');
            $("#errors p").text('De authenticatie is mislukt.');
        }
    }).fail(function () {
        $("#errors").removeClass('hidden');
        $("#errors p").text('Kan de server niet vinden.');
    });

});