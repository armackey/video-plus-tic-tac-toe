var game = game || {};

game.start = (function() {
  function Start() {}
  game.board.createBoard(9);

  return Start;
})();