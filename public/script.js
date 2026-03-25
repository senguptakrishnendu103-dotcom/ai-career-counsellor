let dataGlobal;

// load dashboard data
fetch("/api/data")
.then(r=>r.json())
.then(d=>{
 dataGlobal = d;

 document.getElementById("stats").innerText =
 `👀 Visitors: ${d.visitors} | 📈 Growth: ${d.growth}% | Demand: ${d.demand}`;

 // skills
 d.skills.forEach(s=>{
  const span=document.createElement("span");
  span.innerText=s;
  document.getElementById("skills").appendChild(span);
 });

 drawChart(d.salaries);
});

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

   addMessage(data.explanation,"ai");

   data.topCareers.forEach(c=>{
     addMessage(`${c.title} (${c.confidence}%)`,"ai");
   });
 },1000);
}

// chart
function drawChart(data){
 const canvas=document.getElementById("chart");
 const ctx=canvas.getContext("2d");

 data.forEach((d,i)=>{
   ctx.fillStyle="#3b82f6";
   ctx.fillRect(i*80,200-d.value,40,d.value);

   ctx.fillStyle="white";
   ctx.fillText(d.role,i*80,190);
 });
}
