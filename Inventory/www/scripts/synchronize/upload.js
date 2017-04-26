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
        pushData($settings);
    } else {
        window.location('settings.html');
    }
});

/**
 * Push data to main application
**/
function pushData($settings) {

    //get database connection
    var $db = getDB();

    //object for data
    var $data = new Object();

    //visual feedback
    $(".progress-bar").addClass('progress-bar-striped').addClass('progress-bar-animated');
    $(".progress-bar").attr("style", "width: 100%");
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
            //4th of chain
            getUsernotes();
        });
    }

    function getUsernotes() {
        $db.usernotes_out.toArray(function ($usernotes) {
            $data['usernotes'] = $usernotes;
        }).then(function () {
            //start upload
            upload($data);
        });
    }

    //data for authentication
    var $authdata = new Object();
    $authdata.username = $settings.username;
    $authdata.password = $settings.password;

    //authenticate
    function upload($data) {
        $.ajax({
            url: $settings.address + '/index.php/authenticate',
            crossDomain: true,
            contentType: 'text/plain',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify($authdata)
        }).done(function ($response) {
            if ($response.success === true) {
                startTransaction();
            }
        });

        //push data
        function startTransaction() {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                url: $settings.address + '/index.php/synchronize/upload',
                crossDomain: true,
                contentType: 'text/plain',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify($data)
            }).done(function ($response) {
                console.log($response);
            }).always(function () {
                //user feedback
                $(".progress-bar").removeClass('progress-bar-striped').removeClass('progress-bar-animated');
                $("#feedback-text").text('done');
            });
        }
    }
}