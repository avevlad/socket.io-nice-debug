var chokidar = require('chokidar');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 1337;
var socketGlobal = undefined;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("socket.id", socket.id);
    socketGlobal = socket;
});

var watcher = chokidar.watch('./log.txt', {
    ignored: /[\/\\]\./, persistent: true
});
watcher.on('change', function (path) {
    console.log(socketGlobal.id);
    console.log("path", path);
});