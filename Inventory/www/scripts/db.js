"use strict";

var $db = new Dexie('Inventory');

$db.version(1).stores({
    locations: 'id,&name',
    categories: 'id,&name',
    items: 'id,category,category_id,location_id,location,created_on',
    locations_out: '++prim_key,&name,action',
    categories_out: '++prim_key,&name,action',
    items_out: '++prim_key,id,category,location,action'
});

function getDB() {
    return $db;
}