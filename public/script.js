let answers=[];
let i=0;

const questions=[
"Do you like logic?",
"Do you like leadership?",
"Are you creative?"
];

function addMessage(text,type){
 const msg=document.createElement("div");
 msg.className="message "+type;
 msg.innerText=text;
 document.getElementById("chatBox").appendChild(msg);
}

// visitor
fetch("/api/visit")
.then(r=>r.json())
.then(d=>{
 addMessage("👀 "+d.visitors+" people visited","ai");
});

function startQuiz(){
 ask();
}

function ask(){
 if(i>=questions.length) return submit();
 addMessage(questions[i],"ai");

 const box=document.createElement("div");
 box.innerHTML=`
 <button onclick="answer('Yes')">Yes</button>
 <button onclick="answer('No')">No</button>
 `;
 document.getElementById("chatBox").appendChild(box);
}

function answer(a){
 addMessage(a,"user");
 answers.push(a);
 i++;
 ask();
}

async function submit(){
 const res=await fetch("/api/career",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({answers})
 });

 const data=await res.json();

 addMessage(data.explanation,"ai");

 data.topCareers.forEach(c=>{
   addMessage(c.title+" "+c.confidence+"%","ai");
 });

 loadAnalytics();
}

// 🔥 LOAD REAL ANALYTICS
async function loadAnalytics(){
 const res = await fetch("/api/analytics");
 const data = await res.json();

 const canvas=document.getElementById("analyticsChart");
 const ctx=canvas.getContext("2d");

 let x=20;

 for(let key in data.careerClicks){
   let val=data.careerClicks[key];

   ctx.fillStyle="#3b82f6";
   ctx.fillRect(x,200-val,40,val);

   ctx.fillStyle="white";
   ctx.fillText(key,x,220);

   x+=80;
 }
}
