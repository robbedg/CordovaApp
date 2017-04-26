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

    //get sychronized notes
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

    //get newly created notes
    get_new_usernotes($item);
});

//get newly created notes
function get_new_usernotes($item) {
    $db.usernotes_out.where('item_id').equals($item['id']).toArray(function ($result) {
        //add
        $($result).each(function ($index, $el) {
            //create notes
            $("#notes")
                .prepend(
                $('<div class="note" />').attr('id', $index)
                    .append($('<strong class="username" />').append('YOU'))
                    .append($('<p />').append($el['text']))
                    .append($('<span class="date" />').append('Not created yet.'))
                );
        });
    });
}