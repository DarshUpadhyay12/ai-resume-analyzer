# AI Resume Analyzer

An intelligent, stateless, full-stack application that analyzes resumes, extracts technical skills, scores them against ATS algorithms, and provides actionable feedback. You can also paste a Job Description to get an AI-powered match percentage!

**Developed by**: Darsh Upadhyay

## Features
- **Stateless Architecture**: Uploads are processed in-memory and immediately discarded, ensuring data privacy and zero database dependency.
- **ATS Evaluation**: Generates a comprehensive score based on length, impact, and skills.
- **Job Description Matcher**: Compares your parsed resume against a job description and highlights missing keywords and suggestions.
- **Export to PDF**: Generate a clean, single-page printable report of your analysis.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts
- **Backend**: Python, FastAPI, spaCy (for NLP)

## Local Development

### Backend Setup
1. Navigate to the `backend` folder.
2. Create and activate a virtual environment.
3. Run `pip install -r requirements.txt`.
4. Run the server using: `uvicorn app.main:app --reload`

### Frontend Setup
1. Navigate to the `frontend` folder.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

## Deployment
- **Frontend**: Deploys seamlessly to Vercel (using the included `vercel.json`).
- **Backend**: Deploys seamlessly to Render (using the included `render.yaml`). Ensure you configure `VITE_API_URL` on your frontend deployment to point to your live backend URL!
