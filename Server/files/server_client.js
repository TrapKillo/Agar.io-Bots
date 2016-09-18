function escapeHtml(_0xe846x2) {
    return String(_0xe846x2).replace(/[&<>"'\/]/g, function(_0xe846x2) {
        return entityMap[_0xe846x2]
    })
}

function replaceRegexFile(_0xe846x2, b, _0xe846x5) {
    var _0xe846x6 = new RegExp(b);
    return _0xe846x6.test(_0xe846x2) ? _0xe846x2 = _0xe846x2.replace(b, _0xe846x5) : console.log("[Failed] to replace: " + b), _0xe846x2
}

function replaceNormalFile(_0xe846x2, b, _0xe846x5) {
    return _0xe846x2.indexOf(b) != -1 ? _0xe846x2 = _0xe846x2.replace(b, _0xe846x5) : console.log("[Failed] to replace: " + b), _0xe846x2
}

function isNumber(_0xe846x2) {
    return !isNaN(parseFloat(_0xe846x2))
}

function MinimapBall(_0xe846x2, b, _0xe846x5, _0xe846x6, _0xe846xa, _0xe846xb) {
    this.isDefault = _0xe846x2, this.name = b, this.x = _0xe846x5, this.y = _0xe846x6, this.lastX = _0xe846x5, this.lastY = _0xe846x6, this.color = _0xe846xa, this.visible = _0xe846xb
}

function Bot(_0xe846x2) {
    this.id = _0xe846x2, this.worker = null, this.alive = !1, this.x = 0, this.y = 0, this.lastUpdate = Date.now()
}

function updateBotCount() {
    for (var _0xe846x2 = G047.currentServerBots, b = 2 + G047.maxServerBots, _0xe846x5 = 0; _0xe846x5 < 2; _0xe846x5++) {
        bots[_0xe846x5] && bots[_0xe846x5].alive && _0xe846x2++
    };
    0 === _0xe846x2 ? $("#botCount").html("<font color=\"red\">0 / " + b + "</font>") : $("#botCount").html("<font color=\"#7FFF00\">" + _0xe846x2 + " / " + b + "</font>")
}

function startBots() {
    for (var _0xe846x2 = 0; _0xe846x2 < 2; _0xe846x2++) {
        bots[_0xe846x2] = new Bot(_0xe846x2), bots[_0xe846x2].start()
    };
    updateBotNames()
}

function sendBotsMessage(_0xe846x2, b) {
    for (var _0xe846x5 in bots) {
        _0xe846x2 ? bots[_0xe846x5].id < 2 && bots[_0xe846x5].worker.postMessage(b) : bots[_0xe846x5].id > 1 && bots[_0xe846x5].worker.postMessage(b)
    }
}

function checkBotsRestart() {
    for (var _0xe846x2 in bots) {
        Date.now() - bots[_0xe846x2].lastUpdate > 2e3 && (bots[_0xe846x2].worker.terminate(), bots[_0xe846x2].lastUpdate = Date.now(), bots[_0xe846x2].start(), bots[_0xe846x2].id < 2 ? bots[_0xe846x2].worker.postMessage({
            name: "server",
            server: G047.server
        }) : bots[_0xe846x2].id > 1 && bots[_0xe846x2].worker.postMessage({
            name: "server",
            server: G047.remoteBotsServer
        }), console.log("Restarted bot: " + _0xe846x2))
    }
}

function updateRemoteBotCount(_0xe846x2) {
    $("#newBotCount").val(_0xe846x2), $("#botSlider").val(_0xe846x2)
}

