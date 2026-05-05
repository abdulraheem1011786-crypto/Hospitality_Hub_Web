# Frontend Integration Guide

## Overview

The Hospitality Hub RAG Chatbot has been fully integrated into the support page of your frontend. This guide explains how the chatbot works on the client-side and how to customize it further.

## 📁 Frontend Files

### Updated Files
- **`Frontend/support.html`** - Updated with chatbot widget HTML and toggle button
- **`Frontend/css/style.css`** - Added complete chatbot styling
- **`Frontend/js/chatbot.js`** - New chatbot controller (created)

## 🎨 UI Components

### 1. Floating Action Button
- Located at bottom-right of the screen
- Click to open/close the chatbot
- Shows notification badge
- Smooth animations

```html
<button id="chatbotToggle" class="chatbot-toggle-btn">
  <i class="fas fa-comments"></i>
  <span class="badge">1</span>
</button>
```

### 2. Chat Widget
- Fixed position widget with message history
- Messages container with auto-scroll
- Input field with send button
- Status messages for server connection

```html
<div id="chatbotWidget" class="chatbot-widget">
  <!-- Header with close button -->
  <!-- Messages container -->
  <!-- Input area -->
</div>
```

### 3. Help Card Integration
The "Start Chat" button in help cards opens the widget:

```html
<button class="btn-help" data-action="chat">Start Chat</button>
```

JavaScript handles the click:
```javascript
if (action === 'chat') window.chatbot && window.chatbot.toggleWidget();
```

## 🔧 JavaScript Functionality

### File: `js/chatbot.js`

#### Main Class: `HospitalityHubChatbot`

**Constructor Configuration:**
```javascript
this.API_URL = 'http://localhost:8000';
this.CHAT_ENDPOINT = `${this.API_URL}/chat`;
this.HEALTH_CHECK_ENDPOINT = `${this.API_URL}/health`;
```

**Key Methods:**

1. **`toggleWidget()`** - Open/close the chat widget
2. **`sendMessage(message)`** - Send message to API
3. **`addMessage(role, content)`** - Display message in UI
4. **`checkServerHealth()`** - Verify backend is online
5. **`loadSession()`** - Restore previous session
6. **`saveSession()`** - Persist session ID

**State Management:**
```javascript
this.sessionId = null;        // Unique session identifier
this.messageCount = 0;        // Total messages in session
this.isServerOnline = false;  // Backend connectivity status
this.isLoading = false;       // Message sending state
```

## 📡 API Communication

### Message Flow

```
Frontend (support.html)
    ↓ (chatbot.js)
    ↓ POST /chat
Backend (FastAPI app.py)
    ↓ (rag_chain.py)
    ↓ Retrieve context from FAISS
    ↓ Query OpenAI API
Frontend ← Response JSON
    ↓ (chatbot.js)
    ↓ Display message
User sees bot response
```

### Request Format
```json
{
  "message": "What are your hotel prices?",
  "session_id": "uuid-or-null"
}
```

### Response Format
```json
{
  "response": "We have three hotels...",
  "session_id": "generated-uuid",
  "timestamp": "2024-05-05T10:30:00",
  "message_count": 2
}
```

## 💾 Session Persistence

Sessions are stored in browser localStorage:

```javascript
// Save session
localStorage.setItem('chatbot_session_id', sessionId);

// Load session
const sessionId = localStorage.getItem('chatbot_session_id');
```

Benefits:
- Users can close and reopen the chat without losing history
- Each browser/device has its own session
- Sessions stored on backend for conversation context

## 🎨 Customization

### Change Chat Widget Colors

Edit `style.css`:
```css
/* Floating button gradient */
.chatbot-toggle-btn {
  background: linear-gradient(135deg, var(--cyan), var(--accent-violet));
}

/* Message styling */
.user-message .message-content {
  background: linear-gradient(135deg, var(--cyan), var(--accent-violet));
}
```

### Change API Endpoint

Edit `js/chatbot.js`:
```javascript
this.API_URL = 'http://your-server:8000';  // Change this
```

### Customize System Prompt

Edit `chatbot/rag_chain.py`:
```python
SYSTEM_PROMPT = """Your custom system prompt here..."""
```

