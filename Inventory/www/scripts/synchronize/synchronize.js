"use strict";

function getAttributes($db) {

    var $data = new Object();
    $data.search = null;
    $data.attributes = true;

    //ajax call
    $.ajax({
        url: 'http://inventory.local/index.php/items/get',
        crossDomain: true,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify($data)
    })
    .done(function ($response) {

        $($response.data).each(function ($i, $val) {
            $db.attributes.put({ id: $val['id'], attributes: JSON.parse($val['attributes']) });
        });
    });
}