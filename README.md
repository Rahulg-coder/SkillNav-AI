# SkillNav-AI

## AI-Powered Personalized Learning and Career Guidance Platform

SkillNav-AI is an AI-powered learning companion designed to help students identify their skill gaps, understand their career readiness, and follow a personalized learning roadmap based on their target career role.

The platform combines a modern web frontend, a Node.js backend, MongoDB, and a dedicated FastAPI AI engine powered by Groq.

---

## Problem Statement

Students often struggle to determine:

* Which skills are required for their desired career.
* Which skills they already possess.
* Which skills they are missing.
* What they should learn next.
* Whether they are ready for their target role.
* Which learning resources are relevant to their skill gaps.

SkillNav-AI addresses these problems by providing AI-powered skill analysis and personalized learning recommendations.

---

## Solution

SkillNav-AI provides a complete learning guidance workflow:

1. User creates an account and completes their profile.
2. User selects a target career role.
3. User completes a skill assessment.
4. The system analyzes the user's responses using AI.
5. Skill gaps and strengths are identified.
6. A personalized learning roadmap is generated.
7. Relevant learning modules and resources are provided.
8. Users can interact with the AI through the chat feature.
9. Dashboard and readiness information help users track their learning progress.

---

## Key Features

### User Authentication

* User registration and login.
* Protected application routes.
* User-specific data management.

### Personalized Dashboard

* Displays the learner's information.
* Provides an overview of learning progress.
* Connects assessment, roadmap, skill-gap and readiness information.

### Skill Assessment

* Users answer questions related to their target role.
* Assessment data is stored in MongoDB.
* AI analyzes the submitted assessment.

### AI Skill-Gap Analysis

The AI identifies:

* Current strengths.
* Missing skills.
* Skill-gap priority.
* Reasons for each identified gap.

### Personalized Learning Roadmap

The system generates a structured roadmap containing:

* Learning milestones.
* Topics to study.
* Prerequisites.
* Suggested duration.
* Recommended next actions.

### AI Chat

Users can interact with the AI learning companion and receive career and learning guidance.

### Readiness Analysis

The system evaluates the learner's current skills against their target role and provides readiness-related insights.

### Learning Modules

Learning modules provide structured learning content based on the user's roadmap.

### Learning Resources

The backend integrates learning-resource services to provide useful educational content.

### API Rate Limiting

Authentication endpoints are protected using rate limiting to prevent excessive repeated requests.

---

## System Architecture

```text
                         SkillNav-AI
                              |
                    +---------+---------+
                    |                   |
                Frontend             Backend
              React / Vite       Node.js / Express
                    |                   |
                    |            +------+------+
                    |            |             |
                    |         MongoDB       AI Service
                    |                         |
                    |                    FastAPI :8000
                    |                         |
                    |                      Groq API
                    |
                    +---------- API --------+
                              |
                           Backend
                           :5000
```

### Architecture Components

**Frontend**

* React
* Vite
* JavaScript
* Provides the user interface and communicates with the backend APIs.

**Backend**

* Node.js
* Express.js
* Handles authentication, APIs, business logic and communication with the database and AI engine.

**Database**

* MongoDB
* Stores user profiles, assessments, chat data, roadmaps and other application data.

**AI Engine**

* Python
* FastAPI
* Provides AI-specific processing and communicates with the Groq API.

**AI Provider**

* Groq
* Used for large-language-model based analysis and personalized responses.

---

## AI/ML Techniques Used

### Large Language Model (LLM)

The AI engine uses an LLM to understand learner information, assessment responses and learning goals.

### Prompt Engineering

Structured prompts are used to guide the AI to produce useful and consistent learning recommendations.

### Skill-Gap Identification

The AI compares the learner's demonstrated knowledge with the skills required for the target career role and identifies important gaps.

### Personalized Recommendation

The AI generates recommendations based on:

* Target role.
* Existing skills.
* Experience level.
* Assessment responses.
* Identified skill gaps.

### Structured AI Output

AI responses are returned in structured JSON format containing information such as:

```json
{
  "summary": "...",
  "strengths": [],
  "skillGaps": [],
  "roadmap": [],
  "nextAction": "..."
}
```

This allows the frontend and backend to process AI results reliably.

---

## Main Workflows

### Assessment Workflow

```text
User
 ↓
Frontend
 ↓
Submit Assessment
 ↓
Node.js Backend
 ↓
Store Assessment in MongoDB
 ↓
FastAPI AI Engine
 ↓
Groq
 ↓
AI Analysis
 ↓
Backend
 ↓
Update Assessment
 ↓
Frontend displays results
```

### AI Chat Workflow

```text
User enters message
        ↓
Frontend
        ↓
Backend /api/chat
        ↓
AI Engine
        ↓
Groq
        ↓
AI Response
        ↓
Backend
        ↓
MongoDB
        ↓
Frontend
```

### Learning Roadmap Workflow

