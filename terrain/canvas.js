var loop = new GameLoop();
var canvas = document.querySelector("#myCanvas");
var body = document.querySelector("body");
var context = canvas.getContext('2d');

canvas.style="background-color: white; border:1px solid black";
var rows = 100;
var cols = 60;
var scale = 5;
canvas.width = rows*scale;
canvas.height = cols*scale;
var clearCanvas = function(context){
  context.clearRect(0,0, canvas.width, canvas.height);
}

body.addEventListener('click', function(){

});


function GameLoop(){
    this.interval = setInterval(
      function(){
        drawRectangles(context);

    }, 1000/30);
}

function drawRectangles(ctx){
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      ctx.fillStyle = "black";
      ctx.strokeRect(i*scale, j*scale, scale, scale);
    }
  }
}
