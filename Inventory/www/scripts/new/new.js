"use strict";

//get DB
var $db = getDB();

/**
* On pageload
**/
$(document).ready(function () {

    pageAttributes();

    getLocationsCategories();

    loadSave();

    loadDelete();

});

/**
 * Attach event to save button
 **/
function loadSave() {
    $("#save").click(function ($event) {
        //prevent default
        $event.preventDefault();

        //save
        save();
    });
}

/**
 * Load delete buttons
 **/
function loadDelete() {
    $(".attribute-delete").click(function ($event) {
        //prevent default
        $event.preventDefault();

        $(this).parent().remove();
    });
}

/**
 * Functions for attributes on page
 **/
function pageAttributes() {
    //when item is selected, add ability to add attributes
    $("#what_select").change(function () {
        var $option = $(this);

        //when item is selected
        if ($option.val() === 'item') {
            //hide
            $("#name").addClass('hidden');

            //don't hide
            $("#add-attributes").removeClass('hidden');
            $("#location").removeClass('hidden');
            $("#category").removeClass('hidden');

            //add button
            $("#add").click(function ($event) {
                //prevent default
                $event.preventDefault();

                //add attribute
                $("#attributes")
                    .prepend(
                    $('<div class="attribute" />')
                        .append(
                        $('<input type="text" class="form-control attribute-key" placeholder="Attribute" />')
                        )
                        .append(
                        $('<input type="text" class="form-control attribute-value" placeholder="Value" />')
                        )
                        .append(
                        $('<a href="#" class="btn btn-danger attribute-delete" />').append('<span class="fa fa-close"></span>')
                        )
                    );

                //attach event to delete buttons
                loadDelete();
            });
            //when item is not selected
        } else {
            //hide
            $("#add-attributes").addClass('hidden');
            $("#location").addClass('hidden');
            $("#category").addClass('hidden');

            //don't hide
            $("#name").removeClass('hidden');
        }
    });
}