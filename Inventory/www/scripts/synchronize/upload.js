"use strict";

/**
 * Click upload button
**/
$("#upload a").click(function ($event) {
    //prevent default
    $event.preventDefault();

    //get address
    if (localStorage.getItem('settings') !== null) {
        var $settings = JSON.parse(localStorage.getItem('settings'));
        //push data
        pushData($settings.address);
    } else {
        window.location('settings.html');
    }
});

/**
 * Push data to main application
**/
function pushData($address) {

    //get database connection
    var $db = getDB();

    //object for data
    var $data = new Object();

    //visual feedback
    $("#progress").addClass('progress-striped').addClass('active');
    $(".progress-bar").attr("style", "width: 100%")
    $("#feedback-text").text('uploading');

    //get data from local DB

    //1st of chain
    getLocations();

    //locations
    function getLocations() {
        $db.locations_out.toArray(function ($locations) {
            $data['locations'] = $locations;
        }).then(function () {
            //2nd of chain
            getCategories()
        });
    }

    function getCategories() {
        $db.categories_out.toArray(function ($categories) {
            $data['categories'] = $categories;
        }).then(function () {
            //3rd of chain
            getItems();
        });
    }

    function getItems() {
        $db.items_out.toArray(function ($items) {
            $data['items'] = $items;
        }).then(function () {
            //start upload
            upload($data);
        });
    }

    function upload($data) {
        $.ajax({
            url: $address + '/index.php/synchronize/upload',
            crossDomain: true,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify($data)
        }).done(function ($response) {
                console.log($response);
        }).always(function () {
            //user feedback
            $("#progress").removeClass('progress-striped').removeClass('active');
            $("#feedback-text").text('done');
        });
    }
}