var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');

http.listen(port, function(){
  console.log('listening on *:' + port);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// ----------------- DECLARE VARIBLES --------------
users = [];
var userp = [];
var roomarr;
var roomcount;
var roomno = 1;
var roomu;
var roomup;
var count = 1;
var currUser;
var p = 0;


// ----------------- ON IO CONNECTION DO...  --------------
io.on('connection', function(socket) {
   //Set username
   socket.on('setUsername', function(data) {
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
      // Increase roomno 2 clients are present in a room.
      // Note: If want 3 clients in a room, >2 ...>n etc
      if(io.nsps['/'].adapter.rooms["room-"+roomno]
      && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) {
      roomno++;
      }
      socket.join("room-"+roomno);

      // Set userp ----- room, usersame, player Id, player number
      if (count === 1) {
        userp.push( {username: data, userId: socket.id, userRM:roomno, player: 1});
        socket.emit('userSet', {username: data, userId: socket.id, userRM:roomno, player: 1});
        count = 2;
      }
      else {
        userp.push( {username: data, userId: socket.id, userRM:roomno, player: 2});
        socket.emit('userSet', {username: data, userId: socket.id, userRM:roomno, player: 2});
        count = 1;
      }

      // roomarr = userp.group(function (item) {
      //   return item.userRM;
      //  // console.log('group by roomarr');
      // // console.log(roomarr);
      // });
      //
      //  for (let i = 0; i < roomarr.length; i++) {
      //   console.log('group by room roomarr');
      //   console.log(roomarr[i].data);
      // }
      // Get username and room: let users know which room they are in
      io.sockets.in("room-"+roomno).emit('connectToRoom', data + " you are in room no. "+roomno);
    }
  });

  // Send message between users in the room
   socket.on('msg', function(data) {
     currentRoom(data);
     io.sockets.in("room-"+roomu).emit('newmsg', data);

   });


  // Leave current room
   socket.on('leaveRoom', function(data) {
     currentRoom(data);
     io.sockets.in("room-"+roomu).emit('userLeft', data);
     socket.leave("room-"+roomu);
     updateUsers(data);
     // put a time interval here before deleting users from room
     // or put a time interval before socket.emit
   });

   socket.on('game', function(data) {
     // returns roomu
     currentRoom(data);
    // returns currUser
     currentUser(data);
     getRoomPlayers(currUser,roomu);
     io.sockets.in("room-"+roomu).emit('play', data,roomup);
   });

   socket.on('testing1', function(data) {
     currentRoom(data);
     io.sockets.in("room-"+roomu).emit('newtesting1', data);

   });

   // socket.on('play', function(data) {
   //   currentRoom(data);
   //   roomarr = userp.group(function (item) {
   //     return item.userRM;
   //    // console.log('group by roomarr');
   //   // console.log(roomarr);
   //   });
   //   // io.sockets.in("room-"+roomu).emit('move',data,roomarr,roomu);
   // });

});

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

// Get Current User Information
function currentUser(data){
  p = data.user;
  // Update Room
  for (let i = 0; i < users.length; i++) {
    // console.log(userp[i]);
    if (userp[i].username === p) {
      currUser = userp[i];
    }
    // return userp[i];
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

// Update all Users, Delete Person All Room Users
function getRoomUsers(data,roomnum){
  p = data.username
  var b = 0;
  roomcount = [];
  // Update Room
  for (let i = 0; i < users.length; i++) {
    if (userp[i].userRM === roomnum) {
      roomcount[b] = userp[i];
      b++;
    }
      return roomcount[i];
  }
    // for (let i = 0; i < roomcount.length; i++) {
    //   if (userp[i].username === roomcount[i]) {
    //   userp.splice(i,1);
    //   users.splice(i,1);
    //   }
    // }
  // console.log('user p ' +  userp);
  // console.log('users ' + users);
  // return roomcount;
}

// Update all Users, Delete Person All Room Users
// function updateUsers(data){
//   p = data.user;
//   // Update Room
//   for (let i = 0; i < users.length; i++) {
//     if (userp[i].username === p) {
//       userp.splice(i,1);
//       users.splice(i,1);
//     }
//   }
//   return userp, users;
// }

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
