// --------------------- DECLARE VARIABLES --------------
var output = document.getElementById('output');
var count = 0;
var cell;
var grid;
var roomusers;
var usernowroom;
// ----------------- MAIN WINDOW ONLOAD FUNCTION --------------
// Ask User if Sure they want to refresh page
window.onbeforeunload = function(){
    return confirm("Are you sure you want to close the window?");
}

// ----------------- SOCKET IO ON CLIENT (USER OUTPUTS) --------------
// Create Grid
socket.on('play', function(data,roomup) {
// Create Grid for Board using Clicakble
grid = clickableGrid(6,7,function(el,row,col,i){});
  //Print Grid to HTML
  output.appendChild(grid);
  // Display count for testing
  // console.log('this is count');
  // console.log(count);
  // Return roomusers
  roomusers = roomup;
});

socket.on('move', function(data, count, roomup) {
  if (count === 0) {
    document.getElementById('notice').innerHTML = 'Waiting for Player 2 to make a move';
    document.getElementById(data.divnum).style.backgroundColor = '#f00';
  }else {
    document.getElementById('notice').innerHTML = 'Waiting for Player 1 to make a move';
    document.getElementById(data.divnum).style.backgroundColor = 'yellow';
  }
});

socket.on('hidecursor', function( data,count,roomup) {
     pointereventsnone.classList.remove('hidden');
});

socket.on('showcrusor', function(data) {
     pointereventsnone.classList.add('hidden');
});

socket.on('showWinner', function(data) {
    document.getElementById('output').style.opacity = ' 0.2';
    document.getElementById('gameover').innerHTML = 'GAME OVER';
   if (data.winner === 1) {
     document.getElementById('notice').innerHTML = '';
     document.getElementById('notice').innerHTML = 'Player 1 WINS!';
   } else {
     document.getElementById('notice').innerHTML = '';
     document.getElementById('notice').innerHTML = 'Player 2 WINS!';
   }
   setTimeout(function() {
   document.getElementById('welcome').innerHTML = 'In 10 Seconds this page will clear. Play Again =)';
 }, 3000);
   setTimeout(function() {
   enterusername.classList.add('hidden');
   messagebox.classList.add('hidden');
   btnIC.classList.remove('hidden');
   document.getElementById('welcome').innerHTML = '';
   game.innerHTML = '';
   document.getElementById('message-container').innerHTML = '';
   socket.emit('usersLeaveRoom', {user: user});
 }, 10000);
});

socket.on('retry', function(data) {
  alert('Can not place peice there. Try again');
});

// ---------------------- MAIN GAME FUNCTIONS -----------------
function clickableGrid(rows, cols, callback){
    var i=43;
    var grid = document.createElement('div');
    grid.className = 'grid';
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('div'));
        for (var c=0;c<cols;++c){
            cell = tr.appendChild(document.createElement('div'));
            cell.className = 'circle';
            cell.setAttribute("id", --i);
            cell.addEventListener('click', (function(el,r,c,i){
                 return function(){
                    callback(el,r,c,i);
                    console.log('this is user in clickable');
                    console.log(user);
                    socket.emit('turn',{user:user, divnum:i, row: r, col:c});
                }
            })(cell,r,c,i),false);
        }
    }
    return grid;
}
