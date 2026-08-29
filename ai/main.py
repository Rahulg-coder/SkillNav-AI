import json
import os
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


# =====================================================
# REQUEST MODELS
# =====================================================

class ChatRequest(BaseModel):
    message: str
    profile: Dict[str, Any] = Field(default_factory=dict)
    history: List[Dict[str, str]] = Field(default_factory=list)


class AssessmentRequest(BaseModel):
    profile: Dict[str, Any] = Field(default_factory=dict)
    answers: List[Dict[str, Any]] = Field(default_factory=list)


class AssessmentGenerateRequest(BaseModel):
    profile: Dict[str, Any] = Field(default_factory=dict)


class LearningContentRequest(BaseModel):
    profile: Dict[str, Any] = Field(default_factory=dict)
    roadmap: Dict[str, Any] = Field(default_factory=dict)
    phase: Dict[str, Any] = Field(default_factory=dict)


# =====================================================
# GROQ CLIENT
# =====================================================

def groq_client():
    key = os.getenv("GROQ_API_KEY")

    if not key or Groq is None:
        return None

    return Groq(api_key=key)


# =====================================================
# HEALTH
# =====================================================

@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "skillnav-ai"
    }


# =====================================================
# FALLBACK CHAT
# =====================================================

def fallback_chat(
    message: str,
    profile: Dict[str, Any]
):

    name = profile.get(
        "name",
        "learner"
    )

    return {
        "reply": (
            f"Hi {name}! I can help you plan "
            "your learning journey. Tell me your "
            "target role, current skills, and how "
            "many hours you can study each week."
        ),
        "source": "fallback"
    }


# =====================================================
# CHAT
# =====================================================

@app.post("/chat")
def chat(req: ChatRequest):

    client = groq_client()

    if client is None:

        return fallback_chat(
            req.message,
            req.profile
        )

    system = """
You are SkillNav AI, a personalized learning mentor.
You have access to the user's detailed learning context, including their assessment results, skill gaps, career readiness, and roadmap progress.

Give practical and concise advice based strictly on this context.

Respect the following rules:
- Prioritize actual skill gaps and current roadmap modules when giving advice.
- Do not invent assessment scores, skills, roadmap modules, or learning progress.
- Do not claim that the learner knows a skill unless the profile or assessment demonstrates it.
- Clearly distinguish actual user data from general advice.
- Keep answers understandable and concise.
- Recommend the next best action based on the user's current state (e.g., studying the current incomplete roadmap module or addressing a high-priority skill gap).
- If required user data is missing, explicitly say that the information is unavailable instead of fabricating it.
"""

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

        if (
            role in ["user", "assistant"]
            and content
        ):

            messages.append(
                {
                    "role": role,
                    "content": content
                }
            )

    messages.append(
        {
            "role": "user",
            "content": (
                f"Learner profile: {req.profile}\n"
                f"Question: {req.message}"
            )
        }
    )

    response = client.chat.completions.create(

        model=os.getenv(
            "GROQ_MODEL",
            "llama-3.3-70b-versatile"
        ),

        messages=messages,

        temperature=0.4
    )

    return {
        "reply":
            response.choices[0]
            .message
            .content,

        "source": "groq"
    }


# =====================================================
# FALLBACK ASSESSMENT QUESTIONS
# =====================================================

def fallback_assessment_questions(
    profile: Dict[str, Any]
):

    target = (
        profile.get("targetRole")
        or profile.get("goal")
        or "Software Developer"
    )

    return {

        "targetRole": target,

        "experience": profile.get(
            "experience",
            "Beginner"
        ),

        "questions": [

            {
                "question": (
                    f"Which concept is most important "
                    f"for a beginner targeting {target}?"
                ),

                "options": [
                    "Core fundamentals",
                    "Advanced optimization",
                    "Unrelated technology",
                    "None of the above"
                ]
            },

            {
                "question": (
                    "Which approach is best when "
                    "learning a new technical skill?"
                ),

                "options": [
                    "Only read theory",
                    "Practice and build projects",
                    "Skip fundamentals",
                    "Avoid practical work"
                ]
            },

            {
                "question": (
                    "What is the best way to identify "
                    "a weakness in a technical skill?"
                ),

                "options": [
                    "Avoid the topic",
                    "Practice and assess yourself",
                    "Memorize unrelated facts",
                    "Skip assessments"
                ]
            },

            {
                "question": (
                    "Why are hands-on projects useful?"
                ),

                "options": [
                    "They provide practical experience",
                    "They replace all theory",
                    "They eliminate learning",
                    "They are unnecessary"
                ]
            },

            {
                "question": (
                    "What should a learner do after "
                    "understanding the fundamentals?"
                ),

                "options": [
                    "Stop learning",
                    "Apply them through projects",
                    "Skip practice",
                    "Ignore feedback"
                ]
            }
        ],

        "source": "fallback"
    }


