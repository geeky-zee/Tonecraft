# ✨ ToneCraft — Automated Copywriting & Tone Transformer
<img width="1247" height="754" alt="image" src="https://github.com/user-attachments/assets/f2fe50ce-5386-4b64-9a27-fdf234b0d488" />

ToneCraft is a web application that turns a raw product description into polished, platform-ready marketing copy — instantly. Give it a product name, a short description, pick a platform and a tone, and let AI handle the rest.

**Live Demo:** https://tonecraft-sqwd.onrender.com

---

## 🚀 What It Does

Writing different versions of marketing copy for every platform is repetitive and time-consuming. ToneCraft automates this by dynamically compiling a prompt from your inputs and generating copy tailored to the exact rules of each platform — tone, length, structure, and style — using a large language model.

## 🎯 Key Features

- **Dynamic Prompt Compilation** — Product Name, Description, Platform, and Tone are injected into a master instruction template before being sent to the model.
- **Multi-Platform Support** — Instagram, TikTok, LinkedIn, X (Twitter), Facebook, Email, and GitHub, each with its own platform-specific writing rules baked into the prompt.
- **Tone Control** — Witty, Professional, Persuasive, Friendly, and Luxury tone presets.
- **Inference Parameter Tuning** — Live sliders for `Temperature` and `Top_P` to control creativity vs. consistency.
- **Modern, Responsive UI** — Card-style platform selectors, animated gradients, and a polished dark/light theme toggle.
- **Copy History** — Recent generations are saved locally so nothing is lost between sessions.
- **One-Click Copy** — Copy generated content straight to your clipboard.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3 (custom properties, animations), Vanilla JavaScript |
| Backend | Python, Flask |
| AI Inference | Groq API (OpenAI GPT-OSS models) |
| Deployment | Render |

## ⚙️ How It Works

1. The user fills in a **Product Name**, **Description**, selects a **Platform** and **Tone**, and adjusts **Temperature** / **Top_P**.
2. The frontend sends this data to a Flask API endpoint (`/generate`).
3. The backend compiles a **master prompt template**, injecting the user's inputs along with platform-specific writing rules.
4. The prompt is sent to the Groq API for inference.
5. The generated copy is returned as JSON and rendered instantly in the UI.

## 📦 Local Setup

```bash
# Clone the repository
git clone https://github.com/your-username/tonecraft.git
cd tonecraft

# Create and activate a virtual environment
python -m venv venv
source venv/Scripts/activate   # Windows (Git Bash)
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Add your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env

# Run the app
python app.py
```

Visit `http://127.0.0.1:5000` in your browser.

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your API key from [console.groq.com](https://console.groq.com/keys) |

## 📁 Project Structure

```
tonecraft/
├── app.py
├── requirements.txt
├── .env
├── templates/
│   └── index.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

## 🎓 About

Built as **Project 2** of the Generative AI Engineering track at **DecodeLabs**, focused on dynamic prompt orchestration and inference parameter control — the core skills behind scalable, automated content pipelines.

## 📄 License

This project is open for learning and personal use. Feel free to fork and build on it.

---

**Built with ⚡ Groq, Flask, and a lot of iteration.**
