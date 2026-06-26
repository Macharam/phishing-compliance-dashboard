from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import json
import re
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

DATA_DIR = 'data'
INCIDENTS_FILE = os.path.join(DATA_DIR, 'incidents.json')
COMPLIANCE_FILE = os.path.join(DATA_DIR, 'compliance.json')
STATS_FILE = os.path.join(DATA_DIR, 'stats.json')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Initial Mock Data (used if JSON files are empty or missing)
INITIAL_INCIDENTS = [
    {
        "id": "INC-2026-001",
        "subject": "URGENT Password Reset",
        "sender": "security@gmail.com",
        "domain": "gmail.com",
        "risk": "Critical",
        "reported": "09:10 AM",
        "priority": "P1 - Critical",
        "status": "Investigating",
        "analyst": "Macharam Deepthi",
        "reputation": "12/100 (Untrusted)",
        "aiExplanation": "Spearphishing attempt originating from a public webmail domain. The email contains high-urgency directives, and the destination link points to a lookalike authentication portal designed to capture credentials.",
        "urls": [
            { "link": "https://verification-microsoft.net/login", "risk": "Critical" }
        ],
        "attachments": [],
        "attackChain": { "sender": "malicious", "gateway": "warning", "inbox": "safe", "action": "malicious" },
        "mitre": [
            { "tactic": "Initial Access", "technique": "Spearphishing Link (T1566.002)" },
            { "tactic": "Credential Access", "technique": "Input Capture (T1056)" }
        ],
        "timeline": [
            { "time": "09:10 AM", "desc": "User reported suspicious security reset email", "important": True },
            { "time": "09:12 AM", "desc": "Automated ML sandbox flagged high-risk score (85/100)", "important": False },
            { "time": "09:15 AM", "desc": "Security analyst assigned; console logs loaded", "important": False },
            { "time": "09:20 AM", "desc": "Awaiting analyst confirmation and domain blockade", "important": False }
        ]
    },
    {
        "id": "INC-2026-002",
        "subject": "Payroll Update Request",
        "sender": "payroll@company-payroll.com",
        "domain": "company-payroll.com",
        "risk": "High",
        "reported": "08:45 AM",
        "priority": "P2 - High",
        "status": "Open",
        "analyst": "John Smith",
        "reputation": "28/100 (Suspicious)",
        "aiExplanation": "Financial spoofing payload. The sender domain company-payroll.com is a typosquatted lookalike domain. A macro-enabled spreadsheet has been attached, mimicking an official financial spreadsheet.",
        "urls": [
            { "link": "http://company-payroll.com/updates-q2", "risk": "High" }
        ],
        "attachments": [
            { "name": "payroll_update_q2.xlsm", "risk": "High" }
        ],
        "attackChain": { "sender": "malicious", "gateway": "malicious", "inbox": "safe", "action": "warning" },
        "mitre": [
            { "tactic": "Initial Access", "technique": "Spearphishing Attachment (T1566.001)" },
            { "tactic": "Execution", "technique": "User Execution: Malicious File (T1204.002)" }
        ],
        "timeline": [
            { "time": "08:45 AM", "desc": "Email gateway intercepted macro attachment", "important": True },
            { "time": "08:47 AM", "desc": "Sandbox isolated file and identified VBA script calls", "important": False },
            { "time": "08:52 AM", "desc": "Incident categorized as P2 - High Risk spoofer", "important": False }
        ]
    },
    {
        "id": "INC-2026-003",
        "subject": "Q3 Planning Meeting",
        "sender": "hr@company.com",
        "domain": "company.com",
        "risk": "Low",
        "reported": "07:30 AM",
        "priority": "P4 - Low",
        "status": "Resolved",
        "analyst": "Sarah Johnson",
        "reputation": "98/100 (Safe)",
        "aiExplanation": "Legitimate email meeting standard internal authentication parameters. Both SPF, DKIM, and DMARC checks passed cleanly. No threat detected.",
        "urls": [
            { "link": "https://teams.microsoft.com/j/91283", "risk": "Safe" }
        ],
        "attachments": [
            { "name": "meeting_agenda.pdf", "risk": "Safe" }
        ],
        "attackChain": { "sender": "safe", "gateway": "safe", "inbox": "safe", "action": "safe" },
        "mitre": [],
        "timeline": [
            { "time": "07:30 AM", "desc": "Employee reported email using HR template", "important": False },
            { "time": "07:32 AM", "desc": "SPF/DKIM verified sender identity successfully", "important": False },
            { "time": "07:35 AM", "desc": "No indicators found; incident closed as false positive", "important": False }
        ]
    },
    {
        "id": "INC-2026-004",
        "subject": "Microsoft Access Denied",
        "sender": "support@microsoft-login.com",
        "domain": "microsoft-login.com",
        "risk": "Critical",
        "reported": "10:05 AM",
        "priority": "P1 - Critical",
        "status": "Contained",
        "analyst": "David Miller",
        "reputation": "5/100 (Hostile)",
        "aiExplanation": "Severe credential harvesting threat. Directs users to an insecure landing page hosted on a raw IP address and embeds a malicious executable binary disguised as a security update.",
        "urls": [
            { "link": "http://192.168.4.1/auth/identity", "risk": "Critical" }
        ],
        "attachments": [
            { "name": "update_patch_x64.exe", "risk": "Critical" }
        ],
        "attackChain": { "sender": "malicious", "gateway": "malicious", "inbox": "warning", "action": "malicious" },
        "mitre": [
            { "tactic": "Initial Access", "technique": "Spearphishing Link & Attachment (T1566)" },
            { "tactic": "Defense Evasion", "technique": "Masquerading (T1036)" }
        ],
        "timeline": [
            { "time": "10:05 AM", "desc": "Multiple users flagged login update request", "important": True },
            { "time": "10:07 AM", "desc": "Gateway detected executable payload attachment", "important": False },
            { "time": "10:12 AM", "desc": "Firewall rule created blocking raw IP: 192.168.4.1", "important": False },
            { "time": "10:15 AM", "desc": "Password reset sequence triggered for targeted users", "important": False }
        ]
    },
    {
        "id": "INC-2026-005",
        "subject": "Amazon Invoice #9182",
        "sender": "accounts@amazon-support.co",
        "domain": "amazon-support.co",
        "risk": "Medium",
        "reported": "11:20 AM",
        "priority": "P3 - Medium",
        "status": "Open",
        "analyst": "Emily Clark",
        "reputation": "45/100 (Unverified)",
        "aiExplanation": "E-commerce impersonation attempt. The sender domain amazon-support.co is unverified. Links redirect via shortened tinyurl targets, prompting users to confirm a fraudulent balance sheet.",
        "urls": [
            { "link": "http://tinyurl.com/invoice-amazon", "risk": "Medium" }
        ],
        "attachments": [
            { "name": "invoice_9182.pdf", "risk": "Medium" }
        ],
        "attackChain": { "sender": "warning", "gateway": "warning", "inbox": "safe", "action": "warning" },
        "mitre": [
            { "tactic": "Initial Access", "technique": "Spearphishing Link (T1566.002)" },
            { "tactic": "Obfuscation", "technique": "Obfuscated Files or Information (T1027)" }
        ],
        "timeline": [
            { "time": "11:20 AM", "desc": "Spam trap caught unverified Amazon billing email", "important": True },
            { "time": "11:22 AM", "desc": "URL analysis flagged redirect shortening domain", "important": False },
            { "time": "11:25 AM", "desc": "Assigned for manual analyst inspection", "important": False }
        ]
    }
]

