var takePic = takePic || {};

takePic.Smile = (function() {

  function Smile() {}

  var s = Smile.prototype = new Smile();

  s.getAllCanvas = function() {
    var canvas = $('canvas');
    for (var i = 0; i < canvas.length; i+=1) {
      var context = canvas[i].getContext('2d');
    }
  };

  s.snapPic = function() {
    var video = $('#local-media > video');
    this.getContext().drawImage(video, 0, 0, 150, 150);
  };



  s.take2 = function(elem) {
    // var canvas = document.getElementById('canvas');
    // var context = canvas.getContext('2d');
    // var photo = document.getElementById('photo');
    
    // var video = document.getElementById('local-video');

    // var pre =  document.getElementById('remote-media');
    // var video = pre.getElementsByTagName('video');
    // var canvas = document.getElementById('canvas');
    // var context = canvas.getContext('2d');

    // context.drawImage(video, 0, 0, 640, 480);

    // var context = elem.getContext('2d');
    // var video = document.getElementById('video');
    // context.drawImage(video, 0, 0, 640, 480);

  };


  return s;
});