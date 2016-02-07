function Connection(conn, hostOrNah) {
  this.score = 0;
  this.conn = conn;
  if(hostOrNah){
    this.host = true;
    this.client = false;
  }
  else{
    this.host = false;
    this.client = true;
  }
  this.getHost = function(){
    return host;
  }
  this.getClient = function(){
    return client;
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
  var gameBoard = [new Clue("Who is the best member of the group?", 100, "Michael"),new Clue("Who is the best member of the group?", 200, "Michael"),new Clue("Who is the best member of the group?", 300, "Michael"),new Clue("Who is the best member of the group?", 400, "Michael"),new Clue("Who is the best member of the group?", 500, "Michael")];
  for(var i=0; i<5; i++) {
    gameBoard[i] = [new Clue("Who is the best member of the group?", i*100, "Michael"),new Clue("Who is the best member of the group?", i*100, "Michael"),new Clue("Who is the best member of the group?", i*100, "Michael"),new Clue("Who is the best member of the group?", i*100, "Michael"),new Clue("Who is the best member of the group?", i*100, "Michael"),new Clue("Who is the best member of the group?", i*100, "Michael")];//new Array(6);
  }
  return gameBoard;
}

function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	});
};

var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

var gameHost = [];

var gameClients = [];

gameBoard = fillBoard();

activex = -1;
activey = -1;

wss.on("connection", function(ws) {
  ws.send("Connected");
  console.log("websocket connection open")

  ws.on("message", function(data) {
    if(data==="game:connected"){
      ws.send("game:confirm");
      ws.send("game:askrole");
    }
    else if(data==="game:host"){
      gameHost.push(new Connection(ws, true));
      ws.send("game:loadboard");
      broadcast("game:clientsconnected-"+wss.clients.length);
    }
    else if(data==="game:client"){
      gameClients.push(new Connection(ws, false));
      ws.send("game:loadboard");
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
      ws.send("game:showclue-"+gameBoard[coordx][coordy].getQuestion());
    }
    else if(data.substring(0, 9) ==="game:buzz"){
      broadcast("game:disable");
      answer = data.substring(9);
      if(answer.toLowerCase() === gameBoard[activex][activey].getAnswer().toLowerCase()){
        ws.send("game:correct");
        for(var x = 0; x < gameClients; x++)
          if(gameClients[x].getClient() === ws)
            gameClients[x].addScore(gameBoard[activex][activey].getValue());
        ws.send("game:score-"+gameClients[x].getScore());
      }
      else{
        ws.send("game:incorrect");
      }
    }
    //broadcast(data);
  });

  ws.on("close", function() {
    console.log("websocket connection close");
    broadcast("game:clientsconnected-"+wss.clients.length);
  })

})

