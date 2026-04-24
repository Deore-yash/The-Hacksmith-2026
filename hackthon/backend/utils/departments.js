const departmentKeywords = {
  roads: ["road", "pothole", "street", "traffic", "intersection", "asphalt"],
  sanitation: ["garbage", "trash", "sewer", "drain", "cleaning", "waste", "smell"],
  water: ["water", "leak", "pipe", "supply", "tap", "drainage", "flood"],
  electricity: ["electric", "power", "light", "outage", "wiring", "transformer", "socket"],
  parks: ["park", "garden", "playground", "trees", "green", "bench", "grass"],
  "illegal construction": ["construction", "building", "permit", "illegal", "encroachment", "fence"]
};

const departmentNames = {
  roads: "Roads Department",
  sanitation: "Sanitation Department",
  water: "Water Services",
  electricity: "Electricity Department",
  parks: "Parks & Recreation",
  "illegal construction": "Building Control"
};

function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function detectDepartment(text) {
  const normalizedText = normalizeText(text);
  for (const dept in departmentKeywords) {
    for (const keyword of departmentKeywords[dept]) {
      if (normalizedText.includes(keyword)) {
        return dept;
      }
    }
  }
  return "sanitation"; // default department
}

function getDepartmentName(departmentKey) {
  return departmentNames[departmentKey] || "General Services";
}

module.exports = {
  detectDepartment,
  getDepartmentName,
  normalizeText,
  departmentKeywords,
  departmentNames
};
