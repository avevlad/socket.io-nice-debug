var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 1337;
var socketGlobal = false;
var logFile = process.env.LOG_PATH || __dirname + '\\log.txt';
var lastFileData = "";
var updateTime = 1000;
var ii = 0;
while (ii < 25) {
    ii++;
    console.log('');
}
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("socket.id", socket.id);
    socketGlobal = socket;
    sendData(true, function () {});
});

var sendData = function (newSocket, callback) {
    var data = fs.readFileSync(logFile);
    data = data.toString();
    var tempLine = data.slice(-100);
    console.log('read file', logFile, ' ---------> ', tempLine === lastFileData);
    console.log("newSocket", newSocket);
    if (!newSocket) {
        if (tempLine === lastFileData) {
            setTimeout(function () {
                update(true);
            }, updateTime);
            return false;
        }
    }
    lastFileData = tempLine;
    var reversData = "";
    var reversArr = data.split('\n').reverse().splice(0, 300);
    reversArr.map(function (line) {
        if (line.indexOf("clientIpAddress") > -1) {
            line = "<div style='color: #008800;font-weight: bold;'>" + line + "</div>";
        }
        if (line.indexOf("socket.io-parser decoded 2") > -1) {
            var oldLine = line;
            var splitLine = line.split("as");
            var jsonText = JSON.parse(splitLine[1].trim());
            jsonText = JSON.stringify(jsonText, null, 4);
            console.log(jsonText);
            line = "<div style='font-weight: bold;font-size: 14px;color: #000000;'>" + splitLine[0] + "</div>";
            line +="<div class='json-format'>" + jsonText + "</div>";
        }
        if (line.indexOf("disconnect: username") > -1) {
            line = "<div style='color: #ff0304;font-weight: bold;'>" + line + "</div>";
        }
        if (line.indexOf("client #") > -1) {
            line = "<div style='color: #2143ff;font-weight: bolder;'>" + line + "</div>";
        }
        if (line.indexOf("clients not found") > -1) {
            line = "<div style='color: #2143ff;font-weight: bolder;'>" + line + "</div>";
        }
        if (line.indexOf("Server listening") > -1) {
            line = "<div style='color: #008800;font-weight: bold;font-size: 18px;'>" + line + "</div>";
        }
        reversData += line + '\n';
    });
    socketGlobal.emit('log', reversData);
    callback();
};

var update = function (type) {
    if (!socketGlobal) {
        setTimeout(function () {
            update(true);
        }, updateTime);
        return false;
    }
    sendData(false, function () {
        setTimeout(function () {
            update(true);
        }, updateTime);
    });
};

update();