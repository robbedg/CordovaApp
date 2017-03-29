"use strict";
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

            //save to file
            window.localStorage.setItem('test', JSON.stringify($info));
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function ($dir) {
                $dir.getFile("loans.log", { create: true }, function ($file) {
                    var $logOb = $file;
                    var $log = JSON.stringify($info);
                    $logOb.createWriter(function ($fileWriter) {
                        $fileWriter.seek($fileWriter.length);
                        var $blob = new Blob([$log], { type: 'text/plain' });
                        $fileWriter.write($blob);
                    }, function ($e) { console.error($e); });
                });
            });
        },
        function ($error) {
            $("#result").text("Scanning failed: " + $error);
        }
    );
});

$(document).ready(function () {
    //localStorage.setItem('items', JSON.stringify([{ 'id': '0', 'location': 'Location1', 'category': 'Bank' }]));
    getItems();
});

function getItems() {
    if (localStorage.getItem('items') !== null) {
        var $items = JSON.parse(localStorage.getItem('items'));
        console.log($items);
    }
}