var videoChat = videoChat || {};
var takePic = takePic || {};
var game = game || {};

(function() {
  window.onload = function() {

    // Check for WebRTC
    if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
      alert('WebRTC is not available in your browser. This web app will not work!! Please use Chrome or Firefox');
    } else {
      videoChat.call = new videoChat.MakeCall();
    }

  };
})();