const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'complaints.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize SQLite Database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Create complaints table
        db.run(`
            CREATE TABLE IF NOT EXISTS complaints (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                location TEXT NOT NULL,
                description TEXT NOT NULL,
                department TEXT NOT NULL,
                departmentKey TEXT NOT NULL,
                severity TEXT NOT NULL,
                residents INTEGER NOT NULL,
                priority TEXT NOT NULL,
                priorityScore INTEGER NOT NULL,
                status TEXT NOT NULL,
                workOrderId TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            )
        `);

        // Create work_orders table
        db.run(`
            CREATE TABLE IF NOT EXISTS work_orders (
                orderId TEXT PRIMARY KEY,
                assignedDepartment TEXT NOT NULL,
                departmentKey TEXT NOT NULL,
                location TEXT NOT NULL,
                issue TEXT NOT NULL,
                priorityScore INTEGER NOT NULL,
                severity TEXT NOT NULL,
                residentsAffected INTEGER NOT NULL,
                status TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                dueDate TEXT NOT NULL
            )
        `);
    });
}

// API Endpoints

// Get all complaints
app.get('/api/complaints', (req, res) => {
    db.all('SELECT * FROM complaints ORDER BY id DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// Get all work orders
app.get('/api/workorders', (req, res) => {
    db.all('SELECT * FROM work_orders ORDER BY orderId DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// Create a complaint
app.post('/api/complaints', (req, res) => {
    const {
        name,
        location,
        description,
        department,
        departmentKey,
        severity,
        residents,
        priority,
        priorityScore,
        status,
        workOrderId
    } = req.body;

    const now = new Date().toLocaleString();

    db.run(
        `INSERT INTO complaints (
            name, location, description, department, departmentKey,
            severity, residents, priority, priorityScore, status,
            workOrderId, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            name, location, description, department, departmentKey,
            severity, residents, priority, priorityScore, status,
            workOrderId, now, now
        ],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                name, location, description, department, departmentKey,
                severity, residents, priority, priorityScore, status,
                workOrderId, createdAt: now
            });
        }
    );
});

// Create a work order
app.post('/api/workorders', (req, res) => {
    const {
        orderId,
        assignedDepartment,
        departmentKey,
        location,
        issue,
        priorityScore,
        severity,
        residentsAffected,
        status,
        createdAt,
        dueDate
    } = req.body;

    db.run(
        `INSERT INTO work_orders (
            orderId, assignedDepartment, departmentKey, location, issue,
            priorityScore, severity, residentsAffected, status, createdAt, dueDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            orderId, assignedDepartment, departmentKey, location, issue,
            priorityScore, severity, residentsAffected, status, createdAt, dueDate
        ],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json(req.body);
        }
    );
});

// Update a complaint
app.put('/api/complaints/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const now = new Date().toLocaleString();

    db.run(
        'UPDATE complaints SET status = ?, updatedAt = ? WHERE id = ?',
        [status, now, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Complaint not found' });
            }
            res.json({ id, status, updatedAt: now });
        }
    );
});

// Delete all complaints and work orders (clear database)
app.delete('/api/clear', (req, res) => {
    db.serialize(() => {
        db.run('DELETE FROM complaints', (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
        });

        db.run('DELETE FROM work_orders', (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Database cleared successfully' });
        });
    });
});

// Check for duplicate complaints
app.post('/api/check-duplicate', (req, res) => {
    const { location, description } = req.body;

    db.get(
        `SELECT * FROM complaints WHERE location = ? AND description = ? LIMIT 1`,
        [location, description],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ isDuplicate: !!row, complaint: row || null });
        }
    );
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        }
        console.log('Database connection closed');
        process.exit(0);
    });
});
