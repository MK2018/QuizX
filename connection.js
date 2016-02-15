module.exports = {
	addConnection: function(conn){
  		conCount++;
  		connections.push(conn); 
	},
	removeConnection: function(conn){
  		conCount--;
  		var index = connections.indexOf(conn);
  		connections.splice(index, 1);
	},
	addHost: function(conn){
	   	gameHosts.push(conn);
	},
	addClient: function(conn){
	  	gameClients.push(conn);
	  	return conCount;
	},
	removeHost: function(){
	  	gameHosts.pop();
	  	return conCount;
	},
	removeClient: function(conn){
	  	var index = connections.indexOf(conn);
	  	gameClients.splice(index, 1);
	},
	initRoom: function(ws){
		var id = parseInt(Math.random()*100000+1);
		while(roomIds.indexOf(id) > -1)
			id = parseInt(Math.random()*100000+1);
		rooms.push(new Room(ws, id));
		return id;
	},
	addToRoom: function(conn, roomId){
		index = -1;
		for(var x = 0; x < rooms.length; x++)
			if (rooms[x].id === roomId) 
				index = x;
		if(index !== -1)
			rooms[index].addClient(conn);
		rooms[index].broadcastToRoom('gameClientsConnected', rooms[index].users.length)
		console.log('Person joined room: ' + roomId);
	},
	getRooms: function(){
		return rooms;
	}
}

var gameHosts = [];
var gameClients = [];
var connections = [];
var conCount = 0;

var rooms = [];
var roomIds = [];

function Room(host, id){
	this.users = [host];
	this.host = host;
	this.clients = [];
	this.id = id;

	this.addClient = function(ws){
		this.clients.push(ws);
		this.users.push(ws);
	}
	//this.removeHost = function(){
	//	this.host = null;
	//}
	this.removeClient = function(ws){
		var index = this.clients.indexOf(ws);
	  	this.clients.splice(index, 1);
	}
	this.toString = function(){
		return ""+id;
	}
	this.broadcastToRoom = function(message, args){
		for(var x = 0; x < this.users.length; x++)
			cmd(message, this.users[x], args);
	}
}

function cmd(cmd, ws, arg){
    if(typeof arg === "undefined")
        ws.send(cmd + "();");
    else
        ws.send(cmd + "(" + arg + ");");
}

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
  }*/