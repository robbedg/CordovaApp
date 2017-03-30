//"use strict";
$("#scan").click(function ($event) {
    //prevent default
    $event.preventDefault();

    cordova.plugins.barcodeScanner.scan(
        function ($result) {
            //get results
            var $info = $result.text.split(',', 3);

            //add to <p />
            $("#result").empty();
            $("#result").append(
                '<strong>ID</strong>: ' + $info[0] + '<br />' +
                '<strong>Location</strong>: ' + $info[1] + '<br />' +
                '<strong>Category</strong>: ' + $info[2]
            );

            //show results
            $("#results").removeClass('hidden');

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
    getItems();

    var $db = new Dexie('Inventory');
    $db.version(1).stores({
        attributes: 'id,attributes',
        items: 'id,category,location,from,until,attributes'
    });

    getAttributes($db);
    //
    // Put some data into it
    //

    //for (var $i = 0; $i < 1000; $i++) {
    //    $db.attributes.put({ id: $i, attributes: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' });
    //}

    //$db.attributes.count().then(function ($count) {
    //    console.log($count);
    //});
});

//get items from localstorage
function getItems() {
    if (localStorage.getItem('items') !== null) {
        var $items = JSON.parse(localStorage.getItem('items'));

        //empty table
        $("#table tbody").empty();

        //fill table
        $($items).each(function ($index, $element) {
            $("#table tbody")
                .append($('<tr />')
                    .append($('<td />').append($element['id']))
                    .append($('<td />').append($element['location']))
                    .append($('<td />').append($element['category']))
                    .append($('<td />').append($element['from']))
                    .append($('<td />').append($element['until']))
                );
        });


    } else {
        //make new empty item array
        localStorage.setItem('items', JSON.stringify([]));
    }
}