INITIAL_COMPLIANCE = [
    {
        "name": "ISO 27001",
        "score": 96,
        "status": "Compliant",
        "color": "var(--success)"
    },
    {
        "name": "SOC 2 Type II",
        "score": 88,
        "status": "Needs Review",
        "color": "var(--warning)"
    },
    {
        "name": "NIST CSF v2.0",
        "score": 91,
        "status": "Compliant",
        "color": "var(--success)"
    },
    {
        "name": "CIS Critical Controls",
        "score": 82,
        "status": "Improvement Required",
        "color": "var(--critical)"
    }
]

INITIAL_STATS = {
    "default": [
        { "title": "Total Employees", "value": "248", "icon": "users", "trend": "0.0%", "trendType": "neutral" },
        { "title": "Active Threats", "value": "12", "icon": "shield-alert", "trend": "+4% from yesterday", "trendType": "negative" },
        { "title": "Compliance Score", "value": "96%", "icon": "shield-check", "trend": "+0.8% this week", "trendType": "positive" },
        { "title": "Training Completion", "value": "87%", "icon": "graduation-cap", "trend": "+1.2% this month", "trendType": "positive" },
        { "title": "Resolved Incidents", "value": "145", "icon": "check-circle", "trend": "+12 since Monday", "trendType": "positive" }
    ],
    "staging": [
        { "title": "Total Employees", "value": "45", "icon": "users", "trend": "0.0%", "trendType": "neutral" },
        { "title": "Active Threats", "value": "3", "icon": "shield-alert", "trend": "-1 from yesterday", "trendType": "positive" },
        { "title": "Compliance Score", "value": "98%", "icon": "shield-check", "trend": "+1.2% this week", "trendType": "positive" },
        { "title": "Training Completion", "value": "87%", "icon": "graduation-cap", "trend": "+1.2% this month", "trendType": "positive" },
        { "title": "Resolved Incidents", "value": "145", "icon": "check-circle", "trend": "+12 since Monday", "trendType": "positive" }
    ],
    "emea": [
        { "title": "Total Employees", "value": "850", "icon": "users", "trend": "0.0%", "trendType": "neutral" },
        { "title": "Active Threats", "value": "29", "icon": "shield-alert", "trend": "+8 from yesterday", "trendType": "negative" },
        { "title": "Compliance Score", "value": "94%", "icon": "shield-check", "trend": "-0.5% this week", "trendType": "negative" },
        { "title": "Training Completion", "value": "87%", "icon": "graduation-cap", "trend": "+1.2% this month", "trendType": "positive" },
        { "title": "Resolved Incidents", "value": "145", "icon": "check-circle", "trend": "+12 since Monday", "trendType": "positive" }
    ]
}

