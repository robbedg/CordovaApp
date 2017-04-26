﻿"use strict";

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

    //set title
    $("#item_id_title").append($item.id);

    //set table
    $("#table")
        .append(
            $('<tr />').append($('<td />').append('<strong>ID</strong>')).append($('<td />').append($item['id']))
        )
        .append(
            $('<tr />').append($('<td />').append('<strong>Location</strong>')).append($('<td />').append($item['location']))
        )
        .append(
            $('<tr />').append($('<td />').append('<strong>Category</strong>')).append($('<td />').append($item['category']))
        )
        .append(
            $('<tr />').append($('<td />').append('<strong>Last Loan</strong>')).append($('<td />').append($('<lu id="last-loan" />')))
        );

    //last loan
    $("#last-loan")
        .append(
            $('<li />').append($item['last_loan_lastname'] + ' ' + $item['last_loan_firstname'])
        )
        .append(
            $('<li />').append($item['last_loan_from'] + ' <span class="fa fa-arrow-right"></span> ' + $item['last_loan_until'])
        );


    $.each($item.attributes, function ($key, $value) {
        $("#table")
            .append(
                $('<tr />').append($('<td />').append('<strong>' + $key + '</strong>')).append($('<td />').append($value))
            );
    });

    //reload nanoscroller
    $(".nano").nanoScroller();

});

//delete button
$("#delete").click(function ($event) {

    //check localstorage
    var $item = localStorage.getItem('current_item');
    if ($item === null) {
        console.log('error');
    } else {
        $item = JSON.parse($item);
    }

    //prevent default
    $event.preventDefault();

    console.log($item);
    //create item
    var $item = { id: $item['id'], location: $item['location'], category: $item['category'], attributes: $item['attributes'], action: 'Delete' };

    //to storage
    localStorage.setItem('current_item', JSON.stringify($item));

    //to database
    $db.items_out.put($item).then(function () {
        //back to home
        window.location = 'index.html';
    });
});