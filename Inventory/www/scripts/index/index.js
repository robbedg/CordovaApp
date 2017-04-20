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
            console.log($item);

            $db.items_out.where('id').equals($item.id).count(function ($count) {
                console.log($count);
                //not yet modified
                if ($count === 0) {

                    //get items
                    $db.items
                        .where('id')
                        .equals($item.id)
                        .first(function ($result) {
                            console.log($result);
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

function showDetails($in) {
    var $item = $in;

    //get current item
    var $json = localStorage.getItem('current_item');

    //checking
    if ($item === null && $json !== null) {
        $item = JSON.parse($json);
    }
    console.log($item);
    if ($item !== null) {
        
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
        $("#results").addClass('hidden');
    }

    //refresh scrollbar
    $(".nano").nanoScroller();

}

//on document load
$(document).ready(function () {

    var $item = JSON.parse(localStorage.getItem('current_item'));
    showDetails($item, true);

    getItems();

});

//get items from localstorage
function getItems() {
    //empty table
    $("#table tbody").empty();

    //locations
    $db.locations_out.toArray(function ($locations) {
        //fill table
        $($locations).each(function ($index, $element) {
            $("#table tbody")
                .append($('<tr />').attr('data-id', $element['prim_key']).attr('data-kind', 'location')
                    .append($('<td />').append('Location'))
                    .append($('<td />').append(''))
                    .append($('<td />').append($element['name']))
                    .append($('<td />').append(''))
                    .append($('<td />').append($element['action']))
                    .append($('<td />')
                        .append($('<a href="#" class="btn btn-danger btn-sm delete" /a>').append('<span class="fa fa-close"></span>'))
                    )
                );
        });
    }).then(function () {
        loadButtons();

        //refresh scrollbar
        $(".nano").nanoScroller();
    });

    //categories
    $db.categories_out.toArray(function ($categories) {
        //fill table
        $($categories).each(function ($index, $element) {
            $("#table tbody")
                .append($('<tr />').attr('data-id', $element['prim_key']).attr('data-kind', 'category')
                    .append($('<td />').append('Category'))
                    .append($('<td />').append(''))
                    .append($('<td />').append(''))
                    .append($('<td />').append($element['name']))
                    .append($('<td />').append($element['action']))
                    .append($('<td />')
                        .append($('<a href="#" class="btn btn-danger btn-sm delete" /a>').append('<span class="fa fa-close"></span>'))
                    )
                );
        });
    }).then(function () {
        loadButtons();

        //refresh scrollbar
        $(".nano").nanoScroller();
    });

    //items
    $db.items_out.toArray(function ($items) {
        //fill table
        $($items).each(function ($index, $element) {
            $("#table tbody")
                .append($('<tr />').attr('data-id', $element['prim_key']).attr('data-kind', 'item')
                    .append($('<td />').append('Item'))
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
    }).then(function () {
        loadButtons();

        //refresh scrollbar
        $(".nano").nanoScroller();
    });
}

//load buttons in table
function loadButtons() {
    //delete
    $(".delete").click(function ($event) {
        //prevent default
        $event.preventDefault();

        //get id
        var $id = Number($(this).parent().parent().attr('data-id'));
        //get kind
        var $kind = $(this).parent().parent().attr('data-kind');
        console.log($id);
        console.log($kind);

        //what?
        if ($kind === 'location') {
            $db.locations_out.where('prim_key').equals($id).delete();
        } else if ($kind === 'category') {
            $db.categories_out.where('prim_key').equals($id).delete();
        } else if ($kind === 'item') {
            console.log('start');
            $db.items_out.where('prim_key').equals($id).delete();
            console.log('success');
        }

        //delete from table
        $(this).parent().parent().remove();

        //empty selected
        localStorage.removeItem('current_item');

        showDetails(null);
    });

    //edit
    $(".edit").click(function ($event) {
        //prevent default
        $event.preventDefault();

        //get id
        var $id = Number($(this).parent().parent().attr('data-id'));

        //load in localstorage
        $db.items_out.where('prim_key').equals($id).first(function ($item) {
            localStorage.setItem('current_item', JSON.stringify($item));
            window.location = "edit.html";
        });

    });
}