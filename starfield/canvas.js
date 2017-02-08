var canvas = document.querySelector("#myCanvas");
var body = document.querySelector("body");
var context = canvas.getContext('2d');

canvas.style="background-color: white; border:1px solid black";
var rows = 100;
var cols = 100;
var scale = 5;
var tank = new Tank(scale);
canvas.width = rows*scale;
canvas.height = cols*scale;

var loop = new GameLoop(scale);

var bullets = [];

var clearCanvas = function(context){
  context.clearRect(0,0, canvas.width, canvas.height);
}

canvas.addEventListener('click', function(e){
  var rect = canvas.getBoundingClientRect();
  var mouseX = e.clientX - rect.left;
  var mouseY = e.clientY - rect.top;
  var pos = {"x":mouseX, "y":mouseY};
  tank.move(pos.x);
});

function GameLoop(scale){
  var s1 = new Shield(5,cols-10,20, scale);
  var s2 = new Shield(40,cols-10,20, scale);
  var s3 = new Shield(75,cols-10,20, scale);
    this.interval = setInterval(
      function(){
        clearCanvas(context);
        s1.draw(context);
        s2.draw(context);
        s3.draw(context);
        tank.update();
        tank.draw(context);
        bullets.forEach(function(shot){
          shot.update();
          shot.draw(context);
        });
        for(var i = 0; i < bullets.length; i++){
          if(bullets[i].kill == true){
            bullets.splice(i,1);
            console.log(bullets);
          }
        }

    }, 1000/30);
}

function Shield(x, y, width, scl){
  this.remainingDistance = 0;
  this.x = x*scl;
  this.y = y*scl;
  this.width = width*scl;
  this.height = 2*scl;
  console.log(this);
  this.draw = function(ctx){
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function Tank(scale){
  this.moveTo = 10;
  this.health = 3;
  this.vx = 0;
  this.x = 15*scale;
  this.y=(cols-3)*scale;
  this.width = 5*scale;
  this.height = 2*scale;
  console.log(this);

  this.update = function(){
    if(this.moveTo > -1){
      if(this.x - this.moveTo > 10){
        this.vx = -10;
      } else if (this.x - this.moveTo < -10){
        this.vx = 10;
      } else {
        this.x = this.moveTo;
        this.vx = 0;
        bullets.push(new Bullet(this.x, this.y, -10));
        this.moveTo = -1;
      }
    }

    this.x += this.vx;
  }
  this.move = function(x){
    this.moveTo = x;
    console.log(tank)
  }
  this.draw = function(context){
    context.fillStyle = "#3d3d3d";
    context.fillRect(this.x-this.width/2, this.y, this.width, this.height);
    context.fillRect(this.x-3, this.y-10, 6, 10);
  }
}

function Bullet(x,y,vy){
  this.x = x;
  this.y = y;
  this.width = 2;
  this.height = 10;
  this.vy = vy;
  this.kill = false;

  this.update = function(){
    this.y += vy;
    if(this.y <=0){
      this.kill = true;
    }
  }
  this.draw = function(context){
    context.fillStyle="green";
    context.fillRect(this.x - this.width/2, this.y - this.height, this.width, this.height);
  }
}
