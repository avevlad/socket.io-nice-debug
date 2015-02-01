var chokidar = require('chokidar');
var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 1337;
var socketGlobal = false;
var logFile = process.env.LOG_PATH || __dirname + '\\log.txt';
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("socket.id", socket.id);
    socketGlobal = socket;
    update(logFile);
});


console.log("logFile", logFile);

var watcher = chokidar.watch(logFile, {
    ignored: /[\/\\]\./, persistent: true
});
watcher.on('change', function (path) {
    if (!socketGlobal) {
        return;
    }
    update(path);
});

var update = function (filePath) {
    console.log('');
    console.log('.............................');
    console.log('');
    var data = fs.readFileSync(filePath);
    data = data.toString();
    var reversData = "";
    data.split('\n').reverse().map(function (line) {
        reversData += line + '\n';
    });
    console.log("reversData", reversData);
    socketGlobal.emit('log', reversData);
};