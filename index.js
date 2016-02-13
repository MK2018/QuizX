function Connection(conn, hostOrNah, id) {
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
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

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

function fillBoard(){
  var gameBoard = [];
  for(var i=0; i<5; i++) {
    gameBoard[i] = [new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael")];//new Array(6);
  }
  return gameBoard;
}

function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	});
};

var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

var gameHost = [];

var gameClients = [];

var conCounter = 0;

gameBoard = fillBoard();

//console.log(gameBoard.length);
//console.log(gameBoard[0].length);
//console.log(gameBoard);

activex = -1;
activey = -1;

ingame = false;

wss.on("connection", function(ws) {
  ws.send("Connected");
  console.log("websocket connection open");

  ws.on("message", function(data) {
    if(ingame && wss.clients.length<3){
          
    }
    eval(""+data);
  });

  ws.on("close", function() {
    if(gameHost[0]===ws)
      gameHost.pop();
    console.log("websocket connection close");
    broadcast("game:clientsconnected-"+wss.clients.length);
  });

});

function gameConnected(ws){
  ws.send("game:confirm");
  ws.send("game:askrole");
}
function gameStart(ws){
  broadcast("game:starting");
  ingame = true;
}
function gameGetAllScores(ws){
  scores = "game:scorereport:"+gameClients.length+":";
  for(var x = 0; x < gameClients.length; x++){
    scores+=(gameClients[x].getScore)+",";
  }
  ws.send();
}
function gameVerifyHost(ws){
  var id = conCounter++;
  gameHost.push(new Connection(ws, true, id));
  ws.send("game:id:"+id);
  broadcast("game:clientsconnected-"+wss.clients.length);
}
function gameVerifyClient(ws){
  var id = conCounter++;
  gameClients.push(new Connection(ws, false, id));
  ws.send("game:id:"+id);
  broadcast("game:clientsconnected-"+wss.clients.length);
}
function gameCheckHost(ws){
  if(gameHost.length === 1)
    ws.send("game:hashost");
}
function gameCheck(ws, args){
  coordx = parseInt(args['x']);
  coordy = parseInt(args['y']);
  activex = coordx;
  activey = coordy;
  console.log(coordx+","+coordy);
  broadcast("game:showbuzzer-"+gameBoard[coordx][coordy].getQuestion());
}
function gameBuzz(ws, args){
  var index = -1;
  answer = args['ans'];
  console.log(answer);
  id = parseInt(args['id']);
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
}
function gameIncorrect(ws){
  ws.send("game:incorrect");
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