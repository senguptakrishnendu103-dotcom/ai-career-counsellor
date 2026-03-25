const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for(let i=0;i<80;i++){
 particles.push({
  x:Math.random()*canvas.width,
  y:Math.random()*canvas.height,
  r:Math.random()*2,
  dx:Math.random()-0.5,
  dy:Math.random()-0.5
 });
}

function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);

 particles.forEach(p=>{
  ctx.beginPath();
  ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
  ctx.fillStyle="#3b82f6";
  ctx.fill();

  p.x+=p.dx;
  p.y+=p.dy;
 });

 requestAnimationFrame(draw);
}

draw();
 requestAnimationFrame(draw);
}

draw();
