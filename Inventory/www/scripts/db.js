"use strict";

var $db = new Dexie('Inventory');

$db.version(1).stores({
    attributes: 'id,attributes',
    locations: 'id,name',
    categories: 'id,name',
    items: 'id,category,location,attributes'
});

function getDB() {
    return $db;
}