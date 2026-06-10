from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def clean_text(text: str) -> str:
    doc = nlp(text.lower())
    tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct]
    return " ".join(tokens)

def calculate_job_match(resume_text: str, job_description: str) -> dict:
    """Calculates how well a resume matches a job description."""
    
    clean_resume = clean_text(resume_text)
    clean_jd = clean_text(job_description)
    
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([clean_resume, clean_jd])
    
    similarity_matrix = cosine_similarity(vectors)
    match_score = similarity_matrix[0][1] * 100
    
    # Extract keywords from JD using simple extraction
    jd_doc = nlp(job_description.lower())
    jd_keywords = set([ent.text for ent in jd_doc.ents if ent.label_ in ['ORG', 'PRODUCT']])
    
    # Simple noun chunk extraction for skills
    for chunk in jd_doc.noun_chunks:
        if len(chunk.text.split()) < 3: # Keep it short
            jd_keywords.add(chunk.text)
            
    # Check which are missing in resume
    resume_lower = resume_text.lower()
    missing_keywords = [kw for kw in list(jd_keywords)[:20] if kw not in resume_lower]
    
    return {
        "match_percentage": round(match_score, 2),
        "missing_keywords": missing_keywords[:10] # Return top 10
    }
