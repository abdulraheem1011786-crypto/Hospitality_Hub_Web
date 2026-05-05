# 🚀 Getting Started with Hospitality Hub RAG Chatbot

Welcome! This file gets you started in 5 minutes.

## ⚡ Quick Start (5 minutes)

### Step 1: Get OpenAI API Key (1 minute)
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (you'll use it next)

### Step 2: Setup Project (3 minutes)

**Windows (Command Prompt or PowerShell):**
```bash
cd c:\xampp\htdocs\Hospitality_Hub_Web\chatbot
quickstart.bat
```

**macOS/Linux:**
```bash
cd /path/to/Hospitality_Hub_Web/chatbot
chmod +x quickstart.sh
./quickstart.sh
```

### Step 3: Start the Server (1 minute)

The quickstart script will:
✅ Create virtual environment
✅ Install all dependencies
✅ Create .env file
✅ Run data ingestion

**Then run:**
```bash
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Test the Chatbot

Open in browser:
```
http://localhost:8000/frontend/support.html
```

Click the chat button (bottom-right) and start chatting!

---

## 📁 What Was Created

### Python Backend Files
```
chatbot/
├── requirements.txt           # All Python dependencies
├── .env.example              # Environment template
├── ingestion.py              # Data pipeline
├── rag_chain.py              # LangChain RAG setup
└── app.py                    # FastAPI server
```

### Frontend Files
```
Frontend/
├── js/
│   └── chatbot.js            # Chat widget controller (NEW)
├── css/
│   └── style.css             # Updated with chat styles
└── support.html              # Updated with chat widget
```

### Documentation Files
```
chatbot/
├── README.md                 # Project overview
├── SETUP_INSTRUCTIONS.md     # Detailed setup guide
├── FRONTEND_INTEGRATION.md   # How frontend works
├── CUSTOMIZATION_GUIDE.md    # How to customize everything
├── Dockerfile                # Docker container setup
├── docker-compose.yml        # Docker Compose config
├── .gitignore               # Git ignore rules
├── .dockerignore            # Docker ignore rules
├── quickstart.bat           # Windows quick start
└── quickstart.sh            # Linux/macOS quick start
```

---

## ✨ Features Included

✅ **Real-time Chat Widget**
- Floating action button
- Message history
- Auto-scroll
- Timestamps

✅ **RAG System**
- Knowledge base about hotels, venues, policies
- Vector database (FAISS)
- Context-aware responses
- OpenAI GPT integration

✅ **Session Management**
- Persistent conversation history
- Per-user sessions
- localStorage persistence

✅ **Error Handling**
- Automatic server health checks
- Retry on failure
- Graceful error messages

✅ **Production Ready**
- Docker support
- PM2/Systemd support
- CORS enabled
- Comprehensive logging

---

## 🔥 Next Steps

1. **Start the server** (see Step 3 above)

2. **Test the chatbot**
   - Visit http://localhost:8000/frontend/support.html
   - Click chat button
   - Ask a question

3. **Customize** (optional)
   - Edit hotel information in `ingestion.py`
   - Change bot personality in `rag_chain.py`
   - Adjust colors in `style.css`
   - See `CUSTOMIZATION_GUIDE.md`

4. **Deploy** (when ready)
   - Use Docker: `docker-compose up`
   - Use PM2: `pm2 start app.py`
   - Use systemd: see `SETUP_INSTRUCTIONS.md`

---

## 📚 Documentation Map

| File | Purpose |
|------|---------|
| **This file** | Quick start overview |
| `README.md` | Feature overview and API docs |
| `SETUP_INSTRUCTIONS.md` | Detailed setup and deployment |
| `FRONTEND_INTEGRATION.md` | How the chat widget works |
| `CUSTOMIZATION_GUIDE.md` | How to customize everything |

---

## 🆘 Troubleshooting

### Error: "OPENAI_API_KEY not found"
**Solution:** Make sure `.env` file has your API key:
```
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

### Error: "Vector database not found"
**Solution:** Run ingestion to create it:
```bash
python ingestion.py
```

### Error: "Cannot connect to server"
**Solution:** Make sure FastAPI is running:
```bash
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

### Chat widget not appearing
**Solution:** Check browser console (F12 → Console tab) for errors

---

## 💡 Pro Tips

1. **Save your settings:** In frontend, chat sessions persist automatically
2. **Faster responses:** Use `gpt-3.5-turbo` (default, cheapest)
3. **Better quality:** Switch to `gpt-4` (slower, more expensive)
4. **Update info:** Edit `ingestion.py`, then run it again
5. **Mobile ready:** The chat works perfectly on phones

---

## 📊 API Costs

**Estimated Monthly Costs** (1000 messages):
- Embeddings: ~$0.02
- Chat: ~$1-2
- **Total: ~$2-3/month**

See `CUSTOMIZATION_GUIDE.md` for cost optimization tips.

---

## 🚢 Deployment Cheat Sheet

### Local Development (Current)
```bash
python -m uvicorn app:app --reload
```

### Docker
```bash
docker-compose up
```

### Production (PM2)
```bash
pm2 start app.py --name hospitality-chatbot
pm2 save
pm2 startup
```

### Production (Systemd)
See `SETUP_INSTRUCTIONS.md#option-3-using-systemd-linux`

---

## 📞 Getting Help

1. **Check logs:** Look at FastAPI terminal output
2. **Browser console:** Press F12, check Console tab
3. **API docs:** Visit http://localhost:8000/docs
4. **Read guides:** See documentation files above
5. **Check status:** Visit http://localhost:8000/health

---

## ✅ Verification Checklist

Before going live:

- [ ] OpenAI API key is valid
- [ ] FastAPI server runs without errors
- [ ] Chat widget appears on support page
- [ ] Can send messages and get responses
- [ ] CORS is properly configured
- [ ] Rate limiting is in place
- [ ] Error handling works
- [ ] Mobile responsive verified
- [ ] Sessions persist correctly
- [ ] Docker build succeeds (if using Docker)

---

## 🎯 What's Next?

### Immediate (Today)
- [ ] Run quickstart.bat/quickstart.sh
- [ ] Add OpenAI API key to .env
- [ ] Start FastAPI server
- [ ] Test chatbot on support page

### Short Term (This Week)
- [ ] Customize bot personality
- [ ] Update hotel/venue information
- [ ] Test with real users
- [ ] Monitor API costs

### Medium Term (This Month)
- [ ] Deploy to production
- [ ] Set up monitoring/logging
- [ ] Add custom analytics
- [ ] Optimize for your use case

### Long Term
- [ ] Expand knowledge base
- [ ] Add more venues/services
- [ ] Integrate with booking system
- [ ] Multi-language support

---

## 📈 Monitoring

Check these regularly:

1. **OpenAI Usage:** https://platform.openai.com/usage/overview
2. **API Health:** http://localhost:8000/health
3. **Logs:** Check FastAPI terminal output
4. **Browser Console:** Press F12 in support page

---

## 🎓 Learning Resources

- [LangChain Docs](https://python.langchain.com/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [FAISS Documentation](https://github.com/facebookresearch/faiss)

---

## 💬 Questions?

1. **"How do I customize the responses?"**
   → See `CUSTOMIZATION_GUIDE.md`

2. **"How do I deploy to production?"**
   → See `SETUP_INSTRUCTIONS.md` (Deployment section)

3. **"How does the chat work?"**
   → See `FRONTEND_INTEGRATION.md`

4. **"How do I add new information?"**
   → Edit `ingestion.py` and run it again

5. **"How much does it cost?"**
   → ~$2-3/month for 1000 messages with default settings

---

## 📝 Quick Command Reference

```bash
# Setup
python -m venv venv
source venv/bin/activate    # macOS/Linux
venv\Scripts\activate       # Windows
pip install -r requirements.txt

# Create vector database
python ingestion.py

# Run server
python -m uvicorn app:app --host 0.0.0.0 --port 8000

# Test endpoint
curl http://localhost:8000/chat -X POST -H "Content-Type: application/json" \
  -d '{"message":"Hello","session_id":null}'

# Docker
docker-compose up

# View logs
docker-compose logs -f

# Stop
Ctrl+C (or Cmd+C on Mac)
```

---

## 🌟 What Makes This Special

✨ **Complete Solution**
- Not just API, includes full frontend integration
- Production-ready code with error handling
- Comprehensive documentation

✨ **Easy to Use**
- Quickstart scripts for Windows, Mac, Linux
- One-command setup with quickstart.bat/sh
- Clear, well-commented code

✨ **Fully Customizable**
- Detailed customization guide
- Easy to change bot personality
- Support for knowledge base updates

✨ **Enterprise Ready**
- Docker and docker-compose included
- PM2, systemd, and Windows Task Scheduler support
- Security best practices built-in
- CORS, rate limiting, logging

---

## 🚀 You're Ready!

Everything is configured and ready to go. Just:

1. Add your OpenAI API key to `.env`
2. Run the quickstart script
3. Start the server
4. Open the support page
5. Start chatting!

For detailed information on any topic, see the documentation files.

---

**Version:** 1.0.0  
**Status:** Ready to Use  
**Last Updated:** May 2026

Happy coding! 🎉
