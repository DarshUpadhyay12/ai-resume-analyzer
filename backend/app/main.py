from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from app.parsers.resume_parser import parse_resume
from app.ml.ats_scorer import calculate_ats_score
from app.ml.job_matcher import calculate_job_match
from app.ml.suggestions import generate_suggestions

app = FastAPI(title="AI Resume Analyzer")

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to AI Resume Analyzer API"}

@app.post("/api/v1/resume/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    content = await file.read()
    
    if file.filename.endswith('.pdf'):
        parsed_data = parse_resume(content)
    else:
        raise HTTPException(status_code=501, detail="DOCX support is coming soon. Please upload a PDF.")
    
    ats_evaluation = calculate_ats_score(parsed_data)
    
    return {
        "id": "stateless_id",
        "filename": file.filename,
        "parsed_data": parsed_data,
        "ats_evaluation": ats_evaluation
    }

class JobMatchRequest(BaseModel):
    parsed_data: Dict[str, Any]
    job_description: str

@app.post("/api/v1/jobs/match")
async def match_job(request: JobMatchRequest):
    resume_text = request.parsed_data.get("raw_text", "")
    if not resume_text:
        resume_text = " ".join(request.parsed_data.get("skills", []))
        
    match_results = calculate_job_match(resume_text, request.job_description)
    suggestions = generate_suggestions(request.parsed_data, match_results)
    
    match_results["suggestions"] = suggestions
    
    return match_results
