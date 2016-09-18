//Client Settings
var uuid = "G047";

//Server Settings
var http_Port = 8001;
var client_Port = 8002;
var slave_Port = 8003;
var client = {
    server:'',
    x:0,
    y:0,
    connected:'',
    max:''
};

//Dev Clan
function load() {
    var figlet = require('figlet');
    figlet('Agario Bots', function (err, data) {
        console.log(data);
        console.log('               Made by G047');
        require('dns').lookup(require('os').hostname(), function (err, add, fam) {
            console.log('');
            console.log('Node.js Server Running');
            console.log('Http Server, http://' + add + ':' + http_Port + '/files');
            console.log('Client Server ws://' + add + ':' + client_Port);
            console.log('Bot Server ws://' + add + ':' + slave_Port);
	    console.log('Userscript, http://localhost:8001/files/client.user.js');
            console.log('');
        });
    });
}load();

//Http Server
var express = require('express');
var app = express();
var serveIndex = require('serve-index');
app.use(express.static(__dirname + "/"));
app.use('/files', serveIndex(__dirname + '/files'));
app.listen(http_Port);

//Client Server
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res){
    res.end('G047.pw');
});
io.use(function(socket, next) {
    var handshakeData = socket.request._query.key;
    if (handshakeData===uuid) {
        next();
    } else {
        socket.disconnect();
    }
});
io.on('connection', function(socket){
    console.log('Admin Connected');
    socket.emit('command', {'name':'auth', 'auth':'true'});
    client.connected=true;
    socket.on("command", function(cmd) {
        if (cmd.name === 'position') {
            client.x=cmd.botX;
            client.y=cmd.botY;
            return;
        }
        io_slave.sockets.emit('bots', cmd);
    })
});
http.listen(client_Port, function(){});

//update pos
function update() {
    if (client.y) {
        io_slave.sockets.emit('bots', {'name': 'position','x':client.x,'y':client.y});
    }
}
setInterval(update, 100);

//Slaves Server
var app_slave = require('express')();
var http_slave = require('http').Server(app_slave);
var io_slave = require('socket.io')(http_slave);
app_slave.get('/', function(req, res){
    res.end('G047');
});
io_slave.on('connection', function(socket){
    var uuid = socket.request._query.key;
    console.log('Browser Connected, UUID: '+uuid);
});
http_slave.listen(slave_Port, function(){});

//Change uuid
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', (line) => {
    if (line.split(' ')[0]==='uuid') {
        uuid = line.split(' ')[1];
        console.log('Admin UUID set to: '+uuid);
    }
    if (line==='clear') {
        process.stdout.write('\x1B[2J\x1B[0f');
        load();
    }
    if (line==='help') {
        console.log('Current list of commands:');
        console.log("    clear - Clears Console\n    uuid - sets admin UUID\n    help - Shows help\n    reconnect - Reconnects all the bots")
    }
});
