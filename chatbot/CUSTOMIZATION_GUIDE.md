# Configuration & Customization Guide

This guide explains how to customize the Hospitality Hub RAG Chatbot without modifying the core code.

## 📋 Configuration Files

### 1. Environment Configuration (`.env`)

Controls backend behavior:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx

# Vector Database Path
VECTOR_DB_PATH=./vector_db

# (Optional) Add additional variables below
```

**Common Customizations:**

```bash
# Use GPT-4 for better quality (more expensive)
# Requires changing app.py: model_name="gpt-4"

# Change vector database location
VECTOR_DB_PATH=/custom/path/to/vector_db

# Add logging level
LOG_LEVEL=INFO
```

---

## 🤖 LLM Configuration

### File: `rag_chain.py`

#### Change LLM Model

```python
# Line ~50: Change the model
llm = ChatOpenAI(
    model_name="gpt-4",  # Change from gpt-3.5-turbo to gpt-4
    temperature=0.7,     # Adjust creativity (0=factual, 1=creative)
    api_key=OPENAI_API_KEY,
    max_tokens=500       # Max response length
)
```

**Model Options:**
- `gpt-3.5-turbo` - Fast, cheap, good quality (default)
- `gpt-4` - Slower, expensive, highest quality
- `gpt-4-turbo` - Fast version of GPT-4

#### Adjust Temperature

```python
temperature=0.3  # More factual, less creative
temperature=0.7  # Balanced (default)
temperature=1.0  # Creative, unpredictable
```

#### Change Response Length

```python
max_tokens=250   # Shorter responses
max_tokens=500   # Medium (default)
max_tokens=1000  # Longer responses
```

#### Modify Retriever

```python
# Line ~75: Change retrieval parameters
retriever = vector_db.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}  # Change from 4 to adjust context size
)
```

**k parameter:**
- `k=2` - Fewer documents, faster, less context
- `k=4` - Balanced (default)
- `k=8` - More documents, slower, more context

---

## 📝 System Prompt Customization

### File: `rag_chain.py`

### Current Prompt (Lines ~28-65)

```python
SYSTEM_PROMPT = """You are the Hospitality Hub Support Agent..."""
```

### Customize for Different Purposes

**Example 1: More Formal Tone**
```python
SYSTEM_PROMPT = """You are a professional support representative for Hospitality Hub.

Respond in formal, professional language.
- Always use complete sentences
- Reference specific policies and prices
- Direct complex queries to human support
- Maintain professional courtesy at all times
"""
```

**Example 2: Friendlier Tone**
```python
SYSTEM_PROMPT = """You're the friendly Hospitality Hub chatbot! 👋

Help guests have an amazing experience:
- Be warm and welcoming
- Use casual, friendly language
- Add relevant emojis to responses
- Make recommendations based on their needs
- Ask follow-up questions to understand better
"""
```

**Example 3: Promotions Focus**
```python
SYSTEM_PROMPT = """You are Hospitality Hub's promotion specialist.

Your goal is to help customers find the best deals:
- Highlight current promotions and discounts
- Suggest packages that save money
- Mention group booking discounts
- Point out seasonal offers
- Guide customers toward high-value options
"""
```

---

## 📚 Knowledge Base Customization

### File: `ingestion.py`

### Update Hotel Information

```python
# Lines ~31-100: Modify HOSPITALITY_DATA

HOSPITALITY_DATA = """
=== HOTELS ===

1. YOUR HOTEL NAME
   Location: Address here
   Category: 5-Star Luxury
   
   Rooms & Pricing:
   - Standard Room: Rs. 12,000 per night
   
   Amenities:
   - WiFi
   - Restaurant
   ...
"""
```

### Add New Venue Type

```python
# Add after hotels section:

=== SPA & WELLNESS CENTERS ===

1. LUXURY SPA RETREAT
   Location: Gulberg, Lahore
   Services:
   - Full body massage: Rs. 3,000
   - Facial treatments: Rs. 2,500
   - Packages available
   
   Contact: +92-42-xxx-xxxx
