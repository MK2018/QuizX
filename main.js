            var webSocket;
            var messages = document.getElementById("messages");
            var buttons = document.getElementById("buttons");
            var invisible = document.getElementById("invis-container");
            var invisibletext = document.getElementById("answerBox");
            var thumbsup = document.getElementById("correctThumb");
            var thumbsdown = document.getElementById("incorrectThumb");




            var myID = -1;
            var myScore = 0;

           
           
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
                else if (text === "game:starting")
                {
                    startGame();
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
                else if  (text.substring(0, 8) === "game:id:")
                {
                    var id = parseInt(text.substring(8));
                    myID = id;                      
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
                    button.setAttribute( "onClick", "javascript: send('game:start');" );
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
                 else if  (text.substring(0,14) === "game:showquest") //////////////////////////////////////////
                 {
                   console.log(text.substring(15));
                   invisible.className = "invisible";
                   //var button = document.createElement("button");
                   //button.textContent = "BUZZER";
                   //button.setAttribute( "onClick", "buzzer(document.getElementById(answerBox);"); ///////////////////////////////////////////////////////////////FIXFIXFIXFIXFIXFIX
                    //buttons.appendChild(button);
                    question = document.getElementById("question");
                    question.className = "";
                    question.innerHTML = text.substring(15);
                   //document.getElementById("answerSubmit").className = "";
                   //document.getElementById("answerBox").className = "";

                 }
                 else if (text === "game:disable")
                 {
                    document.getElementById("answerSubmit").disabled = true;
                 }
                 else if (text === "game:enable")
                 {
                    document.getElementById("answerSubmit").disabled = false;
                 }
                 else if (text === "game:correct")
                 {
                   var thumbCont = document.getElementById("thumbsContainer");
                    while (thumbCont.firstChild) {
                        thumbCont.removeChild(thumbCont.firstChild);
                    }
                   var thumbCont = document.getElementById("thumbsContainer");
                    while (thumbCont.firstChild) 
                    {
                        thumbCont.removeChild(thumbCont.firstChild);
                    }
                    var thumbsUp = document.createElement("i");
                    thumbsUp.className = "fa fa-thumbs-up correctSize";
                    thumbCont.appendChild(thumbsUp);
                    document.getElementById("answerSubmit").className = "invisible"; //sets answer box o invisible
                    document.getElementById("answerBox").className = "invisible";
                    setTimeout(function(){}, 2000);
                 
                 }
                 
                 else if (text === "game:=qcom")
                 {
                    var thumbCont = document.getElementById("thumbsContainer");
                    while (thumbCont.firstChild) 
                    {
                        thumbCont.removeChild(thumbCont.firstChild);
                    }
                   
                   document.getElementById("answerSubmit").className = "invisible"; //sets answer box o invisible
                   document.getElementById("answerBox").className = "invisible";
                   document.getElementById("invis-container").className = "";
               }


                    
                  else if (text === "game:incorrect")
                 {
                   var thumbCont = document.getElementById("thumbsContainer");
                    
                    var thumbsDown = document.createElement("i");
                    thumbsDown.className = "fa fa-thumbs-down correctSize";
                    thumbCont.appendChild(thumbsDown);
                   document.getElementById("answerSubmit").className = "invisible"; //sets answer box o invisible
                   document.getElementById("answerBox").className = "invisible";
                   setTimeout(function(){}, 2000);
                 }  
                else if (text.substring(0, 10) === "game:score-"){
                    console.log(parseInt(text.substring(11)));
                    myScore += parseInt(text.substring(11));
                }  
         
            }
             function startGame(){

                console.log("game starting...");
                invisible.className = "";
                while (buttons.firstChild) {
                        buttons.removeChild(buttons.firstChild);
                }
                document.getElementById('title').className = "invisible";  
             }               
            
            function buzz(){
                var arg1 = document.getElementById("answerBox").value;
                console.log("answer:"+ arg1);
                webSocket.send("game:buzz:"+myID+"-" + arg1);
            }
             function check(arg1, arg2)
                 {
                    console.log("x:"+(arg1));
                    console.log("y:"+(arg2));
                    webSocket.send("game:check("+(arg1) +","+(arg2)+")");
                 }