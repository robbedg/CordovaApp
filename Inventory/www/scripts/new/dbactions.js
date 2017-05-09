"use strict";

//get db
var $db = getDB();

/**
 * Get locations & categories from DB
 */
function getLocationsCategories() {
    //get locations
    $db.locations.toArray(function ($locations) {
        $.each($locations, function ($key, $value) {
            $("#location_select").append(
                $('<option />').val($value['name']).append($value['name'])
            );
        });
    });

    //get newly created locations
    $db.locations_out.toArray(function ($locations) {
        $.each($locations, function ($key, $value) {
            $("#location_select").append(
                $('<option />').val($value['name']).append($value['name'])
            );
        });
    });

    //get categories
    $db.categories.toArray(function ($categories) {
        $.each($categories, function ($key, $value) {
            $("#category_select").append(
                $('<option />').val($value['name']).append($value['name'])
            );
        });
    });

    //get newly created categories
    $db.categories_out.toArray(function ($categories) {
        $.each($categories, function ($key, $value) {
            $("#category_select").append(
                $('<option />').val($value['name']).append($value['name'])
            );
        });
    });
}

/**
 * Save newly created.
 **/
function save() {
    var $what = $("#what_select").val();
    
    //object for db
    var $object = new Object;
    $object.action = 'Create';

    //what does user want to create?
    if ($what === 'item') {
        $object.name = $("#name_select").val();
        $object.location = $("#location_select").val();
        $object.category = $("#category_select").val();
        $object.attributes = new Object();

        //attributes
        $(".attribute").each(function () {
            var $key = $(this).find(".attribute-key").first().val();
            var $val = $(this).find(".attribute-value").first().val();
            $object.attributes[$key] = $val;
        });

        //to db
        $db.items_out.add($object).then(function () {
            //redirect
            window.location = 'index.html';
        });

    } else if ($what === 'location') {
        $object.name = $("#name_select").val();

        //to db
        $db.locations_out.add($object).then(function () {
            //redirect
            window.location = 'index.html';
        });

    } else if ($what === 'category') {
        $object.name = $("#name_select").val();

        //to db
        $db.categories_out.add($object).then(function () {
            //redirect
            window.location = 'index.html';
        });
    }
}