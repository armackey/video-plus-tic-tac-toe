var game = game || {};

game.board = (function() {
  function Board() {}

  var b = Board.prototype = new Board();

  b.createBoard = function(num) {
    this.num = num;
    $('#board').append('<table></table>');
    for (var i = 0; i < num; i+=1) {
      if (i % 3 === 0) {
        $('table').append('<tr><td><span></span><canvas id="canvas" width="400" height = "300"></canvas></td><td><span></span><canvas id="canvas" width="400" height = "300"></canvas></td><td><span></span><canvas id="canvas" width="400" height = "300"></canvas></td></tr>');  
      }
      // var space = document.createElement('div');
      // document.getElementById('board').appendChild(space);
    }
  };

  // b.getBoard = function() {
  //   var spaces = document.getElementById('board').getElementsByTagName('div');
  //   return spaces;
  // };

  b.destroyBoard = function() {
    var canvasSpace = $('canvas');
    $(canvasSpace).each(function(i, elem, arr) {
      elem.remove();
    });
  };

  return b;
})();