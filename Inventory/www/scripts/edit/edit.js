"use strict";

var $db = getDB();

//debug
console.log(localStorage.getItem('current_item'));

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
    $("#item_id_title").append($item.id);
    $("#item_id").val($item.id);


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

    //load buttons
    loadDelete();
});

//load delete buttons
function loadDelete() {
    //remove attribute
    $(".attribute > a").click(function ($event) {
        //prevent default
        $event.preventDefault();
        //delete
        $(this).parent().remove();
    });
}

//add attribute
$("#add").click(function ($event) {
    //prevent default
    $event.preventDefault();

    //add attribute
    $("#attributes")
        .append(
        $('<div class="attribute" />')
            .append(
                $('<input type="text" class="form-control attribute-key" placeholder="Attribute" />')
            )
            .append(
                $('<input type="text" class="form-control attribute-value" placeholder="Value" />')
            )
            .append(
                $('<a href="#" class="btn btn-danger attribute-delete" />').append('<span class="fa fa-trash"></span>')
            )
        );

    //load buttons
    loadDelete();
});

//save
$("#save").click(function ($event) {
    //prevent dafault
    $event.preventDefault();

    //get attributes
    var $attributes = new Object();

    $(".attribute").each(function () {
        var $key = $(this).find(".attribute-key").first().val();
        var $value = $(this).find(".attribute-value").first().val();

        $attributes[$key] = $value;
    });

    //create item
    var $item = { id: $("#item_id").val(), location: $("#location_select").val(), category: $("#category_select").val(), attributes: $attributes, action: 'Update' };

    //to storage
    localStorage.setItem('current_item', JSON.stringify($item));

    //to database
    $db.items.put($item).then(function () {
        //back to home
        window.location = 'index.html';
    });
});