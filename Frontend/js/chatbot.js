/**
 * Hospitality Hub RAG Chatbot Frontend
 * Handles real-time communication with the FastAPI backend
 */

class HospitalityHubChatbot {
  constructor() {
    // Configuration
    this.API_URL = 'http://localhost:8000';
    this.CHAT_ENDPOINT = `${this.API_URL}/chat`;
    this.SESSION_ENDPOINT = `${this.API_URL}/session`;
    this.HEALTH_CHECK_ENDPOINT = `${this.API_URL}/health`;
    
    // State
    this.isOpen = false;
    this.isLoading = false;
    this.sessionId = null;
    this.messageCount = 0;
    this.isServerOnline = false;
    this.retryCount = 0;
    this.maxRetries = 3;
    
    // DOM Elements
    this.widget = document.getElementById('chatbotWidget');
    this.toggle = document.getElementById('chatbotToggle');
    this.closeBtn = document.getElementById('chatbotClose');
    this.messagesContainer = document.getElementById('chatMessages');
    this.form = document.getElementById('chatbotForm');
    this.input = document.getElementById('chatInput');
    this.status = document.getElementById('chatbotStatus');
    this.sendBtn = this.form?.querySelector('button[type="submit"]');
    
    // Initialize
    this.init();
  }

  /**
   * Initialize the chatbot
   */
  init() {
    // Check if all required elements exist
    if (!this.widget || !this.toggle || !this.form || !this.input) {
      console.error('Chatbot: Required DOM elements not found');
      return;
    }

    // Attach event listeners
    this.toggle.addEventListener('click', () => this.toggleWidget());
    this.closeBtn.addEventListener('click', () => this.closeWidget());
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Load session from localStorage
    this.loadSession();

    // Check server health
    this.checkServerHealth();

    // Auto-focus input when widget opens (accessibility)
    this.widget.addEventListener('transitionend', () => {
      if (this.isOpen) {
        this.input.focus();
      }
    });

    console.log('✓ Chatbot initialized');
  }

  /**
   * Toggle the chatbot widget open/closed
   */
  toggleWidget() {
    if (this.isOpen) {
      this.closeWidget();
    } else {
      this.openWidget();
    }
  }

  /**
   * Open the chatbot widget
   */
  openWidget() {
    this.isOpen = true;
    this.widget.classList.add('open');
    this.toggle.classList.add('open');
    this.input.focus();
    
    // Store preference
    sessionStorage.setItem('chatbot_open', 'true');
  }

  /**
   * Close the chatbot widget
   */
  closeWidget() {
    this.isOpen = false;
    this.widget.classList.remove('open');
    this.toggle.classList.remove('open');
    
    // Store preference
    sessionStorage.setItem('chatbot_open', 'false');
  }

  /**
   * Check if the server is online
   */
  async checkServerHealth() {
    try {
      const response = await fetch(this.HEALTH_CHECK_ENDPOINT, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        this.isServerOnline = true;
        this.showStatus('Connected to support bot', 'success', 3000);
        console.log('✓ Chatbot server is online');
      } else {
        this.handleServerError();
      }
    } catch (error) {
      this.handleServerError();
    }
  }

  /**
   * Handle server connection errors
   */
  handleServerError() {
    this.isServerOnline = false;
    const message = this.retryCount < this.maxRetries
      ? `Support bot unavailable. Retrying... (${this.retryCount}/${this.maxRetries})`
      : 'Support bot is offline. Please try again later.';
    
    this.showStatus(message, 'error', 5000);
    
    // Retry health check
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => this.checkServerHealth(), 3000);
    }
  }

  /**
   * Load session from localStorage
   */
  loadSession() {
    this.sessionId = localStorage.getItem('chatbot_session_id');
    const wasOpen = sessionStorage.getItem('chatbot_open') === 'true';
    
    if (wasOpen) {
      this.openWidget();
    }
  }

  /**
   * Save session to localStorage
   */
  saveSession() {
    if (this.sessionId) {
      localStorage.setItem('chatbot_session_id', this.sessionId);
    }
  }

  /**
   * Handle form submission
   */
  async handleSubmit(e) {
    e.preventDefault();

    const userMessage = this.input.value.trim();

    if (!userMessage) {
      return;
    }

    if (!this.isServerOnline) {
      this.showStatus('Server is currently offline. Please try again later.', 'error', 5000);
      return;
    }

    // Add user message to UI immediately
    this.addMessage('user', userMessage);

    // Clear input
    this.input.value = '';

    // Disable input while processing
    this.setLoading(true);

    try {
      // Send message to server
      const response = await this.sendMessage(userMessage);

      if (response.response) {
        // Add bot response to UI
        this.addMessage('bot', response.response);

        // Update session info
        this.sessionId = response.session_id;
        this.messageCount = response.message_count;
        this.saveSession();
      }
    } catch (error) {
      this.addMessage('bot', `❌ Error: ${error.message}. Please try again.`);
    } finally {
      this.setLoading(false);
      this.input.focus();
    }
  }

  /**
   * Send message to the API
   */
  async sendMessage(message) {
    const payload = {
      message: message,
      session_id: this.sessionId
    };

    try {
      const response = await fetch(this.CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Server error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection.');
      }
      throw error;
    }
  }

  /**
   * Add message to the chat display
   */
  addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${role}-message`;

    // Add fade-in animation
    messageDiv.style.animation = 'fadeIn 0.3s ease-in';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = this.formatTime(new Date());

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeSpan);
    this.messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    this.scrollToBottom();
  }

  /**
   * Set loading state
   */
  setLoading(loading) {
    this.isLoading = loading;
    this.input.disabled = loading;
    this.sendBtn.disabled = loading;

    if (loading) {
      this.sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    } else {
      this.sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
    }
  }

  /**
   * Show status message
   */
  showStatus(message, type = 'info', duration = 3000) {
    this.status.textContent = message;
    this.status.className = `chatbot-status ${type}`;
    this.status.style.display = 'flex';

    if (duration > 0) {
      setTimeout(() => {
        this.status.style.display = 'none';
      }, duration);
    }
  }

  /**
   * Scroll messages container to bottom
   */
  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 10);
  }

  /**
   * Handle keyboard events
   */
  handleKeyDown(e) {
    // Send on Enter, but allow Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.form.dispatchEvent(new Event('submit'));
    }
  }

  /**
   * Format timestamp
   */
  formatTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }

  /**
   * Clear chat history
   */
  clearHistory() {
    this.messagesContainer.innerHTML = `
      <div class="chatbot-message bot-message">
        <div class="message-content">
          <p>Chat cleared. How can I help you today?</p>
        </div>
        <span class="message-time">just now</span>
      </div>
    `;
    this.scrollToBottom();
  }
}

/**
 * Initialize chatbot when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new HospitalityHubChatbot();
  });
} else {
  window.chatbot = new HospitalityHubChatbot();
}