```text
User Profile
     ↓
Target Career Role
     ↓
Skill Assessment
     ↓
AI Skill-Gap Analysis
     ↓
Personalized Roadmap
     ↓
Learning Modules
     ↓
Learning Resources
```

---

## Project Structure

```text
SkillNav-AI/
│
├── ai/
│   ├── main.py
│   ├── requirements.txt
│   ├── README.md
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── .env.example
│
├── skillbackend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Technologies Used

| Component         | Technology                    |
| ----------------- | ----------------------------- |
| Frontend          | React, Vite, JavaScript       |
| Backend           | Node.js, Express.js           |
| AI Engine         | Python, FastAPI               |
| AI                | Groq API / LLM                |
| Database          | MongoDB                       |
| API Communication | REST API                      |
| Authentication    | Backend authentication system |
| Version Control   | Git, GitHub                   |

---

## Local Setup & Execution

### 1. Clone the Repository

```bash
git clone https://github.com/Rahulg-coder/SkillNav-AI.git
cd SkillNav-AI
```

```bash
git checkout main
git pull origin main
```

### 2. Configure AI Engine

Go to the AI directory:

```bash
cd ai
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Create:

```text
ai/.env
```

Add:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model
```

Run the AI engine:

```bash
python -m uvicorn main:app --reload --port 8000
```

The AI engine runs at:

```text
http://127.0.0.1:8000
```

### 3. Configure Backend

Open another terminal:

```bash
cd skillbackend
npm install
```

Create:

```text
skillbackend/.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
AI_ENGINE_URL=http://127.0.0.1:8000
```

Run the backend:

```bash
npm start
```

The backend runs at:

```text
http://localhost:5000
```

### 4. Run Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL provided by Vite, usually:

```text
http://localhost:5173
```

---

## Environment Variables

For security, actual `.env` files are not included in the repository.

The project provides:

```text
ai/.env.example
skillbackend/.env.example
frontend/.env.example
```

Developers should create their own `.env` files using these templates.

Required credentials include:

* Groq API key.
* MongoDB connection string.
* Other deployment-specific configuration values.

---

## Security

The project includes several security measures:

* Environment variables are used for sensitive configuration.
* Real `.env` files are excluded from Git.
* Authentication endpoints are protected by rate limiting.
* Production rate limiting has secure fallback values.
* User-specific information is handled through authenticated requests.

### Rate Limiting

Authentication endpoints include:

```text
POST /api/auth/register
POST /api/auth/login
```

The rate limiter can be configured using:

```env
AUTH_RATE_LIMIT_MAX=50
AUTH_RATE_LIMIT_WINDOW_MS=900000
```

If these variables are not provided, the backend uses a secure default configuration.

---

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Assessment

```text
POST /api/assessment
```

### Chat

```text
POST /api/chat
```

### Learning

```text
/api/learning
```

### Other Services

The backend also provides functionality for:

* Dashboard
* Roadmap
* Skill-gap analysis
* Readiness analysis
* Learning resources

---

## Challenges Faced

### AI and Backend Integration

The AI engine runs independently using FastAPI, while the main application uses Node.js and Express. Communication between the two services was implemented using HTTP APIs.

### MongoDB Configuration

The application requires a MongoDB connection string through environment variables. Local development requires a valid MongoDB Atlas configuration.

### Environment Configuration

API keys, database credentials and service URLs must remain outside the source code. `.env.example` files were added to make setup easier without exposing secrets.

### Frontend-Backend Integration

The frontend communicates with multiple backend endpoints for authentication, assessment, chat, roadmap, learning and readiness features.

### Rate Limiting During Development

Repeated authentication testing could trigger HTTP 429 responses. The rate limiter was made environment-configurable so development environments can use a suitable threshold while production retains secure defaults.

### AI Response Handling

AI responses need to be structured consistently so that the backend and frontend can process generated skill gaps, roadmaps and recommendations.

---

## Testing

The project can be tested at multiple levels:

### AI Engine

Health endpoint:

```text
GET /health
```

Expected response:

```json
{
  "status": "ok",
  "service": "skillnav-ai"
}
```

### Backend

Start the backend and verify:

```text
SkillNav Backend running on port 5000
MongoDB connected successfully
```

### Frontend

Open the Vite development URL and test:

* Registration
* Login
* Dashboard
* Assessment
* Skill-gap analysis
* Roadmap
* AI Chat
* Learning modules
* Readiness

---

## Future Enhancements

Possible future improvements include:

* Advanced learner progress analytics.
* More career-role datasets.
* Improved AI evaluation and recommendation accuracy.
* Personalized resource ranking.
* Progress-based roadmap adaptation.
* Deployment using cloud infrastructure.
* More comprehensive authentication and authorization.
* Continuous learning recommendations based on user activity.

---

## Conclusion

SkillNav-AI provides an AI-powered platform for personalized career and learning guidance. By combining skill assessment, AI-based skill-gap analysis, personalized roadmaps, learning resources and conversational assistance, the platform helps learners understand what they should learn and how they can progress toward their target career role.
