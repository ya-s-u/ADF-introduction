$(function(){
  // control bar
  var ControlBar = function () {
      this.size = 12;
      this.height = 40;
  };
  var con = new ControlBar();

  // color patterns
  var colorData = ['#CCFF00', '#FF0099', '#FF7CBF', '#EEEEEE', '#666666'];
  var iMax = colorData.length;
  var colorHtml = '';

  for (var i = 0; i < iMax; i++) {
      colorHtml += '<li style="background-color: ' + colorData[i] + '"></li>';
  }
  $('#color-box').html(colorHtml);
  $('#color-box').find('li').on('click', function () {
      var index = $(this).index();
      color = parseInt(colorData[index].replace('#', '0x'), 16);
      buildPrimitive();
      draw();
  });

  // input field
  var ipt = $('#ipt');
  ipt.on('keyup', draw);
  ipt.on('click', function () {
      $(this).select();
  });

  // input off canvas
  var offCanvas = $('#canvas-txt').get(0);
  var ctx = offCanvas.getContext("2d");
  ctx.font = "20px Helvetica,sans-serif";

  // pixel view
  var canvas = $('#canvas-demo');
  var point = new obelisk.Point(150, 30);
  var pixelView = new obelisk.PixelView(canvas, point);
  var brick;
  var cube;
  var color = 0xCCFF00;
  var threshold = 130;

  // build method
  function buildPrimitive() {
      // floor
      var colorBrick = new obelisk.SideColor(0xAAAAAA, 0xEEEEEE);
      var dimensionBrick = new obelisk.BrickDimension(con.size, con.size);
      brick = new obelisk.Brick(dimensionBrick, colorBrick);

      // cube
      var colorCube = new obelisk.CubeColor().getByHorizontalColor(color);
      var dimensionCube = new obelisk.CubeDimension(con.size, con.size, con.height);
      cube = new obelisk.Cube(dimensionCube, colorCube, false);
  }

  function draw() {
      var size = con.size;
      var txtWidth = offCanvas.width;
      var txtHeight = offCanvas.height;

      // clear everything
      pixelView.clear();
      ctx.clearRect(0, 0, txtWidth, txtHeight);

      ctx.fillText('@ya_s_u', 2, 18);
      var textData = ctx.getImageData(0, 0, txtWidth, txtHeight);

      for (var y = 0; y <= txtHeight; y++) {
          for (var x = 0; x <= txtWidth; x++) {
              var p3d = new obelisk.Point3D(x * (size - 2), y * (size - 2), 0);
              pixelView.renderObject(brick, p3d);
          }
      }

      for (var y = 0; y < txtHeight; y++) {
          for (var x = 0; x < txtWidth; x++) {
              // check pixel
              var index = (y * textData.width + x) * 4;

              if (textData.data[index + 3] > threshold) {
                  var p3d = new obelisk.Point3D(x * (size - 2), y * (size - 2), 0);
                  pixelView.renderObject(cube, p3d);
              }
          }
      }
  }

  // main
  buildPrimitive();
  draw();

})
