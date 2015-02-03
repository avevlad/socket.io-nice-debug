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
    });
    $('.reboot').click(function () {
        $.post('http://128.199.37.142:3000/api/v1/quest/reboot', function () {
            console.log('reboot');
        });
    });
});