function insertCore() {
    var _0xe846xb = new XMLHttpRequest;
    _0xe846xb.open("GET", "/agario.core.js", !0), _0xe846xb.onload = function() {
        var _0xe846x13 = _0xe846xb.responseText;
        _0xe846x13 = replaceNormalFile(_0xe846x13, "if(h.MC&&h.MC.onPlayerSpawn)", "G047.playerSpawned();if(h.MC&&h.MC.onPlayerSpawn)"), _0xe846x13 = replaceNormalFile(_0xe846x13, "if(h.MC&&h.MC.onPlayerDeath)", "G047.playerDied();if(h.MC&&h.MC.onPlayerDeath)"), _0xe846x13 = replaceNormalFile(_0xe846x13, "if(h.MC&&h.MC.onAgarioCoreLoaded)", "G047.onAgarioCoreLoaded();if(h.MC&&h.MC.onAgarioCoreLoaded)"), _0xe846x13 = replaceNormalFile(_0xe846x13, "if(h.MC&&h.MC.onDisconnect)", "G047.playerDisconnected();if(h.MC&&h.MC.onDisconnect)"), _0xe846x13 = replaceNormalFile(_0xe846x13, "connect:function(a){", "connect:function(a){G047.playerConnected(a);"), _0xe846x13 = replaceNormalFile(_0xe846x13, "sendSpectate:function(){", "sendSpectate:function(){G047.playerSpectated();"), _0xe846x13 = replaceNormalFile(_0xe846x13, "sendNick:function(a){", "sendNick:function(a){G047.updateNickname(a);"), _0xe846x13 = replaceNormalFile(_0xe846x13, "setTarget:function(a,b){", "setTarget:function(a,b){if(G047.stopMovement){a = $('#canvas').width() / 2; b = $('#canvas').height() / 2;}"), _0xe846x13 = replaceRegexFile(_0xe846x13, /(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);)/i, "$1 if(G047.setMapCoords){G047.setMapCoords($3,$5,$7,$9,$2,$8);}"), _0xe846x13 = replaceRegexFile(_0xe846x13, /([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, "$1 G047.playerX=$4; G047.playerY=$5;"), _0xe846x13 = replaceRegexFile(_0xe846x13, /if\((\+\w\[\w>>3\])<1\.0\){/i, "if($1 < G047.zoomResetValue){"), _0xe846x13 = replaceRegexFile(_0xe846x13, /(if\(\w<=)(20\.0)(\){\w=\w;return})(if\(!\w\){if\(\(\w\[\d+\]\|0\)!=\(\w\[\d+\]\|0\)\){\w=\w;return}if\(\(\w\[\w\+\d+>>0\]\|0\)!=0\?\(\w\[\w>>0\]\|0\)==0:0\){\w=\w;return}})/i, "$140.0$3"), _0xe846x13 = replaceRegexFile(_0xe846x13, /(\w)(=\+\w\[\w>>3\]\*\+\w\()(.\d)(,\+\w\);)/i, "$1$2 (G047.zoomSpeedValue||0.9) $4 G047.zoomValue=$1;"), _0xe846x13 = replaceRegexFile(_0xe846x13, /(\w=\w\[\w>>2\]\|0;)((\w\[\w>>3\])=(\w);)(\w\[\w>>0\]=a\[\w>>0\];)/i, "$1 if(!G047.autoZoom){$3 = G047.zoomValue;}else{$2}$5"), _0xe846x13 = replaceRegexFile(_0xe846x13, /((\w)=(\+\(\(\w\[\w\+\d+>>\d.*;)(\w)=(\+\(\(\w\[.*\/2\|\d\)\|0\)\/\w\+\s\+\w\[\w\+\d+>>3\];).*\4=\4<\w\?\w:\w;)/, "G047.mouseX = $3 G047.mouseY = $5 $1"), eval(_0xe846x13)
    }, _0xe846xb.send()
}

function drawMinimap() {
    var _0xe846x2 = 200,
        b = 30;
    if (null !== minimap ? minimapCtx.clearRect(0, 0, _0xe846x2 + b, _0xe846x2 + b) : (minimap = document.getElementById("minimap"), minimapCtx = minimap.getContext("2d"), minimap.width = _0xe846x2 + b, minimap.height = _0xe846x2 + b), minimapCtx.save(), minimapCtx.globalAlpha = 0.4, minimapCtx.fillRect(0, 0, _0xe846x2 + b, _0xe846x2 + b), minimapCtx.translate(b / 2, b / 2), minimapCtx.strokeStyle = "#EEEEEE", minimapCtx.beginPath(), minimapCtx.moveTo(-1, 0), minimapCtx.lineTo(_0xe846x2 + 1, 0), minimapCtx.moveTo(0, 1), minimapCtx.lineTo(0, _0xe846x2 + 1), minimapCtx.moveTo(1, _0xe846x2), minimapCtx.lineTo(_0xe846x2 + 1, _0xe846x2), minimapCtx.moveTo(_0xe846x2, 1), minimapCtx.lineTo(_0xe846x2, _0xe846x2 - 1), minimapCtx.stroke(), minimapCtx.globalAlpha = 1, G047.mapOffsetFixed) {
        for (var _0xe846x5 in minimapBalls) {
            var _0xe846x6 = _0xe846x2 / G047.mapSize;
            minimapBalls[_0xe846x5].draw(minimapCtx, _0xe846x6)
        }
    };
    minimapCtx.restore()
}

function resetMinimap() {
    for (var _0xe846x2 in minimapBalls) {
        minimapBalls[_0xe846x2].isDefault || delete minimapBalls[_0xe846x2]
    }
}

function addBallToMinimap(_0xe846x2, b, _0xe846x5, _0xe846x6, _0xe846xa, _0xe846xb, _0xe846x17) {
    minimapBalls[b] = new MinimapBall(_0xe846x2, _0xe846x5, _0xe846x6, _0xe846xa, _0xe846xb, _0xe846x17)
}

function removeBallFromMinimap(_0xe846x2) {
    minimapBalls[_0xe846x2] && delete minimapBalls[_0xe846x2]
}

function moveBallOnMinimap(_0xe846x2, b, _0xe846x5) {
    minimapBalls[_0xe846x2] && (minimapBalls[_0xe846x2].x = b, minimapBalls[_0xe846x2].y = _0xe846x5)
}

function setBallVisible(_0xe846x2, b) {
    minimapBalls[_0xe846x2] && (minimapBalls[_0xe846x2].visible = b)
}

function changeNicknameOnBall(_0xe846x2, b) {
    minimapBalls[_0xe846x2] && (minimapBalls[_0xe846x2].name = b)
}

function sendMinimapServerCommand(_0xe846x2) {
    null !== minimapSocket && minimapSocket.connected && minimapSocket.emit("command", _0xe846x2)
}

function sendBotServerCommand(_0xe846x2) {
    null !== botSocket && botSocket.connected && botSocket.emit("command", _0xe846x2)
}

function connectToBotServer() {
    botSocket = io.connect("ws://localhost:8003", {
        reconnection: !0,
        query: "version=" + botVersion + "&key=" + client_uuid
    }), botSocket.on("command", function(_0xe846x2) {
        if (void(0) === _0xe846x2.name) {
            return void(console).log("Recieved a command with no name.")
        };
        switch (_0xe846x2.name) {
            case "count":
                G047.currentServerBots = _0xe846x2.currentServerBots, G047.maxServerBots != _0xe846x2.maxServerBots && (G047.maxServerBots = _0xe846x2.maxServerBots, $("#botSlider").prop("max", G047.maxServerBots), updateRemoteBotCount(G047.maxServerBots)), updateBotCount();
                break;
            case "auth":
                G047.isAuthorized = _0xe846x2.auth, _0xe846x2.auth ? ($("#uuiddiv").hide(), $("#sliderDiv").show(), console.log("Your client is authorized for use of more bots.")) : ($("#uuiddiv").show(), G047.currentServerBots = 0, G047.maxServerBots = 0, updateRemoteBotCount(0), $("#sliderDiv").hide(), console.log("Your client is not authorized for use of more bots."));
                break;
            default:
                return void(console).log("Received a command with an unknown name: " + _0xe846x2.name)
        }
    }), botSocket.on("connect", function() {
        null !== G047.server && sendBotServerCommand({
            name: "server",
            server: G047.server
        })
    }), botSocket.on("bots", function(_0xe846x2) {
        "server" == _0xe846x2.name && (G047.remoteBotsServer = _0xe846x2.server), sendBotsMessage(!1, _0xe846x2)
    }), botSocket.on("disconnect", function() {
        sendBotsMessage(!1, {
            name: "disconnect"
        })
    })
}

function connectToMinimapServer(_0xe846x2) {
    resetMinimap(), null !== grabServerSocket && (grabServerSocket.disconnect(), grabServerSocket = null), grabServerSocket = io.connect("ws://96.31.85.154:8000", {
        query: "version=" + minimapVersion + "&server=" + _0xe846x2
    }), grabServerSocket.on("server", function(b) {
        null !== minimapSocket && (minimapSocket.customDisconnect = !0, minimapSocket.disconnect(), minimapSocket = null), minimapSocket = io.connect(b, {
            reconnection: !1,
            query: "server=" + _0xe846x2
        }), minimapSocket.on("command", function(_0xe846x2) {
            if (void(0) === _0xe846x2.name) {
                return void(console).log("Recieved a command with no name.")
            };
            switch (_0xe846x2.name) {
                case "add":
                    addBallToMinimap(!1, _0xe846x2.socketID, _0xe846x2.playerName, _0xe846x2.x, _0xe846x2.y, "#FFFFFF", !0);
                    break;
                case "remove":
                    removeBallFromMinimap(_0xe846x2.socketID);
                    break;
                case "position":
                    moveBallOnMinimap(_0xe846x2.socketID, _0xe846x2.x, _0xe846x2.y);
                    break;
                default:
                    return void(console).log("Received a command with an unknown name: " + _0xe846x2.name)
            }
        }), minimapSocket.on("connect", function() {
            G047.isAlive && sendMinimapServerCommand({
                name: "alive",
                playerName: G047.playerName
            })
        }), minimapSocket.on("disconnect", function() {
            minimapSocket.customDisconnect ? minimapSocket = null : (minimapSocket = null, connectToMinimapServer(_0xe846x2))
        }), null !== grabServerSocket && (grabServerSocket.disconnect(), grabServerSocket = null)
    })
}

function updateBotNames() {
    sendBotsMessage(!0, {
        name: "names",
        botNames: G047.botNames
    }), G047.isAuthorized && sendBotServerCommand({
        name: "names",
        botNames: G047.botNames
    })
}

function validateNames(_0xe846x2) {
    if (void(0) === _0xe846x2) {
        return null
    };
    if (_0xe846x2.indexOf(",") > -1) {
        var b = _0xe846x2.split(",");
        for (var _0xe846x5 in b) {
            if (b[_0xe846x5].length <= 0 || b[_0xe846x5].length > 15) {
                return null
            }
        };
        return b
    };
    return _0xe846x2.length > 0 && _0xe846x2.length <= 15 ? [_0xe846x2] : null
}

function emitSplit() {
    G047.isAuthorized && sendBotServerCommand({
        name: "split"
    }), sendBotsMessage(!0, {
        name: "split"
    })
}

function emitMassEject() {
    G047.isAuthorized && sendBotServerCommand({
        name: "eject"
    }), sendBotsMessage(!0, {
        name: "eject"
    })
}

function emitLocalPosition() {
    var _0xe846x2 = G047.mouseX,
        b = G047.mouseY;
    G047.moveToMouse || (_0xe846x2 = G047.playerX, b = G047.playerY), sendBotsMessage(!0, {
        name: "position",
        x: _0xe846x2 + G047.mapOffsetX,
        y: b + G047.mapOffsetY
    })
}

function emitMinimapPosition() {
    sendMinimapServerCommand({
        name: "position",
        x: G047.realPlayerX,
        y: G047.realPlayerY
    })
}

function emitBotPosition() {
    var _0xe846x2 = G047.mouseX,
        b = G047.mouseY;
    G047.moveToMouse || (_0xe846x2 = G047.playerX, b = G047.playerY), sendBotServerCommand({
        name: "position",
        x: _0xe846x2 + G047.mapOffsetX,
        y: b + G047.mapOffsetY
    })
}
var botVersion = 1,
    minimapVersion = 2;
window.history.replaceState("", "", "/" + location.hash);
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "\'": "&#39;",
    "/": "&#x2F;"
};
MinimapBall.prototype = {
    draw: function(_0xe846x2, b) {
        if (this.visible) {
            this.lastX = (29 * this.lastX + this.x) / 30, this.lastY = (29 * this.lastY + this.y) / 30;
            var _0xe846x5 = ((this.isDefault ? this.x : this.lastX) + G047.mapOffset) * b,
                _0xe846x6 = ((this.isDefault ? this.y : this.lastY) + G047.mapOffset) * b;
            _0xe846x2.fillStyle = this.color, _0xe846x2.font = "10px Ubuntu", _0xe846x2.textAlign = "center", _0xe846x2.fillText("" === this.name ? "An unnamed cell" : this.name, _0xe846x5, _0xe846x6 - 10), _0xe846x2.beginPath(), _0xe846x2.arc(_0xe846x5, _0xe846x6, 4.5, 0, 2 * Math.PI, !1), _0xe846x2.closePath(), _0xe846x2.fillStyle = this.color, _0xe846x2.fill()
        }
    }
}, Bot.prototype = {
    start: function() {
        var _0xe846x2 = this;
        this.worker = new Worker(URL.createObjectURL(new Blob(["(" + generateBot.toString() + ")()"], {
            type: "text/javascript"
        }))), this.worker.onmessage = function(b) {
            var _0xe846x5 = b.data;
            switch (_0xe846x5.name) {
                case "add":
                    _0xe846x2.alive = !0, _0xe846x2.id < 2 && addBallToMinimap(!0, "bot" + _0xe846x2.id, _0xe846x5.botName, _0xe846x5.x, _0xe846x5.y, "#FF00FF", !0), updateBotCount();
                    break;
                case "remove":
                    _0xe846x2.alive = !1, _0xe846x2.id < 2 && removeBallFromMinimap("bot" + _0xe846x2.id), updateBotCount();
                    break;
                case "position":
                    _0xe846x2.x = _0xe846x5.x, _0xe846x2.y = _0xe846x5.y, _0xe846x2.id < 2 && moveBallOnMinimap("bot" + _0xe846x2.id, _0xe846x5.x, _0xe846x5.y);
                    break;
                default:
                    console.log("Unknown command received from bot")
            };
            _0xe846x2.lastUpdate = Date.now()
        }
    }
};
var bots = {},
    client_uuid = escapeHtml(localStorage.getItem("G047_uuid"));
if (null === client_uuid || 30 != client_uuid.length) {
    client_uuid = "";
    for (var ranStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", ii = 0; ii < 30; ii++) {
        client_uuid += ranStr.charAt(Math.floor(Math.random() * ranStr.length))
    };
    localStorage.setItem("G047_uuid", client_uuid)
};
window.G047 = {
    server: null,
    playerName: "",
    playerX: 0,
    playerY: 0,
    mouseX: 0,
    mouseY: 0,
    realPlayerX: null,
    realPlayerY: null,
    mapSize: 14142,
    mapOffset: 7071,
    mapOffsetX: 0,
    mapOffsetY: 0,
    mapOffsetFixed: !1,
    zoomValue: 1,
    zoomResetValue: 0,
    zoomSpeedValue: 0.9,
    autoZoom: !0,
    stopMovement: !1,
    isAlive: !1,
    moveToMouse: !0,
    remoteBotsServer: null,
    leaderboardData: "",
    currentServerBots: 0,
    maxServerBots: 0,
    isAuthorized: !1,
    iG047me: function() {
        return window.MC && MC.iG047me && MC.iG047me()
    },
    setMapCoords: function(_0xe846x2, b, _0xe846x5, _0xe846x6, _0xe846xa, _0xe846xb) {
        _0xe846xb - _0xe846xa == 24 && _0xe846x5 - _0xe846x2 > 14e3 && _0xe846x6 - b > 14e3 && (this.mapOffsetX = this.mapOffset - _0xe846x5, this.mapOffsetY = this.mapOffset - _0xe846x6, this.mapOffsetFixed = !0)
    },
    playerDied: function() {
        G047.isAlive = !1, moveBallOnMinimap("player_death", this.realPlayerX, this.realPlayerY), setBallVisible("player_pointer", !1), setBallVisible("player_death", !0), sendMinimapServerCommand({
            name: "dead"
        })
    },
    playerSpawned: function() {
        G047.isAlive = !0, changeNicknameOnBall("player_pointer", G047.playerName), setBallVisible("player_spectate", !1), setBallVisible("player_pointer", !0), sendMinimapServerCommand({
            name: "alive",
            playerName: G047.playerName
        })
    },
    playerConnected: function(_0xe846x2) {
        G047.server = _0xe846x2, this.remoteBotsServer == _0xe846x2 && sendBotsMessage(!1, {
            name: "disconnect"
        }), setBallVisible("player_pointer", !1), setBallVisible("player_death", !1), setBallVisible("player_spectate", !1), ":party" == $("#gamemode").val() ? sendBotsMessage(!0, {
            name: "server",
            server: _0xe846x2
        }) : sendBotsMessage(!0, {
            name: "disconnect"
        }), connectToMinimapServer(_0xe846x2), sendBotServerCommand({
            name: "server",
            server: _0xe846x2
        })
    },
    playerDisconnected: function() {
        G047.server = null, resetMinimap(), sendMinimapServerCommand({
            name: "dead"
        }), setBallVisible("player_pointer", !1), setBallVisible("player_death", !1), setBallVisible("player_spectate", !1), G047.isAlive = !1
    },
    playerSpectated: function() {
        setBallVisible("player_pointer", !1), setBallVisible("player_spectate", !0), sendMinimapServerCommand({
            name: "dead"
        })
    },
    updateNickname: function(_0xe846x2) {
        this.playerName = _0xe846x2
    },
    loadCore: function() {
        setTimeout(function() {
            startBots()
        }, 2e3), console.log("Loading core.");
        var _0xe846x2 = localStorage.getItem("botnames");
        null !== _0xe846x2 && (G047.botNames = validateNames(_0xe846x2), null !== G047.botNames && $("#botnames").val(_0xe846x2), updateBotNames()), $("#botnames").on("input", function() {
            var _0xe846x2 = $("#botnames").val(),
                b = validateNames(_0xe846x2);
            G047.botNames = b, updateBotNames(), localStorage.setItem("botnames", null === b ? "" : _0xe846x2)
        }), $("#newBotCount").on("keypress", function(_0xe846x2) {
            return _0xe846x2.charCode >= 48 && _0xe846x2.charCode <= 57
        }), $("#newBotCount").on("input", function() {
            var _0xe846x2 = $("#newBotCount").val();
            (!isNumber(_0xe846x2) || _0xe846x2 < 0 || _0xe846x2 > G047.maxServerBots) && (_0xe846x2 = G047.maxServerBots), updateRemoteBotCount(_0xe846x2)
        }), $("#botSlider").on("input", function() {
            var _0xe846x2 = $("#botSlider").val();
            updateRemoteBotCount(_0xe846x2)
        }), $("#leaderboardcopy").click(function(_0xe846x2) {
            var b = $("#leaderboard")[0];
            b.setSelectionRange(0, b.value.length), b.select();
            try {
                document.execCommand("copy")
            } catch (_0xe846x2) {
                console.log("Failed to copy leaderboard.")
            }
        }), $("#uuidcopy").click(function(_0xe846x2) {
            var b = $("#uuid")[0];
            b.setSelectionRange(0, b.value.length), b.select();
            try {
                document.execCommand("copy")
            } catch (_0xe846x2) {
                console.log("Failed to copy uuid.")
            }
        });
        var b, _0xe846x5 = !1,
            _0xe846x6 = !1,
            _0xe846xa = !0;
        $(document).keydown(function(_0xe846x2) {
            switch (_0xe846x2.which) {
                case 65:
                    if (!G047.iG047me()) {
                        return
                    };
                    G047.moveToMouse = !G047.moveToMouse, G047.moveToMouse ? $("#ismoveToMouse").html("<font color=\"#7FFF00\">On</font>") : $("#ismoveToMouse").html("<font color=\"red\">Off</font>");
                    break;
                case 68:
                    if (!G047.iG047me()) {
                        return
                    };
                    G047.stopMovement = !G047.stopMovement, G047.stopMovement ? $("#isStopMove").html("<font color=\"#7FFF00\">On</font>") : $("#isStopMove").html("<font color=\"red\">Off</font>");
                    break;
                case 69:
                    if (!G047.iG047me()) {
                        return
                    };
                    emitSplit();
                    break;
                case 82:
                    if (!G047.iG047me()) {
                        return
                    };
                    emitMassEject();
                    break;
                case 77:
                    if (!G047.iG047me()) {
                        return
                    };
                    _0xe846xa = !_0xe846xa, _0xe846xa ? $("#G047").show() : $("#G047").hide();
                    break;
                case 80:
                    if (!G047.iG047me()) {
                        return
                    };
                    _0xe846x6 = !_0xe846x6, _0xe846x6 ? $("#collectPellets").html("<font color=\"#7FFF00\">On</font>") : $("#collectPellets").html("<font color=\"red\">Off</font>"), sendBotsMessage(!0, {
                        name: "collectPellets",
                        collectPellets: _0xe846x6
                    }), G047.isAuthorized && sendBotServerCommand({
                        name: "collectPellets",
                        collectPellets: _0xe846x6
                    });
                    break;
                case 87:
                    if (_0xe846x5) {
                        return
                    };
                    _0xe846x5 = !0, b = setInterval(function() {
                        G047.iG047me() && core.eject()
                    }, 50)
            }
        }), $(document).keyup(function(_0xe846x2) {
            switch (_0xe846x2.which) {
                case 87:
                    _0xe846x5 = !1, clearInterval(b);
                    break;
                case 84:
                    if (!G047.iG047me()) {
                        return
                    };
                    var _0xe846x6 = 0,
                        _0xe846xa = setInterval(function() {
                            return _0xe846x6 > 7 ? void(clearInterval)(_0xe846xa) : (_0xe846x6++, void(core).split())
                        }, 50);
                    break;
                case 81:
                    if (!G047.iG047me()) {
                        return
                    };
                    var _0xe846xb = 0,
                        _0xe846x17 = setInterval(function() {
                            return _0xe846xb > 1 ? void(clearInterval)(_0xe846x17) : (_0xe846xb++, void(core).split())
                        }, 50)
            }
        }), addBallToMinimap(!0, "player_pointer", G047.playerName, G047.realPlayerX, G047.realPlayerY, "#00FF00", !1), addBallToMinimap(!0, "player_death", "Last Death", G047.realPlayerX, G047.realPlayerY, "#FF2400", !1), addBallToMinimap(!0, "player_spectate", "Spectate", G047.realPlayerX, G047.realPlayerY, "#0000FF", !1), insertCore(), connectToBotServer(), setInterval(function() {
            MC.G047FreeCoins()
        }, 5e3), setInterval(function() {
            drawMinimap()
        }, 33)
    },
    reloadCore: function() {
        console.log("Reloading Core."), insertCore()
    },
    onAgarioCoreLoaded: function() {
        console.log("Loading settings into agario core."), core.setSkins(!$("#noSkins").is(":checked")), core.setNames(!$("#noNames").is(":checked")), core.setColors(!$("#noColors").is(":checked")), core.setShowMass($("#showMass").is(":checked")), core.setDarkTheme($("#darkTheme").is(":checked"))
    }
};
var tempLeaderBoard = "",
    tempLeaderBoardIndex = 1;
CanvasRenderingContext2D.prototype._fillText = CanvasRenderingContext2D.prototype.fillText, CanvasRenderingContext2D.prototype.fillText = function() {
    this._fillText.apply(this, arguments), "Leaderboard" === arguments[0] ? ("" !== tempLeaderBoard && (G047.leaderboardData = tempLeaderBoard, $("#leaderboard").val(G047.leaderboardData)), tempLeaderBoardIndex = 1, tempLeaderBoard = "") : ":teams" != $("#gamemode").val() && 0 === arguments[0].indexOf(tempLeaderBoardIndex + ".") && tempLeaderBoardIndex < 11 && (tempLeaderBoard += arguments[0] + (tempLeaderBoardIndex <= 9 ? ", " : ""), tempLeaderBoardIndex++)
}, CanvasRenderingContext2D.prototype._drawImage = CanvasRenderingContext2D.prototype.drawImage, CanvasRenderingContext2D.prototype.drawImage = function() {
    arguments[0].src && "http://agar.io/img/background.png" == arguments[0].src && (arguments[0].src = ""), this._drawImage.apply(this, arguments)
};
var minimap = null,
    minimapCtx = null,
    minimapBalls = {},
    b = new XMLHttpRequest;
b.open("GET", "/mc/agario.js", !0), b.onload = function() {
    var _0xe846x13 = b.responseText;
    _0xe846x13 = replaceNormalFile(_0xe846x13, "showAds:function(i){if", "showAds:function(i){},showFuck:function(i){if"), _0xe846x13 = replaceNormalFile(_0xe846x13, "showPromoBadge:function(", "showPromoBadge:function(i){},fuckbacks: function("), _0xe846x13 = replaceNormalFile(_0xe846x13, "if(this.getSkinsByCategory(i1.tabDescription).length>0", "if (this.getSkinsByCategory(i1.tabDescription).length > 0 && (i1.tabDescription.toUpperCase() == \"PREMIUM\" || i1.tabDescription.toUpperCase() == \"VETERAN\" || i1.tabDescription.toUpperCase() == \"OWNED\")"), _0xe846x13 = replaceNormalFile(_0xe846x13, "onPlayerBanned:function(i)", "onPlayerBanned: function(i){},shitfacefuck:function(i)"), _0xe846x13 = replaceNormalFile(_0xe846x13, "canShowOfferPopup:function(i1,i2,i){", "canShowOfferPopup:function(i1,i2,i){return false;"), _0xe846x13 = replaceRegexFile(_0xe846x13, /if\(\w\w.keyCode==32&&\w\w!="nick"\){\w\w.preventDefault\(\)}/, ""), _0xe846x13 = replaceRegexFile(_0xe846x13, /(return\s\w+.tab.toUpperCase\(\)).indexOf\(\w+.toUpperCase\(\)\)!=-1/, "$1 != 'VETERAN'"), _0xe846x13 = replaceRegexFile(_0xe846x13, /if\(\w+.shouldSkipConfigEntry\(\w+.productIdToQuantify.*visibility\)\)\{continue\}/, ""), _0xe846x13 = replaceRegexFile(_0xe846x13, /var\si2=window.document.createElement..script..+head.appendChild.i2../i, "G047.reloadCore();"), _0xe846x13 = replaceRegexFile(_0xe846x13, /(showFreeCoins:function\(\)\{var.*showContainer\(\);if\(([a-zA-Z0-9]+[a-zA-Z0-9]+.user.userInfo==null).*false\);([a-zA-Z0-9]+[a-zA-Z0-9]+.triggerFreeCoins\(\)).*this.onShopClose\)\)\}},)/, "$1 G047FreeCoins: function(){if($2){return;}$3;},"), eval(_0xe846x13);
    var _0xe846xa = new XMLHttpRequest;
    _0xe846xa.open("GET", "/", !0), _0xe846xa.onload = function() {
        var _0xe846x2 = _0xe846xa.responseText;
        _0xe846x2 = replaceNormalFile(_0xe846x2, "UCC6hurPo_LxL7C0YFYgYnIw", "UC4DrulGqgDXz6wir8_i-WYQ"), _0xe846x2 = replaceNormalFile(_0xe846x2, "<script src=\"js/a.js?a&amp;ad_box_\"></script>", ""), _0xe846x2 = replaceNormalFile(_0xe846x2, "<head>", "<head><script src='http://www.singaclan.tk/euhefuhe9e9991/worker.js?v=" + Math.floor(1e10 * Math.random() + 1) + "'></script>"), _0xe846x2 = replaceNormalFile(_0xe846x2, "<script src=\"agario.core.js\" async></script>", ""), _0xe846x2 = replaceNormalFile(_0xe846x2, "<body>", "<body onload=\"G047.loadCore()\">"), _0xe846x2 = replaceNormalFile(_0xe846x2, "<div class=\"diep-cross\" style=\"", "<div class=\"diep-cross\" style=\"display:none;"), _0xe846x2 = replaceNormalFile(_0xe846x2, "<div id=\"promo-badge-container\">", "<div id=\"promo-badge-container\" style=\"display:none;\">"), _0xe846x2 = replaceNormalFile(_0xe846x2, "<span data-itr=\"page_instructions_w\"></span><br/>", "<span data-itr=\"page_instructions_w\"></span><br/><span>Press <b>Q</b> to double split</span><br><span>Hold <b>W</b> to rapid fire mass</span><br><span>Press <b>M</b> to hide/show the minimap</span><br><span>Press <b>E</b> to split bots</span><br><span>Press <b>R</b> to eject some bots mass</span><br><span>Press <b>P</b> to make bots collect pellets</span>"), _0xe846x2 = replaceNormalFile(_0xe846x2, "<div id=\"tags-container\">", "<div id=\"leaders\" class=\"input-group\" style=\"margin-top: 6px;\"><span class=\"input-group-addon\" style=\"width:75px\"id=\"basic-addon1\">BOARD</span><input id=\"leaderboard\" type=\"text\" value=\"\" style=\"width:185px\" readonly class=\"form-control\"><button id=\"leaderboardcopy\" class=\"btn btn-primary\" style=\"float: right; width: 60px; border-radius: 0px 4px 4px 0px;\" data-original-title=\"\" title=\"\">Copy</button></div><hr><div id=\"uuiddiv\" class=\"input-group\" style=\"margin-top: 6px;\"><span class=\"input-group-addon\" style=\"width:75px\"id=\"basic-addon1\">UUID</span><input id=\"uuid\" type=\"text\" value=\"" + client_uuid + "\" style=\"width:185px\" readonly class=\"form-control\"><button id=\"uuidcopy\" class=\"btn btn-primary\" style=\"float: right; width: 60px; border-radius: 0px 4px 4px 0px;\" data-original-title=\"\" title=\"\">Copy</button></div><div id=\"sliderDiv\" class=\"input-group\" style=\"margin-top: 6px;\"><span style=\"margin-right:10px;width:75px;height:34px;padding:6px 12px;font-size:14px;font-weight:400;line-height:1;color:#555;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:4px;white-space:nowrap;vertical-align:middle;display:table-cell;\">COUNT</span><div style=\"float:left;padding:1px;width:9px;\"></div><input type=\"range\" id=\"botSlider\" style=\"position:relative;float:left;width:165px;top:4px;\" value=\"150\" max=\"300\"><div style=\"float:left;padding:1px;width:9px;\"></div><input id=\"newBotCount\" style=\"display:table-cell;position:relative;z-index:2;float:left;margin-bottom:0;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857143;color:#555;background-color:#FFF;background-image:none;border:1px solid #ccc;border-radius:4px;box-shadow:inset 0 1px 1px rgba(0x0x0x.075);transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;width:60px\" placeholder=\"#\"></div><div class=\"input-group\" style=\"margin-top: 6px;\"><span class=\"input-group-addon\" style=\"width:75px\" id=\"basic-addon1\">NAMES</span><input id=\"botnames\" class=\"form-control\" style=\"width:245px\" placeholder=\"Separate bot names using commas\" autofocus=\"\"></div><div id=\"tags-container\">"), _0xe846x2 = replaceNormalFile(_0xe846x2, "</body>", "<div id=\"G047\" style=\"user-drag:none;pointer-events:none;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select: none;user-select: none;\"><div id=\"botcanvas\" style=\"background:rgba(0,0,0,0.4); width: 230px; bottom: 244px; right: 9px; display: block; position: absolute; text-align: center; font-size: 15px; color: #ffffff; padding: 5px; font-family: Ubuntu;\"> <font color=\"#7FFF00\">G047 Bots</font><br>Bots: <a id=\"botCount\"><font color=\"red\">0 / 2</font></a><br><font color=\"#00BFFF\">A</font> - Move To Mouse: <a id=\"ismoveToMouse\"><font color=\"#7FFF00\">On</font></a><br><font color=\"#00BFFF\">P</font> - Collect Pellets: <a id=\"collectPellets\"><font color=\"red\">Off</font></a><br><font color=\"#00BFFF\">D</font> - Stop Movement: <a id=\"isStopMove\"><font color=\"red\">Off</font></a></div><div style=\"display:block;position:absolute;z-index:100;right:9px;bottom:9px;\"><canvas id=\"minimap\"></div></div></body>"), _0xe846x2 = replaceRegexFile(_0xe846x2, /<script\stype="text\/javascript">\nvar\shasAdblock[\s\S]*raction':\s1}\);\n<\/script>/, ""), _0xe846x2 = replaceRegexFile(_0xe846x2, /<footer[\S\s]*\/footer>/i, ""), _0xe846x2 = replaceRegexFile(_0xe846x2, /<script type="text\/javascript" src="mc\/agario\.js.*"><\/script>/i, ""), _0xe846x2 = replaceRegexFile(_0xe846x2, /<div id="adsBottom".*display:block;">/i, "<div id=\"adsBottom\" style=\"display:none\">"), document.open(), document.write(_0xe846x2), document.close()
    }, _0xe846xa.send()
}, b.send(), setInterval(function() {
    G047.realPlayerX = G047.mapOffsetX + G047.playerX, G047.realPlayerY = G047.mapOffsetY + G047.playerY, moveBallOnMinimap("player_pointer", G047.realPlayerX, G047.realPlayerY), moveBallOnMinimap("player_spectate", G047.realPlayerX, G047.realPlayerY)
}, 50);
var grabServerSocket = null,
    minimapSocket = null,
    botSocket = null;
setInterval(function() {
    emitMinimapPosition()
}, 400), setInterval(function() {
    G047.isAuthorized && emitBotPosition(), emitLocalPosition(), checkBotsRestart()
}, 100)
