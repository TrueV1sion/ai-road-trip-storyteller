# AI Road Trip Storyteller - Backend API

## 🚀 Quick Start

### 1. Setup Environment
```powershell
# Run the setup script
.\setup.ps1

# Or manually:
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update with your actual keys.

### 3. Setup Database
```bash
# Install PostgreSQL if not already installed
# Create database
createdb roadtrip

# Run migrations (once we set up Alembic)
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 4. Run the Server
```bash
# Development mode with auto-reload
python -m app.main

# Or with uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access API
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

## 📁 Project Structure
```
backend/
├── app/
│   ├── api/          # API endpoints
│   ├── core/         # Core functionality (config, security, database)
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic services
│   └── main.py       # FastAPI application
├── tests/            # Test files
├── alembic/          # Database migrations
├── requirements.txt  # Python dependencies
└── .env             # Environment variables
```

## 🔐 Authentication
The API uses JWT tokens for authentication:
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Include token in headers: `Authorization: Bearer <token>`

## 🚧 Current Status
- ✅ Basic FastAPI structure
- ✅ Authentication endpoints
- ✅ Database models (User)
- ✅ Health checks
- 🚧 AI integration (TODO)
- 🚧 Voice synthesis (TODO)
- 🚧 Booking system (TODO)

## 📝 Next Steps
1. Complete database models (Story, Booking, etc.)
2. Integrate Google Vertex AI
3. Add voice synthesis
4. Implement booking partners
5. Add payment processing