var game = game || {};

game.gameLogic = (function() {
  var board = game.board.getBoard();
  var moves = [];
  var player1;
  var player2;
  var space = {};



  var myTurn = false;
  

  var ref = new Firebase('https://tic-tac-toe-cam.firebaseio.com');
  
  var playerMovesRef = ref.child('player-moves');

  function checkAndPlace(arg) {
    var spaces = document.getElementById('board').getElementsByTagName('td');
    var move = arg.move;
    var place = arg.place;
    
    console.log('arg = ' + arg + ' move = ' + arg.move + ' place = ' + arg.place);
    spaces[place].innerHTML = move;
    moves[place] = move;
    console.log(moves);

    

  }



  playerMovesRef.on('value', function(snap) {
    console.log(myTurn);
  });

  playerMovesRef.on('child_added', function(snapshot) {
    myTurn = true;
    if (moves.length < 1) {
      createPlayer2();
    }
    
    checkAndPlace(snapshot.val());
  });

  function createPlayer2(arg) {
    myTurn = true;
    console.log('player 2 created');
    player2 = new game.Player('o');
    player1 = null;
  }


  if (moves.length < 1) {
    myTurn = true;
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
        console.log('player2 just went');

        myTurn = false;
        moves[i] = player2.symbol;
        
        space.move = player2.symbol;
        $(this).text(space.move);
        
        playerMovesRef.push(space);
      } else {
        console.log('player1 just went');

        myTurn = false;

        moves[i] = player1.symbol;
        // console.log(moves[i]);
        space.move = player1.symbol;
        $(this).text(space.move);
        
        playerMovesRef.push(space);
        // console.log(moves);
      } 
      
      
    });
  });


  function winner() {
    if (moves[0] === 'x' && moves[1] === 'x' && moves[2] === 'x' ||
        moves[3] === 'x' && moves[4] === 'x' && moves[5] === 'x' ||
        moves[6] === 'x' && moves[7] === 'x' && moves[8] === 'x' ||
        moves[0] === 'x' && moves[3] === 'x' && moves[6] === 'x' ||
        moves[1] === 'x' && moves[4] === 'x' && moves[7] === 'x' ||
        moves[2] === 'x' && moves[5] === 'x' && moves[8] === 'x' ||
        moves[0] === 'x' && moves[4] === 'x' && moves[8] === 'x' ||
        moves[2] === 'x' && moves[4] === 'x' && moves[6] === 'x' ) {
      
        console.log('x is winner');
    }

    if (moves[0] === 'o' && moves[1] === 'o' && moves[2] === 'o' ||
        moves[3] === 'o' && moves[4] === 'o' && moves[5] === 'o' ||
        moves[6] === 'o' && moves[7] === 'o' && moves[8] === 'o' ||
        moves[0] === 'o' && moves[3] === 'o' && moves[6] === 'o' ||
        moves[1] === 'o' && moves[4] === 'o' && moves[7] === 'o' ||
        moves[2] === 'o' && moves[5] === 'o' && moves[8] === 'o' ||
        moves[0] === 'o' && moves[4] === 'o' && moves[8] === 'o' ||
        moves[2] === 'o' && moves[4] === 'o' && moves[6] === 'o' ) {
      
        console.log('o is winner');
    }
      
  }


})();