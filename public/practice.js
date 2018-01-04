// message
// html
<div id= "inputContainer">
<input type = "text" id= "message"  placeholder= "Enter message">
<button type="button"  id= "msubmit" onclick= "sendMessage()">Send</button>
// main.js
function sendMessage() {
  var msg = document.getElementById('message').value;
  if(msg) {
    socket.emit('msg', {message: msg, user: user});
    }
}
//index.js
socket.on('msg', function(data) {
  currentRoom(data);
  io.sockets.in("room-"+roomu).emit('newmsg', data);

});
// main.js
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
