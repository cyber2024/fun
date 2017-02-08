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
  function Booster(size, prevbooster){
    var l = 4;
    if(prevbooster){
      this.delay = Math.random()*300 - 50 + ( l*prevbooster.delay + (Math.random()*1000))/(l+1);
      this.power = Math.random()*300 - 50 + ( l*prevbooster.power + (Math.random()*500 + 150)*size)/(l+1);
      this.duration = Math.random()*300 - 50 + ( l*prevbooster.duration + Math.random() * 500+150)/(l+1);
      this.delaywaited = 0;
      this.durationburned =0;
    } else {
        this.delay = (Math.random()*1000);
        this.power =  (Math.random()*300 + 600)*size;
        this.duration =  Math.random() * 500+500;
        this.delaywaited = 0;
        this.durationburned =0;
    }
    this.firing = false;
  }
  if(reuseDNA){
    this.dna = {
      booster: {
        bottom: new Booster(25, reuseDNA.booster.bottom),
        left: new Booster(10, reuseDNA.booster.left),
        right: new Booster(10, reuseDNA.booster.right),
        rotLeft: new Booster(1, reuseDNA.booster.rotLeft),
        rotRight: new Booster(1, reuseDNA.booster.rotRight)
      },
      fuel: 50
    };
  } else {
    this.dna = {
      booster: {
        bottom: new Booster(25),
        left: new Booster(10),
        right: new Booster(10),
        rotLeft: new Booster(1),
        rotRight: new Booster(1)
      },
      fuel: 50
    };
  }


  this.draw = function(context, elapsed){
      context.save();
      context.beginPath();
      context.translate(this.mov.x, this.mov.y);
      context.fillStyle = "black";
      context.rotate(this.mov.rot * Math.PI / 180);
      context.rect(-this.dim.w/2, -this.dim.h/2, this.dim.w, this.dim.h);
      context.fill();

        context.beginPath();
        context.moveTo(-this.dim.w/2, -this.dim.h/2);
        context.lineTo(this.dim.w/2, -this.dim.h/2);
        context.lineTo(0, -this.dim.h/2-10);
        context.fill();

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

      if(this.dna.booster.bottom.firing){
        context.beginPath();
        context.fillStyle = "orange";
        context.moveTo(-this.dim.w/2, this.dim.h/2);
        context.lineTo(this.dim.w/2, this.dim.h/2);
        context.lineTo(0, this.dim.h+10);
        context.fill();
      }

      if(this.dna.booster.left.firing){
        context.beginPath();
        context.fillStyle = "orange";
        context.moveTo(-this.dim.w/2, -3);
        context.lineTo(-this.dim.w/2, +3);
        context.lineTo(-this.dim.w/2-6, 0);
        context.fill();
      }

      if(this.dna.booster.right.firing){
        context.beginPath();
        context.fillStyle = "orange";
        context.moveTo(this.dim.w/2, -3);
        context.lineTo(this.dim.w/2, +3);
        context.lineTo(this.dim.w/2+6, 0);
        context.fill();
      }

      if(this.dna.booster.rotLeft.firing){
        context.beginPath();
        context.fillStyle = "orange";
        context.moveTo(-this.dim.w/2, -this.dim.h/2 + 2);
        context.lineTo(-this.dim.w/2, -this.dim.h/2 + 8);
        context.lineTo(-this.dim.w/2-6, -this.dim.h/2 + 5);
        context.fill();
      }

      if(this.dna.booster.rotRight.firing){
        context.beginPath();
        context.fillStyle = "orange";
        context.moveTo(this.dim.w/2, -this.dim.h/2 + 2);
        context.lineTo(this.dim.w/2, -this.dim.h/2 + 8);
        context.lineTo(this.dim.w/2+6, -this.dim.h/2 + 5);
        context.fill();
      }
      context.restore();
  }
  this.update = function(elapsed){
    //bottom booster
    var {fuelUsed, accn} = firebooster(this.dna.booster.bottom, elapsed);
    this.mov.ay = this.getYComponent(-accn,0);
    this.mov.ax = this.getXComponent(accn,0);

    var {fuelUsed, accn} = firebooster(this.dna.booster.left, elapsed);
    this.mov.ay += this.getYComponent(-accn +  elapsed * 980/1000,90);
    this.mov.ax += this.getXComponent(accn,90);

    var {fuelUsed, accn} = firebooster(this.dna.booster.right, elapsed);
    this.mov.ay += this.getYComponent(-accn +  elapsed * 980/1000,-90);
    this.mov.ax += this.getXComponent(accn,-90);

    var {fuelUsed, accn} = firebooster(this.dna.booster.rotLeft, elapsed);
    this.mov.rotSpeed += accn * elapsed/100000;
    this.mov.rot += this.mov.rotSpeed * elapsed;

    var {fuelUsed, accn} = firebooster(this.dna.booster.rotRight, elapsed);
    this.mov.rotSpeed -= accn * elapsed/100000;
    this.mov.rot += this.mov.rotSpeed * elapsed;

    this.mov.vy += (this.mov.ay + 98)* elapsed/1000;
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
