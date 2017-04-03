"use strict";

var $db = getDB();

//on load
$(document).ready(function () {
    //check localstorage
    var $item = localStorage.getItem('current_item');
    if ($item === null) {
        console.log('error');
    } else {
        $item = JSON.parse($item);
    }

    //set title
    $("#item_id").append($item.id);


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

    //set attributes
    $("#attributes").empty();

    $.each($item.attributes, function ($key, $value) {
        $("#attributes")
            .append(
            $('<div class="attribute" />')
                .append(
                    $('<input type="text" class="form-control attribute-key" />').val($key)
                )
                .append(
                    $('<input type="text" class="form-control attribute-value" />').val($value)
                )
                .append(
                    $('<a href="#" class="btn btn-danger attribute-delete" />').append('<span class="fa fa-trash"></span>')
                )
            );
    });

});