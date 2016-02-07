function Connection(conn, hostOrNah) {
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
    }
    else if(data==="game:client"){
      gameClients.push(new Connection(ws, false));
      ws.send("game:loadboard");
    }
    //broadcast(data);
  });

  ws.on("close", function() {
    console.log("websocket connection close");
  })

})

