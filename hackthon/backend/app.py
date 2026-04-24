from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Shared data storage
complaints = []
work_orders = []

# Department keywords for detection
department_keywords = {
    'roads': ['road', 'pothole', 'street', 'traffic', 'intersection', 'asphalt'],
    'sanitation': ['garbage', 'trash', 'sewer', 'drain', 'cleaning', 'waste', 'smell'],
    'water': ['water', 'leak', 'pipe', 'supply', 'tap', 'drainage', 'flood'],
    'electricity': ['electric', 'power', 'light', 'outage', 'wiring', 'transformer', 'socket'],
    'parks': ['park', 'garden', 'playground', 'trees', 'green', 'bench', 'grass'],
    'illegal construction': ['construction', 'building', 'permit', 'illegal', 'encroachment', 'fence']
}

department_names = {
    'roads': 'Roads Department',
    'sanitation': 'Sanitation Department',
    'water': 'Water Services',
    'electricity': 'Electricity Department',
    'parks': 'Parks & Recreation',
    'illegal construction': 'Building Control'
}

severity_weight = {
    'Low': 1,
    'Medium': 2,
    'High': 3,
    'Critical': 4
}

def normalize_text(text):
    return text.lower().strip()

def detect_department(text):
    text_lower = normalize_text(text)
    for dept, keywords in department_keywords.items():
        for keyword in keywords:
            if keyword in text_lower:
                return dept
    return 'sanitation'

def calculate_priority_score(severity, residents):
    base = severity_weight.get(severity, 1)
    resident_factor = min(residents, 20) / 4
    return min(round(base * 2 + resident_factor), 10)

def get_priority_label(score):
    if score >= 8:
        return 'High'
    elif score >= 5:
        return 'Medium'
    return 'Low'

def calculate_due_date(priority_score):
    if priority_score >= 8:
        due_days = 1
    elif priority_score >= 5:
        due_days = 3
    else:
        due_days = 5
    
    due_date = datetime.now() + timedelta(days=due_days)
    return due_date.strftime('%m/%d/%Y')

@app.route('/api/complaints', methods=['POST'])
def submit_complaint():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        location = data.get('location', '').strip()
        description = data.get('description', '').strip()
        residents = int(data.get('residents', 1))
        severity = data.get('severity', 'Low')

        # Validation
        if not all([name, location, description, severity]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Check for duplicates
        normalized_location = normalize_text(location)
        normalized_description = normalize_text(description)
        
        duplicate = None
        for c in complaints:
            same_location = normalize_text(c['location']) == normalized_location
            same_description = normalize_text(c['description']) == normalized_description
            if same_location and same_description:
                duplicate = c
                break

        if duplicate:
            return jsonify({
                'isDuplicate': True,
                'duplicateId': duplicate['id'],
                'message': f"Duplicate complaint found. Ticket #{duplicate['id']} already exists."
            }), 409

        # Detect department
        department_key = detect_department(normalized_description + ' ' + normalized_location)
        department = department_names[department_key]

        # Calculate priority
        residents = max(residents, 1)
        priority_score = calculate_priority_score(severity, residents)
        priority = get_priority_label(priority_score)

        # Create complaint
        complaint_id = len(complaints) + 1
        complaint = {
            'id': complaint_id,
            'name': name,
            'location': location,
            'description': description,
            'department': department,
            'departmentKey': department_key,
            'severity': severity,
            'residents': residents,
            'priority': priority,
            'priorityScore': priority_score,
            'status': 'Pending',
            'createdAt': datetime.now().strftime('%m/%d/%Y %H:%M:%S')
        }

        # Create work order
        due_date = calculate_due_date(priority_score)
        work_order = {
            'orderId': f'WO-{complaint_id:04d}',
            'complaintId': complaint_id,
            'assignedDepartment': department,
            'departmentKey': department_key,
            'location': location,
            'issue': description,
            'priorityScore': priority_score,
            'severity': severity,
            'residentsAffected': residents,
            'status': 'Assigned',
            'createdAt': datetime.now().strftime('%m/%d/%Y %H:%M:%S'),
            'dueDate': due_date
        }

        complaints.append(complaint)
        work_orders.append(work_order)

        return jsonify({
            'complaint': complaint,
            'workOrder': work_order,
            'message': f"Thank you, {name}. Your complaint has been routed to the {department}."
        }), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to submit complaint'}), 500

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    return jsonify(complaints), 200

@app.route('/api/complaints/<int:complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    complaint = next((c for c in complaints if c['id'] == complaint_id), None)
    if not complaint:
        return jsonify({'error': 'Complaint not found'}), 404
    return jsonify(complaint), 200

@app.route('/api/complaints/<int:complaint_id>/status', methods=['PATCH'])
def update_complaint_status(complaint_id):
    try:
        data = request.get_json()
        status = data.get('status', 'Resolved')
        
        complaint = next((c for c in complaints if c['id'] == complaint_id), None)
        if not complaint:
            return jsonify({'error': 'Complaint not found'}), 404

        complaint['status'] = status
        return jsonify(complaint), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update complaint'}), 500

@app.route('/api/work-orders', methods=['GET'])
def get_work_orders():
    return jsonify(work_orders), 200

@app.route('/api/work-orders/<order_id>', methods=['GET'])
def get_work_order(order_id):
    work_order = next((wo for wo in work_orders if wo['orderId'] == order_id), None)
    if not work_order:
        return jsonify({'error': 'Work order not found'}), 404
    return jsonify(work_order), 200

@app.route('/api/work-orders/<order_id>/status', methods=['PATCH'])
def update_work_order_status(order_id):
    try:
        data = request.get_json()
        status = data.get('status', 'In Progress')
        
        work_order = next((wo for wo in work_orders if wo['orderId'] == order_id), None)
        if not work_order:
            return jsonify({'error': 'Work order not found'}), 404

        work_order['status'] = status
        return jsonify(work_order), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update work order'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Server is running'}), 200

if __name__ == '__main__':
    print("🚀 Server starting on http://localhost:5000")
    app.run(debug=True, port=5000)
