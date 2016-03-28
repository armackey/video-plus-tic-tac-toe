var game = game || {};
var fire = fire || {};

game.gameLogic = (function() {
  var board = game.board.getBoard();
  var moves = [];
  var player1;
  var player2;
  var myTurn = false;

  var ref = new Firebase('https://tic-tac-toe-cam.firebaseio.com');

  ref.on('child_added', function(snapshot) {
    myTurn = true;
    setValueInMovesArray(snapshot.val());
  });

  function setValueInMovesArray(arg) {
    var key;
    for (key in arg) {
      console.log(arg);
      console.log(key);
    }
    console.log(moves);
  }


  if (moves.length < 1) {
    myTurn = true;
    player1 = new game.Player('x');
    player2 = null;
  } else {
    player2 = new game.Player('o');
    player1 = null;
  }
  

  $('#board > div').each(function(i, elem, arr) {
    var turn;
    $(this).click(function(elem, index, arr) {
      if (!myTurn) { 
        return;
      }
      var indeX = i;

      if (player1 === null) {
        console.log('player 2 just went');
        turn = player2.symbol;
        moves[indeX] = turn;
        ref.push(moves);
        $(this).text(turn);
        
        myTurn = false;
      } else {
        console.log('player 1 just went');
        turn = player1.symbol;
        moves[indeX] = turn;
        ref.push(moves);
        $(this).text(turn);
        myTurn = false;
      } 
      console.log(i);

    // for (var j = 0; j < moves.length; j+=1) {
    //   console.log('working');
    //   if (j === i) {
    //     moves[j] = turn;
    //     ref.push(moves);
    //     console.log(moves);
    //   }
    // }
    
      
    });
  });

  function setMove(ele, i) {
    console.log(myTurn);


 
    console.log(ele[i]);

  }

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