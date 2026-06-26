function loadCompliance() {
    const content = document.getElementById("content");
    if (!content) return;

    const API_BASE = window.location.protocol === 'file:' ? 'http://127.0.0.1:5000' : '';
    
    fetch(`${API_BASE}/api/compliance`)
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(frameworks => {
            renderCompliancePage(frameworks);
        })
        .catch(err => {
            console.warn("Falling back to local compliance data due to fetch error:", err);
            const fallbackFrameworks = [
                {
                    name: "ISO 27001",
                    score: 96,
                    status: "Compliant",
                    color: "var(--success)"
                },
                {
                    name: "SOC 2 Type II",
                    score: 88,
                    status: "Needs Review",
                    color: "var(--warning)"
                },
                {
                    name: "NIST CSF v2.0",
                    score: 91,
                    status: "Compliant",
                    color: "var(--success)"
                },
                {
                    name: "CIS Critical Controls",
                    score: 82,
                    status: "Improvement Required",
                    color: "var(--critical)"
                }
            ];
            renderCompliancePage(fallbackFrameworks);
        });
}

function renderCompliancePage(frameworks) {
    const content = document.getElementById("content");
    if (!content) return;

    // Calculate average score dynamically
    let totalScore = 0;
    frameworks.forEach(f => totalScore += f.score);
    const averageScore = frameworks.length > 0 ? Math.round(totalScore / frameworks.length) : 0;

    let frameworkHTML = "";
    frameworks.forEach(item => {
        const badgeClass = item.status === "Compliant" ? "badge-low" : item.status === "Needs Review" ? "badge-medium" : "badge-critical";
        
        frameworkHTML += `
            <div class="card compliance-meter-card">
                <div class="card-title">
                    <span>${item.name}</span>
                    <span class="badge ${badgeClass}" style="font-size: 11px;">${item.status}</span>
                </div>
                
                <div class="compliance-bar-widget">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">
                        <span>Security Controls Met</span>
                        <strong style="color: var(--text-primary);">${item.score}%</strong>
                    </div>
                    <div class="compliance-progress-wrapper">
                        <div class="compliance-progress-fill" style="width: ${item.score}%; background-color: ${item.color || 'var(--primary)'};"></div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--muted-color); border-top: 1px solid var(--border-color); padding-top: 8px;">
                    <span>Scope: Global Tenant</span>
                    <span>Audited: June 2026</span>
                </div>
            </div>
        `;
    });

    content.innerHTML = `
        <div class="page-header">
            <div class="page-header-info">
                <h1>🛡️ Compliance & Posture Governance</h1>
                <p>Track security framework controls mapping, internal audits metrics, and corporate policy compliance.</p>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 2.2fr; gap: 16px; margin-bottom: 24px; align-items: start;">
            <!-- Overall Score Circle Gauge -->
            <div class="card" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 255px;">
                <span class="ioc-title" style="margin-bottom: 16px;">Overall Compliance Position</span>
                
                <!-- Large Circular SVG Gauge -->
                <div style="position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                    <svg width="120" height="120" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="2.5" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-dasharray="${averageScore}, 100" />
                    </svg>
                    <div style="position: absolute; text-align: center;">
                        <span style="font-size: 26px; font-weight: 700; color: var(--text-primary); letter-spacing: -1px;">${averageScore}%</span>
                        <span style="display: block; font-size: 9px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; margin-top:-4px;">Secure</span>
                    </div>
                </div>

                <span style="font-size: 12px; color: var(--text-secondary); font-weight: 500;">Average platform posture score</span>
            </div>

            <!-- Historical Auditing Details -->
            <div class="card" style="min-height: 255px;">
                <span class="ioc-title" style="display: block; margin-bottom: 12px;">Regulatory Audit Summary</span>
                
                <table class="metadata-table-details" style="margin: 0; font-size: 14px;">
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <th style="padding: 10px 0;">Last Assessment Conducted</th>
                        <td style="padding: 10px 0; text-align: right; font-weight: 600;">15-Jun-2026</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <th style="padding: 10px 0;">Next Scheduled Assessment</th>
                        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: var(--primary);">15-Dec-2026</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <th style="padding: 10px 0;">Active Open Audit Findings</th>
                        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: var(--warning);">4 Actionable Findings</td>
                    </tr>
                    <tr>
                        <th style="padding: 10px 0;">Mitigated/Resolved Findings</th>
                        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: var(--success);">28 Remediated Controls</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Framework Modules Grid -->
        <span class="ioc-title" style="display: block; margin-bottom: 12px;">Active Compliance Frameworks</span>
        <div class="compliance-frameworks-grid">
            ${frameworkHTML}
        </div>
    `;

    // Refresh icons inside dynamically loaded content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}