# Load data helper functions
def load_json(filepath, default_value):
    if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(default_value, f, indent=4)
        return default_value
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return default_value

def save_json(filepath, data):
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving to {filepath}: {e}")
        return False

# Serve landing page
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# Endpoints
@app.route('/api/incidents', methods=['GET', 'POST'])
def api_incidents():
    incidents = load_json(INCIDENTS_FILE, INITIAL_INCIDENTS)
    if request.method == 'POST':
        new_case = request.json
        if not new_case:
            return jsonify({"error": "Invalid incident data"}), 400
        
        # Ensure sequential ID generation if backend manages it
        new_case["id"] = f"INC-2026-00{len(incidents) + 1}"
        
        incidents.insert(0, new_case) # Prepend
        save_json(INCIDENTS_FILE, incidents)
        return jsonify(new_case), 201
    
    return jsonify(incidents)

@app.route('/api/stats', methods=['GET'])
def api_stats():
    workspace = request.args.get('workspace', 'default')
    stats_data = load_json(STATS_FILE, INITIAL_STATS)
    
    # Return stats for the specific workspace, fall back to default
    workspace_stats = stats_data.get(workspace, stats_data.get('default'))
    return jsonify(workspace_stats)

@app.route('/api/compliance', methods=['GET'])
def api_compliance():
    compliance_frameworks = load_json(COMPLIANCE_FILE, INITIAL_COMPLIANCE)
    return jsonify(compliance_frameworks)

