// --------------------- DECLARE VARIABLES --------------
var indexPage = document.getElementById('indexPage');
var enterusername = document.getElementById('enterusername');
var start = document.getElementById('start');
var messagebox = document.getElementById('messagebox');
var btnIC = document.getElementById('btnIndexContainer');
var btnGC = document.getElementById('btnGameContainer');
var start = document.getElementById('start');
var game2Name = document.getElementById('game2Name');
var mC = document.getElementById('mC');
var pointereventsnone = document.getElementById('pointereventsnone');
var game2Name = document.getElementById('game2Name');
var game = document.getElementById('game');
var contain = document.getElementById('contain');

// ---------------------- DECLARE SOCKET VARIABLES -----------------
var socket = io();
var user;



// ---------------------- MAIN FUNCTIONS -----------------
// Ask User if Sure they want to refresh page
window.onbeforeunload = function(){
    return confirm("Are you sure you want to close the window?");
}

function startNew() {
  btnIC.classList.add('hidden');
  btnGC.classList.remove('hidden');
}

function directions() {
  btnIC.classList.add('hidden');
  contain.classList.remove('hidden');
}

function goback() {
  contain.classList.add('hidden');
  btnIC.classList.remove('hidden');
}

function gameT2() {
  btnGC.classList.add('hidden');
  enterusername.classList.remove('hidden');
}

// Enter Chat Room
function enterRoom() {
  enterusername.classList.add('hidden');
  game2Name.classList.remove('hidden');
  messagebox.classList.remove('hidden');
  game2Name.classList.remove('hidden');
}

//Set Username
function setUsername() {
  socket.emit('setUsername', document.getElementById('name').value);
  document.getElementById('userNameText').innerHTML = document.getElementById('name').value;
};
//Send Message
function sendMessage() {
  var msg = document.getElementById('message').value;
  if(msg) {
    socket.emit('msg', {message: msg, user: user});
    }
    console.log("message is sending button works");
}

// Leave Chat Room
function leaveRoom(){
  socket.emit('leaveRoom', {user: user});
  enterusername.classList.add('hidden');
  game.classList.add('hidden');
  messagebox.classList.add('hidden');
  btnIC.classList.remove('hidden');
};

// ----------------- SOCKET IO ON CLIENT (USER OUTPUTS) --------------
// Check User Exists
socket.on('userExists', function(data) {
  document.getElementById('error-container').innerHTML = data;
});

// Get Username & Message container
socket.on('userSet', function(data) {
  user = data.username;
  userId = data.userId;
  room = data.userRM;
  player = data.player;
  enterusername.classList.add('hidden');
  messagebox.classList.remove('hidden');

  if(player === 1) {
    document.getElementById('welcome').innerHTML = 'Player 1'
    document.getElementById('notice').innerHTML = 'Welcome Player 1! Waiting for Player 2...'
  } else {
    document.getElementById('welcome').innerHTML = 'Player 2'
    document.getElementById('notice').innerHTML =  ' Waiting for Player1 to make a move';
    pointereventsnone.classList.remove('hidden');
    socket.emit('game', {user: user});
  }
});

// Makes the Remaining users Leave Room
socket.on('userLeft', function(data) {
  if(user) {
    document.getElementById('message-container').innerHTML += '<div><b>' +
        data.user + '</b>: ' + 'has left this game session. END OF GAME!' + '</div>';
        setTimeout(function() {
        enterusername.classList.add('hidden');
        messagebox.classList.add('hidden');
        btnIC.classList.remove('hidden');
        game.innerHTML = '';
        document.getElementById('message-container').innerHTML = '';
        socket.emit('usersLeaveRoom', {user: user});
      }, 20000)
  }

});

// Get New Message
socket.on('newmsg', function(data) {
  if(user) {
    document.getElementById('message-container').innerHTML +=
      '<div id="messageOutput">'
      +'<figure>'
      + '<img src="http://www.gravatar.com/avatar/%7Bmd5email%7D?s=50&d=mm" alt="mm" />'
      + '</figure>'
      +'<div id= "messageOCH">'
      +'<header>'
      +'<h4>' + data.user +' <time>10:28pm</time>'+'</h4>'
      +'</header>'
      + '<p>' + data.message + '</p>'
      +'</div>'
      +'</div>';
 }
});

// Show data of Room Connection
socket.on('connectToRoom',function(data) {
   console.log(data);
});
