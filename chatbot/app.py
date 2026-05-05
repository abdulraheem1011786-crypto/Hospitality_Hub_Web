"""
FastAPI Server for Hospitality Hub RAG Chatbot
This module creates a REST API for the chatbot accessible from the frontend.
"""

import os
import uuid
from typing import Dict, List
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from rag_chain import initialize_rag_pipeline

# Load environment variables
load_dotenv()

# =====================================================================
# PYDANTIC MODELS FOR REQUEST/RESPONSE
# =====================================================================

class ChatMessage(BaseModel):
    """Schema for individual chat messages"""
    role: str  # "user" or "assistant"
    content: str
    timestamp: str


class ChatRequest(BaseModel):
    """Schema for incoming chat requests"""
    message: str
    session_id: str = None  # Optional session ID for conversation continuity


class ChatResponse(BaseModel):
    """Schema for outgoing chat responses"""
    response: str
    session_id: str
    timestamp: str
    message_count: int


class HealthResponse(BaseModel):
    """Schema for health check"""
    status: str
    timestamp: str


# =====================================================================
# SESSION MANAGEMENT
# =====================================================================

class SessionManager:
    """Manage chat sessions and conversation history"""
    
    def __init__(self):
        self.sessions: Dict[str, Dict] = {}
        self.max_sessions = 100
        self.max_messages_per_session = 50
    
    def create_session(self) -> str:
        """Create a new chat session"""
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "created_at": datetime.now(),
            "messages": [],
            "message_count": 0
        }
        return session_id
    
    def get_session(self, session_id: str) -> Dict:
        """Get session by ID"""
        return self.sessions.get(session_id)
    
    def add_message(self, session_id: str, role: str, content: str) -> bool:
        """Add a message to session history"""
        session = self.get_session(session_id)
        if not session:
            return False
        
        if session["message_count"] >= self.max_messages_per_session:
            return False
        
        session["messages"].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
        session["message_count"] += 1
        return True
    
    def cleanup_old_sessions(self, max_age_hours: int = 24):
        """Remove sessions older than specified hours"""
        now = datetime.now()
        sessions_to_remove = []
        
        for session_id, session in self.sessions.items():
            age = (now - session["created_at"]).total_seconds() / 3600
            if age > max_age_hours:
                sessions_to_remove.append(session_id)
        
        for session_id in sessions_to_remove:
            del self.sessions[session_id]
        
        return len(sessions_to_remove)


# =====================================================================
# LIFESPAN MANAGEMENT
# =====================================================================

rag_chain = None
session_manager = SessionManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage app lifespan - load RAG chain on startup
    """
    global rag_chain
    
    print("=" * 60)
    print("Starting Hospitality Hub RAG Chatbot Server")
    print("=" * 60)
    
    try:
        # Load the RAG chain on startup
        rag_chain = initialize_rag_pipeline()
        print("\n✓ RAG chain loaded successfully")
        print("✓ Server ready to accept chat requests")
        print("=" * 60)
    except Exception as e:
        print(f"\n✗ Failed to initialize RAG chain: {str(e)}")
        print("Server will not be able to process chat requests")
    
    yield
    
    # Cleanup on shutdown
    print("\nShutting down server...")
    cleanup_count = session_manager.cleanup_old_sessions(0)
    print(f"Cleaned up {cleanup_count} sessions")


# =====================================================================
# FASTAPI APP SETUP
# =====================================================================

app = FastAPI(
    title="Hospitality Hub RAG Chatbot API",
    description="Real-time RAG chatbot for Hospitality Hub",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================================
# API ENDPOINTS
# =====================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify server is running
    """
    return HealthResponse(
        status="healthy" if rag_chain else "initializing",
        timestamp=datetime.now().isoformat()
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint
    
    Args:
        request: ChatRequest containing user message and optional session_id
    
    Returns:
        ChatResponse with bot response and session information
    
    Raises:
        HTTPException: If RAG chain not initialized or processing fails
    """
    
    global rag_chain
    
    # Validate RAG chain is loaded
    if not rag_chain:
        raise HTTPException(
            status_code=503,
            detail="Chatbot service is initializing. Please try again in a moment."
        )
    
    # Validate input
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )
    
    if len(request.message) > 1000:
        raise HTTPException(
            status_code=400,
            detail="Message is too long (max 1000 characters)"
        )
    
    try:
        # Handle session management
        if request.session_id:
            session = session_manager.get_session(request.session_id)
            if not session:
                # Create new session if provided one doesn't exist
                request.session_id = session_manager.create_session()
        else:
            # Create new session if not provided
            request.session_id = session_manager.create_session()
        
        # Add user message to session history
        session_manager.add_message(request.session_id, "user", request.message)
        
        # Get response from RAG chain
        print(f"[{request.session_id}] Processing: {request.message[:100]}...")
        
        response = rag_chain.invoke({"question": request.message})
        assistant_message = response.get("answer", "")
        
        # Add assistant message to session history
        session_manager.add_message(request.session_id, "assistant", assistant_message)
        
        # Get current message count
        session = session_manager.get_session(request.session_id)
        message_count = session["message_count"]
        
        print(f"[{request.session_id}] Response generated ({message_count} messages)")
        
        return ChatResponse(
            response=assistant_message,
            session_id=request.session_id,
            timestamp=datetime.now().isoformat(),
            message_count=message_count
        )
    
    except Exception as e:
        print(f"✗ Error processing chat: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing your request: {str(e)}"
        )


@app.post("/session/new")
async def create_new_session():
    """
    Create a new chat session
    
    Returns:
        Dictionary with new session ID
    """
    session_id = session_manager.create_session()
    return {
        "session_id": session_id,
        "message": "New session created successfully"
    }


@app.get("/session/{session_id}")
async def get_session_info(session_id: str):
    """
    Get information about a specific session
    
    Args:
        session_id: The session ID to retrieve
    
    Returns:
        Session information including message history
    """
    session = session_manager.get_session(session_id)
    
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )
    
    return {
        "session_id": session_id,
        "created_at": session["created_at"].isoformat(),
        "message_count": session["message_count"],
        "messages": session["messages"]
    }


@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """
    Delete a chat session
    
    Args:
        session_id: The session ID to delete
    
    Returns:
        Confirmation message
    """
    if session_id in session_manager.sessions:
        del session_manager.sessions[session_id]
        return {"message": "Session deleted successfully"}
    else:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )


# =====================================================================
# ROOT ENDPOINT
# =====================================================================

@app.get("/")
async def root():
    """
    Root endpoint with API information
    """
    return {
        "name": "Hospitality Hub RAG Chatbot API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "chat": "/chat (POST)",
            "create_session": "/session/new (POST)",
            "get_session": "/session/{session_id} (GET)",
            "delete_session": "/session/{session_id} (DELETE)"
        },
        "docs": "/docs"
    }


# =====================================================================
# ERROR HANDLERS
# =====================================================================

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    """Handle ValueError exceptions"""
    return HTTPException(status_code=400, detail=str(exc))


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle unexpected exceptions"""
    print(f"✗ Unexpected error: {str(exc)}")
    return HTTPException(
        status_code=500,
        detail="An unexpected error occurred"
    )


# =====================================================================
# MAIN
# =====================================================================

if __name__ == "__main__":
    import uvicorn
    
    # Run the server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )
