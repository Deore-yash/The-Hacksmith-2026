const express = require('express');
const router = express.Router();

let workOrders = [];

// Get all work orders
router.get('/', (req, res) => {
  workOrders = req.appData.workOrders;
  res.json(workOrders);
});

// Get work orders by department
router.get('/department/:departmentKey', (req, res) => {
  workOrders = req.appData.workOrders;
  const { departmentKey } = req.params;
  const filtered = workOrders.filter(wo => wo.departmentKey === departmentKey);
  res.json(filtered);
});

// Get a specific work order
router.get('/:orderId', (req, res) => {
  workOrders = req.appData.workOrders;
  const workOrder = workOrders.find(wo => wo.orderId === req.params.orderId);
  if (!workOrder) {
    return res.status(404).json({ error: 'Work order not found' });
  }
  res.json(workOrder);
});

// Update work order status
router.patch('/:orderId/status', (req, res) => {
  try {
    const { status } = req.body;
    workOrders = req.appData.workOrders;
    const workOrder = workOrders.find(wo => wo.orderId === req.params.orderId);
    
    if (!workOrder) {
      return res.status(404).json({ error: 'Work order not found' });
    }

    workOrder.status = status || "In Progress";
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update work order' });
  }
});

module.exports = router;
