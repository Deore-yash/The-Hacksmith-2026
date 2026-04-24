# Complaint Management System - Backend API

## Overview
This is a Node.js/Express backend server for the Complaint Management System. It handles complaint submissions, department routing, priority calculation, and work order management.

## Project Structure
```
backend/
├── server.js           # Main Express server
├── package.json        # Dependencies
├── routes/
│   ├── complaints.js   # Complaints API endpoints
│   └── workOrders.js   # Work Orders API endpoints
└── utils/
    ├── departments.js  # Department detection logic
    └── priority.js     # Priority calculation logic
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Complaints
- `POST /api/complaints` - Submit a new complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get a specific complaint
- `PATCH /api/complaints/:id/status` - Update complaint status

### Work Orders
- `GET /api/work-orders` - Get all work orders
- `GET /api/work-orders/department/:departmentKey` - Get work orders by department
- `GET /api/work-orders/:orderId` - Get a specific work order
- `PATCH /api/work-orders/:orderId/status` - Update work order status

## Departments Supported
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

## Features
- Automatic department detection based on keywords
- Duplicate complaint detection
- Priority scoring based on severity and residents affected
- Automatic due date calculation
- RESTful API design
- CORS enabled
