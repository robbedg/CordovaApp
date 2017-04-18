"use strict";

$(document).ready(function () {

    //when item is selected, add ability to add attributes
    $("#what_select").change(function () {
        var $option = $(this);

        if ($option.val() === 'item') {
            $("#add-attributes").removeClass('hidden');
        } else {
            $("#add-attributes").addClass('hidden');
        }
    });
});