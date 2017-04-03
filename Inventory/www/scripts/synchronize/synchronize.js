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
        data: JSON.stringify($data_attributes)
    })
    .done(function ($response) {
        //to DB
        var $attr = new Array();
        $($response.data).each(function ($i, $val) {
            $attr.push({ id: $val['id'], attributes: $val['attributes'] });
        });
        $db.attributes.bulkPut($attr);
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
        var $loc = new Array();
        $($response.data).each(function ($i, $val) {
            $loc.push({ id: $val['id'], name: $val['name'] });
        });
        $db.locations.bulkPut($loc);
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
        var $cat = new Array();
        $($response.data).each(function ($i, $val) {
            $cat.push({ id: $val['id'], name: $val['name'] });
        });
        $db.categories.bulkPut($cat);
    });
}