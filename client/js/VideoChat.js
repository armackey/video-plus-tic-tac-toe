var videoChat = videoChat || {};
var takePic = takePic || {};
var game = game || {};

(function() {
  window.onload = function() {

    // document.getElementById("myNav").style.height = "100%";
    // Check for WebRTC
    // console.log(takePic);
    if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
      alert('WebRTC is not available in your browser. This web app will not work!! Please use Chrome or Firefox');
    } else {
      videoChat.call = new videoChat.MakeCall();
    }

  };
})();