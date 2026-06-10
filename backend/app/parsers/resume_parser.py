import fitz  # PyMuPDF
import spacy
from typing import Dict, List, Optional
import io
import re

# Load English tokenizer, tagger, parser and NER
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Fallback if not downloaded
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extracts text from a PDF file."""
    text = ""
    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text += page.get_text()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
    return text

def extract_skills_with_spacy(text: str, known_skills: List[str] = None) -> List[str]:
    """Uses spaCy NLP to extract potential skills from text."""
    # A basic implementation. In production, a custom NER model or Matcher would be used.
    if known_skills is None:
        known_skills = [
            "python", "java", "javascript", "react", "node.js", "c++", "c#",
            "html", "css", "sql", "mongodb", "aws", "docker", "kubernetes",
            "machine learning", "nlp", "fastapi", "django", "flask", "git"
        ]
    
    doc = nlp(text.lower())
    found_skills = set()
    
    # Simple keyword matching for now
    text_lower = text.lower()
    for skill in known_skills:
        # Use regex for exact word boundary match to avoid partial matches
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill.title())
            
    return list(found_skills)

def extract_entities(text: str) -> Dict[str, List[str]]:
    """Extracts entities like ORG, GPE, PERSON from the resume text."""
    doc = nlp(text)
    entities = {"ORG": [], "GPE": [], "PERSON": [], "DATE": []}
    
    for ent in doc.ents:
        if ent.label_ in entities:
            if ent.text not in entities[ent.label_]:
                entities[ent.label_].append(ent.text)
                
    return entities

def parse_resume(pdf_bytes: bytes) -> Dict:
    """Main parsing function."""
    text = extract_text_from_pdf(pdf_bytes)
    skills = extract_skills_with_spacy(text)
    entities = extract_entities(text)
    
    # Basic section detection based on common headers
    sections = {
        "education": "education" in text.lower(),
        "experience": "experience" in text.lower() or "employment" in text.lower(),
        "projects": "projects" in text.lower(),
        "skills": "skills" in text.lower()
    }
    
    return {
        "raw_text": text,
        "raw_text_length": len(text),
        "skills": skills,
        "entities": entities,
        "sections_found": sections
    }
