const questions=[
"Do you enjoy logical thinking?",
"Do you like leadership?",
"Are you creative?"
];

let i=0;
let answers=[];

function addMessage(text,type){
 const msg=document.createElement("div");
 msg.className="message "+type;
 msg.innerText=text;
 document.getElementById("chatBox").appendChild(msg);
 msg.scrollIntoView();
}

function startQuiz(){
 addMessage("Let's find your career 🚀","ai");
 askQuestion();
}

function askQuestion(){
 if(i>=questions.length) return submit();

 addMessage(questions[i],"ai");

 setTimeout(()=>{
   addMessage("Yes","user");
   answers.push("yes "+questions[i]);
   i++;
   askQuestion();
 },1000);
}

async function submit(){
 addMessage("Analyzing your answers...","ai");

 const res=await fetch("/api/career",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({answers})
 });

 const data=await res.json();

 data.topCareers.forEach(c=>{
   addMessage(`${c.title} (${c.confidence}%)\n${c.reason}`,"ai");
 });
}
