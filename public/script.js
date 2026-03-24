const questions=[
"Do you like logic?",
"Do you like leadership?",
"Are you creative?"
];

let i=0;
let answers=[];

function addMessage(text,type){
 const div=document.createElement("div");
 div.className="message "+type;
 div.innerText=text;
 document.getElementById("chatBox").appendChild(div);
}

// visitor
fetch("/api/visit")
.then(r=>r.json())
.then(d=>{
 document.getElementById("visitor").innerText=
 "👀 "+d.visitors+" users visited";
});

function startQuiz(){
 i=0;
 answers=[];
 ask();
}

function ask(){
 if(i>=questions.length) return submit();

 addMessage(questions[i],"ai");

 const btns=document.createElement("div");
 btns.innerHTML=`
 <button onclick="answer('Yes')">Yes</button>
 <button onclick="answer('No')">No</button>
 `;
 document.getElementById("chatBox").appendChild(btns);
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

 drawChart(data.topCareers);
}

// 🔥 DASHBOARD
function drawChart(data){
 const canvas=document.getElementById("chart");
 const ctx=canvas.getContext("2d");

 ctx.clearRect(0,0,300,200);

 data.forEach((c,i)=>{
   ctx.fillStyle="#3b82f6";
   ctx.fillRect(i*80,200-c.confidence,40,c.confidence);

   ctx.fillStyle="white";
   ctx.fillText(c.title, i*80, 195);
 });
}
