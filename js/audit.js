// Read existing logs or fallback
let auditLogs = JSON.parse(localStorage.getItem("auditLogs")) || [];

// Adds record to local database & triggers repaint
function addAuditLog(action, status) {
    const now = new Date();
    const localTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const log = {
        time: localTime,
        analyst: "Macharam Deepthi",
        action: action,
        status: status
    };

    auditLogs.unshift(log); // Prepend new logs to show latest first
    localStorage.setItem("auditLogs", JSON.stringify(auditLogs));

    renderAuditLogs();
}

// Renders compact audit list for SOC workbench
function renderAuditLogs() {
    const logContainer = document.getElementById("actionLog");
    if (!logContainer) return;

    if (auditLogs.length === 0) {
        logContainer.innerHTML = `
            <div style="text-align: center; color: var(--muted-color); font-size: 11px; padding: 20px 0;">
                No audit entries recorded for this case session.
            </div>
        `;
        return;
    }

    let html = "";
    auditLogs.forEach(log => {
        html += `
            <div class="audit-compact-card" style="margin-bottom: 8px; padding: 10px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span style="color: var(--text-secondary); font-weight: 500;">🕒 ${log.time}</span>
                    <span style="color: var(--success); font-weight: 600;">${log.status}</span>
                </div>
                <div style="font-weight: 500; font-size: 12px; color: var(--text-primary); margin-bottom: 2px;">
                    ${log.action}
                </div>
                <div style="font-size: 10px; color: var(--muted-color); font-weight: 500;">
                    Analyst: ${log.analyst}
                </div>
            </div>
        `;
    });

    logContainer.innerHTML = html;
}

// Clear logs sequence
function clearAuditLogs() {
    if (confirm("Permanently purge all session action log audits? This cannot be undone.")) {
        auditLogs = [];
        localStorage.removeItem("auditLogs");
        renderAuditLogs();
    }
}