@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    data = request.json or {}
    subject = data.get('subject', '').lower()
    sender = data.get('sender', '').lower()
    body = data.get('body', '').lower()
    links = data.get('links', '').lower()

    score = 0
    reasons = []

    if "@gmail.com" in sender or "@yahoo.com" in sender or "@outlook.com" in sender:
        score += 20
        reasons.append("Public Webmail Provider Domain")
    if "urgent" in subject or "immediately" in subject or "verify" in subject:
        score += 20
        reasons.append("Urgent or Coercive Language Pattern")
    if "password" in body or "login" in body or "verify account" in body:
        score += 20
        reasons.append("Sensitive Credential/Authentication Request")
    if "http://" in links:
        score += 15
        reasons.append("Insecure Plaintext HTTP Link Connection")
    
    # URL shortening platforms check
    shorteners = ["bit.ly", "tinyurl", "t.co"]
    if any(s in links for s in shorteners):
        score += 15
        reasons.append("Obfuscated or Shortened URL Pattern")
        
    # Brand spoofing domain checks
    brands = ["micr0soft", "paypa1", "amaz0n"]
    if any(b in sender for b in brands):
        score += 25
        reasons.append("Lookalike Typosquatting Brand Domain")
        
    # Raw IP check
    ip_regex = r"\b\d{1,3}(\.\d{1,3}){3}\b"
    if re.search(ip_regex, links):
        score += 20
        reasons.append("Raw IP Address Destination Pattern")
        
    # Attachment check
    attachment_keywords = [".exe", ".zip", ".rar", ".bat", ".scr", ".js", ".vbs"]
    for ext in attachment_keywords:
        if ext in body:
            score += 20
            reasons.append(f"Suspicious File extension payload ({ext})")
            
    # Banking references
    banking_words = ["bank", "credit card", "debit card", "payment", "invoice", "transaction"]
    for word in banking_words:
        if word in body:
            score += 15
            reasons.append(f"Banking reference keyword ({word})")
            
    # Crypto keywords
    crypto_words = ["bitcoin", "ethereum", "crypto", "wallet", "binance"]
    for word in crypto_words:
        if word in body:
            score += 15
            reasons.append(f"Cryptocurrency asset keyword ({word})")
            
    # Threat words
    threat_words = ["suspended", "terminated", "locked", "blocked", "disabled"]
    for word in threat_words:
        if word in subject or word in body:
            score += 15
            reasons.append(f"Threat escalation keyword ({word})")
            
    # Login words
    login_words = ["login", "sign in", "authenticate", "verification"]
    for word in login_words:
        if word in body:
            score += 10
            reasons.append(f"Access portal login word ({word})")

    if score == 0:
        reasons.append("No obvious indicators identified.")
    if score > 100:
        score = 100

    # Let's generate a premium AI explanation on the backend dynamically based on reasons!
    if score > 70:
        ai_explanation = f"High-risk threat vector detected. Heuristics identified critical indicators: {', '.join(reasons[:2])}. Immediate analyst intervention is recommended to quarantine the sender and block destination URIs."
    elif score > 30:
        ai_explanation = f"Medium-risk suspicious email flag. Key indicators: {', '.join(reasons[:2])}. Suggest monitoring domain behavior and performing user awareness verification."
    else:
        ai_explanation = "Low-risk classification. Standard metadata signatures verify clean parameters. No malicious heuristics observed."

    return jsonify({
        "score": score,
        "reasons": reasons,
        "aiExplanation": ai_explanation
    })

# Serve other static files in workspace directory
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    # Initialize JSON files with defaults on startup
    load_json(INCIDENTS_FILE, INITIAL_INCIDENTS)
    load_json(COMPLIANCE_FILE, INITIAL_COMPLIANCE)
    load_json(STATS_FILE, INITIAL_STATS)
    
    print("--------------------------------------------------")
    print("PhishGuard Security Dashboard Backend Running...")
    print("URL: http://127.0.0.1:5000")
    print("--------------------------------------------------")
    app.run(host='127.0.0.1', port=5000, debug=True)
