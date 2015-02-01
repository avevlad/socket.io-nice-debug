var updateLog = true;

$(function () {
    var socket = io();
    socket.on('connect', function () {
        console.log('connect');
    });

    socket.on('log', function (response) {
        if (!updateLog) {
            return;
        }
        $('pre').html(response);
    });
    $('[name="optionsUpdate"]').change(function () {
        updateLog = parseInt($(this).val());
    })
});