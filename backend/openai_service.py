import os
from openai import OpenAI
import re
import json

def clean_cover_letter_text(text: str) -> str:
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    text = text.replace('—', ', ')
    text = re.sub(r'^\s*[-•]\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    return text.strip()

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

def generate_cover_letter(cv_text, jd_text):
    prompt = f"""
    ----------------------
    STRUCTURE (in order):
    ----------------------
    --------
    HEADER:
    --------
    - Your contact details (name, email, phone, location extracted from the CV)
    - Recipient details (company name, hiring manager extracted from the job description if present)
    - Date
    - Subject line (job title extracted from the job description)
    Salutation — "Dear [Name]" or "Dear Hiring Committee"

    ------
    BODY:
    ------
    3–4 to the point short paragraphs:
    - Open with which role, why this company specifically 
    - For skills match 2–3 concrete achievements mapped to JD requirements extracted from CV
    - Explain why this company and role is a good fit for you, and how you can contribute to the company
    - Make the entire content relevant to the job description and the company, avoid generic statements
    - Avoid repeating the CV content, instead complement it with examples and facts
    - Make the entire conversation sound like talking to a human, not a machine. Avoid robotic language.
    - Don't use bullet points, write in full prose only. Avoid emotional language, stay formal and professional.
    - End with a closing paragraph that expresses interest in an interview and appreciation for the opportunity to apply.

    -----------
    FOOTER:
    -----------
    Closing: availability for interview, "Regards" or "Sincerely", your name [extracted from the CV]

    --------------------------
    RULES MUST FOLLOW:
    --------------------------
    - Exactly one page, formal business letter format 
    - No bullet points, fully written prose only
    - No markdown formatting — no bold, no italics, no dashes, no headers
    - Plain text only, no special characters used for formatting
    - Mirror language and keywords from the job posting 
    - Complement the CV, never repeat it, use examples and facts instead
    - Short, clear paragraphs, stay formal, avoid emotional language
    - Extract user details from the CV automatically
    - If a field like phone is not in the CV, omit it entirely — do not write "not provided"

    --------------------------
    CV:
    --------------------------
    {cv_text}   

    ---------------------------
    JOB DESCRIPTION:
    ---------------------------
    {jd_text}   

    ----------------------------
    Return ONLY a JSON object with these exact keys, no markdown, no code fences:
    ----------------------------
    - "header": the generated cover letter header
    - "body": the generated cover letter body  
    - "footer": the generated cover letter footer
    """
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": """You are helping a job applicant write a cover letter that sounds like a real human conversation, not a corporate document. 

The letter should:
- Tell a brief personal story arc — where they started, how their journey evolved, what they are passionate about now
- Sound like the applicant is genuinely talking to a person, not submitting a form
- Reference projects and experience subtly and naturally, not as a list
- Show self-awareness — if there's a career change or field shift in the CV, acknowledge it honestly
- Be warm, confident, and direct — like a smart friend explaining why they want the job
- Never use phrases like: 'I am writing to express my interest', 'I am a passionate', 'leverage', 'synergy', 'I would be a great fit'
- Start with something unexpected — not 'Dear X, I am applying for...'
"""},
            {"role": "user", "content": prompt}
        ]
    )
    raw = response.choices[0].message.content
    # Strip code fences if present
    raw = re.sub(r'^```json\s*', '', raw.strip())
    raw = re.sub(r'^```\s*', '', raw.strip())
    raw = re.sub(r'```$', '', raw.strip())
    parsed = json.loads(raw)
    parsed['header'] = clean_cover_letter_text(parsed['header'])
    parsed['body'] = clean_cover_letter_text(parsed['body'])
    parsed['footer'] = clean_cover_letter_text(parsed['footer'])
    return json.dumps(parsed)