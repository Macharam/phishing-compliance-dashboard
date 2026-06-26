// Global Database - Single Source of Truth
let incidents = [
    {
        id: "INC-2026-001",
        subject: "URGENT Password Reset",
        sender: "security@gmail.com",
        domain: "gmail.com",
        risk: "Critical",
        reported: "09:10 AM",
        priority: "P1 - Critical",
        status: "Investigating",
        analyst: "Macharam Deepthi",
        reputation: "12/100 (Untrusted)",
        aiExplanation: "Spearphishing attempt originating from a public webmail domain. The email contains high-urgency directives, and the destination link points to a lookalike authentication portal designed to capture credentials.",
        urls: [
            { link: "https://verification-microsoft.net/login", risk: "Critical" }
        ],
        attachments: [],
        attackChain: { sender: "malicious", gateway: "warning", inbox: "safe", action: "malicious" },
        mitre: [
            { tactic: "Initial Access", technique: "Spearphishing Link (T1566.002)" },
            { tactic: "Credential Access", technique: "Input Capture (T1056)" }
        ],
        timeline: [
            { time: "09:10 AM", desc: "User reported suspicious security reset email", important: true },
            { time: "09:12 AM", desc: "Automated ML sandbox flagged high-risk score (85/100)", important: false },
            { time: "09:15 AM", desc: "Security analyst assigned; console logs loaded", important: false },
            { time: "09:20 AM", desc: "Awaiting analyst confirmation and domain blockade", important: false }
        ]
    },
    {
        id: "INC-2026-002",
        subject: "Payroll Update Request",
        sender: "payroll@company-payroll.com",
        domain: "company-payroll.com",
        risk: "High",
        reported: "08:45 AM",
        priority: "P2 - High",
        status: "Open",
        analyst: "John Smith",
        reputation: "28/100 (Suspicious)",
        aiExplanation: "Financial spoofing payload. The sender domain company-payroll.com is a typosquatted lookalike domain. A macro-enabled spreadsheet has been attached, mimicking an official financial spreadsheet.",
        urls: [
            { link: "http://company-payroll.com/updates-q2", risk: "High" }
        ],
        attachments: [
            { name: "payroll_update_q2.xlsm", risk: "High" }
        ],
        attackChain: { sender: "malicious", gateway: "malicious", inbox: "safe", action: "warning" },
        mitre: [
            { tactic: "Initial Access", technique: "Spearphishing Attachment (T1566.001)" },
            { tactic: "Execution", technique: "User Execution: Malicious File (T1204.002)" }
        ],
        timeline: [
            { time: "08:45 AM", desc: "Email gateway intercepted macro attachment", important: true },
            { time: "08:47 AM", desc: "Sandbox isolated file and identified VBA script calls", important: false },
            { time: "08:52 AM", desc: "Incident categorized as P2 - High Risk spoofer", important: false }
        ]
    },
    {
        id: "INC-2026-003",
        subject: "Q3 Planning Meeting",
        sender: "hr@company.com",
        domain: "company.com",
        risk: "Low",
        reported: "07:30 AM",
        priority: "P4 - Low",
        status: "Resolved",
        analyst: "Sarah Johnson",
        reputation: "98/100 (Safe)",
        aiExplanation: "Legitimate email meeting standard internal authentication parameters. Both SPF, DKIM, and DMARC checks passed cleanly. No threat detected.",
        urls: [
            { link: "https://teams.microsoft.com/j/91283", risk: "Safe" }
        ],
        attachments: [
            { name: "meeting_agenda.pdf", risk: "Safe" }
        ],
        attackChain: { sender: "safe", gateway: "safe", inbox: "safe", action: "safe" },
        mitre: [],
        timeline: [
            { time: "07:30 AM", desc: "Employee reported email using HR template", important: false },
            { time: "07:32 AM", desc: "SPF/DKIM verified sender identity successfully", important: false },
            { time: "07:35 AM", desc: "No indicators found; incident closed as false positive", important: false }
        ]
    },
    {
        id: "INC-2026-004",
        subject: "Microsoft Access Denied",
        sender: "support@microsoft-login.com",
        domain: "microsoft-login.com",
        risk: "Critical",
        reported: "10:05 AM",
        priority: "P1 - Critical",
        status: "Contained",
        analyst: "David Miller",
        reputation: "5/100 (Hostile)",
        aiExplanation: "Severe credential harvesting threat. Directs users to an insecure landing page hosted on a raw IP address and embeds a malicious executable binary disguised as a security update.",
        urls: [
            { link: "http://192.168.4.1/auth/identity", risk: "Critical" }
        ],
        attachments: [
            { name: "update_patch_x64.exe", risk: "Critical" }
        ],
        attackChain: { sender: "malicious", gateway: "malicious", inbox: "warning", action: "malicious" },
        mitre: [
            { tactic: "Initial Access", technique: "Spearphishing Link & Attachment (T1566)" },
            { tactic: "Defense Evasion", technique: "Masquerading (T1036)" }
        ],
        timeline: [
            { time: "10:05 AM", desc: "Multiple users flagged login update request", important: true },
            { time: "10:07 AM", desc: "Gateway detected executable payload attachment", important: false },
            { time: "10:12 AM", desc: "Firewall rule created blocking raw IP: 192.168.4.1", important: false },
            { time: "10:15 AM", desc: "Password reset sequence triggered for targeted users", important: false }
        ]
    },
    {
        id: "INC-2026-005",
        subject: "Amazon Invoice #9182",
        sender: "accounts@amazon-support.co",
        domain: "amazon-support.co",
        risk: "Medium",
        reported: "11:20 AM",
        priority: "P3 - Medium",
        status: "Open",
        analyst: "Emily Clark",
        reputation: "45/100 (Unverified)",
        aiExplanation: "E-commerce impersonation attempt. The sender domain amazon-support.co is unverified. Links redirect via shortened tinyurl targets, prompting users to confirm a fraudulent balance sheet.",
        urls: [
            { link: "http://tinyurl.com/invoice-amazon", risk: "Medium" }
        ],
        attachments: [
            { name: "invoice_9182.pdf", risk: "Medium" }
        ],
        attackChain: { sender: "warning", gateway: "warning", inbox: "safe", action: "warning" },
        mitre: [
            { tactic: "Initial Access", technique: "Spearphishing Link (T1566.002)" },
            { tactic: "Obfuscation", technique: "Obfuscated Files or Information (T1027)" }
        ],
        timeline: [
            { time: "11:20 AM", desc: "Spam trap caught unverified Amazon billing email", important: true },
            { time: "11:22 AM", desc: "URL analysis flagged redirect shortening domain", important: false },
            { time: "11:25 AM", desc: "Assigned for manual analyst inspection", important: false }
        ]
    }
];

