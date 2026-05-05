# Hospitality Hub RAG Chatbot

A complete real-time Retrieval-Augmented Generation (RAG) chatbot implementation for the Hospitality Hub project. The chatbot uses OpenAI's API with LangChain to answer customer queries about hotels, high-tea venues, event halls, and booking policies.

## 🎯 Features

- **Real-time Chat Interface**: Beautiful floating chat widget with smooth animations
- **RAG Architecture**: Retrieves context from knowledge base before generating responses
- **Session Management**: Maintains conversation history per user session
- **Vector Database**: FAISS-based vector store for efficient document retrieval
- **FastAPI Backend**: High-performance REST API for chat operations
- **Error Handling**: Graceful error handling and automatic retries
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **CORS Enabled**: Frontend can communicate with backend from any origin

## 📁 Project Structure

```
chatbot/
├── requirements.txt              # Python dependencies
├── .env.example                 # Environment variables template
├── ingestion.py                 # Data ingestion & vector DB creation
├── rag_chain.py                # LangChain RAG setup
├── app.py                       # FastAPI server
├── SETUP_INSTRUCTIONS.md        # Complete setup guide
└── vector_db/                   # Vector database (created after ingestion)
```

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.10+
- OpenAI API Key (from https://platform.openai.com/api-keys)
- Virtual environment (recommended)

### 2. Installation

```bash
# Navigate to chatbot directory
cd chatbot

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxx
```

### 4. Run Ingestion

```bash
python ingestion.py
```

This creates the vector database from the knowledge base.

### 5. Start the Server

```bash
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## 📚 Key Files

### `ingestion.py`
- Loads custom hospitality data (hotels, venues, policies)
- Chunks data using `RecursiveCharacterTextSplitter`
- Creates embeddings using OpenAI's `text-embedding-3-small`
- Stores embeddings in FAISS vector database

### `rag_chain.py`
- Sets up LangChain RAG pipeline
- Creates conversational retrieval chain with memory
- Implements custom system prompt
- Handles conversation history

### `app.py`
- FastAPI application with CORS support
- Session management for chat continuity
- Endpoints:
  - `POST /chat` - Send user message and get response
  - `GET /health` - Health check
  - `POST /session/new` - Create new session
  - `GET /session/{id}` - Get session info
  - `DELETE /session/{id}` - Delete session

### `chatbot.js` (Frontend)
- Floating chat widget UI
- Handles message sending/receiving
- Session persistence
- Server health checks
- Auto-retry on failure

## 🔌 API Endpoints

### Chat Endpoint
```bash
POST http://localhost:8000/chat
Content-Type: application/json

{
  "message": "What hotels do you have?",
  "session_id": null
}
```

**Response:**
```json
{
  "response": "We have three hotels in Lahore: Avari Lahore Hotel (5-star), Lahore Fort View Hotel (4-star), and PC Lahore Hotel (3-star).",
  "session_id": "uuid-string",
  "timestamp": "2024-05-05T10:30:00",
  "message_count": 2
}
```

### Health Check
```bash
GET http://localhost:8000/health
```

### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

## 🎨 Frontend Integration

### Support Page
The chatbot is integrated into `support.html`:
- Floating action button in bottom-right corner
- Click "Start Chat" in help cards to open widget
- Seamless chat interface with message history

### JavaScript Files
- **`chatbot.js`**: Main chatbot controller
  - Handles API communication
  - Manages UI state
  - Session persistence
  - Auto-retry logic

### CSS Styling
- **`style.css`**: Chatbot widget styles
  - Glassmorphism design
  - Smooth animations
  - Responsive layout
  - Dark theme matching site design

## 🔐 Security Considerations

- **API Key Management**: Never commit `.env` to version control
- **CORS**: Configured for development; restrict in production
- **Session Isolation**: Each user gets unique session ID
- **Input Validation**: Message length limited to 1000 chars
- **Error Handling**: Generic error messages to frontend, detailed logging server-side
- **Rate Limiting**: Can be added at API gateway level

## 📊 Knowledge Base

The chatbot has built-in knowledge about:

### Hotels
- **Avari Lahore Hotel** - 5-star luxury (Rs. 12,000-70,000/night)
- **Lahore Fort View Hotel** - 4-star (Rs. 8,000-28,000/night)
- **PC Lahore Hotel** - 3-star (Rs. 4,000-18,000/night)

Includes amenities, services, and special features for each.

### High-Tea Venues
- **Avari Lounge** - Luxury experience (Rs. 2,500-4,500/head)
- **Lahore Heritage** - Traditional style (Rs. 1,500-2,200/head)
- **Parkside Garden** - Casual setting (Rs. 1,200-1,800/head)

### Event Halls
- **Avari Grand Ballroom** - 800 capacity (Rs. 250,000-600,000)
- **Heritage Hall** - 300 capacity (Rs. 100,000-250,000)
- **Modern Convention Center** - 500 capacity (Rs. 150,000-350,000)

### Policies
- Cancellation: Free up to 7 days, 50% refund 3-7 days, no refund within 3 days
- Booking terms, group discounts, payment methods
- Check-in/out times and guest policies

## 💰 Cost Management

**Estimated Monthly Costs:**
- Embeddings: ~$0.02 per 1M tokens
- Chat (gpt-3.5-turbo): ~$0.15 per 1K tokens
- With 1000 messages/month: ~$2-5

**Cost Optimization:**
1. Use `gpt-3.5-turbo` instead of `gpt-4`
2. Adjust chunk size in `ingestion.py` (smaller = fewer tokens)
3. Reduce `k` in retriever for faster responses
4. Implement response caching for common questions

## 🐛 Troubleshooting

### "Server offline" message
- Ensure FastAPI server is running: `python -m uvicorn app:app --host 0.0.0.0 --port 8000`
- Check network connectivity
- Verify API URL in `chatbot.js`

### "Vector database not found"
- Run `python ingestion.py` to create database
- Check `VECTOR_DB_PATH` in `.env`

### Slow responses
- This is normal on first request (cold start)
- Check OpenAI API status
- Consider using faster model or reducing context size

### High costs
- Review OpenAI usage at https://platform.openai.com/usage/overview
- Reduce chunk size or retrieval context
- Implement caching

## 📖 Additional Documentation

- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Detailed setup and deployment guide
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [LangChain Documentation](https://python.langchain.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## 🚢 Deployment Options

### Development
```bash
python -m uvicorn app:app --reload
```

### Production with PM2
```bash
pm2 start app.py --name "hospitality-chatbot"
pm2 save
pm2 startup
```

### Docker
```dockerfile
docker build -t hospitality-chatbot .
docker run -e OPENAI_API_KEY=your_key -p 8000:8000 hospitality-chatbot
```

### Systemd (Linux)
See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md#option-3-using-systemd-linux) for systemd service setup

## 👥 Support & Contributing

For issues or improvements:
1. Check the troubleshooting section
2. Review FastAPI logs: `tail -f logs/app.log`
3. Test endpoints at `http://localhost:8000/docs`

## 📝 License

This chatbot is part of the Hospitality Hub project.

---

**Version:** 1.0.0  
**Last Updated:** May 2026  
**Status:** Production Ready
