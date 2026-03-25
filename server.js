const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

let visitors = 0;

app.get("/api/data",(req,res)=>{
  visitors++;

  res.json({
    visitors,
    growth: (Math.random()*10+5).toFixed(1),
    demand: "High",
    skills:["AI","Web Dev","Data Science","Cybersecurity","Cloud"],
    salaries:[
      {role:"AI Engineer",value:160},
      {role:"Software Dev",value:130},
      {role:"Data Scientist",value:150}
    ]
  });
});

app.post("/api/career",(req,res)=>{
  const roles=[
    "AI Engineer","Software Developer","Data Scientist",
    "UI/UX Designer","Business Analyst"
  ];

  const results=roles.map(r=>({
    title:r,
    confidence: Math.floor(Math.random()*30)+60
  }));

  res.json({
    explanation:"Based on your answers, these careers suit you:",
    topCareers: results.slice(0,3)
  });
});

app.listen(PORT,()=>console.log("Server running"));