// Dashboard KPI metrics configuration
let dashboardStats = [
    { title: "Total Employees", value: "248", icon: "users", trend: "0.0%", trendType: "neutral" },
    { title: "Active Threats", value: "12", icon: "shield-alert", trend: "+4% from yesterday", trendType: "negative" },
    { title: "Compliance Score", value: "96%", icon: "shield-check", trend: "+0.8% this week", trendType: "positive" },
    { title: "Training Completion", value: "87%", icon: "graduation-cap", trend: "+1.2% this month", trendType: "positive" },
    { title: "Resolved Incidents", value: "145", icon: "check-circle", trend: "+12 since Monday", trendType: "positive" }
];

let activeFilterRisk = "All";
let activeSearchQuery = "";
let currentSortColumn = "";
let currentSortOrder = "asc"; // "asc" or "desc"

function loadDashboard() {
    const content = document.getElementById("content");
    if (!content) return;

    // Build KPI Cards
    let kpiHTML = "";
    dashboardStats.forEach(stat => {
        const trendClass = stat.trendType === "positive" ? "positive" : stat.trendType === "negative" ? "negative" : "";
        const trendIcon = stat.trendType === "positive" ? "↑" : stat.trendType === "negative" ? "↓" : "→";

        kpiHTML += `
            <div class="card kpi-card">
                <div class="card-title">
                    <span>${stat.title}</span>
                    <div class="kpi-icon">
                        <i data-lucide="${stat.icon}"></i>
                    </div>
                </div>
                <div class="kpi-content">
                    <span class="kpi-value">${stat.value}</span>
                    <span class="kpi-trend ${trendClass}">
                        <span>${trendIcon}</span> ${stat.trend}
                    </span>
                </div>
            </div>
        `;
    });

    // Main Dashboard Skeleton
    content.innerHTML = `
        <div class="page-header">
            <div class="page-header-info">
                <h1>Security Compliance Console</h1>
                <p>Monitor phishing incidents, platform compliance posture, and real-time security operations.</p>
            </div>
            <div class="soc-status-badge">
                <span class="soc-status-pulse"></span>
                <span>SOC STATUS: ACTIVE & OPERATIONAL</span>
            </div>
        </div>

        <!-- KPI Grid -->
        <div class="cards-grid-kpi">
            ${kpiHTML}
        </div>

        <!-- Chart Layout Grid -->
        <div class="dashboard-grid-main">
            <div class="card chart-container-card">
                <div class="chart-header">
                    <span style="font-size: 15px; font-weight: 600;">📈 Threat Timeline Trend</span>
                    <span style="font-size: 12px; color: var(--text-secondary);">Last 7 Days</span>
                </div>
                <div class="chart-body">
                    <canvas id="threatChart"></canvas>
                </div>
            </div>

            <div class="card chart-container-card">
                <div class="chart-header">
                    <span style="font-size: 15px; font-weight: 600;">🛡️ Email Severity Distribution</span>
                    <span style="font-size: 12px; color: var(--text-secondary);">Active threats</span>
                </div>
                <div class="chart-body">
                    <canvas id="pieChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Extra AI / Health Cards Row -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px;">
            <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 20px;">
                <div>
                    <h4 style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase;">Detection System Accuracy</h4>
                    <h2 style="font-size: 26px; font-weight: 700; margin-top: 4px; color: var(--success);">99.8%</h2>
                    <p style="font-size: 11px; color: var(--muted-color); margin-top: 2px;">Cross-checks domain, SPF, and headers</p>
                </div>
                <!-- Circular Mini Indicator -->
                <div style="position: relative; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                    <svg width="60" height="60" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--success)" stroke-width="3" stroke-dasharray="99.8, 100" />
                    </svg>
                    <i data-lucide="crosshair" style="position: absolute; width: 20px; height: 20px; color: var(--success);"></i>
                </div>
            </div>
            
            <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 20px;">
                <div>
                    <h4 style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase;">Threat Score</h4>
                    <h2 style="font-size: 26px; font-weight: 700; margin-top: 4px; color: var(--warning);">24 / 100</h2>
                    <p style="font-size: 11px; color: var(--muted-color); margin-top: 2px;">Elevated active incident levels</p>
                </div>
                <!-- Circular Mini Indicator -->
                <div style="position: relative; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                    <svg width="60" height="60" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--warning)" stroke-width="3" stroke-dasharray="24, 100" />
                    </svg>
                    <i data-lucide="shield-alert" style="position: absolute; width: 20px; height: 20px; color: var(--warning);"></i>
                </div>
            </div>

            <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 20px;">
                <div>
                    <h4 style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase;">Model Confidence Avg</h4>
                    <h2 style="font-size: 26px; font-weight: 700; margin-top: 4px; color: var(--primary);">94.2%</h2>
                    <p style="font-size: 11px; color: var(--muted-color); margin-top: 2px;">AI Model classification reliability</p>
                </div>
                <!-- Circular Mini Indicator -->
                <div style="position: relative; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                    <svg width="60" height="60" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" stroke-width="3" stroke-dasharray="94.2, 100" />
                    </svg>
                    <i data-lucide="cpu" style="position: absolute; width: 20px; height: 20px; color: var(--primary);"></i>
                </div>
            </div>
        </div>

        <!-- Recent Incidents Table View -->
        <div class="table-card">
            <div class="table-header-toolbar">
                <span class="table-title">Recent Security Incidents</span>
                <div class="table-filters">
                    <!-- Search Input -->
                    <input type="text" id="tableSearch" class="search-bar" style="width: 220px; height: 32px; padding-left: 12px; margin-right: 8px;" placeholder="Search sender..." value="${activeSearchQuery}">
                    <!-- Filter Select -->
                    <select id="tableFilterRisk" class="workspace-select" style="height: 32px; font-size:12px; padding: 0 24px 0 8px;">
                        <option value="All" ${activeFilterRisk === "All" ? "selected" : ""}>Risk: All</option>
                        <option value="Critical" ${activeFilterRisk === "Critical" ? "selected" : ""}>Critical</option>
                        <option value="High" ${activeFilterRisk === "High" ? "selected" : ""}>High</option>
                        <option value="Medium" ${activeFilterRisk === "Medium" ? "selected" : ""}>Medium</option>
                        <option value="Low" ${activeFilterRisk === "Low" ? "selected" : ""}>Low</option>
                    </select>
                </div>
            </div>

            <div class="table-wrapper">
                <table id="incidentDashboardTable">
                    <thead>
                        <tr>
                            <th class="sortable-th" data-column="id">ID <span class="sort-icon" id="sort-id">↕</span></th>
                            <th class="sortable-th" data-column="sender">Sender <span class="sort-icon" id="sort-sender">↕</span></th>
                            <th class="sortable-th" data-column="subject">Subject <span class="sort-icon" id="sort-subject">↕</span></th>
                            <th class="sortable-th" data-column="date">Date <span class="sort-icon" id="sort-date">↕</span></th>
                            <th class="sortable-th" data-column="risk">Risk <span class="sort-icon" id="sort-risk">↕</span></th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="dashboardTableBody">
                        <!-- Filled by renderIncidentTable() -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Initialize Event Listeners
    initDashboardTableListeners();
    // Render the rows
    renderIncidentTable();
    // Initialize charts
    createCharts();
    // Refresh icons inside dynamically loaded content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Interactive Table Render Engine
function renderIncidentTable() {
    const tableBody = document.getElementById("dashboardTableBody");
    if (!tableBody) return;

    // Filter logic
    let filteredIncidents = incidents.filter(inc => {
        const matchesRisk = activeFilterRisk === "All" || inc.risk === activeFilterRisk;
        const matchesSearch = inc.sender.toLowerCase().includes(activeSearchQuery.toLowerCase());
        return matchesRisk && matchesSearch;
    });

    // Sort logic
    if (currentSortColumn) {
        filteredIncidents.sort((a, b) => {
            let valA = a[currentSortColumn].toString().toLowerCase();
            let valB = b[currentSortColumn].toString().toLowerCase();
            
            if (valA < valB) return currentSortOrder === "asc" ? -1 : 1;
            if (valA > valB) return currentSortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }

    if (filteredIncidents.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 24px;">
                    No security incidents matched the active query filters.
                </td>
            </tr>
        `;
        return;
    }

    let rowsHTML = "";
    filteredIncidents.forEach(inc => {
        const riskClass = inc.risk.toLowerCase();
        rowsHTML += `
            <tr style="cursor: pointer;" onclick="viewIncidentInvestigation('${inc.id}')">
                <td style="font-weight: 600; color: var(--primary);">${inc.id}</td>
                <td>${inc.sender}</td>
                <td>${inc.subject || 'No Subject Provided'}</td>
                <td style="color: var(--text-secondary);">${inc.date}</td>
                <td>
                    <span class="badge ${riskClass}">
                        ${inc.risk}
                    </span>
                </td>
                <td>
                    <span class="status-pill">${inc.status}</span>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = rowsHTML;
}

// Redirects analyst directly to the investigation workspace with the selected incident
window.viewIncidentInvestigation = function(incidentId) {
    const incidentIndex = incidents.findIndex(inc => inc.id === incidentId);
    if (incidentIndex !== -1) {
        localStorage.setItem("selectedIncidentIndex", incidentIndex);
    }
    
    // Switch to investigation page
    const navBtn = document.querySelector('.nav-btn[data-page="investigation"]');
    if (navBtn) {
        navBtn.click();
    }
};

function initDashboardTableListeners() {
    // Search listener
    const searchInput = document.getElementById("tableSearch");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            activeSearchQuery = e.target.value;
            renderIncidentTable();
        });
    }

    // Filter listener
    const filterSelect = document.getElementById("tableFilterRisk");
    if (filterSelect) {
        filterSelect.addEventListener("change", (e) => {
            activeFilterRisk = e.target.value;
            renderIncidentTable();
        });
    }

    // Column sorting listeners
    document.querySelectorAll(".sortable-th").forEach(th => {
        th.addEventListener("click", () => {
            const column = th.dataset.column;
            
            // Toggle order
            if (currentSortColumn === column) {
                currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
            } else {
                currentSortColumn = column;
                currentSortOrder = "asc";
            }

            // Update Sort UI indicators
            document.querySelectorAll(".sort-icon").forEach(icon => icon.innerText = "↕");
            const activeIndicator = document.getElementById(`sort-${column}`);
            if (activeIndicator) {
                activeIndicator.innerText = currentSortOrder === "asc" ? "▲" : "▼";
            }

            renderIncidentTable();
        });
    });
}

// =========================================
// Dark Themed Chart.js Configurations
// =========================================
function createCharts() {
    const threatCanvas = document.getElementById("threatChart");
    const pieCanvas = document.getElementById("pieChart");

    if (!threatCanvas || !pieCanvas) return;

    const threatCtx = threatCanvas.getContext("2d");
    const pieCtx = pieCanvas.getContext("2d");

    // Global Font Settings
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = "#94A3B8";

    // Chart 1: Threat Trend Area Chart
    const blueGradient = threatCtx.createLinearGradient(0, 0, 0, 220);
    blueGradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
    blueGradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");

    new Chart(threatCtx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Threat Index",
                data: [4, 8, 5, 12, 9, 7, 10],
                borderColor: "#3B82F6",
                borderWidth: 2,
                backgroundColor: blueGradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#3b82f6",
                pointHoverRadius: 6,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: "rgba(255, 255, 255, 0.03)" },
                    ticks: { color: "#64748B" }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "rgba(255, 255, 255, 0.03)" },
                    ticks: { color: "#64748B", stepSize: 3 }
                }
            }
        }
    });

    // Chart 2: Threat Distribution Doughnut
    new Chart(pieCtx, {
        type: "doughnut",
        data: {
            labels: ["Critical", "High", "Medium", "Low"],
            datasets: [{
                data: [10, 15, 8, 5],
                backgroundColor: [
                    "#EF4444", // Critical
                    "#F97316", // High
                    "#F59E0B", // Medium
                    "#10B981"  // Low
                ],
                borderWidth: 2,
                borderColor: "#1E293B"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        color: "#94A3B8",
                        padding: 15,
                        boxWidth: 8,
                        boxHeight: 8,
                        usePointStyle: true
                    }
                }
            },
            cutout: "75%"
        }
    });
}