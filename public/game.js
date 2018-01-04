
var output = document.getElementById('output');
var newPart = document.getElementById('newPart');
var count = 0;
var cell;
var grid;
var player;
var player1 = 1;
var player2 = 2;
var x =[ [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0] ];

var grid = clickableGrid(6,7,function(el,row,col,i,x){
    getWinner(player,row,col,i);
    document.getElementById(i).style.backgroundColor = '#f00';
    console.log("You clicked on element:",el);
    console.log("You clicked on row:",row);
    console.log("You clicked on col:",col);
    console.log("You clicked on item #:",i);
    console.log("You clicked on item #:",x);
});

output.appendChild(grid);

socket.on('play', function(data,roomup) {
    output.appendChild(grid);
    console.log('this is roomup');
    console.log(roomup);
    console.log('this is roomup[0]');
    console.log(roomup[0].player);
    console.log('this is roomup[1]');
    console.log(roomup[1].player);
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

function clickableGrid(rows, cols, callback){
    var i=43;
    var grid = document.createElement('div');
    grid.className = 'grid';
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('div'));
        for (var c=0;c<cols;++c){
            cell = tr.appendChild(document.createElement('div'));
            cell.className = 'circle';
            // cell.innerHTML = --i;
            cell.setAttribute("id", --i);
            cell.addEventListener('click', (function(el,r,c,i,x){
                 return function(){
                    callback(el,r,c,i,x);
                }
            })(cell,r,c,i,x),false);
        }
    }
    return grid;
}

//check if one before it is empty
//check div has alreayd been selected

function getWinner(r,c,i){
   players(r,c,i);
   console.log(chkWinner(x));
   if(chkWinner(x) === 1) {
     alert("Player 1 Wins!!!!!");
   }

  if(chkWinner(x) === 2) {
     alert("Player 2 Wins!!!!!");
   }
}

function players(r,c,i) {
if(r === 5){

  if ( 0 === count){
    if((x[r][c] !== 2) && (x[r][c] !== 1)) {
      x[r][c] = 1;
      // document.getElementById(i).style.backgroundColor = '#f00';
      // count = 1;
    }
  }

  if (1 === count){
    if((x[r][c] !== 2) && (x[r][c] !== 1))  {
    x[r][c] = 2;
      // document.getElementById(i).style.backgroundColor = 'yellow';
      // count = 0;
    }
  }

} else {

  if( x[r+1][c] === 0) {
    alert('Can not place peice there. Try again');
  } else {
    // count = (count ? 0 : 1);

    if ( 0 === count){
      if((x[r][c] !== 2) && (x[r][c] !== 1)) {
        x[r][c] = 1;
        // count = 1;
      }
    }

    if (1 === count){
      if((x[r][c] !== 2) && (x[r][c] !== 1))  {
      x[r][c] = 2;
        // document.getElementById(i).style.backgroundColor = 'yellow';
        // count = 0;
      }
    }

  }

}
}


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



// socket.on('play', function(data,roomarr,roomu) {
//   if(player === 1) {
//     count = 0;
//   }else{
//     count = 1;
//   }
//
//   for (let i = 0; i < roomarr.length; i++) {
//     console.log("This is data",roomarr[i]);
//     }
//   console.log("This is data", data);
//   console.log("This is roomarr", roomarr);
//   console.log("This is roomu", roomu);
//   for
//   console.log("This is roomarr[roomu]", roomarr[roomu]);
//   grid = clickableGrid(6,7,function(el,row,col,i,x){
//       player = 1;
//       getWinner(player,row,col,i);
//       document.getElementById(i).style.backgroundColor = '#f00';
//       console.log("You clicked on element:",el);
//       console.log("You clicked on row:",row);
//       console.log("You clicked on col:",col);
//       console.log("You clicked on item #:",i);
//       console.log("You clicked on item #:",x);
//   });
//   document.getElementById('output').innerHTML = '';
//   output.appendChild(grid);
// });
