function loadInvestigation() {
    const content = document.getElementById("content");
    if (!content) return;

    // Check if the dashboard redirected to a specific incident index
    let activeIndex = localStorage.getItem("selectedIncidentIndex");
    if (activeIndex === null) {
        activeIndex = "0";
    } else {
        localStorage.removeItem("selectedIncidentIndex");
    }

    // Build options list for selects
    let selectOptionsHTML = "";
    incidents.forEach((inc, idx) => {
        selectOptionsHTML += `<option value="${idx}" ${idx.toString() === activeIndex ? "selected" : ""}>${inc.id} - ${inc.risk}</option>`;
    });

    content.innerHTML = `
        <div class="investigation-workbench">
            
            <!-- LEFT PANEL: Incident Details & Metadata -->
            <div class="workbench-panel">
                <div class="panel-header">
                    <span>Incident Metadata</span>
                    <i data-lucide="info" style="width: 16px; height: 16px; color: var(--text-secondary);"></i>
                </div>
                <div class="panel-body">
                    <div class="form-group" style="margin-bottom: 16px;">
                        <label for="incidentSelect">Select Target Case</label>
                        <select id="incidentSelect" onchange="changeIncident()">
                            ${selectOptionsHTML}
                        </select>
                    </div>

                    <!-- Metadata Table Grid -->
                    <table class="metadata-table-details">
                        <tr>
                            <th>Subject</th>
                            <td id="subjectValue">Loading...</td>
                        </tr>
                        <tr>
                            <th>Sender</th>
                            <td id="senderValue">Loading...</td>
                        </tr>
                        <tr>
                            <th>Domain</th>
                            <td id="domainValue">Loading...</td>
                        </tr>
                        <tr>
                            <th>Reputation</th>
                            <td id="reputationValue" style="color: var(--warning); font-weight:600;">Loading...</td>
                        </tr>
                        <tr>
                            <th>Risk Score</th>
                            <td id="riskValue">Loading...</td>
                        </tr>
                        <tr>
                            <th>Reported</th>
                            <td id="reportedValue" style="color: var(--text-secondary);">Loading...</td>
                        </tr>
                    </table>
                    <div class="ai-insights-block">
                        <strong><i data-lucide="sparkles" style="width: 12px; height: 12px; display: inline; vertical-align: middle; margin-right: 4px;"></i>AI COPILOT ANALYSIS</strong>
                        <span id="aiExplanationText">Compiling neural heuristic reports...</span>
                    </div>
                    <div class="ioc-section">
                        <div class="ioc-title">Scanned Destination Links</div>
                        <div class="ioc-list" id="extractedUrlsList">
                        </div>
                    </div>
                    <div class="ioc-section" style="margin-top: 16px;">
                        <div class="ioc-title">Extracted Files</div>
                        <div class="ioc-list" id="extractedAttachmentsList">
                            <!-- Filled dynamically -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="workbench-panel">
                <div class="panel-header">
                    <span>Visual Attack chain & Timeline</span>
                    <i data-lucide="git-branch" style="width: 16px; height: 16px; color: var(--text-secondary);"></i>
                </div>
                <div class="panel-body">
                                        <div class="attack-chain-container">
                        <div class="attack-chain-title">Attack Chain Propagation</div>
                        <div class="chain-flow" id="attackChainMap">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                    <div class="mitre-section">
                        <div class="ioc-title">MITRE ATT&CK Mapping</div>
                        <div class="mitre-grid" id="mitreTtpGrid">
                            <!-- Filled dynamically -->
                        </div>
                    </div>
                    <div class="workbench-timeline">
                        <div class="ioc-title">Incident Event Timeline</div>
                        <ul class="workbench-timeline-list" id="incidentTimelineList">
                            <!-- Filled dynamically -->
                        </ul>
                    </div>
                </div>
            </div>
            <div class="workbench-panel">
                <div class="panel-header">
                    <span>Response center</span>
                    <i data-lucide="shield" style="width: 16px; height: 16px; color: var(--text-secondary);"></i>
                </div>
                <div class="workbench-header-controls">
                    <div class="workbench-select-group">
                        <label for="priority">Priority</label>
                        <select id="priority">
                            <option>P1 - Critical</option>
                            <option>P2 - High</option>
                            <option>P3 - Medium</option>
                            <option>P4 - Low</option>
                        </select>
                    </div>
                    <div class="workbench-select-group">
                        <label for="status">Status</label>
                        <select id="status">
                            <option>Open</option>
                            <option>Investigating</option>
                            <option>Contained</option>
                            <option>Resolved</option>
                        </select>
                    </div>
                    <div class="workbench-select-group">
                        <label for="analyst">Assigned</label>
                        <select id="analyst">
                            <option>Security Analyst</option>
                            <option>John Smith</option>
                            <option>Sarah Johnson</option>
                            <option>David Miller</option>
                            <option>Emily Clark</option>
                        </select>
                    </div>
                </div>

                <div class="panel-body" style="display: flex; flex-direction: column; justify-content: space-between;">
                    
                    <!-- Action Grid Options -->
                    <div>
                        <div class="ioc-title" style="margin-bottom: 8px;">Incident Containment Actions</div>
                        <div class="action-grid-vertical">
                            <button class="btn-action-workbench warning" onclick="quarantineEmail()">
                                <i data-lucide="mail-x" style="width: 14px; height: 14px;"></i>
                                <span>Quarantine Email Target</span>
                            </button>
                            <button class="btn-action-workbench danger" onclick="blockDomain()">
                                <i data-lucide="globe-lock" style="width: 14px; height: 14px;"></i>
                                <span>Block Sender Domain</span>
                            </button>
                            <button class="btn-action-workbench warning" onclick="resetPassword()">
                                <i data-lucide="key-round" style="width: 14px; height: 14px;"></i>
                                <span>Force Credential Reset</span>
                            </button>
                            <button class="btn-action-workbench primary" onclick="notifyUser()">
                                <i data-lucide="send" style="width: 14px; height: 14px;"></i>
                                <span>Notify Employee</span>
                            </button>
                            <button class="btn-action-workbench glass" onclick="saveIncident()">
                                <i data-lucide="save" style="width: 14px; height: 14px;"></i>
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>

                    <!-- Realtime Audit Timeline -->
                    <div class="action-log-container">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span class="ioc-title" style="margin: 0;">Case Audit Log</span>
                            <button class="icon-action-btn" onclick="clearAuditLogs()" title="Clear Audit Logs" style="width:24px; height:24px;">
                                <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                            </button>
                        </div>
                        <div id="actionLog" style="max-height: 140px; overflow-y: auto; padding-right: 2px;">
                            <!-- Handled by audit.js -->
                        </div>
                    </div>
                </div>
            </div>

        </div>
    `;
    changeIncident();
    if (typeof renderAuditLogs === "function") {
        renderAuditLogs();
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
function changeIncident() {
    const incidentSelect = document.getElementById("incidentSelect");
    if (!incidentSelect) return;
    const incident = incidents[incidentSelect.value];
    if (!incident) return;
    document.getElementById("priority").value = incident.priority;
    document.getElementById("status").value = incident.status;
    document.getElementById("analyst").value = incident.analyst;
    document.getElementById("subjectValue").innerText = incident.subject;
    document.getElementById("senderValue").innerText = incident.sender;
    document.getElementById("domainValue").innerText = incident.domain;
    document.getElementById("reputationValue").innerText = incident.reputation || "Unknown";
    document.getElementById("reportedValue").innerText = incident.reported;
    const riskTd = document.getElementById("riskValue");
    const riskClass = incident.risk.toLowerCase();
    riskTd.innerHTML = `<span class="badge ${riskClass}">${incident.risk}</span>`;
    document.getElementById("aiExplanationText").innerText = incident.aiExplanation;
    const urlsContainer = document.getElementById("extractedUrlsList");
    if (urlsContainer) {
        if (incident.urls && incident.urls.length > 0) {
            let urlsHTML = "";
            incident.urls.forEach(item => {
                const badgeClass = item.risk === "Critical" ? "badge-critical" : item.risk === "High" ? "badge-high" : item.risk === "Medium" ? "badge-medium" : "badge-low";
                urlsHTML += `
                    <div class="ioc-item">
                        <span class="ioc-item-name" title="${item.link}">
                            <i data-lucide="link" style="width: 12px; height: 12px; color: var(--muted-color); flex-shrink:0;"></i>
                            <span style="font-family: monospace; font-size:11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.link}</span>
                        </span>
                        <span class="badge ${badgeClass}" style="font-size: 9px; padding: 1px 6px;">${item.risk}</span>
                    </div>
                `;
            });
            urlsContainer.innerHTML = urlsHTML;
        } else {
            urlsContainer.innerHTML = `<div style="font-size:11px; color: var(--muted-color); text-align:center; padding:4px 0;">No active links extracted</div>`;
        }
    }
    const attachmentsContainer = document.getElementById("extractedAttachmentsList");
    if (attachmentsContainer) {
        if (incident.attachments && incident.attachments.length > 0) {
            let filesHTML = "";
            incident.attachments.forEach(file => {
                const badgeClass = file.risk === "Critical" ? "badge-critical" : file.risk === "High" ? "badge-high" : file.risk === "Medium" ? "badge-medium" : "badge-low";
                filesHTML += `
                    <div class="ioc-item">
                        <span class="ioc-item-name" title="${file.name}">
                            <i data-lucide="file" style="width: 12px; height: 12px; color: var(--muted-color); flex-shrink:0;"></i>
                            <span>${file.name}</span>
                        </span>
                        <span class="badge ${badgeClass}" style="font-size: 9px; padding: 1px 6px;">${file.risk}</span>
                    </div>
                `;
            });
            attachmentsContainer.innerHTML = filesHTML;
        } else {
            attachmentsContainer.innerHTML = `<div style="font-size:11px; color: var(--muted-color); text-align:center; padding:4px 0;">No attachments parsed</div>`;
        }
    }
    const chainContainer = document.getElementById("attackChainMap");
    if (chainContainer && incident.attackChain) {
        const c = incident.attackChain;
        chainContainer.innerHTML = `
            <div class="chain-node ${c.sender}">
                <i data-lucide="user-x"></i>
                <div class="chain-node-label">Sender</div>
            </div>
            <div class="chain-node ${c.gateway}">
                <i data-lucide="server"></i>
                <div class="chain-node-label">Gateway</div>
            </div>
            <div class="chain-node ${c.inbox}">
                <i data-lucide="inbox"></i>
                <div class="chain-node-label">Inbox</div>
            </div>
            <div class="chain-node ${c.action}">
                <i data-lucide="shield-alert"></i>
                <div class="chain-node-label">Action</div>
            </div>
        `;
    }
    const mitreGrid = document.getElementById("mitreTtpGrid");
    if (mitreGrid) {
        if (incident.mitre && incident.mitre.length > 0) {
            let mitreHTML = "";
            incident.mitre.forEach(item => {
                mitreHTML += `
                    <div class="mitre-badge">
                        <span>Tactical Tactic: ${item.tactic}</span>
                        <strong>${item.technique}</strong>
                    </div>
                `;
            });
            mitreGrid.innerHTML = mitreHTML;
        } else {
            mitreGrid.innerHTML = `<div style="font-size:11px; color: var(--muted-color); padding: 4px 0;">No active ATT&CK tactics mapped</div>`;
        }
    }
    const timelineList = document.getElementById("incidentTimelineList");
    if (timelineList && incident.timeline) {
        let timelineHTML = "";
        incident.timeline.forEach(item => {
            timelineHTML += `
                <li class="workbench-timeline-item ${item.important ? 'important' : ''}">
                    <span class="workbench-timeline-time">${item.time}</span>
                    <span class="workbench-timeline-desc">${item.desc}</span>
                </li>
            `;
        });
        timelineList.innerHTML = timelineHTML;
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
function quarantineEmail() {
    const incSelect = document.getElementById("incidentSelect");
    const activeId = incSelect ? incidents[incSelect.value].id : "Unknown Incident";
    addAuditLog(`Quarantined Email Target (${activeId})`, "Completed");
}
function blockDomain() {
    const incSelect = document.getElementById("incidentSelect");
    const activeDomain = incSelect ? incidents[incSelect.value].domain : "Unknown Domain";
    addAuditLog(`Sender Domain Blocked: ${activeDomain}`, "Completed");
}
function resetPassword() {
    const incSelect = document.getElementById("incidentSelect");
    const activeSender = incSelect ? incidents[incSelect.value].sender : "Unknown User";
    addAuditLog(`Forced Credential Reset: ${activeSender}`, "Completed");
}
function notifyUser() {
    const incSelect = document.getElementById("incidentSelect");
    const activeSender = incSelect ? incidents[incSelect.value].sender : "Unknown User";
    addAuditLog(`Employee Notified via email: ${activeSender}`, "Completed");
}
function saveIncident() {
    const priority = document.getElementById("priority").value;
    const status = document.getElementById("status").value;
    const analyst = document.getElementById("analyst").value;
    const incSelect = document.getElementById("incidentSelect");
    if (incSelect) {
        const incident = incidents[incSelect.value];
        if (incident) {
            incident.priority = priority;
            incident.status = status;
            incident.analyst = analyst;
        }
        addAuditLog(`Saved Case ${incident.id} (${priority}, ${status}, ${analyst})`, "Completed");
    }
}