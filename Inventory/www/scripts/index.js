$("#scan").click(function ($event) {
    //prevent default
    $event.preventDefault();

    cordova.plugins.barcodeScanner.scan(
        function ($result) {
            var $info = $result.text.split(',', 3);
            $("#result").append(
                '<strong>ID</strong>: ' + $info[0] + '<br />' +
                '<strong>Location</strong>: ' + $info[1] + '<br />' +
                '<strong>Category</strong>: ' + $info[2]
            );

            
        },
        function ($error) {
            $("#result").text("Scanning failed: " + $error);
        }
    );
});