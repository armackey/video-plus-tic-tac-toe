var game = game || {};

game.Player = (function() {
  
  function Player() {}

  var p = Player.prototype = new Player();

  p.setSymbol = function(symbol) {
    this.symbol = symbol;
  };

  p.setUserName = function() {
    var username = document.getElementById('username').value;
    return username;
  };

  return p;
})();