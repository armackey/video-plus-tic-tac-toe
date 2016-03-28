var fire = fire || {};

fire.calls = (function() {
  function MakeCalls() {}

  var ref = new Firebase('https://tic-tac-toe-cam.firebaseio.com');
  
  return ref;
})();