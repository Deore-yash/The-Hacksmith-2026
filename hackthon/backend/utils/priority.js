const severityWeight = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4
};

const priorityLabels = {
  Low: "priority-low",
  Medium: "priority-medium",
  High: "priority-high"
};

function calculatePriorityScore(severity, residents) {
  const base = severityWeight[severity] || 1;
  const residentFactor = Math.min(residents, 20) / 4;
  return Math.min(Math.round(base * 2 + residentFactor), 10);
}

function getPriorityLabel(score) {
  if (score >= 8) return "High";
  if (score >= 5) return "Medium";
  return "Low";
}

function calculateDueDays(priorityScore) {
  if (priorityScore >= 8) return 1;
  if (priorityScore >= 5) return 3;
  return 5;
}

function calculateDueDate(days) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate.toLocaleDateString();
}

module.exports = {
  calculatePriorityScore,
  getPriorityLabel,
  calculateDueDays,
  calculateDueDate,
  severityWeight,
  priorityLabels
};
