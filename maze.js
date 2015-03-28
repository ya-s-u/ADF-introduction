$(function(){

  var Maze = $('#canvas');
  var BlockSize = 20;
  var StrokeColor = '#bdaca2';
  var StrokeSize = 6;
  var BackgroundColor = '#e5eae3';
  var SolverColor = '#e95937';
  var Title = $('h1');

  function init(){
    Maze.clearCanvas();

    Wall = new Array();
    Direction = new Array(4);

    var window_w = $("#wrapper").width();
    var window_h = $("#wrapper").height();

    w = window_w - (window_w%BlockSize);
    h = window_h - (window_h%BlockSize) - 140;

    Maze.attr({
      width: w + StrokeSize,
      height: h + StrokeSize
    });

    BlockWidthCount = w / BlockSize;
    BlockHeightCount = h / BlockSize;
    BlockSum = BlockWidthCount*BlockHeightCount;

    for(var i=0; i<BlockSum; i++) {
      Wall.push({
        'r': 1, //RightBorder
        'b': 1, //BottomBorder
        'c': i  //ClusterNum
      });
    }

    Wall[BlockSum-1].r = 0;

    drawGrid();
    drawStart();
    drawGoal();

    Direction = [1, BlockWidthCount];
  }

  function drawGrid() {
    for(var i=0; i<=BlockHeightCount; i++) {
      Maze.drawLine({
        strokeStyle: StrokeColor,
        strokeWidth: StrokeSize,
        x1: 0,  y1: i*BlockSize+StrokeSize/2,
        x2: w+StrokeSize,  y2: i*BlockSize+StrokeSize/2,
      })
    }

    for(var i=0; i<=BlockWidthCount; i++) {
      Maze.drawLine({
        strokeStyle: StrokeColor,
        strokeWidth: StrokeSize,
        x1: i*BlockSize+StrokeSize/2,  y1: 0,
        x2: i*BlockSize+StrokeSize/2,  y2: h+StrokeSize,
      })
    }
  }

  function drawStart() {
    Maze.drawLine({
      strokeStyle: BackgroundColor,
      strokeWidth: StrokeSize,
      x1: StrokeSize/2,  y1: StrokeSize,
      x2: StrokeSize/2,  y2: BlockSize,
    })
  }

  function drawGoal() {
    Maze.drawLine({
      strokeStyle: BackgroundColor,
      strokeWidth: StrokeSize,
      x1: w+StrokeSize/2,  y1: h-BlockSize+StrokeSize,
      x2: w+StrokeSize/2,  y2: h,
    })
  }

  function drawRight(x, y) {
    x += StrokeSize/2;
    y += StrokeSize;

    Maze.drawLine({
      strokeStyle: BackgroundColor,
      strokeWidth: StrokeSize,
      x1: x+BlockSize,  y1: y,
      x2: x+BlockSize,  y2: y+BlockSize-StrokeSize,
    })
  }

  function drawBottom(x, y) {
    x += StrokeSize;
    y += StrokeSize/2;

    Maze.drawLine({
      strokeStyle: BackgroundColor,
      strokeWidth: StrokeSize,
      x1: x,  y1: y+BlockSize,
      x2: x+BlockSize-StrokeSize,  y2: y+BlockSize,
    })
  }

  function printCluster(x, y, c) {
    x += StrokeSize/2;
    y += StrokeSize/2;

    Maze.drawText({
      fillStyle: '#9cf',
      x: x+10, y: y+10,
      fontSize: 8,
      fontFamily: 'Verdana, sans-serif',
      text: c
    });
  }

  function connect(i1, i2) {
    var n1 = Wall[i1].c;
    var n2 = Wall[i2].c;

    if(n1 < n2) {
      var s = n1;
      var l = n2;
    } else {
      var s = n2;
      var l = n1;
    }

    for(var i=0; i<BlockSum; i++) {
      if(Wall[i].c == l) Wall[i].c = s;
    }

    if(i1-i2 == -1) {
      Wall[i1].r = 0;
    } else {
      Wall[i1].b = 0;
    }
  }

  function checkFinish() {
    for(var i=0; i<BlockSum; i++) {
      if(Wall[i].c != 0) return 0;
    }

    return 1;
  }

  function drawCircle(x, y) {
    Maze.drawArc({
      fillStyle: SolverColor,
      x: x+BlockSize/2+StrokeSize/2, y: y+BlockSize/2+StrokeSize/2,
      radius: BlockSize/2-StrokeSize/2
    });
  }

  function deleteCircle(x, y) {
    Maze.drawArc({
      fillStyle: BackgroundColor,
      x: x+BlockSize/2+StrokeSize/2, y: y+BlockSize/2+StrokeSize/2,
      radius: BlockSize/2-StrokeSize/2
    });
  }

  function startMake() {
    loop = setInterval(function(){
      var r = ~~(Math.random()*(BlockSum-1-1));
      var d;

      if(r != BlockSum-1) {// 右下

        if(r >= BlockSum-BlockWidthCount) { // 下端
          d = Direction[0];
        } else if(r%BlockWidthCount == BlockWidthCount-1) { // 右端
          d = Direction[1];
        } else {
          d = Direction[~~(Math.random()*(2))];
        }

        if(Wall[r].c != Wall[r+d].c) {
          connect(r, r+d);
        }

        var x = (r%BlockWidthCount)*BlockSize;
        var y = Math.floor(r/BlockWidthCount)*BlockSize;

        if(!Wall[r].r) drawRight(x,y);
        if(!Wall[r].b) drawBottom(x,y);

        if(checkFinish()) stopMake();
      }
    } , 1);
  }

  function stopMake(){
    clearInterval(loop);
    Title.text('Done,Solve?').css('cursor','pointer');
  }

  function drawMaze() {
    while(1) {
      var r = ~~(Math.random()*(BlockSum-1-1));
      var d;

      if(r == BlockSum-1) continue;// 右下

      if(r >= BlockSum-BlockWidthCount) { // 下端
        d = Direction[0];
      } else if(r%BlockWidthCount == BlockWidthCount-1) { // 右端
        d = Direction[1];
      } else {
        d = Direction[~~(Math.random()*(2))];
      }

      if(Wall[r].c != Wall[r+d].c) {
        connect(r, r+d);
      }

      if(checkFinish()) break;
    }

    for(var r=0; r<BlockSum; r++) {
      var x = (r%BlockWidthCount)*BlockSize;
      var y = Math.floor(r/BlockWidthCount)*BlockSize;

      if(!Wall[r].r) drawRight(x,y);
      if(!Wall[r].b) drawBottom(x,y);
    }

  }

  function getMin() {

  }

  function startSolve() {
    Solver = new Array();
    for(var r=0; r<BlockSum; r++) {
      Solver[r] = 0
    }
    Solver[0] = 1;

    Answer = new Array();
    for(var r=0; r<BlockSum; r++) {
      Answer[r] = 0
    }


    // var x = (r%BlockWidthCount)*BlockSize;
    // var y = Math.floor(r/BlockWidthCount)*BlockSize;

    var x = 0;
    var y = 0;
    var n = 0;

    solve = setInterval(function(){
      n = x + y*BlockWidthCount;
      var temp = 10;
      var a = '';

      if(!Wall[n].r) {
        if(temp > Solver[n+1]) {
          temp = Solver[n+1];
          a='r';
        }
      }
      if(!Wall[n].b) {
        if(temp > Solver[n+BlockWidthCount]) {
          temp = Solver[n+BlockWidthCount];
          a='b';
        }
      }
      if(n!=0 && !Wall[n-1].r) {
        if(temp > Solver[n-1]) {
          temp = Solver[n-1];
          a='l';
        }
      }
      if(n>BlockWidthCount-1 && !Wall[n-BlockWidthCount].b) {
        if(temp > Solver[n-BlockWidthCount]) {
          temp = Solver[n-BlockWidthCount];
          a='t';
        }
      }

      var s = 0;
      switch(a) {
        case 'r': x++;s=n+1;break;
        case 'b': y++;s=n+BlockWidthCount;break;
        case 'l': x--;s=n-1;break;
        case 't': y--;s=n-BlockWidthCount;break;
      }

      Solver[s]++;
      if(Answer[s] > 0) {
        deleteCircle(x*BlockSize,y*BlockSize);
      } else {
        Answer[s]++;
        drawCircle(x*BlockSize,y*BlockSize);
      }

      if(x==BlockWidthCount-1 && y==BlockHeightCount-1) stopSolve();
    } , 1);
  }

  function stopSolve(){
    Title.text('Solved:)').css('cursor','none');
    clearInterval(solve);
  }

  function main() {
    init();
    startMake();

    Title.click(function(){
      clearInterval(loop);
      init();
      drawMaze();
      Title.text('Done,Solve?');

      Title.click(function(){
        Title.text('Solving...').css('cursor','none');
        drawCircle(0,0);
        startSolve();
        Title.text('Solved:)');
      })
    })
  }

  $(window).load(function () {
    main();
  })

  var timer = false;
  $(window).resize(function() {
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      main();
    }, 100);
  });

})
