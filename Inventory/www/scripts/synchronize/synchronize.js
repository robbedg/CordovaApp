﻿"use strict";

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
    $data_attributes.location = true;
    $data_attributes.category = true;
    
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
                $attr.push($val);
            });

            $db.items.clear().then(function () {
                $db.items.bulkAdd($attr);
            });
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

        $db.locations.clear().then(function () {
            $db.locations.bulkAdd($loc);
        });
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

        $db.categories.clear().then(function () {
            $db.categories.bulkAdd($cat);
        });
    });
}