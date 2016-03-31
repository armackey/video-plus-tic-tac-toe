var videoChat = videoChat || {};
var game = game || {};
var fire = fire || {};

videoChat.MakeCall = (function() {

  var conversationsClient;
  var activeConversation;
  var previewMedia;
  var identity;
  var self = this;
  var videoElems = document.getElementsByTagName('video');
  var localVideo = document.getElementById('local-media');
  var board = document.getElementsByTagName('canvas');

  function MakeCall() {
    
    var that = this;
    var inCall = false;
    var pNames = [];
    var newItem = false;
    var startGame = document.getElementById('start-game');
    // that.ref = new Firebase('https://tic-tac-toe-cam.firebaseio.com/');
    that.usersRef = new fire.FireCalls.users();
    that.startGameRef = fire.FireCalls.newRef().child('start');    
    // that.notifyRef = that.startGameRef.child('notify');

    if (board.length > 0) {
      console.log('found board');
      // erase game reference on firebase
    }

    startGame.onclick = function() {
      if (!inCall) {
        $('.start-overlay').addClass('show');
      } else {
        that.startGameRef.push('b');
        // notify other use
      }
    };

    that.startGameRef.on('child_added', function(data) {
      document.getElementById('start-game').style.display = 'none';
      game.GameLogic.start();

      that.startGameRef.remove();
    });


        
      
    // that.notifyRef.on('child_added', function(data) {
    //   document.getElementById('start-game').style.display = 'none';
    //   if (pressedStart) {
    //     $('.notify-pressed-start').addClass('show');
    //     console.log('waiting for response');
    //   } else {
    //     $('.notify-answer-start').addClass('show');
    //   }
    //   console.log(data);
    //   if (data.answer === 'yes') {
    //     console.log('start game');
    //     $('.notify-pressed-start').addClass('remove');
    //     $('.notify-answer-start').addClass('remove');
    //   } else {
    //     // idk yet...
    //   }
    // });
    

    // document.getElementById('play').onclick = function() {
    //   that.notifyRef.push({answer:'yes'});
    // };

    // document.getElementById('no').onclick = function() {
    //   that.notifyRef.push({answer:'no'});
    // };


    // gets user names
    that.usersRef.on('child_added', function(snap) { 
      if (!newItem) {
        return;
      }
      pNames.push(snap.val());
      if (!game.Player.player1.name) {
        console.log('p1');
        game.Player.player1.name = pNames[0];
      } else {
        console.log('p2');
        game.Player.player2.name = pNames[1];
        // that.usersRef.remove();
      }
      
      console.log(pNames);
      console.log('player 1 + ' + game.Player.player1.name);
      console.log('player 2 + ' + game.Player.player2.name);
    });

    that.usersRef.once('value', function(snap) {
      newItem = true;
      console.log(snap.val());
    });

    that.usersRef.once('value', function(snap) {
      newItem = true;
    });

    document.getElementById('grab-username').onclick = function() {
      document.getElementById("myNav").style.height = "0%";
      var user = {};
      user.username = game.Player.setUserName();
      that.usersRef.push(user.username);
      createConversation(user);
    };

    function addIdsToCanvas() {
      var remoteVideo = document.getElementById('remote-media');
      console.log('addIdsToCanvas');
      if (!remoteVideo) {
        console.log('remote media not found');
      } else {
        $('#remote-media > video').attr('id', 'remote-video');
        $('#local-media > video').attr('id', 'local-video');
      }
    }


    function createConversation(user) {
      $.post('/token', user).then(function(data) {
        console.log(data);
          
        var accessManager = new Twilio.AccessManager(data.token);

        // Check the browser console to see your generated identity. 
        // Send an invite to yourself if you want! 

        // Create a Conversations Client and connect to Twilio
        conversationsClient = new Twilio.Conversations.Client(accessManager);
        
        conversationsClient.listen().then(clientConnected, function(error) {
          log('Could not connect to Twilio: ' + error.message);
        });
      });
    }
    // Successfully connected!
    function clientConnected() {
      document.getElementById('invite-controls').style.display = 'block';
      log("Welcome, " + conversationsClient.identity + ". We're awaiting invites from friends.");

      conversationsClient.on('invite', function(invite) {
        log('Incoming invite from: ' + invite.from);
        invite.accept().then(conversationStarted);
      });

        // Bind button to create conversation
        document.getElementById('button-invite').onclick = function() {
          console.log(game.Player.player1.name, game.Player.player2.name);
          $('.start-overlay').addClass('remove');
          var inviteTo = document.getElementById('invite-to').value;
          if (activeConversation) {
            // Add a participant
            activeConversation.invite(inviteTo);
            } else {
            // Create a conversation
            var options = {};
            if (previewMedia) {
              options.localMedia = previewMedia;
            }
            conversationsClient.inviteToConversation(inviteTo, options).then(conversationStarted, function (error) {
              log('Unable to create conversation');
              console.error('Unable to create conversation', error);
            });
          }
        };
    }

    function toggleButtons() {
      if (inCall) {
        hideButtons();
      } else {
        showButtons();
      } 

      // if in call
      function hideButtons() {
        // when users are not connected, we want start game button disabled
        

        document.getElementById('button-invite').style.display = 'none';
        // document.getElementById('button-preview').style.display = 'none';
        document.getElementById('grab-username').style.display = 'none';
        document.getElementById('invite-to').style.display = 'none';
        document.getElementById('username').style.display = 'none';

        document.getElementById('end-call').style.display = 'inline';
      }

      // if not in call
      function showButtons() {
        // when users are not connected, we want start game button disabled
        // document.getElementById('start-game').style.display = 'inline';

        document.getElementById('button-invite').style.display = 'inline';
        // document.getElementById('button-preview').style.display = 'inline';
        document.getElementById('grab-username').style.display = 'inline';
        document.getElementById('username').style.display = 'inline';
        document.getElementById('invite-to').style.display = 'inline';

        document.getElementById('end-call').style.display = 'none';

        // ensure that local media removes on firefox
        $('#local-media > video').remove();
      }
    }

    // Conversation is live
    function conversationStarted(conversation) {
      log('In an active Conversation');
      activeConversation = conversation;
      // Draw local video, if not already previewing
      if (!previewMedia) {
        conversation.localMedia.attach('#local-media');
        addIdsToCanvas();
      }

      // When a participant joins, draw their video on screen
      conversation.on('participantConnected', function(participant) {
        inCall = true;
        participant.media.attach('#remote-media');

        toggleButtons();
        log("Participant '" + participant.identity + "' connected");
        addIdsToCanvas();
      });

      // When a participant disconnects, note in log
      conversation.on('participantDisconnected', function(participant) {
        inCall = false;
        toggleButtons();
        
        log("Participant '" + participant.identity + "' disconnected");
      });

      // When the conversation ends, stop capturing local video
      conversation.on('ended', function(conversation) {
        log("How about we call another friend " + conversationsClient.identity + "?");
        conversation.localMedia.stop();
        conversation.disconnect();
        activeConversation = null;
      });

      self.endCall = function() {
        conversation.localMedia.stop();
        conversation.disconnect();
        activeConversation = null;
      };
    }

    document.getElementById('end-call').onclick = function() {
      self.endCall();
    };

    //  Local video preview
    // document.getElementById('button-preview').onclick = function() {
      
    //   document.getElementById('local-media').style.display = 'inline';
    //   if (!previewMedia) {
    //     previewMedia = new Twilio.Conversations.LocalMedia();
    //     Twilio.Conversations.getUserMedia().then(
    //     function(mediaStream) {
    //       previewMedia.addStream(mediaStream);
    //       previewMedia.attach('#local-media');
    //       $('#local-media > video').attr('id', 'local-video');
    //     },
    //     function(error) {
    //       console.error('Unable to access local media', error);
    //       log('Unable to access Camera and Microphone');
    //     });
    //   }
    // };

    // Activity log
    function log(message) {
      document.getElementById('log-content').innerHTML = message;
    }
  }
  return MakeCall;
})();