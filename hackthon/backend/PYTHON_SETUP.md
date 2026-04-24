# Complaint Management System - Backend API (Python Flask)

## Overview
This is a Python Flask backend server for the Complaint Management System. It handles complaint submissions, department routing, priority calculation, and work order management.

## Requirements
- Python 3.7+
- Flask
- Flask-CORS

## Quick Start

### 1. Install Dependencies
```bash
cd hackthon/backend
pip install flask flask-cors
```

### 2. Start Server
```bash
python app.py
```

### Expected Output
```
🚀 Server starting on http://localhost:5000
 * Running on http://127.0.0.1:5000
```

## API Endpoints

### Complaints
- `POST /api/complaints` - Submit a new complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/<id>` - Get a specific complaint
- `PATCH /api/complaints/<id>/status` - Update complaint status

### Work Orders
- `GET /api/work-orders` - Get all work orders
- `GET /api/work-orders/<orderId>` - Get a specific work order
- `PATCH /api/work-orders/<orderId>/status` - Update work order status

### Health Check
- `GET /api/health` - Server status

## Features
✅ Automatic department detection
✅ Duplicate complaint detection
✅ Priority scoring algorithm
✅ Automatic due date calculation
✅ RESTful API
✅ CORS enabled for all origins

## Departments
- Roads Department
- Sanitation Department
- Water Services
- Electricity Department
- Parks & Recreation
- Building Control

## Priority Levels
- Low (1-4 points)
- Medium (5-7 points)
- High (8-10 points)

## How to Use with Frontend
1. Start backend: `python app.py` (runs on http://localhost:5000)
2. Open frontend: Open `hackthon/index.html` in your browser
3. The frontend automatically connects to the backend

## Data Storage
Currently uses in-memory storage. Data is lost when server restarts. For production, integrate with a database like SQLite, PostgreSQL, or MongoDB.
