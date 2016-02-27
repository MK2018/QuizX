module.exports = {
	//implement a timer at some point
	addConnection: function(conn){
  		conCount++;
  		connections.push(conn); 
	},
	removeConnection: function(conn){
  		conCount--;
  		var index = connections.indexOf(conn);
  		checkToKill(conn);			
  		connections.splice(index, 1);
	},
	initRoom: function(ws){
		var id = parseInt(Math.random()*100000+1);
		while(roomIds.indexOf(id) > -1)
			id = parseInt(Math.random()*100000+1);
		rooms.push(new Room(ws, id));
		return id;
	},
	addToRoom: function(conn, roomId){
		room = getRoomById(roomId);
		if(room !== null){
			room.addClient(conn);
			room.broadcastToRoom('gameClientsConnected', room.users.length)
			console.log('Person joined room: ' + roomId);
			if(room.ready()){
				console.log("ROOM READY");
				room.broadcastToRoom('gamePromptStart');
			}
			cmd('roomConnected', conn, roomId);
		}
		else{
			cmd('roomNotFound', conn, roomId);
		}
	},
	getRooms: function(){
		return rooms;
	},
	showBuzzer: function(x, y, roomId){
		//show the question on the host
		//show box to answer on all other clients
		var room = getRoomById(roomId);
		room.ax = x;
		room.ay = y;
		room.broadcastToRoom('gameShowBuzzer', JSON.stringify(room.board[x][y].getQuestion()));
		console.log("showBuzzer signal sent");
	},
	checkAnswer: function(answer, roomId, ws){
		var room = getRoomById(roomId);
		var board = room.board;
		if(board[room.ax][room.ay].getAnswer().toLowerCase()===answer.toLowerCase())
			return board[room.ax][room.ay].getValue();
		return -1;
	},
	startGame: function(roomId){
		var room = getRoomById(roomId);
		room.broadcastToRoom('gameStarting');
	}
}


var boardLoader = require('./board');

var gameHosts = [];
var connections = [];
var conCount = 0;

var rooms = [];
var roomIds = [];

function Room(host, id){
	this.users = [host];
	this.host = host;
	this.clients = [];
	this.id = id;
	this.board = boardLoader.getNewBoard();
	this.ax = -1;
	this.ay = -1;

	gameHosts.push(host);

	this.addClient = function(ws){
		this.clients.push(ws);
		this.users.push(ws);
	}
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
	this.ready = function(){
		console.log(room.users.length);
		//console.log(host);
		if(room.users.length >= 3 && (host !== null && host !== "undefined"))
			return true;
		return false;
	}
}

function cmd(cmd, ws, arg){
    if(typeof arg === "undefined")
        ws.send(cmd + "();");
    else
        ws.send(cmd + "(" + arg + ");");
}

function getRoomById(id){
	index = -1;
	for(var x = 0; x < rooms.length; x++)
		if (rooms[x].id === id) 
			index = x;
	if(index !== -1)
		return rooms[index];
	return null;
}

function getRoomByHost(host){
	index = -1;
	for(var x = 0; x < rooms.length; x++)
		if (rooms[x].host === host) 
			index = x;
	if(index !== -1)
		return rooms[index];
	return null;
}

function checkToKill(ws){
	index = -1;
	for(var x = 0; x < gameHosts.length; x++)
		if (gameHosts[x] === ws) 
			index = x;
	if(index !== -1){
		room = getRoomByHost(ws);
		rooms.splice(index, 1);
	}
	//if ws that closed was a host, kill the room.
}