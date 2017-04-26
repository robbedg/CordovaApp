"use strict";

var $db = getDB();

//load
$(document).ready(function () {
    //count
    var $length;

    //set original length
    $length = $("#count").text();

    //count
    $("textarea").keyup(function () {
        var $current = $(this).val().length;
        $("#count").text($length - $current);

        //changes when user goes over limit
        if (($length - $current) < 0) {
            $("#submit-new-note").addClass('disabled');
            $("#count").css('color', 'red');
        } else {
            $("#submit-new-note").removeClass('disabled');
            $("#count").css('color', '#a6a6a6');
        }
    });

    //expand area
    $('textarea').on('input', function () {
        $(this).outerHeight(100).outerHeight(this.scrollHeight);
    });
    $('textarea').trigger('input');
});

//when new note send
$("#submit-new-note").click(function ($event) {
    //check localstorage
    var $item = localStorage.getItem('current_item');
    if ($item === null) {
        console.log('error');
    } else {
        $item = JSON.parse($item);
    }

    //check localstorage
    var $settings = localStorage.getItem('settings');
    if ($settings === null) {
        console.log('error');
    } else {
        $settings = JSON.parse($settings);
    }

    var $note = new Object();

    //user uid
    $note['user_uid'] = $settings['username'];

    //item id
    $note['item_id'] = $item['id'];

    //get text
    $note['text'] = $("#newnote textarea").val();

    //set action
    $note['action'] = 'Create';

    //to database
    $db.usernotes_out.put($note).then(function () {
        $("#newnote textarea").val('');
        $("#count").text('1024');
        $("#count").css('color', '#a6a6a6');
        $("#textArea").outerHeight(100);
        //get newly created notes
        get_new_usernotes($item);
    });
});