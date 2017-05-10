"use strict";

//get db
var $db = getDB();

//attr counter
var $attrCounter = 0;

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
    $("#item_id_title").append($item.name);
    $("#item_id").val($item.id);

    //set name
    $("#name_select").val($item['name']);


    //set locations
    $("#location_select").empty();

    $db.locations.toArray(function ($locations) {
        $.each($locations, function ($key, $value) {
            if ($value.name !== $item.location) {
                $("#location_select").append($('<option />').append($value.name));
            } else {
                $("#location_select").append($('<option />').append($value.name).attr('selected', 'selected'));
            }
        });
    });

    $db.locations_out.toArray(function ($locations) {
        $.each($locations, function ($key, $value) {
            if ($value.name !== $item.location) {
                $("#location_select").append($('<option />').append($value.name));
            } else {
                $("#location_select").append($('<option />').append($value.name).attr('selected', 'selected'));
            }
        });
    });

    //set categories
    $("#category_select").empty();

    $db.categories.toArray(function ($categories) {
        $.each($categories, function ($key, $value) {
            if ($value.name !== $item.category) {
                $("#category_select").append($('<option />').append($value.name));
            } else {
                $("#category_select").append($('<option />').append($value.name).attr('selected', 'selected'));
            }   
        });
    });

    $db.categories_out.toArray(function ($categories) {
        $.each($categories, function ($key, $value) {
            if ($value.name !== $item.category) {
                $("#category_select").append($('<option />').append($value.name));
            } else {
                $("#category_select").append($('<option />').append($value.name).attr('selected', 'selected'));
            } 
        });
    });

    //set attributes
    $("#attributes").empty();

    $.each($item.attributes, function ($key, $value) {
        $("#attributes")
            .append(
            $('<div class="attribute" />')
                .append(
                    $('<input type="text" class="form-control attribute-key" name="label[]" data-animation="false" unique="true" />').val($key).attr('identifier', $attrCounter)
                )
                .append(
                    $('<input type="text" class="form-control attribute-value name="value[]" data-animation="false" />').val($value)
                )
                .append(
                    $('<a href="#" class="btn btn-danger attribute-delete" />').append('<span class="fa fa-close"></span>')
                )
            );
        //count
        $attrCounter++;
    });

    //load buttons
    loadDelete();

    //reload nanoscroller
    $(".nano").nanoScroller();

    //show page
    $("html").css('visibility', 'visible');
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

    //add removal off errors
    $("#data input").keydown(function () {
        //remove previous
        $(this).removeAttr('data-toggle');
        $(this).removeAttr('data-original-title');
        $(this).removeClass('error');
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
                $('<input type="text" class="form-control attribute-key" name="label[]" placeholder="Attribuut..." data-animation="false" unique="true" />').attr('identifier', $attrCounter)
            )
            .append(
                $('<input type="text" class="form-control attribute-value" name="value[]" placeholder="Waarde..." data-animation="false" />')
            )
            .append(
                $('<a href="#" class="btn btn-danger attribute-delete" />').append('<span class="fa fa-close"></span>')
            )
        );
    //count
    $attrCounter++;
    //load buttons
    loadDelete();
    //load scrollbar
    $(".nano").nanoScroller();
});

//save
function saveChanges() {

    //get attributes
    var $attributes = new Object();

    $(".attribute").each(function () {
        var $key = $(this).find(".attribute-key").first().val();
        var $value = $(this).find(".attribute-value").first().val();

        $attributes[$key] = $value;
    });

    //create item
    var $item = JSON.parse(localStorage.getItem('current_item'));
    $item['name'] = $("#name_select").val();
    $item['location'] = $('#location_select').val();
    $item['category'] = $('#category_select').val();
    $item['attributes'] = $attributes;
    if ($item['action'] !== 'Create') {
        $item['action'] = 'Update';
    }

    //to storage
    localStorage.setItem('current_item', JSON.stringify($item));

    //to database
    $db.items_out.put($item).then(function () {
        //back to home
        window.location = 'index.html';
    });
}

//delete button
$("#delete a").click(function ($event) {
    //get attributes
    var $attributes = new Object();

    $(".attribute").each(function () {
        var $key = $(this).find(".attribute-key").first().val();
        var $value = $(this).find(".attribute-value").first().val();

        $attributes[$key] = $value;
    });

    //create item
    var $item = { id: $("#item_id").val(), location: $("#location_select").val(), category: $("#category_select").val(), attributes: $attributes, action: 'Delete' };

    //to storage
    localStorage.setItem('current_item', JSON.stringify($item));

    //to database
    $db.items_out.put($item).then(function () {
        //back to home
        window.location = 'index.html';
    });
});