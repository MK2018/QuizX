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
  for(var i=1; i<=5; i++) {
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

var conCounter = 0;

gameBoard = fillBoard();

for(var x=0; x < gameBoard.length; x++){
  for(var y = 0; y < gameBoard[0].length;y++){
    console.log(gameBoard[x][y].getValue());
  }
}

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
    else if(data === "game:start"){
      broadcast("game:starting");
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
      broadcast("game:showbuzzer-"+gameBoard[coordx][coordy].getQuestion());
      gameHost.getClient().send("game:showquest-"+gameBoard[coordx][coordy].getQuestion());
    }
    else if(data.substring(0, 9) ==="game:buzz"){
      var index = -1;
      broadcast("game:disable");
      answer = data.substring(10);
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
      }
      else{
        broadcast("game:enable");
        ws.send("game:incorrect");
      }
    }
  });

  ws.on("close", function() {
    if(gameHost[0]===ws)
      gameHost.pop();
    console.log("websocket connection close");
    broadcast("game:clientsconnected-"+wss.clients.length);
  })

})

