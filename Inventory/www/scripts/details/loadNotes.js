﻿"use strict";

var $db = getDB();

//load usernotes
function loadUserNotes() {
    //check localstorage
    var $item = localStorage.getItem('current_item');
    if ($item !== null) {
        $item = JSON.parse($item);
    }

    //clear notes
    $("#notes").empty();

    //get newly created notes
    get_new_usernotes($item);

    //sort notes
    $item['usernotes'] = $item['usernotes'].sort(function (a, b) { return moment(b['created_on'], 'DD/MM/YYYY HH:mm') - moment(a['created_on'], 'DD/MM/YYYY HH:mm') });

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
}

//get newly created notes
function get_new_usernotes($item) {
    $db.usernotes_out.where('item_id').equals($item['id']).toArray(function ($result) {
        //add
        $($result).each(function ($index, $el) {
            //create notes
            $("#notes")
                .prepend(
                $('<div class="note" />').attr('id', $index)
                    .append($('<strong class="username" />').append('JIJ'))
                    .append($('<p />').append($el['text']))
                    .append($('<span class="date" />').append('Nog niet gesychroniseerd.'))
                );
        });
    });
}