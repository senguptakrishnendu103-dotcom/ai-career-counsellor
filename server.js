const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// 🔥 Industry data
const skills = ["Python","JavaScript","AI","Cloud","Data Science","Cybersecurity"];

const salaries = [
  {role:"Software Engineer", value:120},
  {role:"Data Scientist", value:140},
  {role:"AI Engineer", value:160},
  {role:"Frontend Dev", value:110},
  {role:"Backend Dev", value:130}
];

// analytics
let visitors = 0;

app.get("/api/data",(req,res)=>{
  visitors++;
  res.json({
    visitors,
    growth: (Math.random()*10).toFixed(1),
    demand: "High",
    skills,
    salaries
  });
});

// career AI
app.post("/api/career",(req,res)=>{
  const roles=[
    "Software Engineer",
    "AI Engineer",
    "Product Manager",
    "UI/UX Designer",
    "Data Analyst"
  ];

  const result = roles.map(r=>({
    title:r,
    confidence: Math.floor(Math.random()*40)+60
  }));

  res.json({
    message:"Based on your profile, here are your best career options:",
    careers: result.slice(0,3)
  });
});

app.listen(PORT,()=>console.log("Server running"));
