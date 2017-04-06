"use strict";

$("#download").click(function ($event) {

    //get address
    if (localStorage.getItem('settings') !== null) {
        var $settings = JSON.parse(localStorage.getItem('settings'));
        pullData($settings.address);
    } else {
        window.location('settings.html');
    }
});

function pullData($address) {

    //get database connection
    var $db = getDB();

    //ajax get attributes
    var $data_attributes = new Object();
    $data_attributes.search = null;
    $data_attributes.attributes = true;
    
    $.ajax({
        url: $address + '/index.php/items/get',
        crossDomain: true,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify($data_attributes)
    })
        .done(function ($response) {
            //to DB
            var $attr = new Array();
            $($response.data).each(function ($i, $val) {
                $("#debug").append($val['id'] + '<br />');
                $attr.push({ id: $val['id'], attributes: $val['attributes'] });
            });
            $db.attributes.bulkPut($attr);
        })
        .fail(function (jqXHR, textstatus) {
            $("#debug").append(textstatus);
            $("#debug").append(jqXHR);
        });

    //ajax get locations
    $.ajax({
        url: $address + '/index.php/locations/get',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(new Object())
    })
    .done(function ($response) {
        //to DB
        var $loc = new Array();
        $($response.data).each(function ($i, $val) {
            $loc.push({ id: $val['id'], name: $val['name'] });
        });
        $db.locations.bulkPut($loc);
    });

    //ajax get categories
    $.ajax({
        url: $address + '/index.php/categories/get',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(new Object())
    })
    .done(function ($response) {
        //to DB
        var $cat = new Array();
        $($response.data).each(function ($i, $val) {
            $cat.push({ id: $val['id'], name: $val['name'] });
        });
        $db.categories.bulkPut($cat);
    });
}