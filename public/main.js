var indexPage = document.getElementById('indexPage');
var chatBox = document.getElementById('chatBox');
var start = document.getElementById('start');
var messagebox = document.getElementById('messagebox');

var btnIC = document.getElementById('btnIndexContainer');
var btnGC = document.getElementById('btnGameContainer');
var start = document.getElementById('start');
var game2Name = document.getElementById('game2Name');
var mC = document.getElementById('mC');


var socket = io();
var user;

// Ask User if Sure they want to refresh page
window.onbeforeunload = function(){
    // leaveRoom();
    return confirm("Are you sure you want to close the window?");
}

function startNew() {
  btnIC.classList.add('hidden');
  btnGC.classList.remove('hidden');
}

function gameT2() {
  btnGC.classList.add('hidden');
  chatBox.classList.remove('hidden');
}

// Enter Chat Room
function enterRoom() {
  chatBox.classList.add('hidden');
  game2Name.classList.remove('hidden');
  messagebox.classList.remove('hidden');
}


function textplace(){
  socket.emit('testing1', {user: user});
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
}

// Leave Chat Room
function leaveRoom(){
  socket.emit('leaveRoom', {user: user});
  chatBox.classList.add('hidden');
  messagebox.classList.add('hidden');
  indexPage.classList.remove('hidden');
};

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
  chatBox.classList.add('hidden');
  messagebox.classList.remove('hidden');

  if(player === 1) {
    document.getElementById('notice').innerHTML = 'Welcome Player 1! Waiting for Player 2...'
  } else {
    document.getElementById('notice').innerHTML = 'Welcome Player 2!'
    socket.emit('game', {user: user});
  }


  // document.getElementById('userStuff').innerHTML +=
  // '<div>'
  // + 'username ' + user
  // + 'userId ' + userId
  // + 'room ' + room
  // + 'player ' + player
  // + '</div>';
});

// Get New Message
socket.on('userLeft', function(data) {
  if(user) {
    document.getElementById('message-container').innerHTML += '<div><b>' +
        data.user + '</b>: ' + 'has left this chat session.' + '</div>'
  }
  // wait 30 seconds then leave
  // on indexpage write  chat ended when user left session
});

// End Chat

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

socket.on('newtesting1', function(data) {
  // if(user) {
    document.getElementById('tester1').style.backgroundColor = '#f00';
  // }
});

// Show data of Room Connection
socket.on('connectToRoom',function(data) {
   console.log(data);
});
