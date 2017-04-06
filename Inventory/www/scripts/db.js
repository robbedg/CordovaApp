"use strict";

var $db = new Dexie('Inventory');

$db.version(1).stores({
    items: 'id,category,category_id,location,location_id,attributes,created_on',
    locations: 'id,name',
    categories: 'id,name',
    items_out: 'id,category,location,attributes,action'
});

function getDB() {
    return $db;
}