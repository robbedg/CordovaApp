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
    //hide & empty errors
    $("#errors").addClass('hidden');
    $("#errors p").empty();

    //What the user wants to create
    var $what = $("#what_select").val();
    
    //object for db
    var $object = new Object;
    $object.action = 'Create';

    //what does user want to create?
    //new item
    if ($what === 'item') {
        $object.name = $("#name_select").val().trim();
        $object.location = $("#location_select").val();
        $object.category = $("#category_select").val();
        $object.attributes = new Object();

        //attributes
        $(".attribute").each(function () {
            var $key = $(this).find(".attribute-key").first().val().trim();
            var $val = $(this).find(".attribute-value").first().val().trim();
            $object.attributes[$key] = $val;
        });

        //to db
        $db.items_out.add($object).then(function () {
            //redirect
            window.location = 'index.html';
        });

    //new location
    } else if ($what === 'location') {
        //get data
        $object.name = $("#name_select").val().trim();

        //check if already exists
        var $count1 = 0;
        var $count2 = 0;
        $db.transaction('r', $db.locations, $db.locations_out, function () {
            $db.locations.where('name').equals($object.name).count(function ($count) {
                $count1 = $count;
            });
            $db.locations_out.where('name').equals($object.name).count(function ($count) {
                $count2 = $count;
            });
        }).then(function () {
            //if location does not exist yet.
            if ($count1 === 0 && $count2 === 0) {
                //to db
                $db.locations_out.add($object).then(function () {
                    //redirect
                    window.location = 'index.html';
                });
            } else {
                $("#errors").removeClass('hidden');
                $("#errors p").append('Deze locatie is al aangemaakt.');
            }
        });

    //new category
    } else if ($what === 'category') {
        //get data
        $object.name = $("#name_select").val().trim();

        //check if already exists
        var $count1 = 0;
        var $count2 = 0;
        $db.transaction('r', $db.categories, $db.categories_out, function () {
            $db.categories.where('name').equals($object.name).count(function ($count) {
                $count1 = $count;
            });
            $db.categories_out.where('name').equals($object.name).count(function ($count) {
                $count2 = $count;
            });
        }).then(function () {
            //if categorie does not exist yet.
            if ($count1 === 0 && $count2 === 0) {
                //to db
                $db.categories_out.add($object).then(function () {
                    //redirect
                    window.location = 'index.html';
                });
            } else {
                $("#errors").removeClass('hidden');
                $("#errors p").append('Deze categorie is al aangemaakt.');
            }
        });
    }
}