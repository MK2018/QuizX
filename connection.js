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
	  if(gameHosts.length === 1)
	    alreadyHasHost();
	  else
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
	}
}

var gameHosts = [];
var gameClients = [];
var connections = [];
var conCount = 0;