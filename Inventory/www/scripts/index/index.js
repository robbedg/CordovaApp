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
    localStorage.clear();
    //localStorage.setItem('items', JSON.stringify([]));
    //localStorage.setItem('items', JSON.stringify([{ 'id': '0', 'location': 'Location1', 'category': 'Bank' }]));
    getItems();

    //localStorage.clear();
    //for (var $i = 0; $i < 1000000; $i++) {
    //    localStorage.setItem($i, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    //}

    var db = new Dexie("friend_database");
    db.version(1).stores({
        friends: 'name,shoeSize'
    });

    //
    // Put some data into it
    //
    db.friends.put({ name: "Nicolas", shoeSize: 8 }).then(function () {
        //
        // Then when data is stored, read from it
        //
        return db.friends.get('Nicolas');
    }).then(function (friend) {
        //
        // Display the result
        //
        console.log("Nicolas has shoe size " + friend.shoeSize);
    }).catch(function (error) {
        //
        // Finally don't forget to catch any error
        // that could have happened anywhere in the
        // code blocks above.
        //
        console.log("Ooops: " + error);
    });

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