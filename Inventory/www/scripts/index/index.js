"use strict";

//get db
var $db = getDB();

//translations
var $translations = { Create: 'Aanmaken', Update: 'Updaten', Delete: 'Verwijderen' };

/**
 * Search button
 **/
$("#search button").click(function ($event) {
    //prevent default
    $event.preventDefault();

    searchOnID($("#search input").val());
})

/**
 * Scan button event
**/
$("#scan").click(function ($event) {
    //prevent default
    $event.preventDefault();

    //when scan success
    cordova.plugins.barcodeScanner.scan(
        function ($result) {
            searchOnID($result.text);
        },
        function ($error) {
            $("#result").text("Scanning failed: " + $error);
        }
    );
});

function searchOnID($result) {
    //make object
    var $item = new Object();

    //get results
    $item.id = $result;

    $db.items_out.where('id').equals($item.id).count(function ($count) {

        //not yet modified
        if ($count === 0) {

            //count
            $db.items.where('id').equals($item.id).count(function ($count2) {
                //if not exist
                if ($count2 === 0) {
                    $("#result").empty();
                    $("#results").addClass('hidden');
                //if exists
                } else {
                    $("#results").removeClass('hidden');
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
                            showDetails($item);
                        });
                }
                
            });
        }
        //already been modified
        else {
            $("#results").removeClass('hidden');
            //get item
            $db.items_out.where('id').equals($item.id).first(function ($result) {
                $item = $result;

                //store item
                localStorage.setItem('current_item', JSON.stringify($item));

                //show results
                showDetails($item);
            });
        }
    });

    //add data to hidden fields
    $("#item_id").val($item.id);
    $("#location").val($item.location);
    $("#category").val($item.category);
}

