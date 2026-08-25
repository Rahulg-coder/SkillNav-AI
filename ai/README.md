# SkillNav AI Engine

Python FastAPI microservice for SkillNav-AI.

## Run

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Set `GROQ_API_KEY` in `.env` if you want LLM-powered responses.
Without a key, the engine uses a deterministic fallback so the demo still runs.

Endpoints:
- GET `/health`
- POST `/chat`
- POST `/assessment`
