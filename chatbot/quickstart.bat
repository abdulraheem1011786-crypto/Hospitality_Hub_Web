@echo off
REM Quick Start Script for Hospitality Hub RAG Chatbot
REM This script automates the setup process for Windows users

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo Hospitality Hub RAG Chatbot - Quick Start Setup
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

echo ✓ Python is installed
python --version

REM Create virtual environment
echo.
echo Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

REM Activate virtual environment
echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)
echo ✓ Virtual environment activated

REM Upgrade pip
echo.
echo Upgrading pip...
python -m pip install --upgrade pip >nul 2>&1

REM Install requirements
echo.
echo Installing dependencies from requirements.txt...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed successfully

REM Check if .env file exists
echo.
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo ⚠ IMPORTANT: Edit .env file and add your OpenAI API key
    echo   - Open .env in a text editor
    echo   - Replace 'your_openai_api_key_here' with your actual key
    echo   - Get your key from: https://platform.openai.com/api-keys
    echo.
    pause
) else (
    echo ✓ .env file already exists
)

REM Run ingestion
echo.
echo ============================================================
echo Running Data Ingestion Pipeline...
echo ============================================================
python ingestion.py
if errorlevel 1 (
    echo ERROR: Ingestion failed
    echo Make sure your OpenAI API key is correct in .env
    pause
    exit /b 1
)

echo.
echo ============================================================
echo ✓ Setup Complete!
echo ============================================================
echo.
echo Next steps:
echo 1. Run the FastAPI server:
echo    python -m uvicorn app:app --host 0.0.0.0 --port 8000
echo.
echo 2. In your browser, open:
echo    - Frontend: http://localhost:8000/frontend/support.html
echo    - API Docs: http://localhost:8000/docs
echo.
echo 3. Test the chatbot by clicking the chat button on the support page
echo.
echo Make sure:
echo - Your backend PHP server is running (if using live API integration)
echo - The OpenAI API key is valid and has available balance
echo - Port 8000 is not in use by another application
echo.
pause
