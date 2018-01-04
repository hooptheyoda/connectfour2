//game
// After user 2 is set, start game, it will be another function
//html
<div id="game2Name" >
  <div id="output"></div>
</div>
// main.js
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
//index.js
socket.on('game', function(data) {
  currentRoom(data);
  // Get Players By Room
 roomarr = userp.group(function (item) {
   return item.userRM;
  // console.log('group by roomarr');
 // console.log(roomarr);
 });

  for (let i = 0; i < roomarr.length; i++) {
   console.log('group by room roomarr');
   console.log(roomarr[i].data);
 }
  io.sockets.in("room-"+roomu).emit('play', roomarr[i].data);
});

//game.js
socket.on('play', function(data) {
var grid = clickableGrid(6,7,function(el,row,col,i,x){
    getWinnder(row,col,i);
    document.getElementById(i).style.backgroundColor = '#f00';
    console.log("You clicked on element:",el);
    console.log("You clicked on row:",row);
    console.log("You clicked on col:",col);
    console.log("You clicked on item #:",i);
    console.log("You clicked on item #:",x);
});
});







//game.js
socket.on('play', function(data) {
  console.log(data);
 grid = clickableGrid(6,7,function(el,row,col,i){
    getWinnder(row,col,i);
    console.log("You clicked on element:",el);
    console.log("You clicked on row:",row);
    console.log("You clicked on col:",col);
    console.log("You clicked on item #:",i);
});
});

//index.js
//game.js
