$("#scan").click(function ($event) {
    //prevent default
    $event.preventDefault();

    cordova.plugins.barcodeScanner.scan(
        function ($result) {
            //get results
            var $info = $result.text.split(',', 3);

            //add to <p />
            $("#result").append(
                '<strong>ID</strong>: ' + $info[0] + '<br />' +
                '<strong>Location</strong>: ' + $info[1] + '<br />' +
                '<strong>Category</strong>: ' + $info[2]
            );

            //save to file
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