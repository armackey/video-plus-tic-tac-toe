var game = game || {};

game.gameLogic = (function() {
  var board = game.board.getBoard();
  var moves = [];
  var player1;
  var player2;
  var space = {};
  var spaces = document.getElementById('board').getElementsByTagName('td');
  var turnCounter = 0;


  var myTurn = true;
  

  var ref = new Firebase('https://tic-tac-toe-cam.firebaseio.com');
  
  var playerMovesRef = ref.child('player-moves');
  
  function checkAndPlace(arg) {
    console.log(spaces[0]);  
    var move = arg.move;
    var place = arg.place;

    console.log(' move = ' + arg.move + ' place = ' + arg.place);
    spaces[place].innerHTML = move;
    moves[place] = move;
    console.log(moves);
  }



  playerMovesRef.on('value', function(snap) {
       
    if (turnCounter % 2 === 0) {
      myTurn = true;
    } else {
      myTurn = false;
      turnCounter += 1;
    }
    
    console.log(myTurn);
  });

  playerMovesRef.on('child_added', function(snapshot) {
    if (moves.length < 1) {
      createPlayer2();
    }
    
    checkAndPlace(snapshot.val());
  });

  function createPlayer2(arg) {
    turnCounter += 2;
    moves.push(null);
    console.log('player 2 created');
    player2 = new game.Player('o');
    player1 = null;
  }


  if (moves.length < 1) {
    player1 = new game.Player('x');
    player2 = null;
  } 
  

  $('td').each(function(i, elem, arr) {
    
    $(this).click(function(ele, index, arr) {
      if (!myTurn) { 
        return;
      }

      if (ele.currentTarget.innerHTML) {
        console.log('this space has been taken');
        return;
      }
      
      space.place = i;
      if (player1 === null) {
        myTurn = false;
        turnCounter += 1;
        
        space.move = player2.symbol;
        $(this).text(space.move);
        playerMovesRef.push(space);
      } else {
        myTurn = false;
        turnCounter += 1;
        moves.push(null);
        
        space.move = player1.symbol;
        $(this).text(space.move);
        
        playerMovesRef.push(space);
      } 
      
      
    });
  });


  
    if (spaces[0] === '<td>x</td>' && spaces[1] === '<td>x</td>' && spaces[2] === '<td>x</td>' ||
        spaces[3] === '<td>x</td>' && spaces[4] === '<td>x</td>' && spaces[5] === '<td>x</td>' ||
        spaces[6] === '<td>x</td>' && spaces[7] === '<td>x</td>' && spaces[8] === '<td>x</td>' ||
        spaces[0] === '<td>x</td>' && spaces[3] === '<td>x</td>' && spaces[6] === '<td>x</td>' ||
        spaces[1] === '<td>x</td>' && spaces[4] === '<td>x</td>' && spaces[7] === '<td>x</td>' ||
        spaces[2] === '<td>x</td>' && spaces[5] === '<td>x</td>' && spaces[8] === '<td>x</td>' ||
        spaces[0] === '<td>x</td>' && spaces[4] === '<td>x</td>' && spaces[8] === '<td>x</td>' ||
        spaces[2] === '<td>x</td>' && spaces[4] === '<td>x</td>' && spaces[6] === '<td>x</td>' ) {
      
        console.log('x is winner');
    }

    if (spaces[0] === '<td>o</td>' && spaces[1] === '<td>o</td>' && spaces[2] === '<td>o</td>' ||
        spaces[3] === '<td>o</td>' && spaces[4] === '<td>o</td>' && spaces[5] === '<td>o</td>' ||
        spaces[6] === '<td>o</td>' && spaces[7] === '<td>o</td>' && spaces[8] === '<td>o</td>' ||
        spaces[0] === '<td>o</td>' && spaces[3] === '<td>o</td>' && spaces[6] === '<td>o</td>' ||
        spaces[1] === '<td>o</td>' && spaces[4] === '<td>o</td>' && spaces[7] === '<td>o</td>' ||
        spaces[2] === '<td>o</td>' && spaces[5] === '<td>o</td>' && spaces[8] === '<td>o</td>' ||
        spaces[0] === '<td>o</td>' && spaces[4] === '<td>o</td>' && spaces[8] === '<td>o</td>' ||
        spaces[2] === '<td>o</td>' && spaces[4] === '<td>o</td>' && spaces[6] === '<td>o</td>' ) {
      
        console.log('o is winner');
    }
      
  


})();