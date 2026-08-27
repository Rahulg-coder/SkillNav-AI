import os
import json
from typing import Any, Dict, List

from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel, Field

load_dotenv()

try:
    from groq import Groq
except ImportError:
    Groq = None


app = FastAPI(
    title="SkillNav AI Engine",
    version="1.0.0"
)


# =========================================================
# REQUEST MODELS
# =========================================================

class ChatRequest(BaseModel):
    message: str
    profile: Dict[str, Any] = Field(default_factory=dict)
    history: List[Dict[str, str]] = Field(default_factory=list)


class AssessmentRequest(BaseModel):
    profile: Dict[str, Any] = Field(default_factory=dict)
    answers: List[Dict[str, Any]] = Field(default_factory=list)


class AssessmentGenerateRequest(BaseModel):
    profile: Dict[str, Any] = Field(default_factory=dict)


# =========================================================
# FALLBACK CHAT
# =========================================================

def fallback_chat(
    message: str,
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    name = profile.get("name", "learner")

    target = (
        profile.get("targetRole")
        or profile.get("goal")
        or "your target role"
    )

    return {
        "reply": (
            f"Hi {name}! I can help you plan your learning journey "
            f"toward {target}. Tell me what you want to learn next "
            "or ask me about your skill gaps and roadmap."
        ),
        "source": "fallback"
    }


# =========================================================
# FALLBACK ASSESSMENT
# =========================================================

def fallback_assessment(
    profile: Dict[str, Any],
    answers: List[Dict[str, Any]]
) -> Dict[str, Any]:

    skills = profile.get("skills", [])

    target = (
        profile.get("targetRole")
        or profile.get("goal")
        or "your target role"
    )

    if isinstance(skills, str):
        skill_list = [
            skill.strip()
            for skill in skills.split(",")
            if skill.strip()
        ]
    elif isinstance(skills, list):
        skill_list = skills
    else:
        skill_list = []

    return {
        "score": 0,

        "summary": (
            f"Your current profile has been analyzed "
            f"against {target}."
        ),

        "strengths": skill_list[:3],

        "skillGaps": [
            {
                "skill": "Core foundations",
                "priority": "high",
                "reason": (
                    "Strengthen fundamentals before moving "
                    "to advanced topics."
                )
            },
            {
                "skill": "Project experience",
                "priority": "medium",
                "reason": (
                    "Build practical evidence of your skills "
                    "through projects."
                )
            }
        ],

        "roadmap": [
            {
                "milestone": "Foundation",
                "duration": "2-3 weeks",
                "topics": [
                    "Core concepts",
                    "Practice exercises"
                ],
                "prerequisites": []
            },
            {
                "milestone": "Applied learning",
                "duration": "3-4 weeks",
                "topics": [
                    "Intermediate concepts",
                    "Mini project"
                ],
                "prerequisites": [
                    "Foundation"
                ]
            },
            {
                "milestone": "Portfolio",
                "duration": "3-5 weeks",
                "topics": [
                    "Capstone project",
                    "Assessment",
                    "Portfolio"
                ],
                "prerequisites": [
                    "Applied learning"
                ]
            }
        ],

        "nextAction": (
            "Complete the foundation topics and "
            "build one small project."
        ),

        "source": "fallback"
    }


# =========================================================
# FALLBACK QUESTION GENERATOR
# =========================================================

def fallback_generate_questions(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    target = (
        profile.get("targetRole")
        or profile.get("goal")
        or "Software Developer"
    )

    experience = profile.get(
        "experience",
        "Beginner"
    )

    return {
        "targetRole": target,

        "experience": experience,

        "questions": [
            {
                "question": (
                    f"What is a fundamental concept "
                    f"every {target} should understand?"
                ),
                "options": [
                    "Core concepts and principles",
                    "Only advanced tools",
                    "Only project management",
                    "None of these"
                ]
            },
            {
                "question": (
                    f"Which approach is most suitable "
                    f"for a {experience.lower()} learner "
                    f"learning {target}?"
                ),
                "options": [
                    "Learn fundamentals before advanced topics",
                    "Skip fundamentals",
                    "Learn random topics",
                    "Only memorize definitions"
                ]
            },
            {
                "question": (
                    f"Why is practical experience important "
                    f"for {target}?"
                ),
                "options": [
                    "It helps apply concepts to real problems",
                    "It replaces all theoretical knowledge",
                    "It is unnecessary",
                    "It is only useful for experts"
                ]
            },
            {
                "question": (
                    f"What should a learner do after "
                    f"identifying a skill gap in {target}?"
                ),
                "options": [
                    "Practice and strengthen the weak area",
                    "Ignore it",
                    "Skip to unrelated topics",
                    "Stop learning"
                ]
            },
            {
                "question": (
                    f"What is a good way to validate "
                    f"progress toward {target}?"
                ),
                "options": [
                    "Projects and assessments",
                    "Only watching videos",
                    "Only reading titles",
                    "Avoiding practice"
                ]
            }
        ],

        "source": "fallback"
    }


# =========================================================
# GROQ CLIENT
# =========================================================

def groq_client():

    key = os.getenv("GROQ_API_KEY")

    if not key or Groq is None:
        return None

    return Groq(api_key=key)


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "skillnav-ai"
    }


# =========================================================
# CHAT
# =========================================================

@app.post("/chat")
def chat(req: ChatRequest):

    client = groq_client()

    if client is None:
        return fallback_chat(
            req.message,
            req.profile
        )

    system = (
        "You are SkillNav AI, a personalized learning mentor. "
        "Give practical, concise advice based on the learner profile. "
        "When recommending a path, respect prerequisites and the "
        "learner's current level. Do not invent completed courses."
    )

    messages = [
        {
            "role": "system",
            "content": system
        }
    ]

    for item in req.history[-10:]:

        role = item.get("role")

        content = (
            item.get("content")
            or item.get("message")
        )

        if role in ("user", "assistant") and content:

            messages.append({
                "role": role,
                "content": content
            })

    messages.append({
        "role": "user",
        "content": (
            f"Learner profile:\n"
            f"{req.profile}\n\n"
            f"Question:\n"
            f"{req.message}"
        )
    })

    response = client.chat.completions.create(

        model=os.getenv(
            "GROQ_MODEL",
            "llama-3.3-70b-versatile"
        ),

        messages=messages,

        temperature=0.4,
    )

    return {
        "reply": response.choices[0].message.content,
        "source": "groq"
    }


# =========================================================
# GENERATE ADAPTIVE ASSESSMENT QUESTIONS
# =========================================================

@app.post("/assessment/generate")
def generate_assessment(
    req: AssessmentGenerateRequest
):

    client = groq_client()

    # -----------------------------------------------------
    # Fallback when Groq is unavailable
    # -----------------------------------------------------

    if client is None:

        return fallback_generate_questions(
            req.profile
        )

    # -----------------------------------------------------
    # AI SYSTEM PROMPT
    # -----------------------------------------------------

    system = """
You are SkillNav AI's adaptive assessment question generator.

Your job is to generate a personalized technical assessment
based on the learner's target role, experience level,
known skills, and available learning time.

The questions MUST be relevant to the learner's target role.

Do NOT generate generic questions.

Difficulty must match the learner's experience level.

Return ONLY valid JSON in exactly this structure:

{
  "targetRole": "string",
  "experience": "string",
  "questions": [
    {
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ]
    }
  ]
}

STRICT RULES:

1. Generate exactly 5 questions.

2. Every question must have exactly 4 options.

3. Questions must be directly relevant to the target role.

4. Match the learner's experience level.

5. Use a mixture of conceptual and practical questions.

6. Avoid duplicate questions.

7. Avoid generic questions that are unrelated
   to the target role.

8. Do NOT include the correct answer.

9. Do NOT include an "answer" field.

10. Do NOT include explanations.

11. Keep questions clear and concise.

12. Use technical terminology appropriate for
    the learner's target role.

13. Questions should help identify skill gaps.

14. If the learner already knows certain skills,
    include some questions that test those skills
    at the appropriate level.

15. Return ONLY JSON.
"""

    # -----------------------------------------------------
    # LEARNER PROFILE
    # -----------------------------------------------------

    target_role = (
        req.profile.get("targetRole")
        or req.profile.get("goal")
        or "Software Developer"
    )

    experience = req.profile.get(
        "experience",
        "Beginner"
    )

    skills = req.profile.get(
        "skills",
        ""
    )

    learning_hours = (
        req.profile.get("learningHours")
        or req.profile.get("hours")
        or ""
    )

    prompt = f"""
Generate a 5-question adaptive assessment.

Learner Profile:

Name:
{req.profile.get("name", "Learner")}

Target Role:
{target_role}

Experience Level:
{experience}

Known Skills:
{skills}

Learning Time:
{learning_hours}

The assessment must specifically evaluate
the learner's readiness for the target role.

Target Role:
{target_role}
"""

    # -----------------------------------------------------
    # CALL GROQ
    # -----------------------------------------------------

    response = client.chat.completions.create(

        model=os.getenv(
            "GROQ_MODEL",
            "llama-3.3-70b-versatile"
        ),

        messages=[
            {
                "role": "system",
                "content": system
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.4,

        response_format={
            "type": "json_object"
        },
    )

    # -----------------------------------------------------
    # PARSE AI RESPONSE
    # -----------------------------------------------------

    try:

        data = json.loads(
            response.choices[0].message.content
        )

    except json.JSONDecodeError:

        return fallback_generate_questions(
            req.profile
        )

    # -----------------------------------------------------
    # BASIC VALIDATION
    # -----------------------------------------------------

    questions = data.get(
        "questions",
        []
    )

    if not isinstance(questions, list):

        return fallback_generate_questions(
            req.profile
        )

    if len(questions) != 5:

        return fallback_generate_questions(
            req.profile
        )

    for question in questions:

        if not isinstance(question, dict):
            return fallback_generate_questions(
                req.profile
            )

        if not question.get("question"):
            return fallback_generate_questions(
                req.profile
            )

        options = question.get(
            "options",
            []
        )

        if not isinstance(options, list):
            return fallback_generate_questions(
                req.profile
            )

        if len(options) != 4:
            return fallback_generate_questions(
                req.profile
            )

    # -----------------------------------------------------
    # FINAL RESPONSE
    # -----------------------------------------------------

    return {
        "targetRole": data.get(
            "targetRole",
            target_role
        ),

        "experience": data.get(
            "experience",
            experience
        ),

        "questions": questions,

        "source": "groq"
    }


# =========================================================
# ASSESSMENT EVALUATION
# =========================================================

@app.post("/assessment")
def assessment(req: AssessmentRequest):

    client = groq_client()

    # -----------------------------------------------------
    # FALLBACK
    # -----------------------------------------------------

    if client is None:

        return fallback_assessment(
            req.profile,
            req.answers
        )

    # -----------------------------------------------------
    # SYSTEM PROMPT
    # -----------------------------------------------------

    system = """
You are SkillNav AI's learning-path assessment engine.

Analyze the learner profile and assessment answers.

Determine the learner's approximate readiness
for the target role.

Evaluate the answers based on the target role,
experience level and demonstrated knowledge.

Return ONLY valid JSON with this exact shape:

{
  "score": 0,
  "summary": "string",
  "strengths": ["string"],
  "skillGaps": [
    {
      "skill": "string",
      "priority": "high|medium|low",
      "reason": "string"
    }
  ],
  "roadmap": [
    {
      "milestone": "string",
      "duration": "string",
      "topics": ["string"],
      "prerequisites": ["string"]
    }
  ],
  "nextAction": "string"
}

RULES:

1. score must be an integer between 0 and 100.

2. Score should reflect the learner's demonstrated
   knowledge from the answers.

3. Do not assume a skill is mastered unless the
   learner demonstrated knowledge of it.

4. Identify specific skill gaps.

5. Prioritize skill gaps.

6. Make the roadmap sequential.

7. Respect prerequisites.

8. Keep the roadmap realistic for the learner's
   experience level.

9. The nextAction must address the highest-priority
   skill gap.

10. Return ONLY JSON.
"""

    # -----------------------------------------------------
    # PROMPT
    # -----------------------------------------------------

    prompt = f"""
Learner profile:

{req.profile}

Assessment answers:

{req.answers}

Analyze this learner's readiness for their target role.
Identify strengths, skill gaps and a personalized roadmap.
"""

    # -----------------------------------------------------
    # CALL GROQ
    # -----------------------------------------------------

    response = client.chat.completions.create(

        model=os.getenv(
            "GROQ_MODEL",
            "llama-3.3-70b-versatile"
        ),

        messages=[
            {
                "role": "system",
                "content": system
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.2,

        response_format={
            "type": "json_object"
        },
    )

    # -----------------------------------------------------
    # PARSE RESPONSE
    # -----------------------------------------------------

    try:

        data = json.loads(
            response.choices[0].message.content
        )

    except json.JSONDecodeError:

        return fallback_assessment(
            req.profile,
            req.answers
        )

    # -----------------------------------------------------
    # NORMALIZE SCORE
    # -----------------------------------------------------

    try:

        score = int(
            data.get("score", 0)
        )

    except (ValueError, TypeError):

        score = 0

    score = max(
        0,
        min(score, 100)
    )

    data["score"] = score

    # -----------------------------------------------------
    # ENSURE REQUIRED FIELDS EXIST
    # -----------------------------------------------------

    data.setdefault(
        "summary",
        "Assessment completed."
    )

    data.setdefault(
        "strengths",
        []
    )

    data.setdefault(
        "skillGaps",
        []
    )

    data.setdefault(
        "roadmap",
        []
    )

    data.setdefault(
        "nextAction",
        "Continue practicing your identified skill gaps."
    )

    data["source"] = "groq"

    return data