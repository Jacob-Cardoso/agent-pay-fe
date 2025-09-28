# FastAPI + Supabase Architecture for AgentPay

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   FastAPI       │    │   Supabase      │
│   Frontend      │────│   Backend       │────│   Database      │
│   (Port 3001)   │    │   (Port 8000)   │    │   (Cloud)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
    • User Interface        • Method API             • PostgreSQL
    • Supabase Auth        • Bill Processing        • User Data
    • State Management     • Email Parsing          • Auth Tables
    • Real-time UI         • Payment Logic          • Row Level Security
```

## 🎯 **Recommended Setup**

### **Next.js Frontend Responsibilities:**
- User interface and components
- Authentication flow (Supabase Auth)
- Real-time updates (Supabase subscriptions)
- State management

### **FastAPI Backend Responsibilities:**
- Method API integration
- Bill parsing and processing
- Payment logic and automation
- Email processing (AgentMail integration)
- Business rules and validation

### **Supabase Responsibilities:**
- Database storage (PostgreSQL)
- User authentication and sessions
- Real-time data synchronization
- Row-level security

## 🚀 **Implementation Plan**

### Step 1: Create FastAPI Backend
```bash
# Create backend directory
mkdir agent-pay-backend
cd agent-pay-backend

# Set up Python environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install FastAPI dependencies
pip install fastapi uvicorn supabase python-dotenv requests pydantic
```

### Step 2: FastAPI Structure
```
agent-pay-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── database.py          # Supabase connection
│   ├── models/              # Pydantic models
│   ├── routers/             # API routes
│   │   ├── users.py
│   │   ├── cards.py
│   │   ├── bills.py
│   │   └── payments.py
│   ├── services/            # Business logic
│   │   ├── method_api.py
│   │   ├── email_parser.py
│   │   └── payment_processor.py
│   └── utils/
├── requirements.txt
└── .env
```

### Step 3: Authentication Flow
```python
# FastAPI middleware to verify Supabase JWT tokens
from supabase import create_client
import jwt

def verify_supabase_token(token: str):
    # Verify JWT token from Supabase
    # Extract user_id for database queries
    pass
```

### Step 4: API Communication
```typescript
// Next.js - API calls to FastAPI
const response = await fetch('http://localhost:8000/api/cards', {
  headers: {
    'Authorization': `Bearer ${supabaseToken}`,
    'Content-Type': 'application/json'
  }
})
```

## 📊 **Data Flow Examples**

### **User Credit Cards:**
1. **Frontend**: User visits dashboard
2. **Next.js**: Gets Supabase auth token
3. **Next.js**: Calls FastAPI `/api/cards` with token
4. **FastAPI**: Verifies token, calls Method API
5. **FastAPI**: Stores/updates cards in Supabase
6. **FastAPI**: Returns cards to frontend
7. **Next.js**: Displays cards with real-time updates

### **Bill Processing:**
1. **AgentMail**: Receives bill email
2. **Webhook**: Triggers FastAPI `/api/bills/process`
3. **FastAPI**: Parses email, extracts bill data
4. **FastAPI**: Stores bill in Supabase
5. **FastAPI**: Triggers payment if autopay enabled
6. **Supabase**: Real-time update to frontend
7. **Next.js**: Shows notification to user

## 🔒 **Security Model**

### **Authentication:**
- Supabase handles user auth, JWT tokens
- FastAPI verifies tokens on each request
- Frontend stores Supabase session

### **Database Access:**
```python
# FastAPI verifies user identity
user_id = verify_token(request.headers['authorization'])

# Query Supabase with user context
supabase.table('credit_cards').select('*').eq('user_id', user_id).execute()
```

### **API Security:**
- CORS configuration for Next.js domain
- Rate limiting on FastAPI endpoints
- Input validation with Pydantic models

## 🛠️ **Environment Variables**

### **FastAPI (.env):**
```env
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-role-key
METHOD_API_KEY=your-method-api-key
AGENTMAIL_API_KEY=your-agentmail-key
```

### **Next.js (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
```

## 🚀 **Development Workflow**

### **Local Development:**
```bash
# Terminal 1: FastAPI backend
cd agent-pay-backend
uvicorn app.main:app --reload --port 8000

# Terminal 2: Next.js frontend  
cd agent-pay-fe
npm run dev # Runs on port 3001

# Terminal 3: Supabase (if local)
supabase start
```

### **Production Deployment:**
- **Frontend**: Vercel (automatically deploys from GitHub)
- **Backend**: Railway, Render, or DigitalOcean
- **Database**: Supabase Cloud (managed PostgreSQL)

## 💡 **Benefits of This Architecture**

### **Scalability:**
- FastAPI handles compute-intensive tasks
- Supabase handles database scaling
- Next.js handles UI efficiently

### **Development Experience:**
- Python for complex business logic
- TypeScript for type-safe frontend
- PostgreSQL for reliable data storage

### **Flexibility:**
- Can swap FastAPI for Django/Flask later
- Can add more FastAPI services
- Real-time updates with Supabase subscriptions

## 🎯 **Next Steps**

1. **Choose**: Do you want me to create the FastAPI backend structure?
2. **Supabase**: Set up Supabase project and database
3. **Integration**: Connect all three pieces together
4. **Method API**: Implement in FastAPI backend

Would you like me to start by creating the FastAPI backend structure for AgentPay?

