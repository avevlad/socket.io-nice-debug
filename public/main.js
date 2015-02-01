$(function () {
    var socket = io();
    socket.on('connect', function () {
        console.log('connect');
    });

    socket.on('log', function (response) {
        $('pre').html(response);
    });
});