const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

let visitors = 0;

// careers
const careers = {
  tech: {
    titles:["Software Developer","AI Engineer","Cybersecurity Expert"],
    keywords:["logical","problem","code"],
  },
  business: {
    titles:["Entrepreneur","Manager","Consultant"],
    keywords:["leader","manage","decision"],
  },
  creative: {
    titles:["Designer","Content Creator","Video Editor"],
    keywords:["creative","design","visual"],
  },
  finance: {
    titles:["Financial Analyst","Accountant"],
    keywords:["numbers","data","analysis"],
  }
};

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

app.get("/api/visitors",(req,res)=>{
  visitors++;
  res.json({visitors});
});

app.post("/api/career",(req,res)=>{
  const input = (req.body.answers||[]).join(" ").toLowerCase();

  let results=[];

  for(let key in careers){
    let score = Math.floor(Math.random()*40)+40; // 40–80 realistic

    careers[key].keywords.forEach(k=>{
      if(input.includes(k)) score+=10;
    });

    score = Math.min(score,95);

    results.push({
      title: random(careers[key].titles),
      confidence: score
    });
  }

  results.sort((a,b)=>b.confidence-a.confidence);

  res.json({
    explanation: "Based on your responses, here are the most suitable career paths for you:",
    topCareers: results.slice(0,3)
  });
});

app.listen(PORT,()=>console.log("Server running"));
