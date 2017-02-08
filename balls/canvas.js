var board = new GameBoard("#myCanvas", 80, 80, 10);
var loop = new GameLoop();

var body = document.querySelector("body");
body.addEventListener('click', function(){
  board.addBall();
});

function GameBoard(canvasId, width, height, scale){
    this.canvas = document.querySelector(canvasId);
    this.width = width;
    this.height = height;
    this.pixelScale = scale;
    this.canvas.width = this.width * this.pixelScale;
    this.canvas.height = this.height * this.pixelScale;
    this.canvas.style="background-color: white; border:1px solid black";
    this.balls = [];

    this.clear = function(ctx){
      ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
    this.update = function(){
      this.balls.forEach(function(ball){
        ball.update();
      });
      collisionDetector(this.balls);
    }
    this.draw = function(){
      var ctx = this.canvas.getContext("2d");
      this.clear(ctx);
        this.balls.forEach(function(ball){
          ball.draw(ctx);
        });
    }
    this.addBall = function(){
      this.balls.push(new Ball());
    }
}

function Ball(){
    this.x = 0;
    this.y = 0;
    this.r = Math.random()*35+5;
    this.vx = Math.random()*2 + 2;
    this.vy = Math.random()*2+2;
    this.color = "rgb("+
        Math.floor(Math.random()*255) + ","+
        Math.floor(Math.random()*255) + ","+
        Math.floor(Math.random()*255) + ")";

  this.update = function(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.x >= board.canvas.width){
        this.vx *= -1;
        this.x = board.canvas.width;
    } else if(this.x <= 0){
        this.vx *= -1;
        this.x = 0;
    }
    if(this.y <= 0){
      this.vy *= -1;
      this.y = 0;
    } else if( this.y >= board.canvas.width){
      this.vy *= -1;
      this.y = board.canvas.width;
    }
  }
  this.draw = function(context){
    context.beginPath();
    context.arc(this.x,this.y,this.r,0,2*Math.PI, false);
    context.fillStyle = this.color;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.stroke();
  }
}

function GameLoop(){
    this.interval = setInterval(
      function(){
        board.update();
        board.update();
        board.update();
        board.update();
        board.draw();
    }, 1000/30);
}

var collisionDetector = function(balls){
  for(var i = 0; i < balls.length; i++){
    for(var j = i+1; j < balls.length; j++){
      if(j != i){
        var dist = getRange(balls[i],balls[j]);
        if(dist < balls[i].r + balls[j].r){
          console.log("Collision!");
          swapVelocities(balls[i], balls[j]);
        }
      }
    }
  }


}
var getRange = function(b1,b2){
  var x = b2.x - b1.x;
  var y = b2.y - b1.y;
  var dist = Math.sqrt(x*x+y*y);
  return dist;
}
var swapVelocities = function(b1,b2){
  var tmp = b1.vx;
  b1.vx = b2.vx;
  b2.vx = tmp;
  tmp = b1.vy;
  b1.vy = b2.vy;
  b2.vy = tmp;
}
