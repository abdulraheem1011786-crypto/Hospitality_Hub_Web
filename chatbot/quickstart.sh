#!/bin/bash

# Quick Start Script for Hospitality Hub RAG Chatbot
# This script automates the setup process for macOS/Linux users

echo ""
echo "============================================================"
echo "Hospitality Hub RAG Chatbot - Quick Start Setup"
echo "============================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.10+ from https://www.python.org/"
    exit 1
fi

echo "✓ Python is installed"
python3 --version

# Create virtual environment
echo ""
echo "Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to activate virtual environment"
    exit 1
fi
echo "✓ Virtual environment activated"

# Upgrade pip
echo ""
echo "Upgrading pip..."
python -m pip install --upgrade pip > /dev/null 2>&1

# Install requirements
echo ""
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed successfully"

# Check if .env file exists
echo ""
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠ IMPORTANT: Edit .env file and add your OpenAI API key"
    echo "  - Open .env in a text editor (e.g., nano .env)"
    echo "  - Replace 'your_openai_api_key_here' with your actual key"
    echo "  - Get your key from: https://platform.openai.com/api-keys"
    echo ""
    read -p "Press Enter after updating .env file..."
else
    echo "✓ .env file already exists"
fi

# Run ingestion
echo ""
echo "============================================================"
echo "Running Data Ingestion Pipeline..."
echo "============================================================"
python ingestion.py
if [ $? -ne 0 ]; then
    echo "ERROR: Ingestion failed"
    echo "Make sure your OpenAI API key is correct in .env"
    exit 1
fi

echo ""
echo "============================================================"
echo "✓ Setup Complete!"
echo "============================================================"
echo ""
echo "Next steps:"
echo "1. Run the FastAPI server:"
echo "   python -m uvicorn app:app --host 0.0.0.0 --port 8000"
echo ""
echo "2. In your browser, open:"
echo "   - Frontend: http://localhost:8000/frontend/support.html"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "3. Test the chatbot by clicking the chat button on the support page"
echo ""
echo "Make sure:"
echo "- Your backend PHP server is running (if using live API integration)"
echo "- The OpenAI API key is valid and has available balance"
echo "- Port 8000 is not in use by another application"
echo ""
