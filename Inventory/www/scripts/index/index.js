"use strict";

var $db = getDB();

localStorage.clear();
localStorage.setItem('current_item', '{"id":"0000000001","location":"AB","category":"Bank","attributes":{"a":"a","s":"s","z":"s","test":"test"}}');

$("#scan").click(function ($event) {
    //prevent default
    $event.preventDefault();

    //when scan success
    cordova.plugins.barcodeScanner.scan(
        function ($result) {

            //make object
            var $item = new Object();

            //get results
            var $info = $result.text.split(',', 3);

            $db.items.where('id').equals($info[0]).count(function ($count) {
                console.log($count);
                //not yet modified
                if ($count === 0) {
                    //fill object
                    $item.id = $info[0];
                    $item.location = $info[1];
                    $item.category = $info[2];

                    //get attr.
                    $db.attributes
                        .where('id')
                        .equals($info[0])
                        .first(function ($result) {
                            //add to objects
                            $item.attributes = $result['attributes'];

                            //store item
                            localStorage.setItem('current_item', JSON.stringify($item));
                        });
                }
                //already been modified
                else {
                    //get item
                    $db.item.where('id').equals($info[0]).first(function ($result) {
                        $item = $result;

                        //store item
                        localStorage.setItem('current_item', $item);
                    });
                }
            });

            //show results
            showDetails();

            //add data to hidden fields
            $("#item_id").val($info[0]);
            $("#location").val($info[1]);
            $("#category").val($info[2]);

        },
        function ($error) {
            $("#result").text("Scanning failed: " + $error);
        }
    );
});

function showDetails() {

    //get current item
    var $json = localStorage.getItem('current_item');

    if ($json !== null) {
        var $item = JSON.parse($json);
        //add to <p />
        $("#result").empty();
        $("#result").append(
            '<strong>ID</strong>: ' + $item['id'] + '<br />' +
            '<strong>Location</strong>: ' + $item['location'] + '<br />' +
            '<strong>Category</strong>: ' + $item['category'] + '<br />'
        );

        //add attributes to <p />
        $.each($item['attributes'], function ($key, $value) {
            $("#result").append('<strong>' + $key + '</strong>: ' + $value + '<br />');
        });
        $("#results").removeClass('hidden');
    } else {
        $("#result").empty();
        $("#result").addClass('hidden');
    }

}

$("#save a").click(function ($event) {
    //prevent default
    $event.preventDefault();

    //get date from
    var $dateStringFrom = $("#datetimepicker_from").datetimepicker('date');
    var $from = moment($dateStringFrom).format();

    //get date until
    var $dateStringUntil = $("#datetimepicker_until").datetimepicker('date');
    var $until = moment($dateStringUntil).format();

    //save to localstorage
    console.log(localStorage.getItem('items'));
    var $items = JSON.parse(localStorage.getItem('items'));
    console.log($items);

    $items.push({ 'id': $("#item_id").val(), 'location': $("#location").val(), 'category': $("#category").val(), 'from': $from, 'until': $until });

    localStorage.setItem('items', JSON.stringify($items));
    console.log(localStorage.getItem('items'));

    //get items
    getItems();
});

//on document load
$(document).ready(function () {

    getAttributes();

    showDetails();

    getItems();

});

//get items from localstorage
function getItems() {

    $db.items.toArray(function ($items) {
        //empty table
        $("#table tbody").empty();

        //fill table
        $($items).each(function ($index, $element) {
            $("#table tbody")
                .append($('<tr />')
                    .append($('<td />').append($element['id']))
                    .append($('<td />').append($element['location']))
                    .append($('<td />').append($element['category']))
                    .append($('<td />').append($element['action']))
                    .append($('<td />')
                        .append($('<a href="#" class="btn btn-danger btn-sm delete" /a>').append('<span class="fa fa-close"></span>'))
                        .append($('<a href="#" class="btn btn-primary btn-sm edit" /a>').append('<span class="fa fa-edit"></span>'))
                    )
                );
        });
        loadButtons();
    });
}

//load buttons in table
function loadButtons() {
    //delete
    $(".delete").click(function ($event) {
        //prevent default
        $event.preventDefault();

        //get id
        var $id = $(this).parent().parent().find('td').first().text();

        //delete from db
        $db.items.where('id').equals($id).delete();

        //delete from table
        $(this).parent().parent().remove();

        //empty selected
        localStorage.removeItem('current_item');

        showDetails();
    });

    //edit
    $(".edit").click(function ($event) {
        //prevent default
        $event.preventDefault();

        //get id
        var $id = $(this).parent().parent().find('td').first().text();

        //load in localstorage
        $db.items.where('id').equals($id).first(function ($item) {
            localStorage.setItem('current_item', JSON.stringify($item));
            window.location = "edit.html";
        });

    });
}