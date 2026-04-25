# Complaint Management System - Setup Guide

## Overview
This is a modern Complaint Management System with:
- **Frontend**: HTML5 with responsive UI, light/dark mode support
- **Backend**: Node.js/Express REST API
- **Database**: SQLite for persistent storage
- **Features**: Complaint tracking, work order generation, duplicate detection, priority scoring

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation & Setup

### 1. Install Dependencies
Navigate to the project directory and install required packages:

```bash
cd "d:\VS code\The Hacksimth 2026"
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `sqlite3` - Database
- `nodemon` (dev) - Auto-restart on file changes

### 2. Start the Server
Run the Node.js server:

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:3000
Connected to SQLite database
```

### 3. Access the Application
Open your browser and go to: **http://localhost:3000**

## Features

### Submit Complaint Form
- Enter your name, location, and complaint description
- Select severity level (Low, Medium, High, Critical)
- Specify number of affected residents
- System automatically routes to appropriate department

### AI Acknowledgement
- Receives confirmation with ticket number
- Shows assigned department and priority score
- Detects duplicate complaints

### All Complaints
- View all submitted complaints
- See status (Pending/Resolved)
- Mark complaints as resolved
- Priority and severity indicators

### Work Orders
- Auto-generated for each complaint
- Shows department, location, and due date
- Priority-based due date calculation

### Clear Database Button
- Trash icon in header (red colored)
- Deletes all complaints and work orders
- Requires confirmation before execution

### Theme Toggle
- Sun/moon icon in header
- Switch between light and dark modes
- Preference saved in browser

## API Endpoints

### GET /api/complaints
Get all complaints
```bash
curl http://localhost:3000/api/complaints
```

### POST /api/complaints
Create a new complaint
```bash
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "location": "Main Street",
    "description": "Pothole on the road",
    "department": "Roads Department",
    "severity": "High",
    "residents": 5
  }'
```

### GET /api/workorders
Get all work orders

### POST /api/workorders
Create a new work order

### PUT /api/complaints/:id
Update complaint status
```bash
curl -X PUT http://localhost:3000/api/complaints/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "Resolved"}'
```

### DELETE /api/clear
Delete all complaints and work orders
```bash
curl -X DELETE http://localhost:3000/api/clear
```

### POST /api/check-duplicate
Check for duplicate complaints

## Database Schema

### complaints table
- `id` - Primary key (auto-increment)
- `name` - Complainant name
- `location` - Complaint location
- `description` - Complaint details
- `department` - Assigned department
- `departmentKey` - Department identifier
- `severity` - Severity level
- `residents` - Number of affected residents
- `priority` - Calculated priority
- `priorityScore` - Numeric priority score
- `status` - Current status (Pending/Resolved)
- `workOrderId` - Associated work order
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### work_orders table
- `orderId` - Primary key (WO-XXXX format)
- `assignedDepartment` - Department responsible
- `departmentKey` - Department identifier
- `location` - Work location
- `issue` - Work description
- `priorityScore` - Priority level
- `severity` - Severity level
- `residentsAffected` - Number of affected residents
- `status` - Work order status
- `createdAt` - Creation timestamp
- `dueDate` - Due date for completion

## File Structure
```
The Hacksimth 2026/
├── index.html          # Frontend UI & JavaScript
├── server.js           # Express backend
├── package.json        # Node dependencies
├── complaints.db       # SQLite database (created on first run)
├── README.md           # Project overview
└── SETUP_INSTRUCTIONS.md  # This file
```

## Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Try: `lsof -i :3000` (Mac/Linux) or `netstat -ano | findstr :3000` (Windows)
- Change PORT in server.js if needed

### Cannot connect to server
- Ensure server is running: `npm start`
- Check API_BASE in index.html (should be `http://localhost:3000/api`)
- Browser console (F12) will show connection errors

### Database errors
- Delete `complaints.db` and restart server to reset
- Check file permissions in project directory

### CORS errors
- Verify CORS is enabled in server.js
- Frontend and backend must be on same domain for production

## Development Tips

### Enable Debug Mode
Add this to browser console:
```javascript
localStorage.debug = '*'
```

### View Database
Use any SQLite viewer:
- SQLite Browser: https://sqlitebrowser.org/
- VS Code Extension: SQLite Viewer

### Modify Port
Edit `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to desired port
```

## Future Enhancements
- User authentication
- Admin dashboard
- Email notifications
- Export reports to PDF/Excel
- Multiple database support (PostgreSQL, MySQL)
- WebSocket for real-time updates
- Mobile app version
