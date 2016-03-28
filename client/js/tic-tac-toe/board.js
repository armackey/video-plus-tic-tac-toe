var game = game || {};

game.board = (function() {
  function Board() {}

  var b = Board.prototype = new Board();

  b.createBoard = function(num) {
    this.num = num;
    for (var i = 0; i < num; i+=1) {
      var space = document.createElement('div');
      document.getElementById('board').appendChild(space);
    }
  };

  b.getBoard = function() {
    var spaces = document.getElementById('board').getElementsByTagName('div');
    return spaces;
  };

  return b;
})();