# 🔧 Backend Implementation Guide

## Quick Backend Setup for AI Road Trip Storyteller

### Option 1: Minimal FastAPI Backend (Recommended for Quick Start)

```bash
# Create backend directory structure
mkdir -p backend/app/{api,core,models,services}
cd backend

# Create requirements.txt
cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn==0.24.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
httpx==0.25.2
redis==5.0.1
google-cloud-aiplatform==1.38.1
google-cloud-texttospeech==2.14.2
stripe==7.8.0
EOF

# Create main.py
cat > app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, stories, users, bookings

app = FastAPI(title="AI Road Trip Storyteller API")

# Configure CORS for Netlify
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-netlify-app.netlify.app", "http://localhost:*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(stories.router, prefix="/stories", tags=["stories"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
@app.get("/")
async def root():
    return {"message": "AI Road Trip Storyteller API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
EOF
```

### Core Authentication Implementation

```python
# app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from pydantic import BaseModel
import os

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: str = None

# Mock user storage (replace with database)
fake_users_db = {}
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    # Check if user exists
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = pwd_context.hash(user.password)
    
    # Store user
    user_data = {
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "id": str(len(fake_users_db) + 1)
    }
    fake_users_db[user.email] = user_data
    
    # Create token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_data["id"],
            "email": user_data["email"],
            "username": user_data["username"]
        }
    }

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):    user = fake_users_db.get(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"]
        }
    }
```

### AI Story Generation Implementation

```python
# app/api/stories.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import random
import asyncio

router = APIRouter()

class StoryRequest(BaseModel):
    location: dict  # {latitude, longitude}
    destination: Optional[str] = None
    context: Optional[str] = None
    personality: Optional[str] = "Default Narrator"

class Story(BaseModel):
    id: str
    title: str
    content: str
    narrator: str
    duration: int
    location: dict
    created_at: str
# Mock story templates (replace with AI generation)
STORY_TEMPLATES = [
    {
        "title": "The Legend of {location}",
        "content": "As you approach {location}, let me tell you about the fascinating history..."
    },
    {
        "title": "Hidden Gems Near {location}",
        "content": "Not many people know this, but {location} has some incredible secrets..."
    },
    {
        "title": "Tales from the Road",
        "content": "Every journey has its stories, and yours through {location} is no exception..."
    }
]

@router.post("/generate", response_model=Story)
async def generate_story(request: StoryRequest):
    # Simulate AI processing time
    await asyncio.sleep(2)
    
    # Mock story generation (replace with actual AI)
    template = random.choice(STORY_TEMPLATES)
    location_name = request.destination or "this area"
    
    story = Story(
        id=str(random.randint(1000, 9999)),
        title=template["title"].format(location=location_name),
        content=template["content"].format(location=location_name),
        narrator=request.personality,
        duration=random.randint(120, 300),
        location=request.location,
        created_at=datetime.utcnow().isoformat()
    )
    
    return story

# Add more endpoints for story management
@router.get("/")
async def get_stories():    # Return mock stories list
    return {
        "success": True,
        "data": [],
        "message": "Stories retrieved successfully"
    }
```

### Quick Deployment Options

#### Option 1: Deploy to Railway (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Deploy
railway up

# Get your API URL
railway domain
```

#### Option 2: Deploy to Heroku
```bash
# Create Procfile
echo "web: uvicorn app.main:app --host=0.0.0.0 --port=${PORT:-5000}" > Procfile

# Create runtime.txt
echo "python-3.11.6" > runtime.txt

# Initialize git and Heroku
git init
heroku create your-app-name
git add .
git commit -m "Initial backend"
git push heroku main
```

#### Option 3: Deploy to Render
```yaml
# Create render.yaml
services:
  - type: web
    name: roadtrip-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: roadtrip-db
          property: connectionString

databases:
  - name: roadtrip-db
    plan: free
```

### Frontend Integration

Update your frontend `.env`:
```bash
# For development
EXPO_PUBLIC_API_URL=http://localhost:8000

# For production (update after deployment)
EXPO_PUBLIC_API_URL=https://your-backend-url.railway.app
```

Update `services/api.ts` to use the deployed backend:
```typescript
// Remove mock data and connect to real API
export class ApiService {
  private static baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Rest of your API service code...
}
```

### Database Setup (PostgreSQL)

```python
# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/roadtrip")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Next Steps for Production

1. **Add Real AI Integration**
```python
# Install Google AI SDK
# pip install google-cloud-aiplatform

from google.cloud import aiplatform

async def generate_ai_story(location, context):
    # Initialize Vertex AI
    aiplatform.init(project='your-project', location='us-central1')
    
    # Use Gemini model for story generation
    # Implementation here...
```

2. **Add Payment Processing**
```python
# Install Stripe
# pip install stripe

import stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.post("/create-payment-intent")
async def create_payment(amount: int):
    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency='usd'
    )
    return {"client_secret": intent.client_secret}
```

3. **Add Monitoring**
```python
# Install Sentry
# pip install sentry-sdk[fastapi]

import sentry_sdk
sentry_sdk.init(dsn=os.getenv("SENTRY_DSN"))
```

## 🎯 Quick MVP Backend Checklist

- [ ] Set up basic FastAPI structure
- [ ] Implement auth endpoints
- [ ] Create mock story generation
- [ ] Deploy to Railway/Heroku
- [ ] Update frontend API URL
- [ ] Test end-to-end flow
- [ ] Add basic error handling
- [ ] Set up CORS properly
- [ ] Add rate limiting
- [ ] Create API documentation

With this backend, you can have a working MVP in 2-3 days! 🚀