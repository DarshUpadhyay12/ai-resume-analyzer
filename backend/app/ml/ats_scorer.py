from typing import Dict, Any

def calculate_ats_score(parsed_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculates an ATS compatibility score based on parsed resume data."""
    score = 0
    feedback = []
    
    # 1. Length Check (Max 20 points)
    length = parsed_data.get("raw_text_length", 0)
    if 2000 < length < 6000:
        score += 20
        feedback.append({"type": "success", "message": "Optimal resume length."})
    elif length <= 2000:
        score += 10
        feedback.append({"type": "warning", "message": "Resume might be too brief. Consider adding more detail."})
    else:
        score += 10
        feedback.append({"type": "warning", "message": "Resume is quite long. Try to keep it concise."})
        
    # 2. Sections Detection (Max 30 points)
    sections = parsed_data.get("sections_found", {})
    section_score = 0
    missing_sections = []
    for section, found in sections.items():
        if found:
            section_score += 7.5
        else:
            missing_sections.append(section)
    score += section_score
    if not missing_sections:
        feedback.append({"type": "success", "message": "All essential sections found."})
    else:
        feedback.append({"type": "error", "message": f"Missing critical sections: {', '.join(missing_sections).title()}"})

    # 3. Skills Density (Max 30 points)
    skills = parsed_data.get("skills", [])
    if len(skills) >= 10:
        score += 30
        feedback.append({"type": "success", "message": "Strong display of technical skills."})
    elif 5 <= len(skills) < 10:
        score += 15
        feedback.append({"type": "warning", "message": "Moderate skills listed. Consider adding more specific tools and languages."})
    else:
        score += 5
        feedback.append({"type": "error", "message": "Few skills detected. Ensure your technical skills are explicitly listed."})
        
    # 4. Measurable Results (Max 20 points)
    # Placeholder for detecting numbers, percentages, etc.
    # In a full implementation, we would use NER to find percentages/money and action verbs.
    score += 15
    feedback.append({"type": "info", "message": "Ensure your bullet points include measurable results (e.g., 'increased efficiency by 20%')."})

    return {
        "total_score": int(score),
        "feedback": feedback,
        "breakdown": {
            "length": 20 if 2000 < length < 6000 else 10,
            "sections": int(section_score),
            "skills": 30 if len(skills) >= 10 else (15 if len(skills) >= 5 else 5),
            "impact": 15
        }
    }
