# Hospitality Hub RAG Chatbot - Setup Instructions

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [Running the Chatbot](#running-the-chatbot)
5. [Testing the Chatbot](#testing-the-chatbot)
6. [Deployment & 24/7 Uptime](#deployment--247-uptime)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The Hospitality Hub RAG Chatbot is a Python-based application that uses:
- **LangChain** for RAG (Retrieval-Augmented Generation) pipeline
- **FastAPI** for REST API
- **FAISS** for vector database storage
- **OpenAI API** for embeddings and LLM

The chatbot reads from a knowledge base about hotels, high-tea venues, event halls, and policies, then answers customer queries using the retrieved context.

---

## Prerequisites

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Python**: Version 3.10 or higher
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB for dependencies and vector database

### Software Requirements
- **Git** (optional, for cloning the repository)
- **pip** (Python package manager, usually included with Python)
- **OpenAI API Key** (get it from https://platform.openai.com/api-keys)

### API Setup
1. Create an OpenAI account at https://openai.com
2. Go to https://platform.openai.com/api-keys
3. Click "Create new secret key"
4. Copy the key and save it securely (you'll need it soon)

---

## Step-by-Step Installation

### 1. Navigate to the Chatbot Directory

```bash
cd c:\xampp\htdocs\Hospitality_Hub_Web\chatbot
# or your installation path
```

### 2. Create a Python Virtual Environment

It's recommended to use a virtual environment to isolate dependencies.

**Windows (PowerShell/Command Prompt):**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` at the beginning of your terminal prompt when activated.

### 3. Upgrade pip (Optional but Recommended)

```bash
python -m pip install --upgrade pip
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install all necessary packages:
- langchain, langchain-openai, langchain-community
- fastapi, uvicorn
- faiss-cpu (vector database)
- python-dotenv (environment variable management)
- And more...

Installation may take 2-3 minutes depending on your internet speed.

### 5. Set Up Environment Variables

Create a `.env` file in the chatbot directory:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

Edit the `.env` file and replace the placeholder with your actual OpenAI API key:

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxx
VECTOR_DB_PATH=./vector_db
```

**Important**: Never commit the `.env` file to version control. The `.gitignore` should already exclude it.

### 6. Run the Ingestion Pipeline

This step creates the vector database from the knowledge base.

```bash
python ingestion.py
```

**Expected Output:**
```
============================================================
Hospitality Hub RAG Chatbot - Ingestion Pipeline
============================================================
Loading hospitality data...
Splitting documents into chunks...
Created 15 chunks from documents
Creating embeddings and vector database...
This may take a moment on first run...
Vector database created with 15 documents
Vector database saved to ./vector_db

============================================================
✓ Ingestion pipeline completed successfully!
✓ Vector database is ready for the RAG chatbot
============================================================
```

This step may take 1-2 minutes as it communicates with OpenAI API to create embeddings. **You will be charged for the embeddings** (very small amount, usually a few cents).

---

## Running the Chatbot

### Start the FastAPI Server

```bash
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**Expected Output:**
```
============================================================
Starting Hospitality Hub RAG Chatbot Server
============================================================

✓ RAG chain loaded successfully
✓ Server ready to accept chat requests
============================================================

INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

The server is now running on `http://localhost:8000`

### Verify the Server is Running

Open your browser and visit:
- **API Root**: http://localhost:8000/
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs (interactive API documentation)

---

## Testing the Chatbot

### Option 1: Using the Interactive API Docs

1. Navigate to http://localhost:8000/docs
2. Expand the `/chat` endpoint
3. Click "Try it out"
4. Enter a JSON body:
```json
{
  "message": "What hotels do you have in Lahore?",
  "session_id": null
}
```
5. Click "Execute"

### Option 2: Using curl Command

**Windows (PowerShell):**
```powershell
$body = @{
    message = "What is your cancellation policy?"
    session_id = $null
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:8000/chat -Method POST `
    -ContentType application/json -Body $body
```

**macOS/Linux:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How much does high-tea cost at Avari Lounge?",
    "session_id": null
  }'
```

### Option 3: Using Python

```python
import requests

url = "http://localhost:8000/chat"
payload = {
    "message": "Tell me about your event halls",
    "session_id": None
}

response = requests.post(url, json=payload)
data = response.json()
print(f"Bot: {data['response']}")
print(f"Session ID: {data['session_id']}")
```

### Sample Test Questions

```
- What hotels do you have?
- What is the cancellation policy?
- How much does high-tea cost?
- What's the check-in time?
- Do you have parking?
- Can you accommodate vegetarian guests?
- What event halls are available?
```

---

## Deployment & 24/7 Uptime

### Option 1: Using PM2 (Recommended for Linux/macOS)

PM2 is a process manager that keeps your app running forever.

#### Install PM2:
```bash
npm install -g pm2
```

#### Create PM2 Configuration File

Create `ecosystem.config.js` in the chatbot directory:

```javascript
module.exports = {
  apps: [
    {
      name: "hospitality-hub-chatbot",
      script: "app.py",
      interpreter: "python",
      instances: 1,
      exec_mode: "fork",
      env: {
        OPENAI_API_KEY: "your_key_here",
        VECTOR_DB_PATH: "./vector_db"
      },
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "1G",
      watch: false,
      ignore_watch: ["node_modules", "logs", ".git"],
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 4000
    }
  ]
};
```

#### Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Useful PM2 Commands:
```bash
pm2 status                    # Check status
pm2 logs                      # View logs
pm2 restart hospitality-hub-chatbot  # Restart app
pm2 stop hospitality-hub-chatbot     # Stop app
pm2 delete hospitality-hub-chatbot   # Remove from PM2
```

---

### Option 2: Using Windows Task Scheduler

#### Create a Batch File

Create `start_chatbot.bat` in the chatbot directory:

```batch
@echo off
cd /d "%~dp0"
call venv\Scripts\activate
python -m uvicorn app:app --host 0.0.0.0 --port 8000
pause
```

#### Schedule with Task Scheduler:

1. Press `Win + R`, type `taskschd.msc`, press Enter
2. Click "Create Basic Task"
3. Name: "Hospitality Hub Chatbot"
4. Trigger: "At startup"
5. Action: "Start a program"
6. Program: `C:\xampp\htdocs\Hospitality_Hub_Web\chatbot\start_chatbot.bat`
7. Check "Run with highest privileges"
8. Click Finish

---

### Option 3: Using systemd (Linux)

Create a systemd service file at `/etc/systemd/system/hospitality-chatbot.service`:

```ini
[Unit]
Description=Hospitality Hub RAG Chatbot
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/chatbot
Environment="PATH=/path/to/chatbot/venv/bin"
Environment="OPENAI_API_KEY=your_key_here"
ExecStart=/path/to/chatbot/venv/bin/python -m uvicorn app:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable hospitality-chatbot
sudo systemctl start hospitality-chatbot
sudo systemctl status hospitality-chatbot
```

---

### Option 4: Using Docker (Most Portable)

Create `Dockerfile` in the chatbot directory:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Set environment variable
ENV PYTHONUNBUFFERED=1

# Run the app
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create `.dockerignore`:
```
.env
venv/
__pycache__
vector_db/
*.log
.git
```

Build and run:
```bash
docker build -t hospitality-chatbot .
docker run -d -p 8000:8000 -e OPENAI_API_KEY=your_key_here hospitality-chatbot
```

---

## Environment Variables

### .env File Configuration

```bash
# OpenAI API Key (Required)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxx

# Vector Database Path (Optional, defaults to ./vector_db)
VECTOR_DB_PATH=./vector_db
```

### Important Notes:
- Never commit `.env` to version control
- Regenerate keys if accidentally exposed
- Keep the key secret - it's linked to your OpenAI billing

---

## Troubleshooting

### Issue 1: "OPENAI_API_KEY not found"
**Solution**: 
1. Create `.env` file in chatbot directory
2. Add your OpenAI API key
3. Ensure the file is named exactly `.env` (not `.env.txt`)

### Issue 2: "Vector database not found"
**Solution**:
1. Run `python ingestion.py` to create the database
2. Ensure you're in the chatbot directory
3. Check that `VECTOR_DB_PATH` in `.env` is correct

### Issue 3: "Failed to import langchain"
**Solution**:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue 4: FastAPI server won't start
**Solution**:
1. Check if port 8000 is already in use:
   - Windows: `netstat -ano | findstr :8000`
   - Linux/Mac: `lsof -i :8000`
2. Change port: `python -m uvicorn app:app --port 8001`

### Issue 5: Slow responses or timeouts
**Solution**:
1. This may be normal on first request (cold start)
2. Check OpenAI API status at https://status.openai.com
3. Increase timeout in frontend JavaScript

### Issue 6: High API costs
**Solution**:
1. Use `gpt-3.5-turbo` instead of `gpt-4` (cheaper)
2. Use `text-embedding-3-small` for embeddings (cheapest)
3. Reduce chunk size in `ingestion.py` to use fewer tokens
4. Monitor usage at https://platform.openai.com/usage/overview

### Getting Help
1. Check FastAPI logs for error messages
2. Visit http://localhost:8000/docs for API documentation
3. Test endpoints using curl or Postman before integrating frontend
4. Check OpenAI documentation for API errors

---

## Production Checklist

Before deploying to production:

- [ ] Set strong, unique OPENAI_API_KEY
- [ ] Test all endpoints thoroughly
- [ ] Set up logging and monitoring
- [ ] Configure error alerts
- [ ] Use PM2, systemd, or Docker for process management
- [ ] Set up database backups
- [ ] Monitor API costs
- [ ] Configure firewall rules
- [ ] Use HTTPS/SSL in production
- [ ] Set up rate limiting
- [ ] Implement user authentication if needed

---

## Performance Optimization

### Reduce API Costs:
1. Cache common questions
2. Use `gpt-3.5-turbo` over `gpt-4`
3. Adjust chunk size in ingestion
4. Set up request batching

### Improve Response Speed:
1. Increase `k` in retriever for faster but less relevant results
2. Use faster embedding model if available
3. Implement response caching
4. Use async processing

### Scale Horizontally:
1. Run multiple instances with load balancer
2. Use API gateway (AWS API Gateway, Kong, etc.)
3. Implement request queuing
4. Use connection pooling

---

## Support & Documentation

- **FastAPI Docs**: http://localhost:8000/docs
- **LangChain Docs**: https://python.langchain.com/
- **OpenAI API Docs**: https://platform.openai.com/docs/
- **FAISS Documentation**: https://github.com/facebookresearch/faiss

---

## License

This chatbot implementation is part of the Hospitality Hub project.

---

**Last Updated**: May 2026
**Version**: 1.0.0
