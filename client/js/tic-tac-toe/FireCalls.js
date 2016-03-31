var fire = fire || {};
var game = game || {};

fire.FireCalls = (function() {
  var self = this;

  function FireCall() {}

  var f = FireCall.prototype = new FireCall();
  

  f.newRef = function() {
    var ref = new Firebase('https://tic-tac-toe-cam.firebaseio.com/' );
    return ref;
  };

  f.users = function() {
    var usersRef = f.newRef().child('users');
    return usersRef;
  };

  // f.destroyFirebaseRoot = function() {
  //   f.newRef().remove();
  // };
  f.playerRef = function() {
    
    var playerRef = f.newRef().child('player-moves ' + game.Player.player1.name + ' vs ' + game.Player.player2.name);
    return playerRef;
  };

  f.createNewGameRef = function() {
    var gameRef = f.playerRef().child('game');
    return gameRef;
  };




  return f;
})();