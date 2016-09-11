function escapeHtml(a) {
    return String(a).replace(/[&<>"'\/]/g, function(a) {
        return entityMap[a]
    })
}

function updateBotCount(a, b) {
	$("#botCount").html('<font color="#7FFF00">' + 300 + " / " + 300 + "</font>")
}

function startLocalBots() {
    for (var a = 0; a < 0; a++) G047.localBotsAlive[a] = !1, G047.localBots[a] = new Worker(URL.createObjectURL(new Blob(["(" + generateBotFunction() + ")()"], {
        type: "text/javascript"
    }))), G047.localBots[a].onmessage = function(a) {
        var b = a.data;
        switch (b.name) {
            case "add":
                updateBotCount(b.botID, !0), addBallToMinimap(!0, "bot" + b.botID, b.botName, b.x, b.y, "#FF00FF", !0);
                break;
            case "remove":
                updateBotCount(b.botID, !1), removeBallFromMinimap("bot" + b.botID);
                break;
            case "position":
                moveBallOnMinimap("bot" + b.botID, b.x, b.y);
                break;
            default:
                console.log("Unknown command received from bot")
        }
    }, G047.localBots[a].postMessage({
        name: "botID",
        botID: a
    });
    updateBotNames()
}

function startRemoteBots() {
    for (var a = 0; a < 3; a++) G047.remoteBots[a] = new Worker(URL.createObjectURL(new Blob(["(" + generateBotFunction() + ")()"], {
        type: "text/javascript"
    })))
}

function sendLocalBotsMessage(a) {
    for (i in G047.localBots) G047.localBots[i].postMessage(a)
}

function sendRemoteBotsMessage(a) {
    for (i in G047.remoteBots) G047.remoteBots[i].postMessage(a)
}

