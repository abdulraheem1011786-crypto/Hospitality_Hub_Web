# 📑 Chatbot Directory Index & Navigation

Complete guide to all files in the Hospitality Hub RAG Chatbot implementation.

---

## 🎯 Quick Navigation

### Start Here (Choose One)
- **I want to get it running now** → `QUICKSTART.md`
- **I want to understand everything** → `IMPLEMENTATION_SUMMARY.md`
- **I want step-by-step setup** → `SETUP_INSTRUCTIONS.md`

---

## 📂 Complete File Structure

### Core Application (Backend)

```
chatbot/
├── app.py                        ⭐ FastAPI Server
│                                   • REST API endpoints
│                                   • Session management
│                                   • CORS configuration
│                                   • ~400 lines
│
├── rag_chain.py                 ⭐ RAG Pipeline
│                                   • LangChain setup
│                                   • Conversational chain
│                                   • System prompt
│                                   • ~200 lines
│
├── ingestion.py                 ⭐ Data Ingestion
│                                   • Knowledge base loading
│                                   • Text chunking
│                                   • Embedding creation
│                                   • Vector DB storage
│                                   • ~400 lines
│
└── requirements.txt              📋 Dependencies
                                    • All Python packages
                                    • Version-pinned
```

### Configuration Files

```
├── .env.example                  🔑 Environment Template
│                                    • OPENAI_API_KEY
│                                    • VECTOR_DB_PATH
│
├── .gitignore                    🚫 Git Ignore Rules
│                                    • .env files
│                                    • __pycache__
│                                    • vector_db/
│
└── .dockerignore                 🐳 Docker Ignore Rules
                                    • Excludes unnecessary files
                                    • Reduces image size
```

### Deployment & Setup

```
├── Dockerfile                    🐳 Docker Image
│                                    • Python 3.10 slim
│                                    • Health checks
│                                    • Production-ready
│
├── docker-compose.yml            🐳 Docker Compose
│                                    • Local development setup
│                                    • Volume mounts
│                                    • Port configuration
│
├── quickstart.bat                🚀 Windows Quick Start
│                                    • Automated setup
│                                    • One-command installation
│                                    • ~80 lines
│
└── quickstart.sh                 🚀 Unix Quick Start
                                    • Automated setup
                                    • macOS/Linux compatible
                                    • ~80 lines
```

### Documentation Files (📚 READ THESE!)

```
├── QUICKSTART.md                 ⭐ START HERE
│                                    • 5-minute quick start
│                                    • Command reference
│                                    • Troubleshooting quick ref
│                                    • ~200 lines
│
├── IMPLEMENTATION_SUMMARY.md     ✨ Overview
│                                    • What was created
│                                    • Architecture overview
│                                    • File statistics
│                                    • Getting started steps
│                                    • ~300 lines
│
├── README.md                     📖 Project Overview
│                                    • Features list
│                                    • Knowledge base details
│                                    • API endpoints
│                                    • Quick start
│                                    • ~250 lines
│
├── SETUP_INSTRUCTIONS.md         🔧 Detailed Setup
│                                    • Step-by-step installation
│                                    • OpenAI setup
│                                    • Ingestion pipeline
│                                    • Deployment options
│                                    • Troubleshooting
│                                    • ~600 lines
│
├── FRONTEND_INTEGRATION.md       🎨 How Frontend Works
│                                    • UI components
│                                    • JavaScript functionality
│                                    • API communication
│                                    • Session persistence
│                                    • Customization examples
│                                    • ~400 lines
│
└── CUSTOMIZATION_GUIDE.md        🎯 How to Customize
                                    • Configuration options
                                    • Changing bot personality
                                    • Knowledge base updates
                                    • UI customization
                                    • Performance tuning
                                    • Security config
                                    • ~700 lines
```

### This File

```
└── This file                     📑 You are here!
                                    • Navigation guide
                                    • File descriptions
                                    • Reading order suggestions
```

---

## 📖 Documentation Reading Guide

### For Different User Types

**👨‍💻 Developer (Just want to build)**
1. `QUICKSTART.md` (5 min)
2. `SETUP_INSTRUCTIONS.md` (20 min)
3. Start building!

**🏢 Business User (Want to understand)**
1. `README.md` (10 min)
2. `IMPLEMENTATION_SUMMARY.md` (15 min)
3. `FRONTEND_INTEGRATION.md` (15 min)

**🎨 Designer (Want to customize UI)**
1. `QUICKSTART.md` (5 min)
2. `FRONTEND_INTEGRATION.md` - CSS section (10 min)
3. `CUSTOMIZATION_GUIDE.md` - CSS section (15 min)

