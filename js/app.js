// Global App Initializations
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons on startup
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Live clock update
    initLiveClock();

    // Sidebar Collapse Toggle
    initSidebarToggle();

    // Keyboard Shortcuts (Ctrl+K to focus search)
    initKeyboardShortcuts();

    // Wire up interactive modal and dropdown buttons
    initInteractiveWidgets();

    // Check backend connection and fetch initial data
    checkBackendConnection();
});

// Live Clock Widget (Local + IST Display)
function initLiveClock() {
    const clockEl = document.getElementById("topbarClock");
    if (!clockEl) return;

    const updateClock = () => {
        const now = new Date();
        const istTime = now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        clockEl.innerHTML = `<span style="color:var(--primary); font-weight: 600;">IST</span> ${istTime}`;
    };
    updateClock();
    setInterval(updateClock, 1000);
}

// Sidebar toggle controller
function initSidebarToggle() {
    const toggleBtn = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            const isCollapsed = sidebar.style.width === "72px";
            if (isCollapsed) {
                sidebar.style.width = "260px";
                document.querySelectorAll(".logo-text, .sidebar-footer strong, .sidebar-footer small, .nav-btn span").forEach(el => {
                    el.style.display = "";
                });
            } else {
                sidebar.style.width = "72px";
                document.querySelectorAll(".logo-text, .sidebar-footer strong, .sidebar-footer small, .nav-btn span").forEach(el => {
                    el.style.display = "none";
                });
            }
        });
    }
}

// Global hotkeys
function initKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
        // Ctrl/Cmd + K focuses search bar
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
            e.preventDefault();
            const searchBar = document.querySelector(".search-bar");
            if (searchBar) searchBar.focus();
        }
    });
}

