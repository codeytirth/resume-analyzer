import json
import os                      # Used to access environment variables
from pathlib import Path       # Imported for file paths (not used in this code)
from dotenv import load_dotenv # Loads variables from .env file
from groq import Groq   

from resume_reader import read_resume

from pydantic import BaseModel, ValidationError

load_dotenv()  

file_path = "uploads/Sample_Backend_Resume.pdf"

text = read_resume(file_path)


my_api_key = os.getenv("GROQ_API_KEY")  

if not my_api_key : 
    raise ValueError("api error")

client = Groq(api_key = my_api_key)
model = "llama-3.3-70b-versatile"
role = "system"
prompt = f"""
You are a resume parser.

Extract the following fields:

- name
- email
- phone
- education
- experience
- skills

Return ONLY this JSON:

{{
    "name": "",
    "email": "",
    "phone": "",
    "education": [],
    "experience": 0,
    "skills": []
}}

Rules:
1. Return ONLY a valid JSON object.
2. Do not use markdown.
3. Do not write ```json.
4. Do not explain anything.
5. If a field is missing, return an empty string or empty list.
6. Give experience in number of years (integer), and if not mentioned, return 0.

Resume:

{text}
"""
message_system= {
    "role" : "system",
    "content" : "You are a resume parser. Extract the following fields: name, email, phone, education, experience, skills. Return ONLY a valid JSON object. Do not use markdown. Do not write ```json. Do not explain anything. If a field is missing, return an empty string or empty list."
}

class ResumeData(BaseModel):
    name: str
    email: str
    phone: str
    education: list[str]
    experience: int 
    skills: list[str]

message = {
    "role" : role,          
    "content" : prompt      
}

messages = [message_system, message]

response = client.chat.completions.create(
    model = model,
    messages = messages 
)

resume = ResumeData.model_validate_json(response.choices[0].message.content)

# # try:
# #     resume = ResumeData.model_validate_json(response.choices[0].message.content)
# #     # print("Valid JSON!")
# #     # print(resume.model_dump())

# # except ValidationError as e:
# #     print("Invalid JSON")
# #     print(e)

with open("requirement.json", "r") as file:
    job = json.load(file)

matched = []
total = len(job["required_skills"])

for skill in job["required_skills"]:
    if skill.lower() in [s.lower() for s in resume.skills]:
        matched.append(skill)

skill_score  = (len(matched) / total)*100

pref_matched = []
total = len(job["preferred_skills"])

for skill in job["preferred_skills"]:
    if skill.lower() in [s.lower() for s in resume.skills]:
        pref_matched.append(skill)

pref_score = (len(pref_matched) / total)*100

goodfit = 0
if resume.experience >= job["minimum_experience"]:
    goodfit += 20

goodfit += (skill_score/100)*50
goodfit += (pref_score/100)*30

print("Good Fit Score: ", goodfit)