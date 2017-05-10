"use strict";

//get DB
var $db = getDB();

//identifier
var $attrCounter = 0;

/**
* On pageload
**/
$(document).ready(function () {

    //functions for attributes
    pageAttributes();
    //categories & locations
    getLocationsCategories();
    //delete buttons
    loadDelete();

    //Show page
    $("html").css('visibility', 'visible');
});

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

    //add button
    $("#add").click(function ($event) {
        //prevent default
        $event.preventDefault();

        //add attribute
        $("#attributes")
            .prepend(
            $('<div class="attribute" />')
                .append(
                    $('<input type="text" class="form-control attribute-key" placeholder="Attribuut..." name="label[]" data-animation="false" unique="true" />').attr('identifier', $attrCounter)
                )
                .append(
                    $('<input type="text" class="form-control attribute-value" placeholder="Waarde..." name="value[]" data-animation="false" />')
                )
                .append(
                    $('<a href="#" class="btn btn-danger attribute-delete" />').append('<span class="fa fa-close"></span>')
                )
            );
        //counter
        $attrCounter++;

        //attach event to delete buttons
        loadDelete();

        //reload nanoscroller
        $(".nano").nanoScroller();
    });

    //when item is selected, add ability to add attributes
    $("#what_select").change(function () {
        //hide & clear errors
        $("#errors").addClass('hidden');
        $("#errors p").empty();

        //get selected option
        var $option = $(this);

        //when item is selected
        if ($option.val() === 'item') {
 
            //don't hide
            $("#add-attributes").removeClass('hidden');
            $("#location").removeClass('hidden');
            $("#category").removeClass('hidden');

            //when item is not selected
        } else {
            //hide
            $("#add-attributes").addClass('hidden');
            $("#location").addClass('hidden');
            $("#category").addClass('hidden');

        }

        //reload nanoscroller
        $(".nano").nanoScroller();
    });
}