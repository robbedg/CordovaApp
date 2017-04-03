"use strict";

var $db = getDB();

//on load
$(document).ready(function () {
    //set locations
    $("#location_select").empty();

    $db.locations.toArray(function ($locations) {
        $.each($locations, function ($key, $value) {
            $("#location_select").append($('<option />').append($value.name));
        });
    });

    //set categories
    $("#category_select").empty();

    $db.categories.toArray(function ($categories) {
        $.each($categories, function ($key, $value) {
            $("#category_select").append($('<option />').append($value.name));
        });
    });

});