$("#scan").click(function ($event) {
    //prevent default
    $event.preventDefault();

    cordova.plugins.barcodeScanner.scan(
        function (result) {
            $("#result").text("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
        },
        function (error) {
            $("#result").text("Scanning failed: " + error);
        }
    );
});