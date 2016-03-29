var game = game || {};

game.board = (function() {
  function Board() {}

  var b = Board.prototype = new Board();

  b.createBoard = function(num) {
    this.num = num;
    $('#board').append('<table></table>');
    for (var i = 0; i < num; i+=1) {
      if (i % 3 === 0) {
        $('table').append('<tr><td></td><td></td><td></td></tr>');  
      }
      // var space = document.createElement('div');
      // document.getElementById('board').appendChild(space);
    }
  };

  b.getBoard = function() {
    var spaces = document.getElementById('board').getElementsByTagName('div');
    return spaces;
  };

  return b;
})();