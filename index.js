// ----------------- DECLARE CONNECTION VARIABLES --------------
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');

// ----------------- DECLARE LISTENING PORT --------------
http.listen(port, function(){
  console.log('listening on *:' + port);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// ----------------- DECLARE VARIABLES --------------
users = [];
var userp = [];
var currUser;
var roomarr;
var roomcount;
var roomu;
var roomup;
var tryagain;
var winner = 0;

var count = 0;
var p = 0;
var roomno = 1;
var usercount = 1;
var player1 = 1;
var player2 = 2;
var x =[ [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0] ];


// ----------------- SOCKET IO ON CONNECTION --------------
io.on('connection', function(socket) {
   //Set username
   socket.on('setUsername', function(data) {
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
        if(io.nsps['/'].adapter.rooms["room-"+roomno]
        && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) {
        roomno++;
        }
        socket.join("room-"+roomno);

        // Set userp ----- room, usersame, player Id, player number
        if (usercount === 1) {
          userp.push( {username: data, userId: socket.id, userRM:roomno, player: 1});
          socket.emit('userSet', {username: data, userId: socket.id, userRM:roomno, player: 1});
          usercount = 2;
        }
        else {
          userp.push( {username: data, userId: socket.id, userRM:roomno, player: 2});
          socket.emit('userSet', {username: data, userId: socket.id, userRM:roomno, player: 2});
          usercount = 1;
        }
        // Get username and room: let users know which room they are in
        io.sockets.in("room-"+roomno).emit('connectToRoom', data + " you are in room no. "+roomno);
    }
  });

  // Send message between users in the room
   socket.on('msg', function(data) {
     currentRoom(data);
     io.sockets.in("room-"+roomu).emit('newmsg', data);
   });


  // Leave current room FIX THIS CURRENT FIX IS IN DRAGGABLE CHAT EX!!!!
  // Leave current room
   socket.on('leaveRoom', function(data) {
     currentRoom(data);
     io.sockets.in("room-"+roomu).emit('userLeft', data);
     socket.leave("room-"+roomu);
     updateUsers(data);
   });
   // Second User leave Current Room
   socket.on('usersLeaveRoom', function(data) {
     currentRoom(data);
     socket.leave("room-"+roomu);
     updateUsers(data);
   });

   socket.on('game', function(data) {
     // returns roomu
     currentRoom(data);
    // returns currUser
     currentUser(data);
     // returns roomup
     getRoomPlayers(currUser,roomu);
     io.sockets.in("room-"+roomu).emit('play',data,roomup);
   });

   socket.on('turn', function(data) {
     user = data.user;
     currentRoom(data);
     currentUser(data);
     getRoomPlayers(currUser,roomu);
     // All Users Can Click
     io.sockets.in("room-"+roomu).emit('showcrusor', {user: data.user, sockeId:socket.id, count:count});
     //Get User Move and Switch User Clicker
     if (count === 0) {
       //Get Current User, Player 1
       user = roomup[0].username;
       //Check Winner
       getWinner(data.row,data.col,data.divnum,count);
       //Check if Player clicks on wrong Div
       if (tryagain === 4) {
         socket.emit('retry', data);
       } else {
         socket.emit('hidecursor', {user: data.user, socketId:socket.id, curruserId:roomup[0].userId});
       }
     }else {
        user = roomup[1].username;
        getWinner(data.row,data.col,data.divnum,count);
        if (tryagain === 4) {
          socket.emit('retry', data);
        } else {
          socket.emit('hidecursor', {user: data.user, sockeId:socket.id, curruserId:roomup[1].userId});
        }
     }

     // Check If Try Again was Missed
     if (tryagain === 4) {
       socket.emit('retry', data);
     } else {
       io.sockets.in("room-"+roomu).emit('move', data, count, roomup);
       // Update User switch count
       count = (count ? 0 : 1);
     }

     // Check Winner
     if(winner !== 0){
       if((winner === 1) || (winner === 2)){
          io.sockets.in("room-"+roomu).emit('showWinner', {user: data.user, socketId:socket.id, winner:winner});
       }else {
        console.log('something went wrong! Take a look at code!')
       }
     }

   });

  });

// ----------------- GET USERS BY ROOM --------------
Object.defineProperty(Array.prototype, 'group', {
  enumerable: false,
  value: function (key) {
    var map = {};
    this.forEach(function (e) {
      var k = key(e);
      map[k] = map[k] || [];
      map[k].push(e);
    });
    return Object.keys(map).map(function (k) {
      return {key: k, datau: map[k]};
    });
  }
});
// ----------------- SERVER FUNCTIONS VARIABLES --------------

// Get Current User Information
function currentUser(data){
  p = data.user;
  // Update Room
  for (let i = 0; i < users.length; i++) {
    if (userp[i].username === p) {
      currUser = userp[i];
    }
  }
  return currUser;
}

// Get Current Room Number
function currentRoom(data){
  p = data.user;
  // Update Room
  for (let i = 0; i < users.length; i++) {
    if (userp[i].username === p) {
      roomu = userp[i].userRM;
    }
  }
  return roomu;
}


function getRoomPlayers(currUser,roomu){
  // Get Players By Room
  roomarr = userp.group(function (item) {
    return item.userRM;
  });

   for (let i = 0; i < roomarr.length; i++) {
     if(currUser.userRM === roomu){
    roomup =  roomarr[i].datau;
  }
  }
  return roomup;
}

// Update ALL Users, Delete Person that left Room
function updateUsers(data){
  p = data.user;
  // Update Room
  for (let i = 0; i < users.length; i++) {
    if (userp[i].username === p) {
      userp.splice(i,1);
      users.splice(i,1);
    }
  }
  return userp, users;
}


// ----------------- GAME LOGIC --------------
function getWinner(r,c,i,count){
   players(r,c,i,count);
   if(chkWinner(x) === 1) {
     winner = 1;
     console.log("Player 1 Wins!!!!!");
   }

  if(chkWinner(x) === 2) {
     winner = 2;
     console.log("Player 2 Wins!!!!!");
   }
}

function players(r,c,i,count) {
if(r === 5){
tryagain = 0;
  if ( 0 === count){
    if((x[r][c] !== 2) && (x[r][c] !== 1)) {
      x[r][c] = player1;
    }
  }

  if (1 === count){
    if((x[r][c] !== 2) && (x[r][c] !== 1))  {
    x[r][c] = player2;
    }
  }

} else {

  if( x[r+1][c] === 0) {
    tryagain = 4;
    console.log('Can not place peice there. Try again');
  } else {
    tryagain = 0;

    if ( 0 === count){
      if((x[r][c] !== 2) && (x[r][c] !== 1)) {
        x[r][c] = player1;
      }
    }

    if (1 === count){
      if((x[r][c] !== 2) && (x[r][c] !== 1))  {
      x[r][c] = player2;
      }
    }

  }

}
}

// ----------------- CHECK FOR WINNER --------------
function chkLine(a,b,c,d) {
    // Check first cell non-zero and all cells match
    return ((a != 0) && (a ==b) && (a == c) && (a == d));
}

function chkWinner(bd) {
    // Check down
    for (r = 0; r < 3; r++)
        for (c = 0; c < 7; c++)
            if (chkLine(bd[r][c], bd[r+1][c], bd[r+2][c], bd[r+3][c]))
                return bd[r][c];

    // Check right
    for (r = 0; r < 6; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(bd[r][c], bd[r][c+1], bd[r][c+2], bd[r][c+3]))
                return bd[r][c];

    // Check down-right
    for (r = 0; r < 3; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(bd[r][c], bd[r+1][c+1], bd[r+2][c+2], bd[r+3][c+3]))
                return bd[r][c];

    // Check down-left
    for (r = 3; r < 6; r++)
        for (c = 0; c < 4; c++)
            if (chkLine(bd[r][c], bd[r-1][c+1], bd[r-2][c+2], bd[r-3][c+3]))
                return bd[r][c];

    return 0;
}