### Modify Message Appearance

Edit `js/chatbot.js` - `addMessage()` method:
```javascript
addMessage(role, content) {
  // Customize HTML structure here
  messageDiv.className = `chatbot-message ${role}-message`;
}
```

## 🔌 Connecting to Backend

### Prerequisites
1. Python 3.10+ installed
2. OpenAI API key
3. All dependencies installed (see SETUP_INSTRUCTIONS.md)

### Step-by-Step

1. **Open Terminal/Command Prompt** in chatbot directory

2. **Activate Virtual Environment**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Start FastAPI Server**
   ```bash
   python -m uvicorn app:app --host 0.0.0.0 --port 8000
   ```

4. **Open Support Page**
   ```
   http://localhost:8000/frontend/support.html
   ```

5. **Test Chatbot**
   - Click the chat button (bottom-right)
   - Type a question
   - Get instant response

### Verify Connection

The chatbot automatically:
- Checks if backend is online
- Shows "Connected to support bot" message
- Retries if server is unavailable
- Shows error messages if connection fails

## 🐛 Debugging

### Check Browser Console
1. Press `F12` in browser
2. Open "Console" tab
3. Look for error messages

### Check Server Logs
1. Look at FastAPI terminal output
2. Check for `[sessionId] Processing:` messages
3. Verify no Python errors

### Common Issues

**"Server offline" message:**
- Ensure FastAPI is running
- Check if port 8000 is available
- Verify API_URL in chatbot.js

**Messages not sending:**
- Check browser console for errors
- Ensure OPENAI_API_KEY is set
- Check network tab in developer tools

**Slow responses:**
- First response is slower (cold start)
- Check OpenAI API status
- Monitor your API usage

## 📊 Monitoring

### Session Tracking
```javascript
// In chatbot.js, sessionId is logged
console.log('Session:', this.sessionId);
```

### Message Count
```javascript
// Returned in API response
response.message_count
```

### Server Health
```javascript
// Automatic health checks
this.checkServerHealth();
```

## 🚀 Production Deployment

### Environment Setup

1. **Set Production API URL:**
   ```javascript
   // In chatbot.js
   this.API_URL = 'https://your-domain.com/api';
   ```

2. **Enable HTTPS:**
   - Use SSL certificate
   - Update API_URL to `https://`

3. **Configure CORS:**
   - In `app.py`, restrict `allow_origins`
   - Only allow your domain

### Performance Optimization

1. **Minify JavaScript:**
   ```bash
   # Use a JavaScript minifier
   # Or use webpack/vite
   ```

2. **Enable Compression:**
   - Configure web server to gzip assets

3. **Cache Static Files:**
   - Serve chatbot.js from CDN
   - Set appropriate cache headers

## 📱 Mobile Responsiveness

The chatbot is fully responsive:

```css
@media (max-width: 640px) {
  .chatbot-widget {
    width: calc(100vw - 48px);  /* Full screen with padding */
    height: 500px;
  }
}
```

Works seamlessly on:
- Desktop browsers
- Tablets
- Mobile phones
- All screen sizes

## ✨ Features

### Message Features
- ✅ Real-time message display
- ✅ Auto-scroll to latest message
- ✅ Timestamps for each message
- ✅ Typing indicators (optional)

### User Experience
- ✅ Floating action button
- ✅ Smooth animations
- ✅ Mobile responsive
- ✅ Dark theme matching site
- ✅ Session persistence
- ✅ Auto-retry on failure

### Accessibility
- ✅ Aria labels on buttons
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Semantic HTML

## 📚 Related Files

- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Backend setup
- [README.md](./README.md) - Project overview
- [app.py](./app.py) - FastAPI backend
- [rag_chain.py](./rag_chain.py) - RAG implementation
- [ingestion.py](./ingestion.py) - Data pipeline

## 🎯 Next Steps

1. ✅ Review this integration guide
2. ✅ Ensure backend is running
3. ✅ Test chatbot functionality
4. ✅ Customize appearance if needed
5. ✅ Deploy to production

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check server logs
3. Review error messages
4. Check troubleshooting in SETUP_INSTRUCTIONS.md

---

**Version:** 1.0.0  
**Last Updated:** May 2026
