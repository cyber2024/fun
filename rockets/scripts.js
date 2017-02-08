var canvas = document.querySelector("#myCanvas");
canvas.width = 600;
canvas.height = 800;
var context = canvas.getContext("2d");
var launch = false;
var finished = false;
var statusInfo = document.querySelector("#status");
var gen = document.querySelector("#gen");
var generation = 0;
var highest = document.querySelector("#highest");
var highestever = document.querySelector("#highestever");
var h = 0;
var he = 0;
var rocketCount = 50;
var rcount = document.querySelector("#rocketcount")
var rocketRange = document.querySelector("#rocketrange");
var launch = document.querySelector("#launch");
launch.addEventListener('click',function(){
  launch = true;
})
rocketRange.addEventListener('input',function(e){
  updateRocketCount(e.target.value)
})

function updateRocketCount(num){
  rocketCount = num;
  rcount.innerHTML = num;
}
window.onkeyup = keyUp;
window.onkeydown = function(e){
  if(e.keyCode == "105"){
    rocketCount++;
  }
  if(e.keyCode == "99"){
    rocketCount--;
  }
  rcount.innerHTML = rocketCount;
}

function keyUp(e){
  if(e.keyCode == 82){
    //r
    nextGen();
  }

  if(e.keyCode == 32){
    //space
    launch = true;
  }

  if(e.keyCode == 27){
    //esc
    he = 0;
    reset(rocketCount);
  }
}

var rockets = [];

function reset(no, dna){
  if(!dna)
  generation = 0;
  finished = false;
  launch = false;
  rockets = [];
  for(var i =0; i < no; i++){
    rockets.push(new Rocket(dna));
  }
  statusInfo.innerHTML = "Ready to Launch";
  gen.innerHTML = generation;
}

function nextGen(){
    generation++;
    reset(rocketCount,rockets[0].dna);
    launch = true;
}

tick();
reset(rocketCount);

function drawScene(elapsed){
  context.clearRect(0,0,canvas.width, canvas.height);
  for(var i =0; i < rockets.length; i++){
    rockets[i].draw(context, elapsed);
  }
}
function updateScene(elapsed){
  if(launch){
    var countFinished = 0;
    for(var i =0; i < rockets.length; i++){
      rockets[i].update(elapsed);
      if(rockets[i].mov.y == 750 && rockets[i].dna.booster.bottom.durationburned >= rockets[i].dna.booster.bottom.duration && rockets[i].mov.vy == 0){
        countFinished ++;
        if(countFinished == rockets.length){
          statusInfo.innerHTML = "All rockets have landed";
              nextGen();
            }
      }
    }
  }
  rockets = sortByHighest();
  h = parseInt(rockets[0].mov.highest);
  highest.innerHTML = h + "m";
  if(h > he)
    he = h;
  highestever.innerHTML = he+"m";
}

function sortByHighest(){
  return rockets.sort(function(a,b){
    return b.mov.highest - a.mov.highest;
  });
}

var prevTime = 0;
function tick(){
  var elapsed = 0;
  requestAnimationFrame(function(timestamp){
    elapsed = timestamp - prevTime;
    prevTime = timestamp;
    tick();
    if(rockets.length){
      drawScene(elapsed);
      updateScene(elapsed);

    }
  });
}