```

### Update Pricing

Simply edit the prices in `HOSPITALITY_DATA` string, then run:
```bash
python ingestion.py
```

---

## 🎨 Frontend Customization

### File: `js/chatbot.js`

#### Change API Endpoint

```javascript
// Line ~5
this.API_URL = 'http://your-server:8000';
```

For production:
```javascript
this.API_URL = 'https://api.yourdomain.com';
```

#### Modify Welcome Message

```python
# In app.py, modify the initial message:
SYSTEM_PROMPT += """

First message to user:
"Welcome! 👋 I'm here to help with any questions about our hospitality services."
"""
```

#### Change Initial Greeting

In browser console:
```javascript
// Modify the initial message in UI
document.querySelector('.bot-message:first-child').textContent = 
  'Your custom greeting here!';
```

#### Adjust Timeout

```javascript
// Line ~90 in chatbot.js
signal: AbortSignal.timeout(30000)  // 30 seconds
// Change to:
signal: AbortSignal.timeout(60000)  // 60 seconds
```

---

### File: `css/style.css`

#### Change Widget Colors

```css
/* Primary color (cyan) */
:root {
  --cyan: #00e5ff;  /* Change this hex code */
}
```

#### Floating Button Color

```css
.chatbot-toggle-btn {
  background: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
  box-shadow: 0 4px 20px rgba(0, 229, 255, 0.4);
}
```

#### Widget Size

```css
.chatbot-widget {
  width: 380px;   /* Change width */
  height: 600px;  /* Change height */
}

@media (max-width: 640px) {
  .chatbot-widget {
    width: calc(100vw - 48px);
    height: 500px;  /* Mobile height */
  }
}
```

#### Message Styling

```css
/* User messages */
.user-message .message-content {
  background: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
  color: white;
}

/* Bot messages */
.bot-message .message-content {
  background: #YOUR_COLOR;
  color: #YOUR_TEXT_COLOR;
}
```

#### Fonts

```css
.chatbot-message {
  font-family: 'Arial', sans-serif;  /* Change font */
  font-size: 14px;                   /* Change size */
}
```

---

## 🔧 Advanced Configuration

### Data Chunking Strategy

**File:** `ingestion.py` (Line ~70)

```python
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # Smaller = more specific, more API calls
    chunk_overlap=200,      # Overlap between chunks
    separators=["\n\n", "\n", ". ", " ", ""]
)
```

**Strategies:**
- **Small chunks (500-800):** Better for specific questions
- **Medium chunks (1000-1500):** Balanced (default)
- **Large chunks (2000+):** Good for general questions

### Embedding Model

**File:** `ingestion.py` and `rag_chain.py`

```python
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",  # Cheapest option
    # model="text-embedding-3-large",  # Better quality
)
```

**Cost Comparison:**
- `text-embedding-3-small` - $0.02 per 1M tokens (default)
- `text-embedding-3-large` - $0.13 per 1M tokens

---

## 📊 Performance Tuning

### Reduce API Costs

1. **Smaller chunks** (lower in `ingestion.py`)
   ```python
   chunk_size=500  # Fewer tokens per chunk
   ```

2. **Fewer retrievals** (lower in `rag_chain.py`)
   ```python
   search_kwargs={"k": 2}  # Get fewer documents
   ```

3. **Shorter responses**
   ```python
   max_tokens=300  # Shorter outputs
   ```

### Improve Response Speed

1. **Reduce context** (`k` parameter)
   ```python
   search_kwargs={"k": 2}  # Faster retrieval
   ```

2. **Lower temperature** (`rag_chain.py`)
   ```python
   temperature=0.3  # Faster generation
   ```

3. **Caching** - Add to `app.py`
   ```python
   # Cache frequently asked questions
   cache = {}
   
   @app.post("/chat")
   async def chat(request: ChatRequest):
       if request.message in cache:
           return cache[request.message]
       # ... normal processing
   ```

---

## 🌍 Multi-Language Support

### Add Knowledge in Multiple Languages

**File:** `ingestion.py`

```python
HOSPITALITY_DATA = """
=== ENGLISH ===
Hotel name: Avari Lahore
Price: Rs. 12,000/night

=== URDU ===
ہوٹل کا نام: عوری لاہور
قیمت: روپے 12,000/رات

=== ARABIC ===
اسم الفندق: أفاري لاهور
السعر: 12,000 روبية/ليلة
"""
```

---

## 🔐 Security Configuration

### Rate Limiting

**File:** `app.py` (add before routes)

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/chat")
@limiter.limit("10/minute")  # 10 requests per minute
async def chat(request: ChatRequest):
    # ... existing code
```

