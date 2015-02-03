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
});

var update = function (filePath) {
    if (!socketGlobal) {
        return false;
    }
    console.log('');
    console.log('.............................');
    console.log('');
    var data = fs.readFileSync(filePath);
    data = data.toString();
    var reversData = "";
    var reversArr = data.split('\n').reverse().splice(0, 150);
    reversArr.map(function (line) {
        reversData += line + '\n';
    });
    socketGlobal.emit('log', reversData);
};

setInterval(function () {
    update(logFile);
}, 1000);