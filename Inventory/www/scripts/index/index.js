"use strict";

var $db = getDB();

//localStorage.clear();
localStorage.setItem('current_item', '{"id": "0000000001","created_on": "13\/02\/17 14:40","location_id": "10","location": "AB","category_id": "4","category": "Bank","attributes": {"a": "a","s": "s","z": "s","test": "test"},"last_loan_from": "25\/04\/17 17:06","last_loan_until": "25\/04\/17 18:06","last_loan_firstname": "Robbe","last_loan_lastname": "DE GEYNDT","usernotes": [{"id": "2","user_id": "1","item_id": "0000000001","text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porta scelerisque mauris, quis dapibus justo rutrum id. Donec fermentum quam quis ante varius dignissim. Sed mollis eros eu gravida gravida. Nulla egestas mi et tempus ornare. Vivamus volutpat non tortor a posuere. Donec eu ex rutrum, pretium libero et, mattis tortor. Nulla facilisi. Nulla vel sem sed diam tincidunt vestibulum. Aenean accumsan commodo velit nec consectetur. Duis vitae felis sed risus ullamcorper hendrerit. Sed tellus purus, aliquet non risus et, sodales facilisis sem. Donec fringilla blandit viverra.","created_on": "22\/02\/2017 13:16","uid": "p4472517","firstname": "Torben","lastname": "MARECHAL","role_id": "4"},{"id": "3","user_id": "2","item_id": "0000000001","text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porta scelerisque mauris, quis dapibus justo rutrum id. Donec fermentum quam quis ante varius dignissim. Sed mollis eros eu gravida gravida. Nulla egestas mi et tempus ornare. Vivamus volutpat non tortor a posuere. Donec eu ex rutrum, pretium libero et, mattis tortor. Nulla facilisi. Nulla vel sem sed diam tincidunt vestibulum. Aenean accumsan commodo velit nec consectetur. Duis vitae felis sed risus ullamcorper hendrerit. Sed tellus purus, aliquet non risus et, sodales facilisis sem. Donec fringilla blandit viverra.","created_on": "22\/02\/2017 13:16","uid": "p0","firstname": "Robbe","lastname": "DE GEYNDT","role_id": "3"},{"id": "4","user_id": "2","item_id": "0000000001","text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis libero eget tortor bibendum dignissim. Integer convallis scelerisque lorem, ultricies elementum mauris maximus et. Integer sem erat, vehicula eget finibus eget, blandit a leo. Nunc sed neque non sem laoreet sagittis. Suspendisse non consectetur nisi. Suspendisse est urna, molestie eget lorem eget, lacinia ullamcorper odio. Nullam a iaculis sapien. Integer sit amet feugiat odio, sit amet hendrerit dui. Pellentesque ornare risus magna, non gravida lacus lacinia et. Pellentesque luctus commodo viverra. Nullam sit amet nulla velit. Ut mollis, risus sit amet auctor vestibulum, lorem mauris mattis purus, id posuere justo ipsum ut mauris. Nullam sed lectus tristique, cursus est eget, fringilla sapien. Nullam volutpat molestie ipsum nec venenatis.","created_on": "22\/02\/2017 13:15","uid": "p0","firstname": "Robbe","lastname": "DE GEYNDT","role_id": "3"},{"id": "49","user_id": "1","item_id": "0000000001","text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed convallis elementum risus. Etiam interdum egestas tincidunt. Donec ut ante eu nunc maximus suscipit ut eget metus. Vivamus nec molestie nulla. Quisque sed libero scelerisque, egestas magna sit amet, condimentum odio. Integer pulvinar ex sed magna bibendum fermentum. Aliquam a bibendum lacus. Praesent tortor lacus, dignissim ut convallis non, hendrerit sit amet quam. Ut tempor nulla lobortis, egestas nisi quis, imperdiet dolor. Maecenas a imperdiet magna. Donec lacinia, sem eget luctus volutpat, nisi dui porttitor lectus, vitae rhoncus enim nulla vel lorem. Sed dapibus elit ipsum, id faucibus nisl mattis placerat. Nunc id ultrices turpis.","created_on": "22\/02\/2017 12:53","uid": "p4472517","firstname": "Torben","lastname": "MARECHAL","role_id": "4"}]}');

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
                    .append($('<td />').append($('<a />').attr('href', '#').append($element['id'])))
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

    //usernotes
    $db.usernotes_out.toArray(function ($usernotes) {
        //fill table
        $($usernotes).each(function ($index, $element) {
            $("#table tbody")
                .append($('<tr />').attr('data-id', $element['prim_key']).attr('data-kind', 'usernote')
                    .append($('<td />').append('Comment'))
                    .append($('<td />').append($('<a />').attr('href', '#').append($element['item_id'])))
                    .append($('<td />').append($element['']))
                    .append($('<td />').append($element['']))
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

        //what?
        if ($kind === 'location') {
            $db.locations_out.where('prim_key').equals($id).delete();
        } else if ($kind === 'category') {
            $db.categories_out.where('prim_key').equals($id).delete();
        } else if ($kind === 'item') {
            $db.items_out.where('prim_key').equals($id).delete();
        } else if ($kind === 'usernote') {
            $db.usernotes_out.where('prim_key').equals($id).delete();
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