# =====================================================
# GENERATE ASSESSMENT QUESTIONS
# =====================================================

@app.post("/assessment/generate")
def generate_assessment(
    req: AssessmentGenerateRequest
):

    client = groq_client()

    if client is None:

        return fallback_assessment_questions(
            req.profile
        )

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
        []
    )

    system = """
You are SkillNav AI's adaptive assessment
question generator.

Generate exactly 5 multiple-choice questions.

Questions MUST be relevant to the learner's
target role.

Difficulty MUST match the learner's experience.

Current skills must be considered.

Return ONLY valid JSON:

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

Do not include answers.
Do not generate unrelated questions.
"""

    prompt = f"""
Target role:
{target_role}

Experience:
{experience}

Current skills:
{skills}

Generate a practical assessment specifically
for this learner.
"""

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
        }
    )

    data = json.loads(
        response.choices[0]
        .message
        .content
    )

    data["source"] = "groq"

    return data


# =====================================================
# FALLBACK ASSESSMENT
# =====================================================

def fallback_assessment(
    profile: Dict[str, Any],
    answers: List[Dict[str, Any]]
):

    target = (
        profile.get("targetRole")
        or profile.get("goal")
        or "your target role"
    )

    return {

        "score": 0,

        "summary": (
            f"Your current profile has been "
            f"analyzed against {target}."
        ),

        "strengths": [],

        "skillGaps": [

            {
                "skill": "Core foundations",
                "priority": "high",
                "reason": (
                    "Strengthen fundamentals "
                    "before advanced topics."
                )
            },

            {
                "skill": "Project experience",
                "priority": "medium",
                "reason": (
                    "Build practical evidence "
                    "of your skills."
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
            "Complete the foundation topics "
            "and build one small project."
        ),

        "source": "fallback"
    }


# =====================================================
# ASSESSMENT ANALYSIS
# =====================================================

@app.post("/assessment")
def assessment(
    req: AssessmentRequest
):

    client = groq_client()

    if client is None:

        return fallback_assessment(
            req.profile,
            req.answers
        )

    system = """
You are SkillNav AI's learning-path assessment engine.

Analyze the learner profile and assessment answers.

Return ONLY valid JSON:

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

Score must be between 0 and 100.

Make the roadmap sequential and realistic.

Do not assume skills the learner has not demonstrated.
"""

    prompt = f"""
Learner profile:

{req.profile}

Assessment answers:

{req.answers}
"""

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
        }
    )

    data = json.loads(
        response.choices[0]
        .message
        .content
    )

    data["source"] = "groq"

    return data


# =====================================================
# LEARNING CONTENT
# =====================================================