**🔧 DevOps (Want to deploy)**
1. `SETUP_INSTRUCTIONS.md` - Deployment section (20 min)
2. Docker or PM2 instructions as needed
3. `CUSTOMIZATION_GUIDE.md` - Performance section (10 min)

**📚 Complete Learning (Want to master everything)**
1. `IMPLEMENTATION_SUMMARY.md` (15 min)
2. `README.md` (10 min)
3. `SETUP_INSTRUCTIONS.md` (20 min)
4. `FRONTEND_INTEGRATION.md` (15 min)
5. `CUSTOMIZATION_GUIDE.md` (30 min)
6. Read through source code with comments

---

## 🔑 Key Files Explained

### app.py - FastAPI Server
**What it does:**
- Provides REST API for the chatbot
- Manages user sessions
- Handles request/response
- Integrates with RAG chain

**When to edit:**
- Change API endpoints
- Add new functionality
- Configure CORS
- Add rate limiting

**Key endpoints:**
- `POST /chat` - Main chat endpoint
- `GET /health` - Health check
- `POST /session/new` - Create session
- `GET /session/{id}` - Get session info

---

### rag_chain.py - RAG Pipeline
**What it does:**
- Sets up LangChain RAG chain
- Manages conversation memory
- Retrieves context from FAISS
- Queries OpenAI API
- Generates responses

**When to edit:**
- Change bot personality (SYSTEM_PROMPT)
- Switch LLM model (GPT-4, etc.)
- Adjust temperature or tokens
- Change retrieval strategy

**Key customizations:**
- SYSTEM_PROMPT (lines 28-65)
- LLM configuration (line 50)
- Retriever parameters (line 75)

---

### ingestion.py - Data Pipeline
**What it does:**
- Loads custom hospitality knowledge
- Chunks text for embeddings
- Creates embeddings via OpenAI
- Stores in FAISS vector database

**When to edit:**
- Update hotel information
- Add new venues
- Change policies
- Add new sections

**Key section:**
- HOSPITALITY_DATA (lines 31-300+)

---

### chatbot.js - Frontend Controller
**What it does:**
- Manages chat UI
- Sends/receives messages
- Handles sessions
- Shows error messages
- Auto-retry on failure

**When to edit:**
- Change API endpoint
- Customize styling
- Add features
- Modify behavior

**Key class:**
- HospitalityHubChatbot (complete implementation)

---

### style.css - Chatbot Styling
**What it does:**
- Styles the chat widget
- Floating action button
- Message bubbles
- Input area
- Responsive design

**When to edit:**
- Change colors
- Modify size
- Update fonts
- Change animations

**Key sections:**
- `.chatbot-toggle-btn` (floating button)
- `.chatbot-widget` (main widget)
- `.chatbot-message` (messages)

---

## 🚀 Running the Application

### Quick Start (5 minutes)
```bash
# Windows
cd c:\xampp\htdocs\Hospitality_Hub_Web\chatbot
quickstart.bat

# macOS/Linux
cd /path/to/chatbot
./quickstart.sh
```

### Manual Setup
```bash
python -m venv venv
source venv/bin/activate      # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python ingestion.py
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

### With Docker
```bash
docker-compose up
```

---

## 📚 Common Tasks

### Task: Update Hotel Information
1. Edit `ingestion.py` - HOSPITALITY_DATA section
2. Run `python ingestion.py`
3. Restart FastAPI server

### Task: Change Bot Personality
1. Edit `rag_chain.py` - SYSTEM_PROMPT (lines 28-65)
2. Restart FastAPI server
3. Test in browser

### Task: Change Widget Colors
1. Edit `style.css` - Search for `--cyan`
2. Update hex color values
3. Browser will auto-refresh

### Task: Switch to GPT-4
1. Edit `rag_chain.py` - Line 50: `model_name="gpt-4"`
2. Edit `requirements.txt` - Ensure openai version is recent
3. Restart server

### Task: Deploy to Production
1. Read `SETUP_INSTRUCTIONS.md` - Deployment section
2. Choose PM2, systemd, Docker, or other
3. Follow instructions for your platform

---

## 🔍 File Relationships

```
Frontend (Browser)
    │
    └─→ support.html
        ├─→ js/chatbot.js ──→ calls API
        └─→ css/style.css ──→ styles widget
    
    │
    └─→ HTTP Request
        │
        └─→ http://localhost:8000
            │
            └─→ FastAPI (app.py)
                ├─→ Receives /chat request
                ├─→ Manages sessions
                └─→ Calls RAG Chain
                    │
                    └─→ rag_chain.py
                        ├─→ Loads vector DB (created by ingestion.py)
                        ├─→ Retrieves context from FAISS
                        └─→ Calls OpenAI API
