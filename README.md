# ✍️ Zapply

> Upload a CV. Paste a job description. Get a tailored, human-sounding cover letter in about **15 seconds**.

No generic *"I am writing to express my interest..."*. No awkward AI fluff. Just a cover letter that actually sounds like you.

_🌐 **Live app:** https://zapply-cyan.vercel.app_

---

## ✨ Features

- 📄 **Upload your resume** (PDF) and paste the job description, that's literally the entire workflow.
- 🤖 **AI-generated cover letter** powered by OpenAI `gpt-4.1`
  - sounds like a real person, not a template
  - skips cliché openings and corporate buzzwords
  - mirrors the language and tone of the job posting
  - honestly acknowledges career changes instead of pretending they never happened
- 📝 **Ready-to-send formatting**
  - contact details
  - date
  - subject line
  - professionally structured body
  - signature
- 📋 **Copy with one click** or 📥 **download as a polished one-page PDF**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|------------|
| **Frontend** | React + Vite + TypeScript, Material UI |
| **Backend** | Flask (Python) |
| **AI** | OpenAI API (`gpt-4.1`) |
| **PDF Parsing** | `pymupdf4llm` |
| **PDF Generation** | `html2pdf.js` |
| **Hosting** | Vercel (frontend) + Render (backend) |

---

## 📂 Project Structure

```text
Zapply/
├── backend/
│   ├── app.py               # Flask entrypoint + CORS
│   ├── processing.py        # Handles uploads and orchestrates the pipeline
│   ├── openai_service.py    # Prompt engineering + OpenAI calls
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/
        │   ├── UploadPage.tsx
        │   └── CoverLetterPage.tsx
        └── components/
            └── Navbar.tsx
```

---

## 🚀 Local Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:

```env
OPENAI_API_KEY=your_key_here
```

Run:

```bash
python app.py
```

Backend → `http://localhost:5000`

---

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

Frontend → `http://localhost:5173`

---

## 🔐 Environment Variables

| Variable | Location | Purpose |
|-----------|----------|---------|
| `OPENAI_API_KEY` | `backend/.env` | Generates the cover letter |
| `FRONTEND_URL` | Render | Allowed frontend origin for CORS |
| `VITE_API_URL` | Frontend | Backend API URL |

---

## ☁️ Deployment

### Backend (Render)

- Root directory: `backend`
- Build command:
  ```bash
  pip install -r requirements.txt
  ```
- Start command:
  ```bash
  gunicorn app:app --bind 0.0.0.0:$PORT
  ```
- Environment variables:
  - `OPENAI_API_KEY`
  - `FRONTEND_URL`

### Frontend (Vercel)

- Root directory: `frontend`
- Framework preset: **Vite**
- Environment variable:
  - `VITE_API_URL` → deployed Render backend URL

---

## ⚠️ Known Limitations

- 🧠 Stateless by design: nothing is stored after a request finishes.
- 🔒 CORS is intentionally restricted to approved frontend origins.
- 💻 `pymupdf4llm` brings in `onnxruntime`, which may log harmless GPU detection warnings on Render's CPU-only machines.
- 😴 Render's free tier goes to sleep after inactivity, so the first request may take ~30 seconds to wake up.
- 👤 No authentication: this is a personal project, not a multi-user SaaS.

---

## 💡 Why I built this

After applying to way too many jobs, I realized the hardest part wasn't updating my CV; it was rewriting the same cover letter over and over again.

Most AI tools either sound overly formal, stuff every sentence with buzzwords, or generate the same generic opening every recruiter has already seen.

So I built **Zapply** to generate cover letters that feel more human: tailored to the job description, grounded in the candidate's actual experience, and ready to send with minimal editing.
