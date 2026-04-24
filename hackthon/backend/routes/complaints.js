const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { detectDepartment, getDepartmentName, normalizeText } = require('../utils/departments');
const { calculatePriorityScore, getPriorityLabel, calculateDueDays, calculateDueDate } = require('../utils/priority');

let complaints = [];
let workOrders = [];

// Submit a new complaint
router.post('/', (req, res) => {
  try {
    const { name, location, description, residents, severity } = req.body;
    complaints = req.appData.complaints;
    workOrders = req.appData.workOrders;

    // Validation
    if (!name || !location || !description || !severity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const normalizedLocation = normalizeText(location);
    const normalizedDescription = normalizeText(description);

    // Check for duplicates
    const duplicate = complaints.find(c => {
      const sameLocation = normalizeText(c.location) === normalizedLocation;
      const sameDescription = normalizeText(c.description) === normalizedDescription;
      const fuzzyMatch = normalizedDescription.includes(normalizeText(c.description).slice(0, 20)) || 
                        normalizeText(c.description).includes(normalizedDescription.slice(0, 20));
      return sameLocation && (sameDescription || fuzzyMatch);
    });

    if (duplicate) {
      return res.status(409).json({
        isDuplicate: true,
        duplicateId: duplicate.id,
        message: `Duplicate complaint found. Ticket #${duplicate.id} already exists for this location and issue.`
      });
    }

    // Detect department
    const departmentKey = detectDepartment(normalizedDescription + " " + normalizedLocation);
    const department = getDepartmentName(departmentKey);

    // Calculate priority
    const residentCount = Math.max(residents || 1, 1);
    const priorityScore = calculatePriorityScore(severity, residentCount);
    const priority = getPriorityLabel(priorityScore);

    // Create complaint
    const complaintId = complaints.length + 1;
    const complaint = {
      id: complaintId,
      name,
      location,
      description,
      department,
      departmentKey,
      severity,
      residents: residentCount,
      priority,
      priorityScore,
      status: "Pending",
      createdAt: new Date().toLocaleString()
    };

    // Create work order
    const dueDays = calculateDueDays(priorityScore);
    const dueDate = calculateDueDate(dueDays);
    const workOrder = {
      orderId: `WO-${String(complaintId).padStart(4, "0")}`,
      complaintId: complaintId,
      assignedDepartment: department,
      departmentKey,
      location,
      issue: description,
      priorityScore,
      severity,
      residentsAffected: residentCount,
      status: "Assigned",
      createdAt: new Date().toLocaleString(),
      dueDate
    };

    complaints.push(complaint);
    workOrders.push(workOrder);

    res.status(201).json({
      complaint,
      workOrder,
      message: `Thank you, ${name}. Your complaint has been routed to the ${department}.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// Get all complaints
router.get('/', (req, res) => {
  complaints = req.appData.complaints;
  res.json(complaints);
});

// Get a specific complaint
router.get('/:id', (req, res) => {
  complaints = req.appData.complaints;
  const complaint = complaints.find(c => c.id === parseInt(req.params.id));
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json(complaint);
});

// Update complaint status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    complaints = req.appData.complaints;
    const complaint = complaints.find(c => c.id === parseInt(req.params.id));
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    complaint.status = status || "Resolved";
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

module.exports = router;