```

---

## 🎯 Typical User Journey

1. **First Time**
   - Read: `QUICKSTART.md`
   - Run: `quickstart.bat` (Windows) or `quickstart.sh` (Mac/Linux)
   - Test: Open support.html and chat

2. **After Testing**
   - Read: `CUSTOMIZATION_GUIDE.md`
   - Edit: Hotel info in `ingestion.py`
   - Rerun: `python ingestion.py`
   - Test: Verify changes work

3. **Before Production**
   - Read: `SETUP_INSTRUCTIONS.md` (Deployment section)
   - Choose: PM2, systemd, Docker, or other
   - Configure: Environment variables and security
   - Deploy: Follow chosen method

4. **Ongoing**
   - Monitor: Check logs and API usage
   - Update: Knowledge base as needed
   - Maintain: Keep dependencies updated
   - Optimize: Adjust based on usage patterns

---

## 📊 File Statistics

| File | Type | Size | Purpose |
|------|------|------|---------|
| app.py | Python | 400 lines | API Server |
| rag_chain.py | Python | 200 lines | RAG Setup |
| ingestion.py | Python | 400 lines | Data Pipeline |
| chatbot.js | JavaScript | 400 lines | Frontend |
| style.css | CSS | 400 lines | Styling |
| Documentation | Markdown | 3000+ lines | Guides |

---

## ✅ Verification Checklist

Before using the chatbot, verify:

- [ ] Python 3.10+ installed
- [ ] All dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env` file created with OpenAI API key
- [ ] `python ingestion.py` runs without errors
- [ ] FastAPI server starts without errors
- [ ] Chat widget appears on support page
- [ ] Can send messages and get responses
- [ ] Works on mobile device

---

## 🆘 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| "OPENAI_API_KEY not found" | See `SETUP_INSTRUCTIONS.md` → Configuration |
| "Vector database not found" | Run `python ingestion.py` |
| "Cannot connect to server" | Ensure FastAPI is running on port 8000 |
| "Chat not appearing" | Check browser console for errors (F12) |
| Slow responses | Normal on first request; check OpenAI status |
| High costs | See `CUSTOMIZATION_GUIDE.md` → Cost Management |

---

## 📚 External Resources

- [OpenAI API Docs](https://platform.openai.com/docs/)
- [LangChain Documentation](https://python.langchain.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [FAISS Documentation](https://github.com/facebookresearch/faiss)

---

## 🎓 Learning Resources

For each technology:

**Python/FastAPI**
- `app.py` - Complete example
- `SETUP_INSTRUCTIONS.md` - Usage guide

**JavaScript/Frontend**
- `chatbot.js` - Fully commented code
- `FRONTEND_INTEGRATION.md` - Architecture guide

**LangChain/RAG**
- `rag_chain.py` - Complete implementation
- `ingestion.py` - Data pipeline example

**CSS/Styling**
- Bottom of `style.css` - Complete widget styles
- `FRONTEND_INTEGRATION.md` - Customization examples

---

## 🚀 Next Steps

### Immediate (Today)
1. Read `QUICKSTART.md`
2. Run `quickstart.bat` or `quickstart.sh`
3. Add OpenAI API key
4. Start server

### This Week
1. Test chatbot on support page
2. Read `CUSTOMIZATION_GUIDE.md`
3. Update hotel information
4. Customize bot personality

### This Month
1. Read `SETUP_INSTRUCTIONS.md` (Deployment)
2. Choose deployment method
3. Deploy to production
4. Set up monitoring

---

## 💬 Questions?

- **How do I get started?** → `QUICKSTART.md`
- **How does it work?** → `README.md` + `FRONTEND_INTEGRATION.md`
- **How do I customize it?** → `CUSTOMIZATION_GUIDE.md`
- **How do I deploy it?** → `SETUP_INSTRUCTIONS.md`
- **What was created?** → `IMPLEMENTATION_SUMMARY.md`

---

## 📝 File Format Guide

- **`.md`** - Markdown documentation (read in text editor or GitHub)
- **`.py`** - Python source code
- **`.js`** - JavaScript source code
- **`.css`** - CSS stylesheets
- **`.txt`** - Plain text (requirements.txt)
- **`.example`** - Template file (copy to remove .example)
- **`.yml`** - YAML configuration
- **`.bat`** - Windows batch script
- **`.sh`** - Unix shell script

---

## 🎉 You're All Set!

Everything you need is in this directory. Start with `QUICKSTART.md` and follow from there!

---

**Version:** 1.0.0  
**Last Updated:** May 2026  
**Status:** Complete & Ready to Use

Happy building! 🚀
