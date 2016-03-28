var videoChat = videoChat || {};

videoChat.MakeCall = (function() {
  var conversationsClient;
  var activeConversation;
  var previewMedia;
  var identity;
  var self = this;
  var videoElems = document.getElementsByTagName('video');
  var localVideo = document.getElementById('local-media');
  var inCall = false;

  function MakeCall() {



    document.getElementById('grab-username').onclick = function() {
      document.getElementById("myNav").style.height = "0%";
      var user = {};
      user.username = videoChat.CreateUser.getUser();
      createConversation(user);
    };

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
        inCall = false;
      } else {
        showButtons();
        inCall = true;
      } 

      function hideButtons() {
        document.getElementById('button-invite').style.display = 'none';
        // document.getElementById('button-preview').style.display = 'none';
        document.getElementById('grab-username').style.display = 'none';
        document.getElementById('invite-to').style.display = 'none';
        document.getElementById('username').style.display = 'none';

        document.getElementById('end-call').style.display = 'inline';
      }

      function showButtons() {
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
      }

      // When a participant joins, draw their video on screen
      conversation.on('participantConnected', function(participant) {
        inCall = true;
        toggleButtons();
        log("Participant '" + participant.identity + "' connected");
        participant.media.attach('#remote-media');
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