function Rocket(reuseDNA){
  this.timestamp = new Date().getTime();
  this.dim = {
    h: 50,
    w: 10,
    m: 5
  }
  this.mov = {
    x : Math.random()*(canvas.width-100) + 50,
    y : canvas.height - this.dim.h,
    vx : 0,
    vy : 0,
    ax: 0,
    ay: 0,
    rot:0,
    rotSpeed: 0,
    highest: 0
  }
  function Booster(size, prevbooster, orientation){
    var l = 4;
    if(prevbooster){
      this.delay = Math.random()*100 - 50 + prevbooster.delay;
      this.power = Math.random()*100 - 50 + prevbooster.power;
      this.duration = Math.random()*100 - 50 + prevbooster.duration ;
      this.orientation = (prevbooster.orientation + (Math.random()*5-2.5));
      this.delaywaited = 0;
      this.durationburned =0;
      var r = parseInt(prevbooster.color.r + Math.random()*30 - 15);
      var g = parseInt(prevbooster.color.g + Math.random()*30 - 15);
      var b = parseInt(prevbooster.color.b + Math.random()*30 - 15);
      r = r > 255? 255 : r;
      g = g>255?255:g;
      b = b>255?255:b;
      this.color = {r,g,b};
    } else {
        this.delay = (Math.random()*1000);
        this.power =  (Math.random()*300 + 600)*size;
        this.duration =  Math.random() * 500+500;
        this.orientation = orientation;
        this.delaywaited = 0;
        this.durationburned =0;
        this.color = {r: 255, g: 155, b: 0};
    }
    this.firing = false;
  }
  if(reuseDNA){
    this.dna = {
      booster: {
        bottom: new Booster(25, reuseDNA.booster.bottom, 0),
        left: new Booster(6, reuseDNA.booster.left, 90),
        right: new Booster(6, reuseDNA.booster.right, -90),
        rotLeft: new Booster(1, reuseDNA.booster.rotLeft, 90),
        rotRight: new Booster(1, reuseDNA.booster.rotRight, -90)
      },
      fuel: 50
    };
  } else {
    this.dna = {
      booster: {
        bottom: new Booster(25, null,0),
        left: new Booster(6, null,90),
        right: new Booster(6, null,-90),
        rotLeft: new Booster(1, null,90),
        rotRight: new Booster(1, null,-90)
      },
      fuel: 50
    };
  }


  this.draw = function(context, elapsed){
      context.save();

      //body
      context.beginPath();
      context.translate(this.mov.x, this.mov.y);
      context.fillStyle = "black";
      context.rotate(this.mov.rot * Math.PI / 180);
      context.rect(-this.dim.w/2, -this.dim.h/2, this.dim.w, this.dim.h);
      context.fill();

        //cone
        context.beginPath();
        context.moveTo(-this.dim.w/2, -this.dim.h/2);
        context.lineTo(this.dim.w/2, -this.dim.h/2);
        context.lineTo(0, -this.dim.h/2-10);
        context.fill();

        //fins
        context.beginPath();
        context.moveTo(-this.dim.w/2, this.dim.h/2);
        context.lineTo(-this.dim.w/2-5, this.dim.h/2);
        context.lineTo(-this.dim.w/2, this.dim.h/2-5);
        context.fill();

        context.beginPath();
        context.moveTo(this.dim.w/2, this.dim.h/2);
        context.lineTo(this.dim.w/2+5, this.dim.h/2);
        context.lineTo(this.dim.w/2, this.dim.h/2-5);
        context.fill();

        //bottom booster
      if(this.dna.booster.bottom.firing){
        context.beginPath();
        var color = this.dna.booster.bottom.color;
        context.fillStyle = "rgba("+color.r+","+color.g+","+color.b+",1.0)";
        context.moveTo(-this.dim.w/2, this.dim.h/2);
        context.lineTo(this.dim.w/2, this.dim.h/2);
        context.lineTo(-Math.sin(Math.PI*this.dna.booster.bottom.orientation/180)*20, this.dim.h+20);
        context.fill();
      }

      if(this.dna.booster.left.firing){
        context.beginPath();
        var color = this.dna.booster.bottom.color;
        context.fillStyle = "rgba("+color.r+","+color.g+","+color.b+",1.0)";
        context.moveTo(-this.dim.w/2, -3);
        context.lineTo(-this.dim.w/2, +3);
        context.lineTo(-this.dim.w/2-Math.sin(-Math.PI*this.dna.booster.right.orientation/180)*12, +Math.cos(-Math.PI*this.dna.booster.left.orientation/180)*12);
        context.fill();
      }

      if(this.dna.booster.right.firing){
        context.beginPath();
        var color = this.dna.booster.bottom.color;
        context.fillStyle = "rgba("+color.r+","+color.g+","+color.b+",1.0)";
        context.moveTo(this.dim.w/2, -3);
        context.lineTo(this.dim.w/2, +3);
        context.lineTo(this.dim.w/2+Math.sin(-Math.PI*this.dna.booster.right.orientation/180)*12, Math.cos(Math.PI*this.dna.booster.right.orientation/180)*12);
        context.fill();
      }

      if(this.dna.booster.rotLeft.firing){
        context.beginPath();
        var color = this.dna.booster.bottom.color;
        context.fillStyle = "rgba("+color.r+","+color.g+","+color.b+",1.0)";
        context.moveTo(-this.dim.w/2, -this.dim.h/2 + 2);
        context.lineTo(-this.dim.w/2, -this.dim.h/2 + 8);
        context.lineTo(-this.dim.w/2-6, -this.dim.h/2 + 5);
        context.fill();
      }

      if(this.dna.booster.rotRight.firing){
        context.beginPath();
        var color = this.dna.booster.bottom.color;
        context.fillStyle = "rgba("+color.r+","+color.g+","+color.b+",1.0)";
        context.moveTo(this.dim.w/2, -this.dim.h/2 + 2);
        context.lineTo(this.dim.w/2, -this.dim.h/2 + 8);
        context.lineTo(this.dim.w/2+6, -this.dim.h/2 + 5);
        context.fill();
      }
      context.restore();
  }
  this.update = function(elapsed){
    //bottom booster
    this.mov.ay = 9800*elapsed/1000
    var {fuelUsed, accn} = firebooster(this.dna.booster.bottom, elapsed);
    this.mov.ay += this.getYComponent(-accn,this.dna.booster.bottom.orientation);
    this.mov.ax = this.getXComponent(accn,this.dna.booster.bottom.orientation);
    this.mov.rotSpeed += this.getRotComponent(accn,this.dna.booster.bottom.orientation)/10000;
    this.mov.rot += this.mov.rotSpeed * elapsed;

    var {fuelUsed, accn} = firebooster(this.dna.booster.left, elapsed);
    this.mov.ay += this.getYComponent(-accn,this.dna.booster.left.orientation);
    this.mov.ax += this.getXComponent(accn,this.dna.booster.left.orientation);

    var {fuelUsed, accn} = firebooster(this.dna.booster.right, elapsed);
    this.mov.ay += this.getYComponent(-accn,this.dna.booster.right.orientation);
    this.mov.ax += this.getXComponent(accn,this.dna.booster.right.orientation);

    var {fuelUsed, accn} = firebooster(this.dna.booster.rotLeft, elapsed);
    this.mov.rotSpeed += accn * elapsed/100000;
    this.mov.rot += this.mov.rotSpeed * elapsed;

    var {fuelUsed, accn} = firebooster(this.dna.booster.rotRight, elapsed);
    this.mov.rotSpeed -= accn * elapsed/100000;
    this.mov.rot += this.mov.rotSpeed * elapsed;

    this.mov.vy += (this.mov.ay)* elapsed/1000;
    this.mov.vx += this.mov.ax * elapsed/1000;
    this.mov.y += this.mov.vy * elapsed/1000;
    this.mov.x += this.mov.vx * elapsed/1000;
    if(this.mov.y >= canvas.height - this.dim.h) {
      this.mov.y = canvas.height - this.dim.h;
      this.mov.vy = 0;
      this.mov.ay = 0;
      this.mov.vx = 0;
      this.mov.ax = 0;
      this.mov.rotSpeed = 0;
    }
    if(canvas.height - this.dim.h - this.mov.y > this.mov.highest){
      this.mov.highest = canvas.height - this.dim.h - this.mov.y ;
    }
  }

  this.getYComponent = function(v, boosterOrientation){
    return (Math.cos(Math.PI * (this.mov.rot+boosterOrientation)/180) * v);
  }
  this.getRotComponent = function(v, boosterOrientation){
    var vx = Math.sin(2*Math.PI * (boosterOrientation)/360) * v;
    return vx;
  }
  this.getXComponent = function(v, boosterOrientation){
    var vx = Math.sin(2*Math.PI * (this.mov.rot+boosterOrientation)/360) * v;
    return vx;
  }
  function firebooster(booster, elapsed){
    var fuelUsed = 0;
    var accn = 0;
    booster.delaywaited += elapsed;
      if(booster.delay <= booster.delaywaited && booster.duration >= booster.durationburned){
        booster.firing = true;
      } else {
        booster.firing = false;
      }
      if(booster.firing){
        fuelUsed = elapsed * booster.power;
        accn = elapsed * booster.power/1000;
        booster.durationburned += elapsed;
      }
      return {fuelUsed, accn};
    }
}
