import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel, Field

load_dotenv()

try:
    from groq import Groq
except ImportError:
    Groq = None

app = FastAPI(title="SkillNav AI Engine", version="1.0.0")


class ChatRequest(BaseModel):
    message: str
    profile: Dict[str, Any] = Field(default_factory=dict)
    history: List[Dict[str, str]] = Field(default_factory=list)


class AssessmentRequest(BaseModel):
    profile: Dict[str, Any] = Field(default_factory=dict)
    answers: List[Dict[str, Any]] = Field(default_factory=list)


def fallback_chat(message: str, profile: Dict[str, Any]) -> Dict[str, Any]:
    name = profile.get("name", "learner")
    return {
        "reply": (
            f"Hi {name}! I can help you plan your learning journey. "
            "Tell me your target role, current skills, and how many hours "
            "you can study each week."
        ),
        "source": "fallback"
    }


def fallback_assessment(profile: Dict[str, Any], answers: List[Dict[str, Any]]) -> Dict[str, Any]:
    skills = profile.get("skills", [])
    target = profile.get("targetRole") or profile.get("goal") or "your target role"

    return {
        "summary": f"Your current profile has been analyzed against {target}.",
        "strengths": skills[:3] if isinstance(skills, list) else [],
        "skillGaps": [
            {
                "skill": "Core foundations",
                "priority": "high",
                "reason": "Strengthen fundamentals before advanced topics."
            },
            {
                "skill": "Project experience",
                "priority": "medium",
                "reason": "Build practical evidence of your skills."
            }
        ],
        "roadmap": [
            {
                "milestone": "Foundation",
                "duration": "2-3 weeks",
                "topics": ["Core concepts", "Practice exercises"],
                "prerequisites": []
            },
            {
                "milestone": "Applied learning",
                "duration": "3-4 weeks",
                "topics": ["Intermediate concepts", "Mini project"],
                "prerequisites": ["Foundation"]
            },
            {
                "milestone": "Portfolio",
                "duration": "3-5 weeks",
                "topics": ["Capstone project", "Assessment", "Portfolio"],
                "prerequisites": ["Applied learning"]
            }
        ],
        "nextAction": "Complete the foundation topics and build one small project.",
        "source": "fallback"
    }


def groq_client():
    key = os.getenv("GROQ_API_KEY")
    if not key or Groq is None:
        return None
    return Groq(api_key=key)


@app.get("/health")
def health():
    return {"status": "ok", "service": "skillnav-ai"}


@app.post("/chat")
def chat(req: ChatRequest):
    client = groq_client()
    if client is None:
        return fallback_chat(req.message, req.profile)

    system = (
        "You are SkillNav AI, a personalized learning mentor. "
        "Give practical, concise advice based on the learner profile. "
        "When recommending a path, respect prerequisites and the learner's "
        "current level. Do not invent completed courses."
    )

    messages = [{"role": "system", "content": system}]
    for item in req.history[-10:]:
        if item.get("role") in ("user", "assistant") and item.get("content"):
            messages.append({"role": item["role"], "content": item["content"]})

    messages.append({
        "role": "user",
        "content": f"Learner profile: {req.profile}\nQuestion: {req.message}"
    })

    response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        messages=messages,
        temperature=0.4,
    )
    return {"reply": response.choices[0].message.content, "source": "groq"}


@app.post("/assessment")
def assessment(req: AssessmentRequest):
    client = groq_client()
    if client is None:
        return fallback_assessment(req.profile, req.answers)

    system = """
You are SkillNav AI's learning-path assessment engine.
Analyze the learner profile and assessment answers.
Return ONLY valid JSON with this shape:
{
  "summary": "string",
  "strengths": ["string"],
  "skillGaps": [
    {"skill":"string","priority":"high|medium|low","reason":"string"}
  ],
  "roadmap": [
    {
      "milestone":"string",
      "duration":"string",
      "topics":["string"],
      "prerequisites":["string"]
    }
  ],
  "nextAction":"string"
}
Make the roadmap sequential and realistic. Do not assume skills the learner
has not demonstrated.
"""

    prompt = f"Learner profile:\n{req.profile}\nAssessment answers:\n{req.answers}"

    response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )

    import json
    data = json.loads(response.choices[0].message.content)
    data["source"] = "groq"
    return data
