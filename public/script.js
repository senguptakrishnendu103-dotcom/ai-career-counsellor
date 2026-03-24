// load data
fetch("/api/data")
.then(r=>r.json())
.then(d=>{
 document.getElementById("growth").innerText="Growth: "+d.growth+"%";
 document.getElementById("demand").innerText="Demand: "+d.demand;
 document.getElementById("visitors").innerText="Visitors: "+d.visitors;

 // skills
 d.skills.forEach(s=>{
  const span=document.createElement("span");
  span.innerText=s;
  document.getElementById("skills").appendChild(span);
 });

 drawChart(d.salaries);
});

// chart
function drawChart(data){
 const c=document.getElementById("chart");
 const ctx=c.getContext("2d");

 data.forEach((d,i)=>{
  ctx.fillStyle="#3b82f6";
  ctx.fillRect(i*80,200-d.value,40,d.value);
  ctx.fillStyle="white";
  ctx.fillText(d.role,i*80,190);
 });
}

// chat
function addMessage(text,type){
 const div=document.createElement("div");
 div.className="message "+type;
 div.innerText=text;
 document.getElementById("chatBox").appendChild(div);
}

function startChat(){
 addMessage("Tell me about your interests...","ai");

 setTimeout(async ()=>{
   const res=await fetch("/api/career",{method:"POST"});
   const data=await res.json();

   addMessage(data.message,"ai");

   data.careers.forEach(c=>{
     addMessage(c.title+" ("+c.confidence+"%)","ai");
   });
 },1000);
}
