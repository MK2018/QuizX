            var webSocket;
            var messages = document.getElementById("messages");
            var buttons = document.getElementById("buttons");
            var invisible = document.getElementById("invis-container");
            var invisibletext = document.getElementById("answerBox");
            var thumbsup = document.getElementById("correctThumb");
            var thumbsdown = document.getElementById("incorrectThumb");







           
           
            function openSocket(){
                // Ensures only one connection is open at a time
                if(webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED){
                   writeResponse("WebSocket is already opened.");
                    return;
                }
                // Create a new instance of the websocket
                var host = location.origin.replace(/^http/, 'ws')

                // Create a new instance of the websocket
                webSocket = new WebSocket(host);
                 
                /**
                 * Binds functions to the listeners for the websocket.
                 */
                webSocket.onopen = function(event){
                    // For reasons I can't determine, onopen gets called twice
                    // and the first time event.data is undefined.
                    // Leave a comment if you know the answer.
                    if(event.data === undefined)
                        return;
 
                    //writeResponse(event.data);
                };
 
                webSocket.onmessage = function(event){
                    //writeResponse(event.data);
                    checkText(event.data);
                    //check(0, 4);
                };
 
                webSocket.onclose = function(event){
                    //writeResponse("Connection closed");
                };
            }
           
            /**
             * Sends the value of the text input to the server
             */
            function send(arg1){
                var text = arg1;
                console.log("text:"+text);
                webSocket.send(text);
            }
           
            function closeSocket(){
                webSocket.close();
            }
 
            //function writeResponse(text){
              //  messages.innerHTML += "<br/>" + text;
            //}
            function checkText(text)
            {
                //console.log(text);
                if (text === "game:confirm")
                {
                    //literally do nothing
                }
                else if (text === "game:askrole")
                {
                    while (buttons.firstChild) 
                    {
                        buttons.removeChild(buttons.firstChild);
                    }                    
                    var button = document.createElement("button");
                    var button2 = document.createElement("button");
                    button.textContent = "Join as a host";
                    button.setAttribute( "onClick", "javascript: send('game:host');" );
                    button2.setAttribute( "onClick", "javascript: send('game:client');" );
                    button2.textContent = "Join as a client";
                    button.className += " joinButton btn btn-success";
                    button2.className += " joinButton btn btn-success";
                    buttons.appendChild(button);
                    buttons.appendChild(button2);

                }
                else if  (text === "game:loadboard")
                {
                    //LOAD GAME BOARD IN


                    /*while (buttons.firstChild) {
                        buttons.removeChild(buttons.firstChild);
                    }  
                    var pg = document.createElement("p");
                    pg.textContent = "WAITING FOR OTHER PLAYERS TO JOIN....";
                    pg.className += " par";  
                    buttons.appendChild(pg);    */                         
                }
                else if (text.substring(0, 22) === 'game:clientsconnected-')
                {
                    while (buttons.firstChild) {
                        buttons.removeChild(buttons.firstChild);
                    }  
                    var pg = document.createElement("p");
                    if(parseInt(text.substring(22))===1)
                        pg.textContent = "Currently, there is " + text.substring(22) + " client connected.";
                    else
                        pg.textContent = "Currently, there are " + text.substring(22) + " clients connected.";
                    if(parseInt(text.substring(22))>2){
                        send("game:checkhost");
                    }
                    pg.className += " par";  
                    buttons.appendChild(pg);  
                }

                else if(text === "game:hashost")
                {
                    var button = document.createElement("button");  
                    button.textContent = "Start Game"; 
                    button.setAttribute( "onClick", "javascript: startGame();" );
                    buttons.appendChild(button);
                }
                 else if  (text.substring(0,15) === "game:showbuzzer") //////////////////////////////////////////
                 {
                   console.log(text.substring(16));
                   invisible.className = "invisible";
                   //var button = document.createElement("button");
                   //button.textContent = "BUZZER";
                   //button.setAttribute( "onClick", "buzzer(document.getElementById(answerBox);"); ///////////////////////////////////////////////////////////////FIXFIXFIXFIXFIXFIX
                    //buttons.appendChild(button);

                   document.getElementById("answerSubmit").className = "";
                   document.getElementById("answerBox").className = "";

                 }
                 else if (text === "game:correct")
                 {
                   document.getElementById("correctThumb").className = ""; 
                   document.getElementById("incorrectThumb").className = "invisable"; 

                   document.getElementById("answerSubmit").className = "invisable"; //sets answer box o invisible
                   document.getElementById("answerBox").className = "invisable";
                 }
                  else if (text === "game:incorrect")
                 {

                   document.getElementById("correctThumb").className = "invisable"; 
                   document.getElementById("incorrectThumb").className = "";
                   document.getElementById("answerSubmit").className = "invisable"; //sets answer box o invisible
                   document.getElementById("answerBox").className = "invisable";

                 }  
                 else if (text === "game:=qcom")
                 {

                   document.getElementById("correctThumb").className = "invisable"; 
                   document.getElementById("incorrectThumb").className = "invisable";
                   document.getElementById("answerSubmit").className = "invisable"; //sets answer box o invisible
                   document.getElementById("answerBox").className = "invisable";
                   document.getElementById("invis-container") = "";


                 }  
         
            }
             function startGame(){
                console.log("Game starting...");
                invisible.className = "";
                while (buttons.firstChild) {
                        buttons.removeChild(buttons.firstChild);
                }
                document.getElementById('title').className = "invisible";  
             }               
            
            function buzz(arg1)
                 {
                console.log("answer:"+ arg2);
                webSocket.send("game:buzz");
                webSocket.send(arg1+"");
                 }
             function check(arg1, arg2)
                 {
                    console.log("x:"+arg1);
                    console.log("y:"+arg2);
                    webSocket.send("game:check("+arg1 +","+arg2+")");
                 }