### CORS Restrictions

**File:** `app.py` (Line ~80)

```python
# Current (all origins allowed - development only)
allow_origins=["*"]

# Production (restrict to your domain)
allow_origins=["https://yourdomain.com"]

# Multiple domains
allow_origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    "https://admin.yourdomain.com"
]
```

---

## 📈 Monitoring & Logging

### Enable Detailed Logging

**File:** `app.py`

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,  # Change to DEBUG for verbose output
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# In your functions:
logger.info(f"Chat session: {session_id}")
logger.warning("Low on API balance")
logger.error("API call failed")
```

### Track User Behavior

**File:** `app.py`

```python
# Add to chat endpoint
@app.post("/chat")
async def chat(request: ChatRequest):
    # Log the interaction
    logger.info(f"""
    Session: {request.session_id}
    Message: {request.message[:100]}...
    Timestamp: {datetime.now()}
    """)
    # ... rest of function
```

---

## 🚀 Deployment Customization

### Environment-Specific Settings

Create multiple `.env` files:

**.env.development**
```
OPENAI_API_KEY=dev-key
DEBUG=True
```

**.env.production**
```
OPENAI_API_KEY=prod-key
DEBUG=False
```

Load with:
```bash
# Development
python -m uvicorn app:app --reload --env-file .env.development

# Production
python -m uvicorn app:app --env-file .env.production
```

### Docker Image Customization

**File:** `Dockerfile`

```dockerfile
# Change Python version
FROM python:3.11-slim  # Was 3.10

# Add custom environment variable
ENV CHATBOT_NAME="My Custom Bot"

# Use custom port
EXPOSE 3000  # Instead of 8000
```

---

## 📝 Configuration Checklist

Before going to production:

- [ ] Updated `.env` with production OpenAI key
- [ ] Customized system prompt for your brand
- [ ] Verified all knowledge base information is current
- [ ] Tested with production API endpoint
- [ ] Set appropriate CORS origins
- [ ] Configured logging and monitoring
- [ ] Set up rate limiting
- [ ] Tested on mobile and desktop
- [ ] Reviewed security settings
- [ ] Set up backup and recovery procedures

---

## 🆘 Reverting Changes

If you make mistakes, revert with:

```bash
# Restore to original settings
git checkout -- ingestion.py rag_chain.py app.py

# Restore CSS
git checkout -- ../Frontend/css/style.css

# Restore JavaScript
git checkout -- ../Frontend/js/chatbot.js
```

---

## 📚 Quick Reference

| What to Change | Where | How |
|---|---|---|
| Bot personality | `rag_chain.py` SYSTEM_PROMPT | Edit the prompt text |
| Hotel info | `ingestion.py` HOSPITALITY_DATA | Edit the data string, run ingestion.py |
| Response quality | `rag_chain.py` LLM config | Change model or temperature |
| Widget colors | `style.css` | Edit CSS color values |
| Chat speed | `rag_chain.py` | Adjust `k` parameter or temperature |
| API endpoint | `chatbot.js` | Change `API_URL` |
| Response length | `rag_chain.py` | Change `max_tokens` |

---

**Version:** 1.0.0  
**Last Updated:** May 2026