function insertCore() {
    var f = new XMLHttpRequest;
    f.open("GET", "/agario.core.js", !0), f.onload = function() {
        var script = f.responseText;
        script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerSpawn)", "G047.playerSpawned();if(h.MC&&h.MC.onPlayerSpawn)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerDeath)", "G047.playerDied();if(h.MC&&h.MC.onPlayerDeath)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onAgarioCoreLoaded)", "G047.onAgarioCoreLoaded();if(h.MC&&h.MC.onAgarioCoreLoaded)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onDisconnect)", "G047.playerDisconnected();if(h.MC&&h.MC.onDisconnect)"), script = replaceNormalFile(script, "connect:function(a){", "connect:function(a){G047.playerConnected(a);"), script = replaceNormalFile(script, "sendSpectate:function(){", "sendSpectate:function(){G047.playerSpectated();"), script = replaceNormalFile(script, "sendNick:function(a){", "sendNick:function(a){G047.updateNickname(a);"), script = replaceNormalFile(script, "setTarget:function(a,b){", "setTarget:function(a,b){if(G047.stopMovement){a = $('#canvas').width() / 2; b = $('#canvas').height() / 2;}"), script = replaceRegexFile(script, /(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);)/i, "$1 if(G047.setMapCoords){G047.setMapCoords($3,$5,$7,$9,$2,$8);}"), script = replaceRegexFile(script, /([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, "$1 G047.playerX=$4; G047.playerY=$5;"), script = replaceRegexFile(script, /if\((\+\w\[\w>>3\])<1\.0\){/i, "if($1 < G047.zoomResetValue){"), script = replaceRegexFile(script, /(if\(\w<=)(20\.0)(\){\w=\w;return})(if\(!\w\){if\(\(\w\[\d+\]\|0\)!=\(\w\[\d+\]\|0\)\){\w=\w;return}if\(\(\w\[\w\+\d+>>0\]\|0\)!=0\?\(\w\[\w>>0\]\|0\)==0:0\){\w=\w;return}})/i, "$140.0$3"), script = replaceRegexFile(script, /(\w)(=\+\w\[\w>>3\]\*\+\w\()(.\d)(,\+\w\);)/i, "$1$2 (G047.zoomSpeedValue||0.9) $4 G047.zoomValue=$1;"), script = replaceRegexFile(script, /(\w=\w\[\w>>2\]\|0;)((\w\[\w>>3\])=(\w);)(\w\[\w>>0\]=a\[\w>>0\];)/i, "$1 if(!G047.autoZoom){$3 = G047.zoomValue;}else{$2}$5"), script = replaceRegexFile(script, /((\w)=(\+\(\(\w\[\w\+\d+>>\d.*;)(\w)=(\+\(\(\w\[.*\/2\|\d\)\|0\)\/\w\+\s\+\w\[\w\+\d+>>3\];).*\4=\4<\w\?\w:\w;)/, "G047.mouseX = $3 G047.mouseY = $5 $1"), eval(script)
    }, f.send()
}

function MinimapBall(a, b, c, d, e, f) {
    this.isDefault = a, this.name = b, this.x = c, this.y = d, this.lastX = c, this.lastY = d, this.color = e, this.visible = f
}

function drawMinimap() {
    if (null != miniMap ? minimapCtx.clearRect(0, 0, 200, 200) : (miniMap = document.getElementById("minimap"), minimapCtx = miniMap.getContext("2d"), miniMap.width = 400, miniMap.height = 400, miniMap.style.width = "200px", miniMap.style.height = "200px", minimapCtx.scale(2, 2)), G047.mapOffsetFixed && G047.drawMinimap) {
        minimapCtx.globalAlpha = .4, minimapCtx.fillStyle = "#000000", minimapCtx.fillRect(0, 0, miniMap.width, miniMap.height);
        var a = 200 / G047.mapSize,
            b = 200 / G047.mapSize;
        minimapCtx.globalAlpha = 1;
        for (ball in minimapBalls) minimapBalls[ball].draw(minimapCtx, a, b)
    }
}

function resetMinimap() {
    for (ball in minimapBalls) minimapBalls[ball].isDefault || delete minimapBalls[ball]
}

function addBallToMinimap(a, b, c, d, e, f, g) {
    minimapBalls[b] = new MinimapBall(a, c, d, e, f, g)
}

function removeBallFromMinimap(a) {
    minimapBalls[a] && delete minimapBalls[a]
}

function moveBallOnMinimap(a, b, c) {
    minimapBalls[a] && (minimapBalls[a].x = b, minimapBalls[a].y = c)
}

function setBallVisible(a, b) {
    minimapBalls[a] && (minimapBalls[a].visible = b)
}

function changeNicknameOnBall(a, b) {
    minimapBalls[a] && (minimapBalls[a].name = b)
}

function replaceRegexFile(a, b, c) {
    var d = new RegExp(b);
    return d.test(a) ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a
}

function replaceNormalFile(a, b, c) {
    return a.indexOf(b) != -1 ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a
}

function sendCommand(a) {
    null != socket && socket.connected && socket.emit("command", a)
}

function connectToG047Server() {
    socket = io.connect("ws://localhost:8002", {
        reconnection: true,
        query: "key=" + client_uuid
    }), socket.on("command", function(a) {
        if (void 0 === a.name) return void console.log("Recieved a command with no name.");
        switch (a.name) {
            case "force-update":
                resetMinimap(), transmit_current_server(!0), G047.isAlive && sendCommand({
                    name: "alive",
                    playerName: G047.playerName
                });
                break;
            case "add":
                addBallToMinimap(!1, a.socketID, a.playerName, a.x, a.y, "#FFFFFF", !0);
                break;
            case "remove":
                removeBallFromMinimap(a.socketID);
                break;
            case "position":
                moveBallOnMinimap(a.socketID, a.x, a.y);
                break;
            case "count":
                G047.serverBots = a.count;
                break;
            case "auth":
                G047.isAuthorized = a.auth, console.log("Your client is authorized for use of more bots.");
                break;
            default:
                return void console.log("Received a command with an unknown name: " + a.name)
        }
    }), socket.on("bots", function(a) {
        "server" == a.name && (G047.remoteBotsServer = a.server), sendRemoteBotsMessage(a)
    }), socket.on("disconnect", function() {
        resetMinimap(), sendRemoteBotsMessage({
            name: "disconnect"
        })
    })
}

function updateBotNames() {
    sendLocalBotsMessage({
        name: "names",
        botNames: G047.botNames
    }), G047.isAuthorized && sendCommand({
        name: "names",
        botNames: G047.botNames
    })
}

function validateNames(a) {
    if (void 0 === a) return null;
    if (a.indexOf(",") > -1) {
        var b = a.split(",");
        for (name in b)
            if (b[name].length <= 0 || b[name].length > 15) return null;
        return b
    }
    return a.length > 0 && a.length <= 15 ? [a] : null
}

function emitSplit() {
    G047.isAuthorized && sendCommand({
        name: "split"
    }), sendLocalBotsMessage({
        name: "split"
    })
}

function emitMassEject() {
    G047.isAuthorized && sendCommand({
        name: "eject"
    }), sendLocalBotsMessage({
        name: "eject"
    })
}

function emitLocalPosition() {
    var a = G047.mouseX,
        b = G047.mouseY;
    G047.moveToMouse || (a = G047.playerX, b = G047.playerY), sendLocalBotsMessage({
        name: "position",
        x: a + G047.mapOffsetX,
        y: b + G047.mapOffsetY
    })
}

function emitPosition() {
    var a = G047.mouseX,
        b = G047.mouseY;
    G047.moveToMouse || (a = G047.playerX, b = G047.playerY), sendCommand({
        name: "position",
        x: G047.realPlayerX,
        y: G047.realPlayerY,
        botX: a + G047.mapOffsetX,
        botY: b + G047.mapOffsetY
    })
}

function transmit_current_server(a) {
    (a || last_transmited_game_server != G047.server) && (last_transmited_game_server = G047.server, sendCommand({
        name: "server",
        server: last_transmited_game_server
    }))
}

function generateBotFunction() {
    return function() {
        function replaceRegexFile(a, b, c) {
            var d = new RegExp(b);
            return d.test(a) ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a
        }

        function replaceNormalFile(a, b, c) {
            return a.indexOf(b) != -1 ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a
        }

        function getRandomInt(a, b) {
            return Math.floor(Math.random() * (b - a + 1)) + a
        }

        function getBotCore() {
            var e = new XMLHttpRequest;
            e.open("GET", "http://agar.io/agario.core.js", !0), e.onload = function() {
                var script = e.responseText;
                script = replaceRegexFile(script, /\w+\.location\.hostname/g, '"agar.io"'), script = replaceNormalFile(script, "window", "self"), script = replaceNormalFile(script, "c.setStatus=function(a){console.log(a)};", "c.setStatus=function(a){};"), script = replaceNormalFile(script, 'console.log("postRun");', ""), script = replaceRegexFile(script, /(\w)=\+\(\(\w\[\w\+\d+>>\d.*;(\w)=\+\(\(\w\[.*\/2\|\d\)\|0\)\/\w\+\s\+\w\[\w\+\d+>>3\];/, "$1 = G047.newX; $2 = G047.newY;"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerSpawn)", "G047.playerSpawned();if(h.MC&&h.MC.onPlayerSpawn)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerDeath)", "G047.playerDied();if(h.MC&&h.MC.onPlayerDeath)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onAgarioCoreLoaded)", "G047.onAgarioCoreLoaded();if(h.MC&&h.MC.onAgarioCoreLoaded)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onDisconnect)", "G047.playerDisconnected();if(h.MC&&h.MC.onDisconnect)"), script = replaceNormalFile(script, "h.MC&&h.MC.corePendingReload", "G047.reloadCore();h.MC&&h.MC.corePendingReload"), script = replaceRegexFile(script, /(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);)/i, "$1 if(G047.setMapCoords){G047.setMapCoords($3,$5,$7,$9,$2,$8);}"), script = replaceRegexFile(script, /([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, "$1 G047.playerX=$4; G047.playerY=$5; G047.setPath();"), script = replaceRegexFile(script, /(do\sif\(\w\){)((\w)=!\(\+\w\[\w>>2]<=20.0\);)(.+,\w\[\w>>2\]\|0,(\+\(\+\w\[\w>>2\]\)),(\+\(\+\w\[\w>>2\]\)),\+\((\+\w\[\w>>2\]))/, "$1var cellSize=$7;$2if(!$3){G047.recordPellet($5,$6,cellSize);}$4"), eval(script)
            }, e.send(null)
        }
        self.innerWidth = 1, self.innerHeight = 1;
        const window = {},
            elementMock = {
                getContext: function() {
                    return {
                        canvas: {
                            width: 1,
                            height: 1
                        },
                        clearRect: function() {},
                        save: function() {},
                        translate: function() {},
                        scale: function() {},
                        stroke: function() {},
                        arc: function() {},
                        fill: function() {},
                        moveTo: function() {},
                        lineTo: function() {},
                        closePath: function() {},
                        beginPath: function() {},
                        restore: function() {},
                        fillRect: function() {},
                        measureText: function() {
                            return {}
                        },
                        strokeText: function() {},
                        fillText: function() {},
                        drawImage: function() {}
                    }
                },
                innerText: "",
                div: {
                    appendChild: function() {}
                },
                appendChild: function() {},
                style: {}
            },
            document = {
                getElementById: function() {
                    return elementMock
                },
                createElement: function(a) {
                    return elementMock
                },
                body: {
                    firstChild: {},
                    insertBefore: function() {}
                }
            },
            Image = function() {};
        self.G047 = {
            server: null,
            botID: 0,
            botName: "G047",
            playerX: 0,
            playerY: 0,
            newX: 0,
            newY: 0,
            realPlayerX: null,
            realPlayerY: null,
            mapOffset: 7071,
            mapOffsetX: 0,
            mapOffsetY: 0,
            mapOffsetFixed: !1,
            collectPellets: !1,
            pelletTargetX: 99999,
            pelletTargetY: 99999,
            pellets: [],
            recordPellet: function(a, b, c) {
                this.pellets.push({
                    x: a,
                    y: b,
                    size: c
                })
            },
            setMapCoords: function(a, b, c, d, e, f) {
                f - e == 24 && c - a > 14e3 && d - b > 14e3 && (this.mapOffsetX = this.mapOffset - c, this.mapOffsetY = this.mapOffset - d, this.mapOffsetFixed = !0)
            },
            playerDied: function() {
                postMessage({
                    name: "remove",
                    botID: G047.botID
                })
            },
            playerSpawned: function() {
                postMessage({
                    name: "add",
                    botID: G047.botID,
                    botName: G047.botName,
                    x: G047.realPlayerX,
                    y: G047.realPlayerY
                })
            },
            playerDisconnected: function() {
                postMessage({
                    name: "remove",
                    botID: G047.botID
                }), self.core && core.connect(G047.server)
            },
            reloadCore: function() {
                self.core && self.core.destroy(), getBotCore()
            },
            onAgarioCoreLoaded: function() {
                null != G047.server && self.core && core.connect(G047.server)
            },
            setPath: function() {
                for (var a = -1, b = 0, c = 0; c < this.pellets.length; c++) {
                    var d = this.getDistanceBetweenPositions(this.pellets[c].x, this.pellets[c].y, this.playerX, this.playerY);
                    a != -1 && d > b || (a = c, b = d)
                }
                a == -1 ? (this.pelletTargetX = 99999, this.pelletTargetY = 99999) : (this.pelletTargetX = this.pellets[a].x, this.pelletTargetY = this.pellets[a].y), this.pellets = []
            },
            getDistanceBetweenPositions: function(a, b, c, d) {
                return Math.sqrt(Math.pow(c - a, 2) + Math.pow(b - d, 2))
            }
        }, onmessage = function(a) {
            var b = a.data;
            switch (b.name) {
                case "botID":
                    G047.botID = b.botID;
                    break;
                case "server":
                    G047.server = b.server, self.core && core.connect(b.server);
                    break;
                case "position":
                    G047.collectPellets && 99999 != G047.pelletTargetX && 99999 != G047.pelletTargetY ? (G047.newX = G047.pelletTargetX, G047.newY = G047.pelletTargetY) : (G047.newX = b.x - G047.mapOffsetX, G047.newY = b.y - G047.mapOffsetY);
                    break;
                case "split":
                    core.split();
                    break;
                case "eject":
                    core.eject();
                    break;
                case "names":
                    if (null == b.botNames) {
                        G047.botName = "G047Clan";
                        break
                    }
                    G047.botName = b.botNames[getRandomInt(0, b.botNames.length - 1)];
                    break;
                case "disconnect":
                    G047.server = null, self.core && core.disconnect();
                    break;
                case "collectPellets":
                    G047.collectPellets = b.collectPellets;
                    break;
                default:
                    console.log("Unknown message received.")
            }
        }, setInterval(function() {
            G047.realPlayerX = G047.mapOffsetX + G047.playerX, G047.realPlayerY = G047.mapOffsetY + G047.playerY, postMessage({
                botID: G047.botID,
                name: "position",
                x: G047.realPlayerX,
                y: G047.realPlayerY
            }), self.core && core.sendNick(G047.botName)
        }, 100), getBotCore()
    }.toString()
}
window.history.replaceState("", "", "/" + location.hash), window.getTextWidth = function(a, b) {
    var c = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas")),
        d = c.getContext("2d");
    d.font = b;
    var e = d.measureText(a);
    return e.width
};
var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    },
    client_uuid = escapeHtml(localStorage.getItem("G047_uuid"));
if (null === client_uuid || 15 != client_uuid.length) {
    client_uuid = "";
    for (var ranStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", ii = 0; ii < 15; ii++) client_uuid += ranStr.charAt(Math.floor(Math.random() * ranStr.length));
    localStorage.setItem("G047_uuid", client_uuid)
}
client_uuid='G047'; //Change if needed
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
    zoomSpeedValue: .9,
    autoZoom: !0,
    stopMovement: !1,
    isAlive: !1,
    moveToMouse: !0,
    localBots: {},
    localBotsAlive: {},
    remoteBotsServer: null,
    remoteBots: {},
    remoteBotsAlive: {},
    leaderboardData: "",
    serverBots: 0,
    isAuthorized: !1,
    drawMinimap: !0,
    setMapCoords: function(a, b, c, d, e, f) {
        f - e == 24 && c - a > 14e3 && d - b > 14e3 && (this.mapOffsetX = this.mapOffset - c, this.mapOffsetY = this.mapOffset - d, this.mapOffsetFixed = !0)
    },
    playerDied: function() {
        G047.isAlive = !1, moveBallOnMinimap("player_death", this.realPlayerX, this.realPlayerY), setBallVisible("player_pointer", !1), setBallVisible("player_death", !0), sendCommand({
            name: "dead"
        })
    },
    playerSpawned: function() {
        G047.isAlive = !0, changeNicknameOnBall("player_pointer", G047.playerName), setBallVisible("player_spectate", !1), setBallVisible("player_pointer", !0), sendCommand({
            name: "alive",
            playerName: G047.playerName
        })
    },
    playerConnected: function(a) {
        resetMinimap(), null != this.remoteBotsServer && this.remoteBotsServer == a && sendRemoteBotsMessage({
            name: "disconnect"
        }), G047.server = a, console.log("Connecting to: " + a), setBallVisible("player_pointer", !1), setBallVisible("player_death", !1), setBallVisible("player_spectate", !1), sendLocalBotsMessage({
            name: "server",
            server: a
        })
    },
    playerDisconnected: function() {
        resetMinimap(), sendCommand({
            name: "dead"
        }), setBallVisible("player_pointer", !1), setBallVisible("player_death", !1), setBallVisible("player_spectate", !1), G047.server = null, G047.isAlive = !1
    },
    playerSpectated: function() {
        setBallVisible("player_pointer", !1), setBallVisible("player_spectate", !0), sendCommand({
            name: "dead"
        })
    },
    updateNickname: function(a) {
        this.playerName = a
    },
    loadCore: function() {
        setTimeout(function() {
            startLocalBots(), startRemoteBots()
        }, 2e3), console.log("Loading core.");
        var b = (document.getElementById("canvas"), localStorage.getItem("botnames"));
        null !== b && (G047.botNames = validateNames(b), null !== G047.botNames && $("#botnames").val(b), updateBotNames()), $("#botnames").on("input", function() {
            var a = $("#botnames").val(),
                b = validateNames(a);
            G047.botNames = b, updateBotNames(), null !== b && localStorage.setItem("botnames", a)
        }), $("#leaderboardcopy").click(function(a) {
            var b = $("#leaderboard")[0];
            b.setSelectionRange(0, b.value.length), b.select();
            try {
                document.execCommand("copy")
            } catch (a) {
                console.log("Failed to copy leaderboard.")
            }
        }), $("#uuidcopy").click(function(a) {
            var b = $("#uuid")[0];
            b.setSelectionRange(0, b.value.length), b.select();
            try {
                document.execCommand("copy")
            } catch (a) {
                console.log("Failed to copy uuid.")
            }
        });
        var c, d = !1,
            f = !1;
        $(document).keydown(function(a) {
            switch (a.which) {
                case 65:
                    G047.moveToMouse = !G047.moveToMouse, G047.moveToMouse ? $("#ismoveToMouse").html("<font color='#7FFF00'>On</font>") : $("#ismoveToMouse").html("<font color='red'>Off</font>");
                    break;
                case 68:
                    G047.stopMovement = !G047.stopMovement, G047.stopMovement ? $("#isStopMove").html("<font color='#7FFF00'>On</font>") : $("#isStopMove").html("<font color='red'>Off</font>");
                    break;
                case 69:
                    emitSplit();
                    break;
                case 82:
                    emitMassEject();
                    break;
                case 77:
                    G047.drawMinimap = !G047.drawMinimap, G047.drawMinimap ? $("#botcanvas").show() : $("#botcanvas").hide();
                    break;
                case 80:
                    f = !f, f ? $("#collectPellets").html("<font color='#7FFF00'>On</font>") : $("#collectPellets").html("<font color='red'>Off</font>"), sendLocalBotsMessage({
                        name: "collectPellets",
                        collectPellets: f
                    }), G047.isAuthorized && sendCommand({
                        name: "collectPellets",
                        collectPellets: f
                    });
                    break;
                case 87:
                    if (d) return;
                    d = !0, c = setInterval(function() {
                        core.eject()
                    }, 50)
            }
        }), $(document).keyup(function(a) {
            switch (a.which) {
                case 87:
                    d = !1, clearInterval(c);
                    break;
                case 84:
                    var b = 0,
                        e = setInterval(function() {
                            return b > 7 ? void clearInterval(e) : (b++, void core.split())
                        }, 50);
                    break;
                case 81:
                    var f = 0,
                        g = setInterval(function() {
                            return f > 1 ? void clearInterval(g) : (f++, void core.split())
                        }, 50)
            }
        }), addBallToMinimap(!0, "player_pointer", G047.playerName, G047.realPlayerX, G047.realPlayerY, "#00FF00", !1), addBallToMinimap(!0, "player_death", "Last Death", G047.realPlayerX, G047.realPlayerY, "#FF2400", !1), addBallToMinimap(!0, "player_spectate", "Spectate", G047.realPlayerX, G047.realPlayerY, "#0000FF", !1), connectToG047Server(), insertCore(), setInterval(function() {
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
    this._fillText.apply(this, arguments), "Leaderboard" === arguments[0] ? ("" != tempLeaderBoard && (G047.leaderboardData = tempLeaderBoard, $("#leaderboard").val(G047.leaderboardData)), tempLeaderBoardIndex = 1, tempLeaderBoard = "") : ":teams" != $("#gamemode").val() && 0 == arguments[0].indexOf(tempLeaderBoardIndex + ".") && tempLeaderBoardIndex < 11 ? (tempLeaderBoard += arguments[0] + (tempLeaderBoardIndex <= 9 ? ", " : ""), tempLeaderBoardIndex++) : this._fillText.apply(this, arguments)
}, CanvasRenderingContext2D.prototype._drawImage = CanvasRenderingContext2D.prototype.drawImage, CanvasRenderingContext2D.prototype.drawImage = function() {
    arguments[0].src && "http://agar.io/img/background.png" == arguments[0].src && (arguments[0].src = ""), this._drawImage.apply(this, arguments)
};
var miniMap = null,
    minimapCtx = null;
minimapBalls = {}, MinimapBall.prototype = {
    draw: function(a, b, c) {
        if (this.visible) {
            this.lastX = (29 * this.lastX + this.x) / 30, this.lastY = (29 * this.lastY + this.y) / 30;
            var d = ((this.isDefault ? this.x : this.lastX) + G047.mapOffset) * b,
                e = ((this.isDefault ? this.y : this.lastY) + G047.mapOffset) * c;
            a.fillStyle = this.color, a.font = "10px Ubuntu", a.textAlign = "center", a.fillText("" == this.name ? "An unnamed cell" : this.name, d, e - 10), a.beginPath(), a.arc(d, e, 4.5, 0, 2 * Math.PI, !1), a.closePath(), a.fillStyle = this.color, a.fill()
        }
    }
};
var b = new XMLHttpRequest;
b.open("GET", "/mc/agario.js", !0), b.onload = function() {
    var script = b.responseText;
    script = replaceNormalFile(script, 'if(js.keyCode==32&&i1!="nick"){js.preventDefault()}', ""), script = replaceNormalFile(script, "showAds:function(i){if", "showAds:function(i){},showFuck:function(i){if"), script = replaceNormalFile(script, "showPromoBadge:function(", "showPromoBadge:function(i){},fuckbacks: function("), script = replaceRegexFile(script, /(return\s\w+.tab.toUpperCase\(\)).indexOf\(\w+.toUpperCase\(\)\)!=-1/, "$1 != 'VETERAN'"), script = replaceRegexFile(script, /if\(\w+.shouldSkipConfigEntry\(\w+.productIdToQuantify.*visibility\)\)\{continue\}/, ""), script = replaceNormalFile(script, "if(this.getSkinsByCategory(i1.tabDescription).length>0", 'if (this.getSkinsByCategory(i1.tabDescription).length > 0 && (i1.tabDescription.toUpperCase() == "PREMIUM" || i1.tabDescription.toUpperCase() == "VETERAN" || i1.tabDescription.toUpperCase() == "OWNED")'), script = replaceRegexFile(script, /var\si2=window.document.createElement..script..+head.appendChild.i2../i, "G047.reloadCore();"), script = replaceRegexFile(script, /(showFreeCoins:function\(\)\{var.*showContainer\(\);if\(([a-zA-Z0-9]+[a-zA-Z0-9]+.user.userInfo==null).*false\);([a-zA-Z0-9]+[a-zA-Z0-9]+.triggerFreeCoins\(\)).*this.onShopClose\)\)\}},)/, "$1 G047FreeCoins: function(){if($2){return;}$3;},"), script = replaceNormalFile(script, "onPlayerBanned:function(i)", "onPlayerBanned: function(i){},shitfacefuck:function(i)"), eval(script);
    var e = new XMLHttpRequest;
    e.open("GET", "/", !0), e.onload = function() {
        var a = e.responseText;
        a = replaceNormalFile(a, "UCC6hurPo_LxL7C0YFYgYnIw", "UC4DrulGqgDXz6wir8_i-WYQ"), a = replaceRegexFile(a, /<footer[\S\s]*\/footer>/i, ""), a = replaceNormalFile(a, '<script src="agario.core.js" async></script>', "<div id='botcanvas' style='background:rgba(0,0,0,0.4); width: 200px; bottom: 214px; right: 9px; display: block; position: absolute; text-align: center; font-size: 15px; color: #ffffff; padding: 5px; font-family: Ubuntu;'> <font color='#7FFF00'>G047 Bots</font><br>Bots: <a id='botCount'><font color='red'>300 / 300</font></a><br><font color='#00BFFF'>A</font> - Move To Mouse: <a id='ismoveToMouse'><font color='#7FFF00'>On</font></a><br><font color='#00BFFF'>P</font> - Collect Pellets: <a id='collectPellets'><font color='red'>Off</font></a><br><font color='#00BFFF'>D</font> - Stop Movement: <a id='isStopMove'><font color='red'>Off</font></a></div>"), a = replaceNormalFile(a, "<body>", '<body onload="G047.loadCore()">'), a = replaceRegexFile(a, /<script type="text\/javascript" src="mc\/agario\.js.*"><\/script>/i, ""), a = replaceRegexFile(a, /<div id="adsBottom".*display:block;">/i, '<div id="adsBottom" style="display:none">'), a = replaceNormalFile(a, '<div class="diep-cross" style="', '<div class="diep-cross" style="display:none;'), a = replaceNormalFile(a, '<div id="promo-badge-container">', '<div id="promo-badge-container" style="display:none;">'), a = replaceNormalFile(a, '<span data-itr="page_instructions_w"></span><br/>', '<span data-itr="page_instructions_w"></span><br/><span>Press <b>Q</b> to double split</span><br><span>Hold <b>W</b> to rapid fire mass</span><br><span>Press <b>M</b> to hide/show the minimap</span><br><span>Press <b>E</b> to split bots</span><br><span>Press <b>R</b> to eject some bots mass</span><br><span>Press <b>P</b> to make bots collect pellets</span>'), a = replaceNormalFile(a, '<div id="tags-container">', '<div id="leaders" class="input-group" style="margin-top: 6px;"><span class="input-group-addon" style="width:75px"id="basic-addon1">BOARD</span><input id="leaderboard" type="text" value="" style="width:185px" readonly class="form-control"><button id="leaderboardcopy" class="btn btn-primary" style="float: right; width: 60px; border-radius: 0px 4px 4px 0px;" data-original-title="" title="">Copy</button></div><div class="input-group" style="margin-top: 6px;"><span class="input-group-addon" style="width:75px"id="basic-addon1">UUID</span><input id="uuid" type="text" value="' + client_uuid + '" style="width:185px" readonly class="form-control"><button id="uuidcopy" class="btn btn-primary" style="float: right; width: 60px; border-radius: 0px 4px 4px 0px;" data-original-title="" title="">Copy</button></div><div class="input-group" style="margin-top: 6px;"><span class="input-group-addon" style="width:75px" id="basic-addon1">NAMES</span><input id="botnames" class="form-control" style="width:245px" placeholder="Separate bot names using commas" autofocus=""></div><div id="tags-container">'), a = replaceNormalFile(a, "</body>", '<div style="display:block;position:absolute;z-index:100;pointer-events:none;right:9px;bottom:9px;"><canvas id="minimap"></div></body>'), document.open(), document.write(a), document.close()
    }, e.send()
}, b.send(), setInterval(function() {
    G047.realPlayerX = G047.mapOffsetX + G047.playerX, G047.realPlayerY = G047.mapOffsetY + G047.playerY, moveBallOnMinimap("player_pointer", G047.realPlayerX, G047.realPlayerY), moveBallOnMinimap("player_spectate", G047.realPlayerX, G047.realPlayerY)
}, 50);
var last_transmited_game_server = null,
    socket = null;
setInterval(function() {
    G047.isAuthorized || emitPosition()
}, 1e3), setInterval(function() {
    G047.isAuthorized && emitPosition(), emitLocalPosition(), transmit_current_server(!1)
}, 100);

//Decoded By G047, Sun, 28 Aug 2016 13:32:27 GMT
