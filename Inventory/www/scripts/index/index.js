"use strict";

var $db = getDB();

//localStorage.clear();
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
            $item.id = $result.text;

            $db.items.where('id').equals($item.id).count(function ($count) {
                console.log($count);
                //not yet modified
                if ($count === 0) {

                    //get items
                    $db.items
                        .where('id')
                        .equals($item.id)
                        .first(function ($result) {
                            //add to objects
                            $item = $result;

                            //store item
                            localStorage.setItem('current_item', JSON.stringify($item));

                            //show results
                            console.log($item);
                            showDetails($item);
                        });
                }
                //already been modified
                else {
                    //get item
                    $db.items_out.where('id').equals($item.id).first(function ($result) {
                        $item = $result;
                        console.log($item, $result);

                        //store item
                        localStorage.setItem('current_item', JSON.stringify($item));

                        //show results
                        console.log($item);
                        showDetails($item);
                    });
                }
            });

            //add data to hidden fields
            $("#item_id").val($item.id);
            $("#location").val($item.location);
            $("#category").val($item.category);

        },
        function ($error) {
            $("#result").text("Scanning failed: " + $error);
        }
    );
});

function showDetails($item) {

    //get current item
    var $json = localStorage.getItem('current_item');

    if ($json !== null) {
        
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

//on document load
$(document).ready(function () {

    var $item = JSON.parse(localStorage.getItem('current_item'));
    showDetails($item);

    getItems();

});

//get items from localstorage
function getItems() {

    $db.items_out.toArray(function ($items) {
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
        $db.items_out.where('id').equals($id).delete();

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
        $db.items_out.where('id').equals($id).first(function ($item) {
            localStorage.setItem('current_item', JSON.stringify($item));
            window.location = "edit.html";
        });

    });
}