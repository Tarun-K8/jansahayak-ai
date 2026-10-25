# 🇮🇳 JanSahayak AI (जन सहायक AI)
### *Indic Voice & Chat Citizen Welfare & CPGRAMS Grievance Copilot*

[![Built for Hackathon](https://img.shields.io/badge/Hackathon-45--Min%20Buildathon-orange.svg)](https://github.com)
[![Languages](https://img.shields.io/badge/Indic%20Languages-Hindi%20%7C%20English%20%7C%20Bengali%20%7C%20Marathi%20%7C%20Tamil%20%7C%20Telugu-emerald.svg)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **"Build for India's language. Keep the scope small. Ship something real in 45 minutes."**  
> Inspired by Sarvam AI Ideas Sheet: **#45 Sarkari Sahayak (Scheme Journey Agent)**, **#46 Grievance Drafter**, and **#29 Scheme-to-Pocket Benefit Finder**.

---

## 💡 The Problem
In India, over **800 million citizens** are eligible for government welfare schemes worth billions of rupees (PM Kisan, Ayushman Bharat, E-Shram, Ladli Behna, etc.), yet:
1. Complex bureaucratic English portals prevent ordinary rural citizens from knowing what they qualify for.
2. Filing official administrative grievances (CPGRAMS, Electricity, Water, PDS) requires formal legal language that citizens don't know how to draft.
3. Language barriers lock out non-English speakers.

## 🚀 The Solution: JanSahayak AI
**JanSahayak AI** is a voice-first Indic copilot where any citizen can simply **speak in Hindi or their regional language**:
* *"मैं डिलीवरी बॉय हूँ, क्या मेरे लिए कोई सुरक्षा बीमा है?"* (Gig Worker Social Security)
* *"गाँव में 15 दिन से ट्रांसफार्मर जला हुआ है, बिजली नहीं है।"* (Public Utility Grievance)

The copilot instantly:
1. **Identifies 100% Matching Welfare Schemes** with direct financial benefits, eligibility criteria, and required document checklist.
2. **Drafts an Official CPGRAMS Grievance Petition** citing statutory acts (Electricity Act 2003 Sec 43, National Food Security Act, Article 21 Right to Water) with reference tracking ID and mandated SLA days.
3. **Reads Out Aloud in Native Speech** using Web Speech Synthesis.
4. **Enables 1-Click Action**: Copy petition to clipboard, share directly to WhatsApp, or print/export to PDF.

---

## 🏛️ System Architecture

```text
       [ Citizen Voice / Text Input ] (Hindi / Hinglish / Regional)
                      │
           ┌──────────┴──────────┐
           ▼                     ▼
 [Web Speech API (STT)]   [Direct Text Query]
           │                     │
           └──────────┬──────────┘
                      ▼
     [ JanSahayak Indic Routing Engine ]
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[Intent: Welfare Scheme]   [Intent: Grievance / CPGRAMS]
        │                           │
  - Semantic Matching         - Ministry / Dept Tagging
  - Eligibility Checklist     - Statutory Act Citations (Sec 43)
  - Direct Benefit Amount     - Citizen Charter SLA Days
        │                           │
        └─────────────┬─────────────┘
                      ▼
  [ Dual-Engine Output Card & TTS Voice Synthesis ]
  - Direct Application Link
  - Formal Administrative Petition
  - 1-Click WhatsApp Share & PDF Export
```

---

## 🎬 Live 45-Second Video Walkthrough
The web application features an interactive, synchronized **16:9 HD Video Demo** directly embedded on the landing page:
* **Visual Graphics & Scene Transitions:** Covers Problem Statement, Voice AI, Welfare Matching, CPGRAMS Drafting, and WhatsApp sharing.
* **Bilingual Audio Voiceover:** Narrated in Hindi and Indian English.
* **1-Click WebM Video Download:** Powered by HTML5 Canvas & MediaRecorder API to export the demo video file locally.

---

## ⚡ Quick 1-Click Stage Demo Scenarios
To guarantee a zero-fail 90-second stage presentation, the UI includes instant demo presets:
1. 🌾 **Kisan (Farmer)**: *PM-KISAN Samman Nidhi & KCC Fertilizer Assistance*
2. ⚡ **Grievance (Bijli Cut)**: *Electricity Board CPGRAMS Complaint under Sec 43*
3. 🛵 **Gig Worker (Swiggy/Zomato)**: *E-Shram & PMSYM ₹2 Lakh accident + pension cover*
4. 🎓 **Student**: *National Scholarship Portal (NSP) College Tuition Waiver*

---

## 🎤 90-Second Stage Pitch Script (For Presenters)

> *"Judges, over 800 million citizens in India miss out on government welfare benefits simply because the portals are in complex English, and when basic services like electricity or water fail, an ordinary villager has no idea how to file a formal CPGRAMS petition.*
>
> *Introducing **JanSahayak AI** — the Indic Citizen Copilot. Let me show you a live demo.*
>
> *(Click or Speak: 'हमारें गाँव में 15 दिनों से ट्रांसफार्मर फुंका है, बिजली नहीं है')*
>
> *Look at what happened in under 1 second:*
> *1. It drafted a **formal administrative petition** to the State Electricity Board citing Section 43 of the Electricity Act and the 7-day mandatory resolution SLA.*
> *2. It generated a unique tracking token and lets the citizen share it instantly on WhatsApp or copy it to CPGRAMS.*
> *3. It reads the answer aloud in Hindi for illiterate citizens!*
>
> *Built in 45 minutes, deployable anywhere, empowering 1.4 billion citizens in their mother tongue. Thank you!"*

---

## 🛠️ Getting Started (Local Run)

### Using Python:
```bash
python3 serve.py
```
Open [http://localhost:3000](http://localhost:3000)

### Using Node.js:
```bash
node server.js
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 1-Click Live Deployment (Vercel)
You can deploy this repository directly to Vercel or GitHub Pages in 30 seconds:
1. Push this folder to your GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) -> Import repo -> Click **Deploy**.
3. Done! You have a live URL to showcase to the judges!

---

*Built with ❤️ for Digital India & Indic AI Hackathon.*
# jansahayak-ai
