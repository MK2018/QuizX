//DEPRECATED CODE. NEW VERSION IS IN THE WORKS.


function broadcast(data, args) {
	wss.clients.forEach(function each(client) {
		cmd(data, client, args);
	});
};

function cmd(cmd, ws, arg){
    if(typeof arg === "undefined")
        ws.send(cmd + "();");
    else
        ws.send(cmd + "(" + arg + ");");
}

/////START CODE EXECUTION HERE
var conn = require('./connection')
var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

var tmpRmId = null;

app.use(express.static(__dirname + "/static"));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");


//gameBoard = fillBoard();

var activex = -1;
var activey = -1;

wss.on("connection", function(ws) {
  cmd('connected', ws);
  console.log("websocket connection open");
  conn.addConnection(ws);

  ws.on("message", function(data) {
    eval(data);
  });

  ws.on("close", function() {
    conn.removeConnection(ws);
    //if(gameHost[0]===ws)
    //  gameHost.pop();
    console.log("websocket connection close");
    broadcast("gameClientsConnected", wss.clients.length);
  });

});

function gameConnected(ws){
  //ws.send("game:confirm");
  //ws.send("game:askrole");
  cmd('gameConfirm', ws);
  cmd('gameAskRole', ws);
}
function gameStart(ws, roomId){
  conn.startGame(parseInt(roomId));
  //broadcast("gameStarting");
  //ingame = true;
}
function gameGetAllScores(ws){
  //scores = [];
  //for(var x = 0; x < gameClients.length; x++){           
  //  scores.push(gameClients[x].getScore);                
  //}
  cmd('gameScoreReport', ws, 'tmp');
}
function gameCheck(ws, args){
  coordx = parseInt(args['x']);
  coordy = parseInt(args['y']);
  roomId = parseInt(args['roomId']);
  //console.log(roomId);
  //activex = coordx;
  //activey = coordy;
  //console.log(coordx+","+coordy);
  conn.showBuzzer(coordx, coordy, roomId);
  //broadcast('gameShowBuzzer', JSON.stringify(gameBoard[coordx][coordy].getQuestion()));
}
function gameBuzz(ws, args){
  //var index = -1;
  var answer = args['ans'];
  var roomId = args['roomId'];
  var points = conn.checkAnswer(answer, roomId, ws);
  if(points === -1)
    cmd('questionIncorrect', ws);
  else
    cmd('questionCorrect', ws, points);
}
function gameIncorrect(ws){
  cmd("gameIncorrect", ws);
}
function gameInitRoom(ws){
  var id = conn.initRoom(ws);
  cmd('displayRoomId', ws, id);
  //rooms = conn.getRooms();
  //rooms.forEach(function(room){
  //  console.log(room.toString());
  //});
}
function gameJoinRoom(ws, id){
  conn.addToRoom(ws, id);
}
