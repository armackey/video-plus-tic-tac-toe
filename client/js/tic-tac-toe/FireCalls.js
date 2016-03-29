var fire = fire || {};
var game = game || {};

fire.FireCalls = (function() {
  function FireCall() {}

  f = FireCall.prototype = new FireCall();



  f.newRef = function() {
    var ref = new Firebase('https://tic-tac-toe-cam.firebaseio.com/' );
    return ref;
  };


  

  return f;
})();