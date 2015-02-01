var chokidar = require('chokidar');
var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 1337;
var socketGlobal = false;
var logFile = process.env.LOG_PATH || __dirname + '\\log.txt';
//Tail = require('tail').Tail;
//
//var tail = new Tail(logFile);
//tail.watch();
//tail.on("line", function(data) {
//    console.log("line", data);
//});
//
//tail.on("error", function(error) {
//    console.log('ERROR: ', error);
//});

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
    //update(logFile);
});
var log = console.log.bind(console);

var watcher = chokidar.watch(logFile, {
    ignored: /[\/\\]\./, persistent: true
});
watcher.on('add', function (path) {
    log('File', path, 'has been added');
})
    .on('addDir', function (path) {
        log('Directory', path, 'has been added');
    })
    .on('change', function (path) {
        log('File', path, 'has been changed');
    })
    .on('unlink', function (path) {
        log('File', path, 'has been removed');
    })
    .on('unlinkDir', function (path) {
        log('Directory', path, 'has been removed');
    })
    .on('error', function (error) {
        log('Error happened', error);
    })
    .on('ready', function () {
        log('Initial scan complete. Ready for changes.');
    })
    .on('raw', function (event, path, details) {
        log('Raw event info:', event, path, details);
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
    socketGlobal.emit('log', reversData);
};