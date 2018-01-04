//leave room
// html
<button id="leaveRoom" type="button" onclick= "leaveRoom()">Leave Room</button>
// main.js
function leaveRoom(){
  socket.emit('leaveRoom', {user: user});
  chatBox.classList.add('hidden');
  messagebox.classList.add('hidden');
  indexPage.classList.remove('hidden');
};
//index.js
socket.on('leaveRoom', function(data) {
  currentRoom(data);
  io.sockets.in("room-"+roomu).emit('userLeft', data);
  socket.leave("room-"+roomu);
  updateUsers(data);
  // put a time interval here before deleting users from room
  // or put a time interval before socket.emit
});
// main.js
socket.on('userLeft', function(data) {
  if(user) {
    document.getElementById('message-container').innerHTML += '<div><b>' +
        data.user + '</b>: ' + 'has left this chat session.' + '</div>'
  }
  // wait 30 seconds then leave
  // on indexpage write  chat ended when user left session
});
