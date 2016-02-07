            var webSocket;
            var messages = document.getElementById("messages");
            var buttons = document.getElementById("buttons");
           
           
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
 
                    writeResponse(event.data);
                };
 
                webSocket.onmessage = function(event){
                    //writeResponse(event.data);
                    checkText(event.data);
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
            function checkText(text){
                if (text === "game:confirm")
                {

                }
                else if (text === "game:askrole")
                {
                    while (buttons.firstChild) {
                        buttons.removeChild(buttons.firstChild);
                    }                    
                    var button = document.createElement("button");
                    var button2 = document.createElement("button");
                    button.textContent = "THIS IS A BUTTON";
                    button.setAttribute( "onClick", "javascript: send(game:host);" );

                    button2.setAttribute( "onClick", "javascript: send(game:client);" );
                    button2.textContent = "THIS IS A BUTTON TOO";
                    button.className += " joinButton btn btn-success";
                    button2.className += " joinButton btn btn-success";
                    buttons.appendChild(button);
                    buttons.appendChild(button2);

                }
            }