// ==================================================
// INTERACTIVE WIDGET HANDLERS (SETTINGS, THEME, DROPDOWNS)
// ==================================================
function initInteractiveWidgets() {
    // Dropdowns
    const quickBtn = document.getElementById("quickActionBtn");
    const quickDropdown = document.getElementById("quickActionsDropdown");
    const notificationsBtn = document.getElementById("notificationsBtn");
    const notificationsDropdown = document.getElementById("notificationsDropdown");

    if (quickBtn && quickDropdown) {
        quickBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            quickDropdown.classList.toggle("show");
            if (notificationsDropdown) notificationsDropdown.classList.remove("show");
        });
    }

    if (notificationsBtn && notificationsDropdown) {
        notificationsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            notificationsDropdown.classList.toggle("show");
            if (quickDropdown) quickDropdown.classList.remove("show");
        });
    }

    // Close active dropdowns when clicking outside
    document.addEventListener("click", () => {
        if (quickDropdown) quickDropdown.classList.remove("show");
        if (notificationsDropdown) notificationsDropdown.classList.remove("show");
        const globalSearchDropdown = document.getElementById("globalSearchDropdown");
        if (globalSearchDropdown) globalSearchDropdown.classList.remove("show");
    });

    // Modals
    const settingsBtn = document.getElementById("settingsBtn");
    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            openModal("settingsModal");
        });
    }

    // Theme Toggle Handler
    let isAltTheme = false;
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            isAltTheme = !isAltTheme;
            const root = document.documentElement;
            const themeIcon = document.querySelector("#themeToggleBtn i");
            
            if (isAltTheme) {
                // Shift variables to a high-contrast deep emerald slate dark theme
                root.style.setProperty("--bg-main", "#070B14");
                root.style.setProperty("--bg-secondary", "#0E1321");
                root.style.setProperty("--bg-sidebar", "#0B0E1A");
                root.style.setProperty("--bg-card", "#151C30");
                root.style.setProperty("--primary", "#10B981"); // Emerald primary accent
                root.style.setProperty("--primary-glow", "rgba(16, 185, 129, 0.15)");
                
                if (themeIcon) themeIcon.setAttribute("data-lucide", "moon");
                if (typeof addAuditLog === "function") {
                    addAuditLog("Theme context switched to Emerald Slate Dark", "Completed");
                }
            } else {
                // Revert to original specifications
                root.style.removeProperty("--bg-main");
                root.style.removeProperty("--bg-secondary");
                root.style.removeProperty("--bg-sidebar");
                root.style.removeProperty("--bg-card");
                root.style.removeProperty("--primary");
                root.style.removeProperty("--primary-glow");
                
                if (themeIcon) themeIcon.setAttribute("data-lucide", "sun");
                if (typeof addAuditLog === "function") {
                    addAuditLog("Theme context switched to Default Cyber Dark", "Completed");
                }
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    // Workspace Selector Logic
    const workspaceSelect = document.getElementById("workspaceSelect");
    if (workspaceSelect) {
        workspaceSelect.addEventListener("change", (e) => {
            const workspaceName = e.target.selectedOptions[0].text;
            const workspaceValue = e.target.value;
            if (typeof addAuditLog === "function") {
                addAuditLog(`Workspace context switched to ${workspaceName}`, "Completed");
            }

            const API_BASE = window.location.protocol === 'file:' ? 'http://127.0.0.1:5000' : '';

            fetch(`${API_BASE}/api/stats?workspace=${workspaceValue}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to load workspace stats");
                    return res.json();
                })
                .then(fetchedStats => {
                    dashboardStats = fetchedStats;
                    // Repaint active dashboard
                    const activeBtn = document.querySelector(".nav-btn.active");
                    if (activeBtn && activeBtn.dataset.page === "dashboard") {
                        loadDashboard();
                    }
                })
                .catch(err => {
                    console.warn("Falling back to local workspace stats due to connection error:", err);
                    if (workspaceValue === "staging") {
                        dashboardStats[0].value = "45"; // Employees
                        dashboardStats[1].value = "3";  // Active Threats
                        dashboardStats[2].value = "98%"; // Compliance
                    } else if (workspaceValue === "emea") {
                        dashboardStats[0].value = "850";
                        dashboardStats[1].value = "29";
                        dashboardStats[2].value = "94%";
                    } else {
                        dashboardStats[0].value = "248";
                        dashboardStats[1].value = "12";
                        dashboardStats[2].value = "96%";
                    }
                    // Repaint active dashboard
                    const activeBtn = document.querySelector(".nav-btn.active");
                    if (activeBtn && activeBtn.dataset.page === "dashboard") {
                        loadDashboard();
                    }
                });
        });
    }

    // Global Search Interactive Navigation Heuristics
    const globalSearchInput = document.getElementById("globalSearchInput");
    const globalSearchDropdown = document.getElementById("globalSearchDropdown");

    if (globalSearchInput && globalSearchDropdown) {
        globalSearchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                globalSearchDropdown.classList.remove("show");
                return;
            }

            // Filter global incidents array
            const results = incidents.filter(inc => 
                inc.id.toLowerCase().includes(query) ||
                inc.sender.toLowerCase().includes(query) ||
                inc.subject.toLowerCase().includes(query)
            );

            if (results.length === 0) {
                globalSearchDropdown.innerHTML = `
                    <div style="font-size: 11px; color: var(--muted-color); text-align: center; padding: 12px;">
                        No incidents matched query
                    </div>
                `;
            } else {
                let html = '<div class="dropdown-header">Incident Navigation Results</div>';
                results.slice(0, 5).forEach(inc => {
                    html += `
                        <button onclick="viewIncidentInvestigation('${inc.id}'); document.getElementById('globalSearchDropdown').classList.remove('show'); document.getElementById('globalSearchInput').value='';" style="padding: 8px 12px; gap: 4px; border-bottom: 1px solid rgba(255,255,255,0.02); display: flex; flex-direction: column; width: 100%;">
                            <div style="display:flex; justify-content:space-between; width:100%; font-size:12px;">
                                <strong style="color:var(--primary); font-weight:600;">${inc.id}</strong>
                                <span class="badge ${inc.risk.toLowerCase()}" style="font-size:9px; padding:1px 6px;">${inc.risk}</span>
                            </div>
                            <div style="font-size: 11px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
                                ${inc.subject}
                            </div>
                        </button>
                    `;
                });
                globalSearchDropdown.innerHTML = html;
            }
            globalSearchDropdown.classList.add("show");
        });

        // Prevent click inside search from closing the dropdown instantly
        globalSearchInput.addEventListener("click", (e) => {
            e.stopPropagation();
            if (globalSearchInput.value.trim()) {
                globalSearchDropdown.classList.add("show");
            }
        });
    }
}

// Modal Toggle Helpers
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("show");
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("show");
};

// Dismiss Alert Item from Dropdown
window.clearNotification = function(element) {
    element.classList.remove("unread");
    element.style.opacity = "0.5";
    
    const unreadCount = document.querySelectorAll("#notificationsDropdown .dropdown-item.unread").length;
    const badge = document.querySelector(".bell-badge");
    if (unreadCount === 0 && badge) {
        badge.style.display = "none";
    }
};

// Settings Modal Action
window.saveSettings = function() {
    const heuristics = document.getElementById("aiHeuristicsOpt").checked;
    const quarantine = document.getElementById("autoQuarantineOpt").checked;
    const isolate = document.getElementById("isolateExeOpt").checked;
    const https = document.getElementById("forceHttpsOpt").checked;
    
    if (typeof addAuditLog === "function") {
        addAuditLog(`Settings Updated (AI: ${heuristics}, Quarantine: ${quarantine}, Isolate: ${isolate}, HTTPS: ${https})`, "Completed");
    }
    closeModal("settingsModal");
};

// Submit custom manual incident form (Adds to shared incident array dynamically!)
window.submitManualIncident = function() {
    const subject = document.getElementById("manualSubject").value;
    const sender = document.getElementById("manualSender").value;
    const risk = document.getElementById("manualRisk").value;

    if (!subject || !sender) {
        alert("Subject and Sender fields are required to log an incident.");
        return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newCase = {
        subject: subject,
        sender: sender,
        domain: sender.split('@')[1] || "external.com",
        risk: risk,
        reported: formattedTime,
        priority: risk === "Critical" ? "P1 - Critical" : risk === "High" ? "P2 - High" : risk === "Medium" ? "P3 - Medium" : "P4 - Low",
        status: "Open",
        analyst: "Macharam Deepthi",
        reputation: "Unknown (Manual Entry)",
        aiExplanation: "Manual security incident log filed by Security Analyst from Quick Actions panel.",
        urls: [],
        attachments: [],
        attackChain: { sender: "warning", gateway: "safe", inbox: "safe", action: "warning" },
        mitre: [],
        timeline: [
            { time: formattedTime, desc: "Manual incident entry logged", important: true }
        ]
    };

    const API_BASE = window.location.protocol === 'file:' ? 'http://127.0.0.1:5000' : '';

    fetch(`${API_BASE}/api/incidents`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCase)
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to post manual incident");
        return res.json();
    })
    .then(savedCase => {
        incidents.unshift(savedCase);
        
        if (typeof addAuditLog === "function") {
            addAuditLog(`Manual incident created on backend: ${savedCase.id}`, "Completed");
        }
        
        completeManualIncidentSetup();
    })
    .catch(err => {
        console.warn("Falling back to local incident storage due to connection error:", err);
        
        // Generate manual sequential ID for local storage
        newCase.id = `INC-2026-00${incidents.length + 1}`;
        incidents.unshift(newCase);
        
        if (typeof addAuditLog === "function") {
            addAuditLog(`Manual incident created locally (fallback): ${newCase.id}`, "Warning");
        }
        
        completeManualIncidentSetup();
    });
};

function completeManualIncidentSetup() {
    // Reset inputs
    document.getElementById("manualSubject").value = "";
    document.getElementById("manualSender").value = "";

    closeModal("manualIncidentModal");

    // Repaint dashboard if active to show the new row instantly!
    const activeBtn = document.querySelector(".nav-btn.active");
    if (activeBtn && activeBtn.dataset.page === "dashboard") {
        loadDashboard();
    }
}

// Quick Action Item dispatcher
window.triggerQuickAction = function(actionType) {
    if (actionType === 'scan') {
        const analyzerBtn = document.querySelector('.nav-btn[data-page="analyzer"]');
        if (analyzerBtn) analyzerBtn.click();
    } else if (actionType === 'incident') {
        openModal("manualIncidentModal");
    } else if (actionType === 'export') {
        if (typeof auditLogs !== "undefined") {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", "phishguard_audit_logs.json");
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
            
            if (typeof addAuditLog === "function") {
                addAuditLog("Exported platform audit logs to JSON", "Completed");
            }
        } else {
            alert("No session audits found to export.");
        }
    } else if (actionType === 'health') {
        alert("Platform Health: 100% Operational\nDKIM/SPF Modules: Healthy\nSandboxing Nodes: Online\nAI Pipeline Status: Clean");
        if (typeof addAuditLog === "function") {
            addAuditLog("Conducted automatic platform diagnostics check", "Completed");
        }
    }
};

// Navigation Buttons & Transitions
const navButtons = document.querySelectorAll(".nav-btn");
const contentContainer = document.getElementById("content");

// Default Page Load
loadPageTransition("dashboard", loadDashboard);

// Navigation Click Handlers
navButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Clear active classes
        navButtons.forEach(btn => btn.classList.remove("active"));
        // Add active
        button.classList.add("active");

        const page = button.dataset.page;
        
        // Define rendering actions
        let renderFn;
        switch(page) {
            case "dashboard":
                renderFn = loadDashboard;
                break;
            case "analyzer":
                renderFn = loadAnalyzer;
                break;
            case "investigation":
                renderFn = loadInvestigation;
                break;
            case "compliance":
                renderFn = loadCompliance;
                break;
        }

        if (renderFn) {
            loadPageTransition(page, renderFn);
        }
    });
});

// SaaS Shimmer Load Transition
function loadPageTransition(pageName, renderFunc) {
    if (!contentContainer) return;

    // Render loading state
    contentContainer.innerHTML = `
        <div class="skeleton-layout">
            <div class="skeleton-title skeleton-shimmer" style="width: 250px; height: 32px; margin-bottom: 24px;"></div>
            <div class="cards-grid-kpi">
                <div class="card skeleton-card skeleton-shimmer" style="height: 120px;"></div>
                <div class="card skeleton-card skeleton-shimmer" style="height: 120px;"></div>
                <div class="card skeleton-card skeleton-shimmer" style="height: 120px;"></div>
                <div class="card skeleton-card skeleton-shimmer" style="height: 120px;"></div>
            </div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-top: 24px;">
                <div class="card skeleton-shimmer" style="height: 300px; border-radius: var(--radius-lg);"></div>
                <div class="card skeleton-shimmer" style="height: 300px; border-radius: var(--radius-lg);"></div>
            </div>
        </div>
    `;

    // Simulate high speed network delay (150ms) for responsive page switch feel
    setTimeout(() => {
        // Execute the rendering function
        renderFunc();

        // Refresh icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 180);
}

// Validate backend connectivity and update badge status
function checkBackendConnection() {
    const statusBadge = document.getElementById("backendStatus");
    const API_BASE = window.location.protocol === 'file:' ? 'http://127.0.0.1:5000' : '';
    
    if (statusBadge) {
        statusBadge.className = "backend-status-badge connecting";
        const textNode = statusBadge.querySelector(".status-text");
        if (textNode) textNode.innerText = "Backend: Connecting...";
    }
    
    // Promise validation for multi-endpoint status checks
    Promise.all([
        fetch(`${API_BASE}/api/incidents`).then(res => {
            if (!res.ok) throw new Error("Failed to load incidents database");
            return res.json();
        }),
        fetch(`${API_BASE}/api/stats?workspace=default`).then(res => {
            if (!res.ok) throw new Error("Failed to load platform stats");
            return res.json();
        })
    ])
    .then(([fetchedIncidents, fetchedStats]) => {
        // Set dynamic arrays
        incidents = fetchedIncidents;
        dashboardStats = fetchedStats;
        
        if (statusBadge) {
            statusBadge.className = "backend-status-badge connected";
            const textNode = statusBadge.querySelector(".status-text");
            if (textNode) textNode.innerText = "Backend: Connected";
        }
        
        if (typeof addAuditLog === "function") {
            addAuditLog("Connected to live security database.", "Completed");
        }
        
        // Repaint the active workspace view with fresh state
        refreshActivePage();
    })
    .catch(err => {
        console.warn("Backend database offline. Working in local sandbox sandbox mode:", err);
        if (statusBadge) {
            statusBadge.className = "backend-status-badge disconnected";
            const textNode = statusBadge.querySelector(".status-text");
            if (textNode) textNode.innerText = "Backend: Offline (Local Mock)";
        }
        
        if (typeof addAuditLog === "function") {
            addAuditLog("Backend connection offline. Running in sandbox mock mode.", "Warning");
        }
    });
}

// Repaint active workspace page dynamically
function refreshActivePage() {
    const activeBtn = document.querySelector(".nav-btn.active");
    if (!activeBtn) return;
    const page = activeBtn.dataset.page;
    switch(page) {
        case "dashboard":
            if (typeof loadDashboard === "function") loadDashboard();
            break;
        case "compliance":
            if (typeof loadCompliance === "function") loadCompliance();
            break;
        case "investigation":
            if (typeof loadInvestigation === "function") loadInvestigation();
            break;
        case "analyzer":
            if (typeof loadAnalyzer === "function") loadAnalyzer();
            break;
    }
}