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

// comments
function addComment(){
 const text=document.getElementById("commentInput").value;
 const div=document.createElement("div");
 div.innerText=text;
 document.getElementById("commentList").appendChild(div);
}

// quiz
function startQuiz(){
 ask();
}

function ask(){
 if(i>=questions.length) return submit();
 addMessage(questions[i],"ai");
}

function answer(ans){
 addMessage(ans,"user");
 answers.push(ans);
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

 data.topCareers.forEach(c=>{
   addMessage(c.title+" "+c.confidence+"%","ai");
 });

 drawChart(data.topCareers);
}

// chart
function drawChart(data){
 const canvas=document.getElementById("chart");
 const ctx=canvas.getContext("2d");

 data.forEach((c,i)=>{
   ctx.fillRect(i*100,100-c.confidence,50,c.confidence);
 });
}
