var game = game || {};

game.Player = (function() {
  
  function Player(name, symbol) {
    this.name = name;
    this.symbol = symbol;
  }

  var name;

  var p = Player.prototype = new Player();

  p.player = Player.prototype = new Player();
  p.player2 = Player.prototype = new Player();

  p.setSymbol = function(symbol) {
    this.symbol = symbol;
  };

  p.setUserName = function(name) {
    this.player.name = name;
    name = name;
    return name;
  };

  p.getUserName = function() {
    return name;
  };

  return p;
})();