@app.post("/learning-content")
def generate_learning_content(
    req: LearningContentRequest
):

    client = groq_client()

    phase_title = req.phase.get(
        "title",
        "Learning Module"
    )

    description = req.phase.get(
        "description",
        ""
    )

    duration = req.phase.get(
        "duration",
        ""
    )

    skills = req.phase.get(
        "skills",
        []
    )

    prerequisites = req.phase.get(
        "prerequisites",
        []
    )

    target_role = (
        req.profile.get("targetRole")
        or req.roadmap.get("targetRole")
        or "Software Developer"
    )

    experience = req.profile.get(
        "experience",
        "Beginner"
    )


    # =================================================
    # FALLBACK
    # =================================================

    if client is None:

        lessons = []

        for skill in skills[:3]:

            lessons.append(
                {
                    "title":
                        f"{skill} Fundamentals",

                    "content":
                        (
                            f"Learn the fundamentals of "
                            f"{skill} and understand how "
                            f"it applies to {target_role}."
                        ),

                    "keyPoints": [
                        f"Understand {skill}",
                        f"Learn practical usage of {skill}",
                        f"Practice {skill}"
                    ]
                }
            )

        if not lessons:

            lessons = [
                {
                    "title": phase_title,

                    "content":
                        (
                            f"Learn the core concepts "
                            f"of {phase_title}."
                        ),

                    "keyPoints": [
                        "Understand fundamentals",
                        "Practice concepts",
                        "Apply concepts"
                    ]
                }
            ]

        return {

            "title": phase_title,

            "overview":
                (
                    f"This module helps you build "
                    f"skills required for {target_role}."
                ),

            "lessons": lessons,

            "practice": [
                "Complete a practical exercise.",
                "Solve a hands-on problem.",
                "Build a small project."
            ],

            "quiz": [
                {
                    "question":
                        f"What is an important part of {phase_title}?",

                    "options": [
                        "Understanding fundamentals",
                        "Skipping practice",
                        "Ignoring concepts",
                        "Avoiding hands-on work"
                    ],

                    "answer":
                        "Understanding fundamentals"
                }
            ],

            "resources": [
                {
                    "title": f"{phase_title} Tutorial",
                    "type": "video",
                    "searchQuery": f"{phase_title} tutorial for beginners",
                    "description": (
                        f"Beginner-friendly video learning "
                        f"resource for {phase_title}."
                    )
                },
                {
                    "title": f"{phase_title} Documentation",
                    "type": "documentation",
                    "searchQuery": f"{phase_title} official documentation",
                    "description": (
                        f"Reference material for learning "
                        f"{phase_title}."
                    )
                }
            ],

            "source": "fallback"
        }


    # =================================================
    # AI PROMPT
    # =================================================

    system = """
You are SkillNav AI's adaptive learning-content generator.

Create a learning module ONLY for the supplied roadmap phase.

The content MUST match the supplied phase title and topics.

Do not introduce unrelated technologies.

Respect:
- target role
- learner experience
- prerequisites
- roadmap phase

Create EXACTLY:
- 3 lessons
- 3 practice tasks
- 5 quiz questions
- 4 learning resources

Learning resources MUST be directly relevant to the supplied
phase and its topics.

Create:
- 2 video resources
- 2 documentation/article resources

IMPORTANT:
Do NOT invent URLs.

For every resource provide a useful searchQuery instead of
a URL. The searchQuery must be specific enough to find a
high-quality learning resource.

Prefer:
- official documentation
- MDN
- Microsoft Learn
- AWS documentation
- Cisco learning resources
- OWASP
- Linux documentation
- reputable educational YouTube tutorials

Do not generate fake URLs.

Every lesson must contain:
- title
- content
- keyPoints

Every quiz must contain:
- question
- exactly 4 options
- answer

The answer must exactly match one of the options.

Keep content concise enough for a web application.

Return ONLY valid JSON.

Use this structure:

{
  "title": "string",
  "overview": "string",

  "lessons": [
    {
      "title": "string",
      "content": "string",
      "keyPoints": [
        "string",
        "string",
        "string"
      ]
    }
  ],

  "practice": [
    "string",
    "string",
    "string"
  ],

  "quiz": [
    {
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "answer": "string"
    }
  ],

  "resources": [
    {
      "title": "string",
      "type": "video|documentation",
      "searchQuery": "string",
      "description": "string"
    }
  ]
}
"""


    prompt = f"""
Target role:
{target_role}

Experience:
{experience}

Roadmap phase:
{phase_title}

Phase description:
{description}

Duration:
{duration}

Topics:
{skills}

Prerequisites:
{prerequisites}

Create the learning module specifically for
this roadmap phase.

IMPORTANT:

Do not replace the supplied topics with
unrelated technologies.

If the phase is HTTP Fundamentals, teach
HTTP fundamentals.

If the phase is Networking, teach networking.

If the phase is Cybersecurity Fundamentals,
teach cybersecurity fundamentals.

The course must prepare the learner for
the next phase of the roadmap.

Learning resources must be specifically
related to this phase.
"""


    # =================================================
    # GROQ
    # =================================================

    try:

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

            max_completion_tokens=6000,

            response_format={
                "type": "json_object"
            }
        )

        raw_content = (
            response.choices[0]
            .message
            .content
        )

        data = json.loads(
            raw_content
        )


        # =============================================
        # VALIDATE
        # =============================================

        if not isinstance(data, dict):
            raise ValueError(
                "Invalid AI response"
            )

        if not isinstance(
            data.get("lessons"),
            list
        ):
            raise ValueError(
                "Lessons are missing"
            )

        if not isinstance(
            data.get("practice"),
            list
        ):
            raise ValueError(
                "Practice tasks are missing"
            )

        if not isinstance(
            data.get("quiz"),
            list
        ):
            raise ValueError(
                "Quiz is missing"
            )

        if not isinstance(
            data.get("resources"),
            list
        ):
            raise ValueError(
                "Resources are missing"
            )


        # =============================================
        # NORMALIZE LESSONS
        # =============================================

        normalized_lessons = []

        for lesson in data["lessons"][:3]:

            normalized_lessons.append(
                {
                    "title": str(
                        lesson.get(
                            "title",
                            "Lesson"
                        )
                    ),

                    "content": str(
                        lesson.get(
                            "content",
                            ""
                        )
                    ),

                    "keyPoints": [
                        str(point)
                        for point in lesson.get(
                            "keyPoints",
                            []
                        )[:3]
                    ]
                }
            )

        data["lessons"] = normalized_lessons


        # =============================================
        # NORMALIZE PRACTICE
        # =============================================

        data["practice"] = [
            str(task)
            for task in data.get(
                "practice",
                []
            )[:3]
        ]


        # =============================================
        # NORMALIZE QUIZ
        # =============================================

        normalized_quiz = []

        for quiz in data["quiz"][:5]:

            options = [
                str(option)
                for option in quiz.get(
                    "options",
                    []
                )[:4]
            ]

            answer = str(
                quiz.get(
                    "answer",
                    ""
                )
            )

            if len(options) == 4:

                if answer not in options:
                    answer = options[0]

                normalized_quiz.append(
                    {
                        "question":
                            str(
                                quiz.get(
                                    "question",
                                    ""
                                )
                            ),

                        "options":
                            options,

                        "answer":
                            answer
                    }
                )

        data["quiz"] = normalized_quiz


        # =============================================
        # NORMALIZE RESOURCES
        # =============================================

        normalized_resources = []

        for resource in data.get(
            "resources",
            []
        )[:4]:

            resource_type = str(
                resource.get(
                    "type",
                    "video"
                )
            ).lower()

            if resource_type not in [
                "video",
                "documentation"
            ]:
                resource_type = "video"

            normalized_resources.append(
                {
                    "title": str(
                        resource.get(
                            "title",
                            "Learning Resource"
                        )
                    ),

                    "type": resource_type,

                    "searchQuery": str(
                        resource.get(
                            "searchQuery",
                            phase_title
                        )
                    ),

                    "description": str(
                        resource.get(
                            "description",
                            "Recommended learning resource."
                        )
                    )
                }
            )

        data["resources"] = normalized_resources


        # =============================================
        # ENSURE RESOURCES EXIST
        # =============================================

        if len(data["resources"]) == 0:

            data["resources"] = [

                {
                    "title":
                        f"{phase_title} Video Tutorial",

                    "type":
                        "video",

                    "searchQuery":
                        f"{phase_title} tutorial for beginners",

                    "description":
                        "Video tutorial for this learning module."
                },

                {
                    "title":
                        f"{phase_title} Documentation",

                    "type":
                        "documentation",

                    "searchQuery":
                        f"{phase_title} official documentation",

                    "description":
                        "Reference documentation for this topic."
                }
            ]


        data["source"] = "groq"

        return data


    # =================================================
    # SAFE FALLBACK
    # =================================================

    except Exception as error:

        print(
            "AI learning content generation error:",
            error
        )

        fallback_lessons = []

        for skill in skills[:3]:

            fallback_lessons.append(
                {
                    "title":
                        f"{skill} Fundamentals",

                    "content":
                        (
                            f"Learn the fundamentals of "
                            f"{skill}. Understand the key "
                            f"concepts and practical "
                            f"applications relevant to "
                            f"{target_role}."
                        ),

                    "keyPoints": [
                        f"Understand {skill}",
                        f"Practice {skill}",
                        f"Apply {skill}"
                    ]
                }
            )

        if not fallback_lessons:

            fallback_lessons = [
                {
                    "title":
                        phase_title,

                    "content":
                        (
                            f"Learn the core concepts "
                            f"of {phase_title} and "
                            f"understand how they apply "
                            f"to {target_role}."
                        ),

                    "keyPoints": [
                        "Understand fundamentals",
                        "Practice concepts",
                        "Apply concepts"
                    ]
                }
            ]

        return {

            "title":
                phase_title,

            "overview":
                (
                    f"This personalized module "
                    f"focuses on {phase_title} "
                    f"for {target_role}."
                ),

            "lessons":
                fallback_lessons,

            "practice": [
                "Complete a hands-on exercise.",
                "Solve a practical problem.",
                "Build a small project."
            ],

            "quiz": [
                {
                    "question":
                        f"What is the main purpose of learning {phase_title}?",

                    "options": [
                        "Build practical skills",
                        "Skip fundamentals",
                        "Avoid practice",
                        "Ignore the topic"
                    ],

                    "answer":
                        "Build practical skills"
                }
            ],

            "resources": [
                {
                    "title":
                        f"{phase_title} Video Tutorial",

                    "type":
                        "video",

                    "searchQuery":
                        f"{phase_title} tutorial for beginners",

                    "description":
                        "Recommended video tutorial."
                },

                {
                    "title":
                        f"{phase_title} Documentation",

                    "type":
                        "documentation",

                    "searchQuery":
                        f"{phase_title} official documentation",

                    "description":
                        "Recommended documentation."
                }
            ],

            "source":
                "fallback"
        }