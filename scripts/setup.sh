#!/bin/bash

# DrugPredict Development Startup Script

echo "🧬 Starting DrugPredict Development Environment..."

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Frontend: npm run dev (port 3000)"
echo "2. Backend:  python backend/api/flask_app.py (port 5001)"
echo ""
echo "Or run both with: npm run dev & python backend/api/flask_app.py"
