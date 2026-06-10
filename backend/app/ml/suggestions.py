from typing import Dict, Any, List

def generate_suggestions(parsed_data: Dict[str, Any], match_data: Dict[str, Any] = None) -> List[str]:
    """Generates actionable improvement tips based on parsed data and optional job match data."""
    tips = []
    
    # Analyze raw text
    text = parsed_data.get("raw_text", "").lower()
    
    # 1. Check for Action Verbs
    action_verbs = ["developed", "managed", "created", "led", "increased", "reduced", "designed"]
    found_verbs = sum(1 for verb in action_verbs if verb in text)
    if found_verbs < 3:
        tips.append("Use more strong action verbs (e.g., Developed, Led, Managed, Increased) to start your bullet points.")

    # 2. Check for Quantifiable Results
    import re
    # Simple regex to find numbers/percentages
    has_metrics = bool(re.search(r'\d+%|\$\d+|\b\d+\s*(percent|million|k)\b', text))
    if not has_metrics:
        tips.append("Quantify your achievements. Add numbers, percentages, or dollar amounts to demonstrate impact (e.g., 'Increased sales by 20%').")

    # 3. Structure Tips
    sections = parsed_data.get("sections_found", {})
    if not sections.get("projects") and sections.get("experience"):
        tips.append("Consider adding a 'Projects' section to showcase practical applications of your skills, especially if you lack extensive experience.")
    
    # 4. Job Match Tips
    if match_data and match_data.get("missing_keywords"):
        keywords_str = ", ".join(match_data["missing_keywords"][:5])
        tips.append(f"To better match the job description, try to naturally incorporate these keywords if you have the experience: {keywords_str}")
        
    if not tips:
        tips.append("Your resume structure looks solid! Focus on tailoring the content specifically to each job description.")
        
    return tips
