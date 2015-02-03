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

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("socket.id", socket.id);
    socketGlobal = socket;
    sendData(true, function () {
    });
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
        else if (line.indexOf("socket.io:socket emitting event") > -1) {
            var oldLine = line;
            var name = line;
            name = name.match(/event\s\["\w+/)[0].substring(8).trim();
            line = "<div class='emittingEventName'>" + name + "</div>";
            var splitLine = oldLine.split("\",{");
            var appendToLine = "";
            if (splitLine[1]) {
                var json = "{" + splitLine[1].trim();
                json = json.substring(0, json.length - 1);
                appendToLine = "<div class='json-format'>" + json + "</div>";
                json = json.replace(/\s+/g, ' ');
            } else {
                var varString = oldLine.split('",')[1].trim();
                varString = varString.substring(0, varString.length - 1);
                appendToLine = "<div class='string-format'>" + varString + "</div>";
            }
            line += appendToLine;
        }
        else if (line.indexOf("disconnect: username") > -1) {
            line = "<div style='color: #ff0304;font-weight: bold;'>" + line + "</div>";
        }
        else if (line.indexOf("client #") > -1) {
            line = "<div style='color: #2143ff;font-weight: bolder;'>" + line + "</div>";
        }
        else if (line.indexOf("clients not found") > -1) {
            line = "<div style='color: #2143ff;font-weight: bolder;'>" + line + "</div>";
        }
        else if (line.indexOf("Server listening") > -1) {
            line = "<div style='color: #008800;font-weight: bold;font-size: 18px;'>" + line + "</div>";
        } else {
            line = escapeHtml(line);
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