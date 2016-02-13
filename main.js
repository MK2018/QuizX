var webSocket;
var messages = document.getElementById("messages");
var buttons = document.getElementById("buttons");
var invisible = document.getElementById("invis-container");
var invisibletext = document.getElementById("answerBox");
var thumbsup = document.getElementById("correctThumb");
var thumbsdown = document.getElementById("incorrectThumb");

var myID = -1;
var myScore = 0;

var isHost = false;
 
function initSocket(){
    // Ensures only one connection is open at a time
    if(webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED){
        return;
    }
    var host = location.origin.replace(/^http/, 'ws')

    // Create a new instance of the websocket
    webSocket = new WebSocket(host);
                 
    webSocket.onopen = function(event){
        console.log("connected.");
        cmd('gameConnected');
    };
    webSocket.onmessage = function(event){
        checkText(event.data);
    };
    webSocket.onclose = function(event){
        //nada
    };
}

function closeSocket(){
    webSocket.close();
}
function checkText(text){
    if (text === "game:confirm"){
        //nada
    }
    else if (text === "game:starting")
    {
        startGame();
    }
    else if (text === "game:askrole"){
        while (buttons.firstChild)
            buttons.removeChild(buttons.firstChild);                   
        var button = document.createElement("button");
        var button2 = document.createElement("button");
        button.textContent = "Join as a host";
        button.setAttribute( "onClick", "javascript: checkIfHost(); cmd('gameVerifyHost');" );
        button2.setAttribute( "onClick", "javascript: cmd('gameVerifyClient');" );
        button2.textContent = "Join as a client";
        button.className += " joinButton btn btn-success";
        button2.className += " joinButton btn btn-success";
        buttons.appendChild(button);
        buttons.appendChild(button2);
    }
    else if (text.substring(0, 8) === "game:id:"){
        var id = parseInt(text.substring(8));
        myID = id;                      
    }
    else if (text.substring(0, 22) === 'game:clientsconnected-'){
        while (buttons.firstChild) 
            buttons.removeChild(buttons.firstChild); 
        var pg = document.createElement("p");
        if(parseInt(text.substring(22))===1)
            pg.textContent = "Currently, there is " + text.substring(22) + " client connected.";
        else
            pg.textContent = "Currently, there are " + text.substring(22) + " clients connected.";
        if(parseInt(text.substring(22))>2)
            cmd("gameCheckHost");
        pg.className += " par";  
        buttons.appendChild(pg);  
    }
    else if(text === "game:hashost"){
        var button = document.createElement("button");  
        button.textContent = "Start Game"; 
        button.setAttribute( "onClick", "javascript: cmd('gameStart');" );
        buttons.appendChild(button);
    }
    else if(text.substring(0,15) === "game:showbuzzer") {
        if(!isHost){
            console.log(text.substring(16));
            invisible.className = "invisible";
            document.getElementById("answerSubmit").className = "";
            document.getElementById("answerBox").className = "";
        }
        else{
            console.log(text.substring(15));
            invisible.className = "invisible";
            question = document.getElementById("question");
            question.className = "questionStyle";
            question.textContent = text.substring(16);
        }
    }
    else if(text.substring(0,15) === "game:showquest") {
    }
    else if (text === "game:disable"){
        document.getElementById("answerSubmit").disabled = true;
    }
    else if (text === "game:enable"){
        document.getElementById("answerSubmit").disabled = false;
    }
    else if (text === "game:correct"){
        var thumbCont = document.getElementById("thumbsContainer");
        while (thumbCont.firstChild) 
            thumbCont.removeChild(thumbCont.firstChild);
        var thumbCont = document.getElementById("thumbsContainer");
        while (thumbCont.firstChild) 
            thumbCont.removeChild(thumbCont.firstChild);
        var thumbsUp = document.createElement("i");
        thumbsUp.className = "fa fa-thumbs-up correctSize";
        thumbCont.appendChild(thumbsUp);
        document.getElementById("answerSubmit").className = "invisible"; //sets answer box o invisible
        document.getElementById("answerBox").className = "invisible";
        document.getElementById("scoreTable").className = "invisible row"; 
        setTimeout(function(){}, 2000);
    }
    else if(text === "game:=qcom"){
        question = document.getElementById("question");
        question.textContent = "";
        var thumbCont = document.getElementById("thumbsContainer");
        while (thumbCont.firstChild) 
            thumbCont.removeChild(thumbCont.firstChild);
        document.getElementById("answerSubmit").className = "invisible"; //sets answer box o invisible
        document.getElementById("answerBox").className = "invisible";
        document.getElementById("invis-container").className = "";
        document.getElementById("scoreTable").className = "row"; 
    }    
    else if(text === "game:incorrect"){
        var thumbCont = document.getElementById("thumbsContainer");
        var thumbsDown = document.createElement("i");
        thumbsDown.className = "fa fa-thumbs-down correctSize";
        thumbCont.appendChild(thumbsDown);
        document.getElementById("answerSubmit").className = "invisible"; //sets answer box o invisible
        document.getElementById("answerBox").className = "invisible";
        document.getElementById("scoreTable").className = "invisible row"; 
        setTimeout(function(){}, 2000);
    }  
    else if (text.substring(0, 11) === "game:score-"){
        console.log(parseInt(text.substring(12)));
        myScore += parseInt(text.substring(12));
    }  
    else if (text.substring(0, 16) === "game:scorereport"){
        var scores = text.subtring(18).splitText(",");
        for (var i =0; i < (Integer.parseInt(text.substring(17,18))); i++){
            var newDiv = document.createElement("div");  //sets answer box o invisible
            newDiv.id='c'+i;
            newDiv.className='col-md-3';
            var pg = scores[i];
            myDiv.setContent(pg);
            toAdd.appendChild(newDiv);
        }
        document.getElementById("scoreTable").className = "row"; 
    }
}
function startGame(){
    console.log("game starting...");
    invisible.className = "";
    while (buttons.firstChild)
        buttons.removeChild(buttons.firstChild);
    document.getElementById('title').className = "invisible";  
}                   
function buzz(){
    var ans = document.getElementById("answerBox").value;
    console.log("answer:"+ ans);
    var id = myID;
    argString = JSON.stringify({"id":myID, "ans":ans});
    cmd('gameBuzz', argString);
}
function check(x, y){
    console.log("x:"+(x));
    console.log("y:"+(y));
    argString = JSON.stringify({x, y});
    cmd('gameCheck', argString);
}
function checkIfHost(){
    isHost = true;
}
function cmd(cmd, arg){
    if(typeof arg === "undefined")
        send(cmd + "(ws);");
    else
        send(cmd + "(ws," + arg + ");");
}
function send(arg){
    webSocket.send(arg);
}
function invisToggle(id){
    //nada
} 