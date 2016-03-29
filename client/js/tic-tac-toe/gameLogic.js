var game = game || {};
var videoChat = videoChat || {};
var takePic = takePic || {};
var fire = fire || {};

game.GameLogic = (function() {

  function GameLogic() {}

  var newGame = GameLogic.prototype = new GameLogic();

  newGame.start = function() {


    var moves = [];
    var player1;
    var player2;
    var space = {};
    var spaces = document.getElementById('board').getElementsByTagName('td');
    var canvasElems = $('canvas');
    var spanElems = $('td > span');
    var turnCounter = 0;
    var self = this;

    var myTurn = true;
    var ref = new fire.FireCalls.newRef();
    var playerMoveRef = ref.child('player-moves');

    console.log(fire);
    console.log(game);
    console.log(this);

    document.getElementById('clear-board').onclick = function() {
      playerMoveRef.remove(this.start);
      self.clearCanvas();
      game.board.createBoard(9);
    };

    self.clearCanvas = function() {
      game.board.destroyBoard();
    };
    
    
    function checkAndPlace(arg) {  
      var move = arg.move;
      var place = arg.place;
      spanElems[place].innerHTML = move;
    }

    function takeOpponentPhoto(arg) {
      var place = arg.place;
      console.log(place + ' place');
      var video = document.getElementById('remote-video');
      var context = canvasElems[place].getContext('2d');
      context.drawImage(video, 0, 0, 640, 480);
    }

    // function takeMyPhoto(arg) {
    //   var context = arg.getContext('2d');
    //   var video = document.getElementById('local-video');
    //   context.drawImage(video, 0, 0, 640, 480);
    // }

    playerMoveRef.on('value', function(snap) {

      if (turnCounter % 2 === 0) {
        myTurn = true;
      } else {
        myTurn = false;
        turnCounter += 1;
      }

      checkForWinner();
    });

    playerMoveRef.on('child_added', function(snapshot) {
      if (moves.length < 1) {
        createPlayer2();
      }
      
      takeOpponentPhoto(snapshot.val());  
      checkAndPlace(snapshot.val());
    });

    function createPlayer2(arg) {
      turnCounter += 2;
      moves.push(null);
      console.log('player 2 created');
      player2 = new game.Player.setSymbol('o');
      player1 = null;
    }


    if (moves.length < 1) {
      player1 = new game.Player.setSymbol('x');
      player2 = null;
    } 
    


    $('canvas').each(function(i, elem, arr) {
      
      $(this).click(function(ele, index, arr) {
        if (!myTurn) { 
          return;
        }

        var context = elem.getContext('2d');
        var video = document.getElementById('local-video');
        context.drawImage(video, 0, 0, 640, 480);
        
        if (ele.currentTarget.innerHTML) {
          console.log('this space has been taken');
          return;
        }
        
        space.place = i;
        if (player1 === null) {
          // player2.name = videoChat.CreateUser.getUser();
          myTurn = false;
          turnCounter += 1;
          console.log(player2);
          space.move = player2.symbol;

          $(this).text(context.drawImage(video, 0, 0, 640, 480));
          playerMoveRef.push(space);
        } else {
          // player1.name = videoChat.CreateUser.getUser();
          myTurn = false;
          turnCounter += 1;
          moves.push(null);
          console.log(player1);
          space.move = player1.symbol;
          $(this).text(context.drawImage(video, 0, 0, 640, 480));
          
          playerMoveRef.push(space);
        } 
        
        
      });
    });


    function checkForWinner() {

      if (spanElems[0].innerHTML == 'x' && spanElems[1].innerHTML == 'x' && spanElems[2].innerHTML == 'x' ||
          spanElems[3].innerHTML == 'x' && spanElems[4].innerHTML == 'x' && spanElems[5].innerHTML == 'x' ||
          spanElems[6].innerHTML == 'x' && spanElems[7].innerHTML == 'x' && spanElems[8].innerHTML == 'x' ||
          spanElems[0].innerHTML == 'x' && spanElems[3].innerHTML == 'x' && spanElems[6].innerHTML == 'x' ||
          spanElems[1].innerHTML == 'x' && spanElems[4].innerHTML == 'x' && spanElems[7].innerHTML == 'x' ||
          spanElems[2].innerHTML == 'x' && spanElems[5].innerHTML == 'x' && spanElems[8].innerHTML == 'x' ||
          spanElems[0].innerHTML == 'x' && spanElems[4].innerHTML == 'x' && spanElems[8].innerHTML == 'x' ||
          spanElems[2].innerHTML == 'x' && spanElems[4].innerHTML == 'x' && spanElems[6].innerHTML == 'x' ) {
        
          console.log('x is winner');
      }

      if (spanElems[0].innerHTML == 'o' && spanElems[1].innerHTML == 'o' && spanElems[2].innerHTML == 'o' ||
          spanElems[3].innerHTML == 'o' && spanElems[4].innerHTML == 'o' && spanElems[5].innerHTML == 'o' ||
          spanElems[6].innerHTML == 'o' && spanElems[7].innerHTML == 'o' && spanElems[8].innerHTML == 'o' ||
          spanElems[0].innerHTML == 'o' && spanElems[3].innerHTML == 'o' && spanElems[6].innerHTML == 'o' ||
          spanElems[1].innerHTML == 'o' && spanElems[4].innerHTML == 'o' && spanElems[7].innerHTML == 'o' ||
          spanElems[2].innerHTML == 'o' && spanElems[5].innerHTML == 'o' && spanElems[8].innerHTML == 'o' ||
          spanElems[0].innerHTML == 'o' && spanElems[4].innerHTML == 'o' && spanElems[8].innerHTML == 'o' ||
          spanElems[2].innerHTML == 'o' && spanElems[4].innerHTML == 'o' && spanElems[6].innerHTML == 'o' ) {
        
          console.log('o is winner');
      }
    }
  };

    return newGame;
  
})();