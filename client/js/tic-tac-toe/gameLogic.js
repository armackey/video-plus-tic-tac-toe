var game = game || {};
var videoChat = videoChat || {};
var takePic = takePic || {};
var fire = fire || {};

game.GameLogic = (function() {

  function GameLogic() {}

  var newGame = GameLogic.prototype = new GameLogic();

  newGame.start = function() {

    game.board.createBoard(9); 
    // $('#remote-media > video').attr('id', 'remote-video');
    // $('#local-media > video').attr('id', 'local-video');
    var player1 = null;
    var player2 = null;
    var moves = [];
    var space = {};
    var spaces = document.getElementById('board').getElementsByTagName('td');
    var canvasElems = $('canvas');
    var spanElems = $('td > span');
    var turnCounter = 0;
    var self = this;
    var localVidStream = document.getElementById('local-media');
    var remoteVidStream = document.getElementById('remote-media');

    var myTurn = true;


    var gameRef = fire.FireCalls.createNewGameRef();
    var clearBoardRef = gameRef.child('play again');

    console.log(fire);
    console.log(game);
    console.log(this);


    //clears board
    clearBoardRef.on("child_added", function(data) {
      gameRef.remove();
    });

    // start game over with same person
    document.getElementById('clear-board').onclick = function() {
      clearBoardRef.push('new game');
    };    
    


    function checkAndPlace(arg) {  
      var move = arg.move;
      var place = arg.place;
      spanElems[place].innerHTML = move;
    }

    function takeOpponentPhoto(arg) {
      var place = arg.place;
      console.log(place + ' remote');
      var video = document.getElementById('remote-video');
      var context = canvasElems[place].getContext('2d');
      context.drawImage(video, 0, 0, 640, 480);
    }

    // function takeMyPhoto(arg) {
    //   var context = arg.getContext('2d');
    //   var video = document.getElementById('local-video');
    //   context.drawImage(video, 0, 0, 640, 480);
    // }


    gameRef.on('value', function(snap) {
      if (turnCounter % 2 === 0) {
        myTurn = true;
      } else {
        myTurn = false;
        turnCounter += 1;
      }

      checkForWinner();

      gameRef.on('child_added', function(snapshot) {
        console.log('first');
        if (moves.length < 1) {
          createPlayer2();
        }
        if (!myTurn) {
          takeOpponentPhoto(snapshot.val());  
        }
        
        checkAndPlace(snapshot.val());
      });

    });



    function createPlayer2(arg) {
      turnCounter += 2;
      moves.push(null);
      console.log('player 2 created');
      game.Player.player2.symbol = 'o';
      player2 = game.Player.player2.symbol;
      player1 = null;
    }

    // sets player symbol for board
    if (moves.length < 1) {
      console.log(game.Player.player1.name);
      game.Player.player1.symbol = 'x';
      player1 = game.Player.player1.symbol;
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
          space.move = player2;
          console.log('I am player 2 o');
          $(localVidStream).addClass('o');
          $(this).text(context.drawImage(video, 0, 0, 640, 480));
          gameRef.push(space);
        } else {
          $(localVidStream).addClass('x');
          myTurn = false;
          turnCounter += 1;
          moves.push(null);
          console.log(player1);
          space.move = player1;
          $(this).text(context.drawImage(video, 0, 0, 640, 480));
          console.log('I am player 1 x');
          gameRef.push(space);
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
        
          // $('#winner').append('<div class="overlay">' + game.Player.player1.name + ' WINS!</div>').addClass('show');
          // document.getElementById('start-game').style.display = 'inline';
          // game.board.restartGame();
          // videoChat.MakeCall();
          canvasElems.unbind("click");
 
          $('.overlay').css('height','100%').text('');
          $('.has-won').css('display', 'block');

          if ($(localVidStream).hasClass('x')) {
            $(localVidStream).addClass('winner');
          } else {
            $(remoteVidStream).addClass('winner');
          }
      }

      if (spanElems[0].innerHTML == 'o' && spanElems[1].innerHTML == 'o' && spanElems[2].innerHTML == 'o' ||
          spanElems[3].innerHTML == 'o' && spanElems[4].innerHTML == 'o' && spanElems[5].innerHTML == 'o' ||
          spanElems[6].innerHTML == 'o' && spanElems[7].innerHTML == 'o' && spanElems[8].innerHTML == 'o' ||
          spanElems[0].innerHTML == 'o' && spanElems[3].innerHTML == 'o' && spanElems[6].innerHTML == 'o' ||
          spanElems[1].innerHTML == 'o' && spanElems[4].innerHTML == 'o' && spanElems[7].innerHTML == 'o' ||
          spanElems[2].innerHTML == 'o' && spanElems[5].innerHTML == 'o' && spanElems[8].innerHTML == 'o' ||
          spanElems[0].innerHTML == 'o' && spanElems[4].innerHTML == 'o' && spanElems[8].innerHTML == 'o' ||
          spanElems[2].innerHTML == 'o' && spanElems[4].innerHTML == 'o' && spanElems[6].innerHTML == 'o' ) {
          
          // $('#winner').append('<div class="overlay">' + game.Player.player2.name + ' WINS!</div>').addClass('show');
          // document.getElementById('start-game').style.display = 'inline';
          // game.board.restartGame();
          // videoChat.MakeCall();
          canvasElems.unbind("click");
          $('.overlay').css('height','100%').text('');
          $('.has-won').css('display', 'block');

          if ($(localVidStream).hasClass('o')) {
            $(localVidStream).addClass('winner');
          } else {
            $(remoteVidStream).addClass('winner');
          }
          
      }
    }
  };

    return newGame;
  
})();