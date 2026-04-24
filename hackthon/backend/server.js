const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Shared data storage
const sharedData = {
  complaints: [],
  workOrders: []
};

// Pass shared data to routes via middleware
app.use((req, res, next) => {
  req.appData = sharedData;
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

const complaintsRouter = require('./routes/complaints');
const workOrdersRouter = require('./routes/workOrders');

// Routes
app.use('/api/complaints', complaintsRouter);
app.use('/api/work-orders', workOrdersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
