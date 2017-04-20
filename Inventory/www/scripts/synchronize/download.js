"use strict";

$("#download a").click(function ($event) {
    //prevent default
    $event.preventDefault();

    //get address
    if (localStorage.getItem('settings') !== null) {
        var $settings = JSON.parse(localStorage.getItem('settings'));
        //get data
        pullData($settings.address);
    } else {
        window.location('settings.html');
    }
});

function pullData($address) {

    //get database connection
    var $db = getDB();

    //show user
    $(".progress-bar").addClass('progress-bar-striped').addClass('progress-bar-animated');
    $(".progress-bar").attr("style", "width: 100%");
    $("#feedback-text").text('downloading');

    //ajax get data
    $.ajax({
        url: $address + '/index.php/synchronize/download',
        crossDomain: true,
        type: 'GET'
    }).done(function ($response) {
        //locations
        $db.locations.clear().then(function () {
            $db.locations.bulkAdd($response['locations']['data']);
        });

        //categories
        $db.categories.clear().then(function () {
            $db.categories.bulkAdd($response['categories']['data']);
        });

        //items
        $db.items.clear().then(function () {
            $db.items.bulkAdd($response['items']['data']);
        })
    }).always(function () {
        //user feedback
        $(".progress-bar").removeClass('progress-bar-striped').removeClass('progress-bar-animated');
        $("#feedback-text").text('done');
    });
}