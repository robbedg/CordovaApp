"use strict";

/**
 * Custom validation rule.
 * No double values
**/
jQuery.validator.addMethod("unique", function ($value, $element, $params) {
    var $prefix = $params;
    var $selector = jQuery.validator.format("[identifier!='{0}'][unique='{1}']", $($element).attr('identifier'), $prefix);
    var $matches = new Array();
    $($selector).each(function ($index, $item) {
        if ($value == $($item).val()) {
            $matches.push($item);
        }
    });
    return $matches.length == 0;
}, "De waarde is niet uniek.");

jQuery.validator.classRuleSettings.unique = {
    unique: true
};

$(document).ready(function ($) {

    $("#data").validate({
        rules: {
            'label[]': {
                required: true,
                maxlength: 45
            },
            'value[]': {
                required: true,
                maxlength: 45
            },
            'name': {
                required: true,
                maxlength: 45
            }
        },
        showErrors: function ($errorMap, $errorList) {
            //remove previous
            $("#data input").each(function ($el) {
                $($el).removeAttr('data-toggle');
                $($el).removeAttr('data-original-title');
                $($el).removeClass('error');
            });

            //add new
            $errorList.forEach(function ($element) {
                $($element['element']).attr('data-toggle', 'tooltip').attr('data-original-title', $element['message']);
                $($element['element']).addClass('error');
            });

            $('[data-toggle="tooltip"]').tooltip();
        }
    });
});

$("#save").click(function ($event) {
    //prevent default
    $event.preventDefault();

    //check if valid
    var $valid = $("#data").valid();

    if ($valid) {
        save();
    }
});