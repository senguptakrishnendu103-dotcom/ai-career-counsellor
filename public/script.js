const questions=[
"Do you enjoy solving logical problems?",
"Do you like leadership roles?",
"Are you creative?",
"Do you like working with numbers?"
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

// typing effect
function typingEffect(text,callback){
 let i=0;
 const box=document.getElementById("chatBox");

 const msg=document.createElement("div");
 msg.className="message ai";
 box.appendChild(msg);

 let interval=setInterval(()=>{
   msg.innerText=text.slice(0,i);
   i++;
   if(i>text.length){
     clearInterval(interval);
     if(callback) callback();
   }
 },20);
}

function startQuiz(){
 typingEffect("Hey 👋 I'm your AI career assistant.",()=>{
   askQuestion();
 });
}

function askQuestion(){
 if(i>=questions.length) return submit();

 typingEffect(questions[i],()=>{
   showOptions();
 });
}

// 🔥 REAL USER INPUT
function showOptions(){
 const box=document.getElementById("chatBox");

 const container=document.createElement("div");
 container.className="message ai";

 container.innerHTML=`
   <button onclick="selectAnswer('Yes')">Yes</button>
   <button onclick="selectAnswer('No')">No</button>
 `;

 box.appendChild(container);
 container.scrollIntoView();
}

function selectAnswer(ans){
 addMessage(ans,"user");

 answers.push(ans+" "+questions[i]);
 i++;

 askQuestion();
}

async function submit(){
 typingEffect("Analyzing your personality deeply...",async ()=>{
   const res=await fetch("/api/career",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({answers})
   });

   const data=await res.json();

   typingEffect(data.explanation);

   data.topCareers.forEach((c,index)=>{
     setTimeout(()=>{
       typingEffect(`${c.title} (${c.confidence}%)\n${c.reason}`);
     },1000*(index+1));
   });
 });
}
