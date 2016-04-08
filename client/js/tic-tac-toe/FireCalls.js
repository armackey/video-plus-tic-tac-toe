var fire = fire || {};
var game = game || {};

fire.FireCalls = (function() {
  var self = this;

  function FireCall() {}

  var f = FireCall.prototype = new FireCall();
  var room;

  f.newRef = function() {
    var ref = new Firebase('https://tic-tac-toe-cam.firebaseio.com/' );
    return ref;
  };

  f.users = function() {
    var usersRef = f.newRef().child('users');
    return usersRef;
  };

  f.setRoom = function(num) {
    console.log(num + ' from firecalls');
    room = num;
    return room;
  };

  // f.destroyFirebaseRoot = function() {
  //   f.newRef().remove();
  // };
  f.gameNum = function() {    
    console.log(room);
    var playerRef = f.newRef().child(room);
    return playerRef;
  };

  f.randomKey = function() {    
    var random1 = Math.floor((Math.random() * 25) + 1);
    var random2 = Math.floor((Math.random() * 10) + 1);
    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    return random1 + random2 + letters[random1];
  };

  f.createNewGameRef = function() {
    var gameRef = f.gameNum().child('game');
    return gameRef;
  };




  return f;
})();