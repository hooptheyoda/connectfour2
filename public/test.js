<div id="test1" >
  <div id="tester1" onclick="textplace()"></div>
</div>

function textplace(){
  socket.emit('testing1', {user: user});
}

socket.on('testing1', function(data) {
  currentRoom(data);
  io.sockets.in("room-"+roomu).emit('newtesting1', data);

});

socket.on('newtesting1', function(data) {
  if(user) {
 document.getElementById('tester1').backgroundColor = '#f00';
  }
});


// cell.addEventListener('click', (function(el,r,c,i){
//      return function(){
//         callback(el,r,c,i);
//         socket.emit('move', {user: user});
//     }
// })(cell,r,c,i),false);
//
//
// ocket.on('connectToRoom', function(data) {
//     console.log('this is data');
//     console.log(data);
//     document.getElementById('userStuff').innerHTML +=
//     '<div>'
//     + 'username ' + user
//     + 'userId ' + userId
//     + 'room ' + room
//     + 'player ' + player
//     + '</div>';
// });
