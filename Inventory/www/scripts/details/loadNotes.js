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

    $($item['usernotes']).each(function ($index, $el) {
        //create notes
        $("#notes")
            .append(
            $('<div class="note" />').attr('id', $index)
                .append($('<strong class="username" />').append($el['lastname'].toUpperCase() + ' ' + $el['firstname'].toUpperCase()))
                .append($('<p />').append($el['text']))
                .append($('<span class="date" />').append($el['created_on']))
            );
    });
});