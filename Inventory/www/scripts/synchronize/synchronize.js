"use strict";

function getAttributes() {

    //get database connection
    var $db = getDB();

    //ajax get attributes
    var $data_attributes = new Object();
    $data_attributes.search = null;
    $data_attributes.attributes = true;
    
    $.ajax({
        url: 'http://inventory.local/index.php/items/get',
        crossDomain: true,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify($data_attributes)
    })
    .done(function ($response) {
        //to DB
        $($response.data).each(function ($i, $val) {
            $db.attributes.put({ id: $val['id'], attributes: JSON.parse($val['attributes']) });
        });
    });

    //ajax get locations
    $.ajax({
        url: 'http://inventory.local/index.php/locations/get',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(new Object())
    })
    .done(function ($response) {
        //to DB
        $($response.data).each(function ($i, $val) {
            $db.locations.put({ id: $val['id'], name: $val['name'] });
        });
    });

    //ajax get categories
    $.ajax({
        url: 'http://inventory.local/index.php/categories/get',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(new Object())
    })
    .done(function ($response) {
        //to DB
        $($response.data).each(function ($i, $val) {
            $db.categories.put({ id: $val['id'], name: $val['name'] });
        });
    });
}