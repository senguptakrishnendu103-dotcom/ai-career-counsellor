const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// 🔥 Analytics storage
let analytics = {
  visitors: 0,
  careerClicks: {}
};

// careers
const careers = ["Software Developer","AI Engineer","Designer","Manager","Finance Analyst"];

// visitor count
app.get("/api/visit",(req,res)=>{
  analytics.visitors++;
  res.json({visitors: analytics.visitors});
});

// career API
app.post("/api/career",(req,res)=>{
  let results = careers.map(c=>{
    let score = Math.floor(Math.random()*50)+50;

    // 🔥 track analytics
    analytics.careerClicks[c] = (analytics.careerClicks[c] || 0) + 1;

    return {title:c,confidence:score};
  });

  results.sort((a,b)=>b.confidence-a.confidence);

  res.json({
    explanation:"Here are your best career options:",
    topCareers: results.slice(0,3)
  });
});

// 🔥 analytics API
app.get("/api/analytics",(req,res)=>{
  res.json(analytics);
});

app.listen(PORT,()=>console.log("Server running"));
