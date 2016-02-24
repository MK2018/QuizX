/*function Connection(conn, hostOrNah, id) {
  this.score = 0;
  this.conn = conn;
  this.id = id;
  if(hostOrNah){
    this.host = true;
    this.client = false;
  }
  else{
    this.host = false;
    this.client = true;
  }
  this.getHost = function(){
    return this.host;
  }
  this.getClient = function(){
    return this.client;
  }
  this.info = function(){
    return "Client = " + client + ", Host = " + host;
  }
  this.getScore = function(){
    return this.score;
  }
  this.addScore = function(toAdd){
    this.score += toAdd;
  }
  this.getId = function(){
    return this.id;
  }
}*/

/*function addConnection(conn){
  conCount++;
  connections.push(conn); 
}
function removeConnection(conn){
  conCount--;
  var index = connections.indexOf(conn);
  connections.splice(index, 1);
}
function addHost(conn){
  if(gameHosts.length === 1)
    alreadyHasHost();
  else
    gameHosts.push(conn);
}
function addClient(conn){
  gameClients.push(conn);
}
function removeHost(){
  gameHosts.pop();
}
function removeClient(conn){
  var index = connections.indexOf(conn);
  gameClients.splice(index, 1);
}
*/

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/*
function Clue(question, value, answer){
  this.question = question;
  this.value = value;
  this.answer = answer;
  this.getQuestion =  function(){
    return this.question;
  }
  this.getValue = function(){
    return this.value;
  }
  this.getAnswer = function(){
    return this.answer;
  }
}
*/
/*function fillBoard(){
  var gameBoard = [];
  for(var i=0; i<5; i++) {
    gameBoard[i] = [new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael")];//new Array(6);
  }
  return gameBoard;
}*/

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

/*app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res) {
  console.log("we here");
  tmpRmId = req.query.room;
  console.log(tmpRmId);
  res.render('index');
});

app.get('/join/:room(([0-9])+)', function(req, res) {
  console.log("we here in 5");
  tmpRmId = req.params.room;
  console.log(tmpRmId);
  res.render('index');
});
*/
app.use(express.static(__dirname + "/views"));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");


//gameBoard = fillBoard();

activex = -1;
activey = -1;

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
/*function gameVerifyHost(ws){
  //var id = conCount++;
  //gameHost.push(new Connection(ws, true, id));
  id = conn.addHost(ws);
  cmd('gameId', ws, id);
  broadcast('gameClientsConnected', wss.clients.length)
}*/
//function gameVerifyClient(ws){
  //var id = conCounter++;
  //gameClients.push(new Connection(ws, false, id));
  //id = conn.addClient(ws);
  //cmd('gameId', ws, id);                                      //CHANGE TO NEW ID SYSTEM.
  //broadcast('gameClientsConnected', wss.clients.length)
//}
//function gameCheckHost(ws){
  //if(gameHost.length === 1)
  //  cmd('gameHasHost', ws);
//}
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
//------------------------------------------------------------------
  //console.log(answer);
  //id = parseInt(args['id']);
  /*if(answer.toLowerCase() === gameBoard[activex][activey].getAnswer().toLowerCase()){
    cmd('gameCorrect', ws, gameBoard[activex][activey].getValue());
      //for(var x = 0; x < gameClients.length; x++)
      //  if(gameClients[x].getId() === id){
      //    index = x;
      //    gameClients[x].addScore(gameBoard[activex][activey].getValue());
      //  }
    cmd("gameScore", ws, gameClients[index].getScore());
    sleep(2000);
    broadcast("gameQuestionComplete");
  }*/
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
///////OLD IF-ELSE TREE BELOW. KEEPING IT HERE FOR REFERENCE UNTIL TRANSITION TO NEW SYSTEM IS COMPLETE.

/*
    if(data==="game:connected"){
      ws.send("game:confirm");
      ws.send("game:askrole");
    }
    else if(data === "game:start"){
      broadcast("game:starting");
    }
    else if(data === "game:getallscores"){
      scores = "game:scorereport:"+gameClients.length+":";
      for(var x = 0; x < gameClients.length; x++){
        scores+=(gameClients[x].getScore)+",";
      }
      ws.send();
    }
    else if(data==="game:host"){
      var id = conCounter++;
      gameHost.push(new Connection(ws, true, id));
      ws.send("game:id:"+id);
      broadcast("game:clientsconnected-"+wss.clients.length);
    }
    else if(data==="game:client"){
      var id = conCounter++;
      gameClients.push(new Connection(ws, false, id));
      ws.send("game:id:"+id);
      broadcast("game:clientsconnected-"+wss.clients.length);
    }
    else if(data==="game:checkhost"){
      if(gameHost.length === 1)
        ws.send("game:hashost");
    }
    else if(data.substring(0,10) ==="game:check"){
      coords = data.substring(10);
      coordx = coords.substring(1, 2);
      coordy = coords.substring(3, 4);
      activex = coordx;
      activey = coordy;
      console.log(coordx+","+coordy);
      broadcast("game:showbuzzer-"+gameBoard[coordx][coordy].getQuestion());
      //host = gameHost[0];
      //host.send("game:showquest-"+gameBoard[coordx][coordy].getQuestion());
    }
    else if(data.substring(0, 9) ==="game:buzz"){
      var index = -1;
      //broadcast("game:disable");
      answer = data.substring(10);
      console.log(answer);
      id = parseInt(answer.substring(0, answer.indexOf("-")));
      answer = answer.substring(answer.indexOf("-")+1);
      if(answer.toLowerCase() === gameBoard[activex][activey].getAnswer().toLowerCase()){
        ws.send("game:correct");
        for(var x = 0; x < gameClients.length; x++)
          if(gameClients[x].getId() === id){
            index = x;
            gameClients[x].addScore(gameBoard[activex][activey].getValue());
          }
        ws.send("game:score-"+gameClients[index].getScore());
        sleep(2000);
        broadcast("game:=qcom");
      }
      else{
        //broadcast("game:enable");
        ws.send("game:incorrect");
      }
    }*/