
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

wss.on("connection", function(ws) {

  ws.send("Connected");

  console.log("websocket connection open")

  ws.on("message", function(data, id) {
    console.log(data);
    if(data==="game:connected"){
      ws.send("game:confirm");
      ws.send("game:askrole");
    }
    else if(data==="game:whatever"){
      ws.send("game:");
    }
    //broadcast(data);
  });

  ws.on("close", function() {
    console.log("websocket connection close");
  })

})

