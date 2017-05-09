"use strict";

var $db = new Dexie('Inventory');

$db.version(1).stores({
    locations: 'id,&name',
    categories: 'id,&name',
    items: 'id,issue,name,category,category_id,location_id,location,created_on',
    locations_out: '++prim_key,&name,action',
    categories_out: '++prim_key,&name,action',
    items_out: '++prim_key,id,issue,name,category,location,action',
    usernotes_out: '++prim_key,user_uid,item_id,text'
});

function getDB() {
    return $db;
}