function showDetails($in) {
    var $item = $in;

  
    //get current item
    var $json = localStorage.getItem('current_item');

    //checking
    if ($item === null && $json !== null) {
        $item = JSON.parse($json);
    }

    if ($item !== null && typeof $item['id'] !== 'undefined') {

        //add to <p />
        $("#result").empty();
        $("#result").append(
            '<strong>ID</strong>: ' + $item['id'] + '<br />' +
            '<strong>Locatie</strong>: ' + $item['location'] + '<br />' +
            '<strong>Categorie</strong>: ' + $item['category'] + '<br />'
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

    //current item
    if (localStorage.getItem('current_item') !== null) {
        var $item = JSON.parse(localStorage.getItem('current_item'));
        showDetails($item, true);
    }

    //show table
    getItems();

    //show page
    $('html').css('visibility', 'visible');

});

//get items from localstorage
function getItems() {
    //empty table
    $("#table tbody").empty();

    //transaction
    $db.transaction('r', $db.locations_out, $db.categories_out, $db.items_out, $db.usernotes_out, function () {
        //locations
        $db.locations_out.toArray(function ($locations) {

            //fill table
            $($locations).each(function ($index, $element) {

                //remove hidden class
                $("#overview").removeClass('hidden');

                $("#table tbody")
                    .append($('<tr />').attr('data-id', $element['prim_key']).attr('data-kind', 'location')
                        .append($('<td />').append('Locatie'))
                        .append($('<td />').append(''))
                        .append($('<td />').append($element['name']))
                        .append($('<td />').append($translations[$element['action']]))
                        .append($('<td />')
                            .append($('<a href="#" class="btn btn-danger btn-sm delete" /a>').append('<span class="fa fa-close"></span>'))
                        )
                    );
            });
        });

        //categories
        $db.categories_out.toArray(function ($categories) {
            
            //fill table
            $($categories).each(function ($index, $element) {

                //remove hidden class
                $("#overview").removeClass('hidden');

                $("#table tbody")
                    .append($('<tr />').attr('data-id', $element['prim_key']).attr('data-kind', 'category')
                        .append($('<td />').append('Categorie'))
                        .append($('<td />').append(''))
                        .append($('<td />').append($element['name']))
                        .append($('<td />').append($translations[$element['action']]))
                        .append($('<td />')
                            .append($('<a href="#" class="btn btn-danger btn-sm delete" /a>').append('<span class="fa fa-close"></span>'))
                        )
                    );
            });
        });

        //items
        $db.items_out.toArray(function ($items) {
            
            //fill table
            $($items).each(function ($index, $element) {

                //remove hidden class
                $("#overview").removeClass('hidden');

                $("#table tbody")
                    .append($('<tr />').attr('data-id', $element['prim_key']).attr('data-kind', 'item')
                        .append($('<td />').append('Item'))
                        .append($('<td />').append($('<a class="table-link" />').attr('href', '#').append($element['id'])))
                        .append($('<td />').append($element['name']))
                        .append($('<td />').append($translations[$element['action']]))
                        .append($('<td />')
                            .append($('<a href="#" class="btn btn-danger btn-sm delete" /a>').append('<span class="fa fa-close"></span>'))
                            .append($('<a href="#" class="btn btn-primary btn-sm edit" /a>').append('<span class="fa fa-edit"></span>'))
                        )
                    );
            });
        });

        //usernotes
        $db.usernotes_out.toArray(function ($usernotes) {
            
            //fill table
            $($usernotes).each(function ($index, $element) {

                //remove hidden class
                $("#overview").removeClass('hidden');

                $("#table tbody")
                    .append($('<tr />').attr('data-id', $element['prim_key']).attr('data-kind', 'usernote')
                        .append($('<td />').append('Reactie'))
                        .append($('<td />').append($('<a class="table-link" />').attr('href', '#').append($element['item_id'])))
                        .append($('<td />').append($element['']))
                        .append($('<td />').append($translations[$element['action']]))
                        .append($('<td />')
                            .append($('<a href="#" class="btn btn-danger btn-sm delete" /a>').append('<span class="fa fa-close"></span>'))
                        )
                    );
            });
        });
    }).then(function () {
        //load buttons
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
        //location
        if ($kind === 'location') {
            //modal
            $("#delete-submit").unbind();
            $("#modal-text").empty();
            $("#modal-text").append('Wanneer je een locatie verwijderd, worden alle items daarin ook verwijderd.');
            $("#delete-modal").modal('show');

            //confirm
            $("#delete-submit").click(function ($event) {
                //prevent default
                $event.preventDefault();

                //database
                $db.locations_out.where('prim_key').equals($id).first(function ($location) {
                    //delete items in location
                    $db.items_out.where('location').equals($location['name']).delete();
                    //delete location
                    $db.locations_out.where('prim_key').equals($id).delete();
                }).then(function () {
                    //reload
                    $("#overview").addClass('hidden');
                    getItems();
                });

                //unbind
                $("#delete-submit").unbind();
                //close
                $("#delete-modal").modal('hide');
            });

            //category
        } else if ($kind === 'category') {
            //modal
            $("#delete-submit").unbind();
            $("#modal-text").empty();
            $("#modal-text").append('Wanneer je een categorie verwijderd, worden alle items daarin ook verwijderd.');
            $("#delete-modal").modal('show');

            //confirm
            $("#delete-submit").click(function ($event) {
                //prevent default
                $event.preventDefault();

                //database
                $db.categories_out.where('prim_key').equals($id).first(function ($category) {
                    //delete items in category
                    $db.items_out.where('category').equals($category['name']).delete();
                    //delete category
                    $db.categories_out.where('prim_key').equals($id).delete();
                }).then(function () {
                    //reload
                    $("#overview").addClass('hidden');
                    getItems();
                });

                //unbind
                $("#delete-submit").unbind();
                //close
                $("#delete-modal").modal('hide');
            });
            //item
        } else if ($kind === 'item') {
            //modal
            $("#delete-submit").unbind();
            $("#modal-text").empty();
            $("#modal-text").append('Wilt u dit item verwijderen?');
            $("#delete-modal").modal('show');

            //confirm
            $("#delete-submit").click(function ($event) {
                //prevent default
                $event.preventDefault();

                //database
                $db.items_out.where('prim_key').equals($id).delete();

                //reload
                $("#overview").addClass('hidden');
                getItems();

                //unbind
                $("#delete-submit").unbind();
                //close
                $("#delete-modal").modal('hide');
            });

            //usernote
        } else if ($kind === 'usernote') {
            //modal
            $("#delete-submit").unbind();
            $("#modal-text").empty();
            $("#modal-text").append('Wilt u deze reactie verwijderen?');
            $("#delete-modal").modal('show');

            //confirm
            $("#delete-submit").click(function ($event) {
                //prevent default
                $event.preventDefault();

                //database
                $db.usernotes_out.where('prim_key').equals($id).delete();

                //reload
                $("#overview").addClass('hidden');
                getItems();

                //unbind
                $("#delete-submit").unbind();
                //close
                $("#delete-modal").modal('hide');
            });
        }

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

    //click link in table
    $(".table-link").click(function ($event) {
        //prevent default
        $event.preventDefault();

        $db.items_out.where('id').equals($(this).text()).first(function ($item) {
            localStorage.setItem('current_item', JSON.stringify($item));
            window.location = "details.html";
        });
    });
}