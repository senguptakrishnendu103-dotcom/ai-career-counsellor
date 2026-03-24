const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

let visitors = 0;

app.get("/api/visit",(req,res)=>{
  visitors++;
  res.json({visitors});
});

app.post("/api/career",(req,res)=>{
  const careers = [
    "Software Engineer",
    "AI Engineer",
    "UI/UX Designer",
    "Business Manager",
    "Financial Analyst"
  ];

  let results = careers.map(c=>{
    return {
      title: c,
      confidence: Math.floor(Math.random()*40)+50
    };
  });

  results.sort((a,b)=>b.confidence-a.confidence);

  res.json({
    explanation:"Here are your best career matches:",
    topCareers: results.slice(0,3)
  });
});

app.listen(PORT,()=>console.log("Server running"));
