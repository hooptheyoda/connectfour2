var output = document.getElementById('output');
var count = 0;
var player1 = 1;
var player2 = 2;
var x =[ [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0] ];

var grid2 = clickableGrid(6,7,function(el,row,col,i){
    getWinnder(row,col,i);
    console.log("You clicked on element:",el);
    console.log("You clicked on row:",row);
    console.log("You clicked on col:",col);
    console.log("You clicked on item #:",i);
});

function gameT3() {
    document.getElementById('btnGameContainer').classList.add('hidden');
    document.getElementById('uvp').innerHTML = 'Working on it, Return Later Will Be Up Soon!';
    setTimeout(function() {
      document.getElementById('uvp').innerHTML = 'In 10 Seconds this page will clear. Play Again =)';
    }, 5000);
    setTimeout(function() {
      document.getElementById('uvp').innerHTML = '';
      document.getElementById('btnIndexContainer').classList.remove('hidden');
    }, 10000);
}


function startgameT1() {
  document.getElementById('btnGameContainer').classList.add('hidden');
  document.getElementById('enterplayername').classList.remove('hidden');
}

function setplayername1() {
    document.getElementById('p1').innerHTML = document.getElementById('namep1').value;
    document.getElementById('enternamep1').classList.add('hidden');
    document.getElementById('np1').classList.remove('hidden');
    document.getElementById('p0').innerHTML = 'Player 1 turn...'
    checkplayername();
    document.getElementById('enternamep2').classList.remove('hidden');
}

function setplayername2() {
      document.getElementById('p2').innerHTML = document.getElementById('namep2').value;
      document.getElementById('enternamep2').classList.add('hidden');
      document.getElementById('np2').classList.remove('hidden');
}

function checkplayername(){
      document.getElementById('output2').appendChild(grid2);
}


function clickableGrid(rows, cols, callback){
    var i=43;
    var grid = document.createElement('div');
    grid.className = 'grid';
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('div'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('div'));
            cell.className = 'circle';
            cell.setAttribute("id", --i);
            cell.addEventListener('click', (function(el,r,c,i){
                 return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);
        }
    }
    return grid;
}


function getWinnder(r,c,i){
   players(r,c,i);
   console.log(chkWinner(x));
   if(chkWinner(x) === 1) {
     alert("Player 1 Wins!!!!!");
     document.getElementById('p0').innerHTML = 'Player 1 Wins!!!!!';
   }

  if(chkWinner(x) === 2) {
     alert("Player 2 Wins!!!!!");
     document.getElementById('p0').innerHTML = 'Player 2 Wins!!!!!';
   }

   setTimeout(function() {
     document.getElementById('p0').innerHTML = 'In 10 Seconds this page will clear. Play Again =)';
   }, 3000);
   setTimeout(function() {
     document.getElementById('enterplayername').classList.add('hidden');
     document.getElementById('p0').innerHTML = '';
     document.getElementById('p1').innerHTML = '';
     document.getElementById('p2').innerHTML = '';
     btnIC.classList.remove('hidden');
   }, 10000);
}

function players(r,c,i) {
if(r === 5){

  if ( 0 === count){
    if((x[r][c] !== 2) && (x[r][c] !== 1)) {
      x[r][c] = player1;
      document.getElementById(i).style.backgroundColor = '#f00';
      count = 1;
      document.getElementById('p0').innerHTML = 'Player 2 turn...'
    }
  }

  if (1 === count){
    if((x[r][c] !== 2) && (x[r][c] !== 1))  {
    x[r][c] = player2;
      document.getElementById(i).style.backgroundColor = 'yellow';
      count = 0;
      document.getElementById('p0').innerHTML = 'Player 1 turn...'
    }
  }

} else {

  if( x[r+1][c] === 0) {
    alert('Can not place peice there. Try again');
  } else {
    // count = (count ? 0 : 1);

    if ( 0 === count){
      if((x[r][c] !== 2) && (x[r][c] !== 1)) {
        x[r][c] = player1;
        document.getElementById(i).style.backgroundColor = '#f00';
        count = 1;
        document.getElementById('p0').innerHTML = 'Player 2 turn...'
      }
    }

    if (1 === count){
      if((x[r][c] !== 2) && (x[r][c] !== 1))  {
      x[r][c] = player2;
        document.getElementById(i).style.backgroundColor = 'yellow';
        count = 0;
        document.getElementById('p0').innerHTML = 'Player 1 turn...'
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
