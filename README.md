# 🚀 CareerAI Pro

![CareerAI Pro Banner](https://img.shields.io/badge/Status-Live-success) ![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-blue) ![License](https://img.shields.io/badge/License-MIT-purple)

**CareerAI Pro** is a state-of-the-art, AI-powered career counseling platform. It leverages the advanced **Google Gemini 2.5 Flash** model to provide hyper-personalized career roadmaps, salary expectations, and skill requirements based on your unique interests, interactive quiz results, or an automatic analysis of your actual PDF resume!

---

## ✨ Features

- **🧠 Google Gemini Integration:** Generates dynamic, highly accurate, and up-to-date career advice, replacing hardcoded data with real AI intelligence.
- **📄 AI Resume Parsing:** Upload your PDF resume, and the system will extract the text, analyze your past experience/projects, and recommend the absolute best-fitting career path.
- **🗺️ Interactive Quiz Flow:** Unsure of what you want to do? Take a quick 4-question assessment and let the AI find your calling based on your tech, data, design, and business affinities.
- **📥 Downloadable PDF Roadmaps:** Instantly download your beautifully formatted AI-generated roadmap as a PDF to keep for future reference.
- **🎨 Premium UI/UX:** Built with a stunning dark-mode "Glassmorphism" aesthetic, featuring smooth micro-animations, vibrant gradients, and modern typography.

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, Vanilla JavaScript (ES6+), `html2pdf.js` (for PDF generation).
- **Backend:** Node.js, Express.js.
- **AI & Integrations:** `@google/generative-ai` (Gemini SDK), `pdf-parse` (for reading PDF text), `multer` (for secure memory file uploads).

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/senguptakrishnendu103-dotcom/ai-career-counsellor.git
cd ai-career-counsellor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example`) and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```
> *Note: You can get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

### 4. Start the Server
```bash
npm run dev
```
The server will start on port `3000`. Open your browser and navigate to `http://localhost:3000`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to open a pull request or issue.

## 📜 License
This project is open-source and available under the MIT License.
