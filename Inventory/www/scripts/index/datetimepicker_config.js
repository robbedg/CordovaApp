"use strict";
$(document).ready(function () {
    $('#datetimepicker_from').datetimepicker({
        'locale': 'nl-be',
        'sideBySide': false,
        'minDate': moment(new Date()).add(10, 'm'),
        'defaultDate': moment(new Date()).add(10, 'm'),
        'icons': {
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-arrow-up',
            down: 'fa fa-arrow-down',
            previous: 'fa fa-arrow-left',
            next: 'fa fa-arrow-right',
            today: 'fa fa-crosshairs',
            clear: 'fa fa-trash-o',
            close: 'fa fa-times'
        }
    });

    $('#datetimepicker_until').datetimepicker({
        'locale': 'nl-be',
        'sideBySide': false,
        'useCurrent': false,
        'minDate': moment(new Date()).add(20, 'm'),
        'defaultDate': moment(new Date()).add(70, 'm'),
        'icons': {
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-arrow-up',
            down: 'fa fa-arrow-down',
            previous: 'fa fa-arrow-left',
            next: 'fa fa-arrow-right',
            today: 'fa fa-crosshairs',
            clear: 'fa fa-trash-o',
            close: 'fa fa-times'
        }
    });

    $("#datetimepicker_from").on("dp.change", function (e) {
        var $date = new moment(e.date);
        $('#datetimepicker_until').data("DateTimePicker").minDate(e.date.add(10, 'm')).date($date.add(60, 'm'));
    });
});