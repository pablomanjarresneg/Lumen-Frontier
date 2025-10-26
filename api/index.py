"""Vercel serverless function handler for FastAPI backend."""

import sys
import os
from pathlib import Path

# Add backend directory to Python path
backend_path = Path(__file__).resolve().parent.parent / "apps" / "backend"
sys.path.insert(0, str(backend_path))

# Set working directory for imports
os.chdir(str(backend_path))

# Import the FastAPI app
from main import app

# Wrap FastAPI with Mangum for ASGI compatibility with Vercel
from mangum import Mangum

handler = Mangum(app, lifespan="off")
