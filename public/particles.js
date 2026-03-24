const canvas=document.getElementById("bg");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let particles=[];

for(let i=0;i<60;i++){
 particles.push({
  x:Math.random()*canvas.width,
  y:Math.random()*canvas.height,
  r:2
 });
}

function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);

 particles.forEach(p=>{
  ctx.beginPath();
  ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
  ctx.fillStyle="#3b82f6";
  ctx.fill();
 });

 requestAnimationFrame(draw);
}

draw();
