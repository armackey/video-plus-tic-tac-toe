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
  var pressedStart = false;
  var tempName;
  var room;

  function MakeCall() {
    
    var that = this;
    var inCall = false;
    var pNames = [];
    var newItem = false;
    var startGame = document.getElementById('start-game');
    var usersRef = new fire.FireCalls.users();
    var amOnline = new fire.FireCalls.users().child('online');
    var userPresence;
    var startGameRef = fire.FireCalls.newRef().child('start');    
    var notifyRef = startGameRef.child('notify');
    var inGame = false;



    startGame.onclick = function() {
      if (!inCall) {
        $('.start-overlay').addClass('show');
      } else {
        pressedStart = true;
        game.Player.player.symbol = 'x';
        // startGameRef.push('b');
        // create game ref
        // notify other use
        room = fire.FireCalls.randomKey();
        notifyRef.push(room);
      }
    };


    document.getElementById('grab-username').onclick = function() {
      document.getElementById("myNav").style.height = "0%";
      var user = {};
      user.username = document.getElementById('username').value;
      game.Player.setUserName(user.username);
      usersRef.push(user.username);
      createConversation(user);
      settingPresence(user);
    };

    function settingPresence(user) {
      userPresence = amOnline.child('presence/' + user.username);
      usersRef.on('value', function(snapshot) {

        if (snapshot.val()) {
          console.log(snapshot.val());
          userPresence.onDisconnect().remove();
          userPresence.set(true);
        }
        
      });
    }

    function pressedStartGame() {

      startGameRef.on('child_added', function(data) {
        if (inGame) {
          return;
        }
        inGame = true;
        document.getElementById('start-game').style.display = 'none';
        game.GameLogic.start();

        startGameRef.remove();
      });
    }


    


        
      
    notifyRef.on('child_added', function(data) {
      if (inGame || !inCall) {
        return;
      }
      console.log(data.val());
      if (typeof data.val() === 'string') {
        room = data.val();
      }

      document.getElementById('start-game').style.display = 'none';
      if (pressedStart) {
        $('.notify-pressed-start').addClass('show');
        console.log('waiting for response');
      } else {
        $('.notify-answer-start').addClass('show');
      }
      
      if (data.val().answer === "yes") {
        console.log(room + ' from makecalls');
        
        fire.FireCalls.setRoom(room);
        pressedStartGame();
        $('.notify-pressed-start').addClass('remove');
        $('.notify-answer-start').addClass('remove');
      } else {
        // idk yet...
      }
    });
    

    document.getElementById('play').onclick = function() {
      notifyRef.push({answer:"yes"});
    };

    document.getElementById('no').onclick = function() {
      notifyRef.push({answer:'no'});
    };

    function whosOnline(online) {
      var key;
      for (key in online.presence) {
        writeToDOM(key);
      }
    }

    function writeToDOM(name) {
      if (game.Player.setUserName() !== name) {
        $('.online').append('<div class="user-list">'+ name + ' is online' + '</div>');  
      } else {
        $('.online').append('<div class="only-me">' + 'You\'re the only one online :\'( open a 2nd tab..?' + '</div>');  
      }
    }


    // gets user names
    usersRef.on('child_added', function(snap) { 
      if (!newItem) {
        return;
      }
      console.log(snap.val());


      if (typeof snap.val() === 'object') {
        whosOnline(snap.val());
        return;
      }
      console.log(snap.val());
      // // if length of snap is greater than 1 return eh...
      // if (snap.val() === game.Player.player1.name) {
      //   return;
      // }

      // if (!game.Player.player2.name) {
      //   game.Player.player2.name = snap.val();
      // }
      // pNames.push(snap.val());
      // if (snap.val() === undefined) {
      //   return;
      // }
      // if (!game.Player.player1.name) {
      //   game.Player.player1.name = pNames[0];
      // } else {
      //   game.Player.player2.name = pNames[1];
      //   // usersRef.remove();
      // }
    });

    usersRef.once('value', function(snap) {
      newItem = true;
    });

    usersRef.once('value', function(snap) {
      newItem = true;
    });


    function addIdsToCanvas() {
      var remoteVideo = document.getElementById('remote-media');
      if (!remoteVideo) {
        console.log('remote media not found');
      } else {
        $('#remote-media > video').attr('id', 'remote-video');
        $('#local-media > video').attr('id', 'local-video');
      }
    }


    function createConversation(user) {
      $.post('/token', user).then(function(data) {
          
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
      log("Welcome, " + conversationsClient.identity + ". ");

      conversationsClient.on('invite', function(invite) {
        game.Player.player2.name = invite.from;
        log('Incoming invite from: ' + invite.from);
        invite.accept().then(conversationStarted);



      });

        // Bind button to create conversation
        document.getElementById('button-invite').onclick = function() {
          $('.start-overlay').addClass('remove');
          var inviteTo = document.getElementById('invite-to').value;
           game.Player.player2.name = inviteTo;
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
        
        document.getElementById('start-game').style.display='block';
        document.getElementById('button-invite').style.display = 'none';
        // document.getElementById('button-preview').style.display = 'none';
        document.getElementById('grab-username').style.display = 'none';
        document.getElementById('invite-to').style.display = 'none';
        document.getElementById('username').style.display = 'none';

        // document.getElementById('end-call').style.display = 'inline';
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

        // document.getElementById('end-call').style.display = 'none';

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
        // log("Participant '" + participant.identity + "' connected");
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

    // document.getElementById('end-call').onclick = function() {
    //   self.endCall();
    // };

    // Activity log
    function log(message) {
      document.getElementById('log-content').innerHTML = message;
    }
  }
  return MakeCall;
})();