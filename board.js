//THIS WILL BE RESPONSABLE FOR MANAGING THE QUESTION BOARD
//
//
//eventually, may use APIs to consume data and create questions
//
//
//for now, will remain as a placeholder while system is developed.
//
//
module.exports = {
	getNewBoard: function(){
		return fillBoard();
	}
}

function fillBoard(){
  var gameBoard = [];
  for(var i=0; i<5; i++) {
    gameBoard[i] = [new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael"),new Clue("Who is the best member of the group?", (i+1)*100, "Michael")];
  }
  return gameBoard;
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