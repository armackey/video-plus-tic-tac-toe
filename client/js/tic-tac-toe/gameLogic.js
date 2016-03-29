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
  }



  playerMovesRef.on('value', function(snap) {
    if (turnCounter % 2 === 0) {
      myTurn = true;
    } else {
      myTurn = false;
      turnCounter += 1;
    }
    checkForWinner();
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


  function checkForWinner() {

    if (spaces[0].innerHTML == 'x' && spaces[1].innerHTML == 'x' && spaces[2].innerHTML == 'x' ||
        spaces[3].innerHTML == 'x' && spaces[4].innerHTML == 'x' && spaces[5].innerHTML == 'x' ||
        spaces[6].innerHTML == 'x' && spaces[7].innerHTML == 'x' && spaces[8].innerHTML == 'x' ||
        spaces[0].innerHTML == 'x' && spaces[3].innerHTML == 'x' && spaces[6].innerHTML == 'x' ||
        spaces[1].innerHTML == 'x' && spaces[4].innerHTML == 'x' && spaces[7].innerHTML == 'x' ||
        spaces[2].innerHTML == 'x' && spaces[5].innerHTML == 'x' && spaces[8].innerHTML == 'x' ||
        spaces[0].innerHTML == 'x' && spaces[4].innerHTML == 'x' && spaces[8].innerHTML == 'x' ||
        spaces[2].innerHTML == 'x' && spaces[4].innerHTML == 'x' && spaces[6].innerHTML == 'x' ) {
      
        console.log('x is winner');
    }

    if (spaces[0].innerHTML == 'o' && spaces[1].innerHTML == 'o' && spaces[2].innerHTML == 'o' ||
        spaces[3].innerHTML == 'o' && spaces[4].innerHTML == 'o' && spaces[5].innerHTML == 'o' ||
        spaces[6].innerHTML == 'o' && spaces[7].innerHTML == 'o' && spaces[8].innerHTML == 'o' ||
        spaces[0].innerHTML == 'o' && spaces[3].innerHTML == 'o' && spaces[6].innerHTML == 'o' ||
        spaces[1].innerHTML == 'o' && spaces[4].innerHTML == 'o' && spaces[7].innerHTML == 'o' ||
        spaces[2].innerHTML == 'o' && spaces[5].innerHTML == 'o' && spaces[8].innerHTML == 'o' ||
        spaces[0].innerHTML == 'o' && spaces[4].innerHTML == 'o' && spaces[8].innerHTML == 'o' ||
        spaces[2].innerHTML == 'o' && spaces[4].innerHTML == 'o' && spaces[6].innerHTML == 'o' ) {
      
        console.log('o is winner');
    }
  }


})();