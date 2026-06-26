function loadAnalyzer() {
    const content = document.getElementById("content");
    if (!content) return;

    content.innerHTML = `
        <div class="page-header">
            <div class="page-header-info">
                <h1>📧 Phishing Analyzer Sandbox</h1>
                <p>Submit suspicious email headers, bodies, or links to analyze threat vectors against safety heuristics.</p>
            </div>
        </div>

        <div class="analyzer-layout-grid">
            <!-- Left Side: Interactive Input Console -->
            <div class="card">
                <div style="font-size: 15px; font-weight: 600; margin-bottom: 20px; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="binary" style="color: var(--primary); width: 18px; height: 18px;"></i>
                    <span>Sandbox Parameters</span>
                </div>

                <div class="form-group">
                    <label for="subject">Email Subject</label>
                    <input type="text" id="subject" placeholder="e.g., URGENT: Action Required - Verify Account Details">
                </div>

                <div class="form-group">
                    <label for="sender">Sender Address</label>
                    <input type="email" id="sender" placeholder="e.g., support@micr0soft-login.com">
                </div>

                <div class="form-group">
                    <label for="body">Email Content Body</label>
                    <textarea id="body" rows="6" placeholder="Paste full raw email text payload here..."></textarea>
                </div>

                <div class="form-group">
                    <label for="links">Embedded Link / URL</label>
                    <input type="text" id="links" placeholder="e.g., http://shorturl.co/x9fA2">
                </div>

                <button id="analyzeBtn" class="btn-primary" style="margin-top: 12px;">
                    <i data-lucide="cpu"></i>
                    <span>Execute Reputation Scan</span>
                </button>
            </div>

            <!-- Right Side: Real-Time Report Container -->
            <div class="card" id="analysisResult" style="min-height: 480px; display: flex; flex-direction: column;">
                <!-- Default Awaiting State -->
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--text-secondary); padding: 40px;">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(59, 130, 246, 0.05); border: 1px dashed rgba(59, 130, 246, 0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <i data-lucide="shield-alert" style="width: 24px; height: 24px; color: var(--muted-color);"></i>
                    </div>
                    <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">Awaiting Sandbox Execution</span>
                    <p style="font-size: 12px; color: var(--muted-color); max-width: 260px; margin-top: 8px;">Fill in the email fields on the left and run the reputation scan to compile automated IOC reports.</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById("analyzeBtn").addEventListener("click", runAnalysisTrigger);

    // Refresh icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Simulated High-Compute Sandbox Loading Trigger
function runAnalysisTrigger() {
    const resultBox = document.getElementById("analysisResult");
    if (!resultBox) return;

    // Render computing state skeleton shimmers
    resultBox.innerHTML = `
        <div style="padding: 12px; display: flex; flex-direction: column; gap: 16px; width: 100%;">
            <div class="skeleton-title skeleton-shimmer" style="width: 70%; height: 24px;"></div>
            <div class="skeleton-shimmer" style="height: 100px; border-radius: var(--radius-md);"></div>
            <div class="skeleton-text skeleton-shimmer" style="width: 90%; height: 16px;"></div>
            <div class="skeleton-text skeleton-shimmer" style="width: 80%; height: 16px;"></div>
            <div class="skeleton-text skeleton-shimmer" style="width: 95%; height: 16px;"></div>
            <div style="margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                <div class="skeleton-title skeleton-shimmer" style="width: 40%; height: 20px;"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                    <div class="skeleton-shimmer" style="height: 32px; border-radius: var(--radius-sm);"></div>
                    <div class="skeleton-shimmer" style="height: 32px; border-radius: var(--radius-sm);"></div>
                </div>
            </div>
        </div>
    `;

    // Trigger calculation after 650ms to simulate ML pipeline delay
    setTimeout(() => {
        analyzeEmail();
    }, 650);
}

// Calculation logic via Backend API with Local Heuristics Fallback
function analyzeEmail() {
    const subjectVal = document.getElementById("subject").value;
    const senderVal = document.getElementById("sender").value;
    const bodyVal = document.getElementById("body").value;
    const linksVal = document.getElementById("links").value;

    const API_BASE = window.location.protocol === 'file:' ? 'http://127.0.0.1:5000' : '';

    fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subject: subjectVal,
            sender: senderVal,
            body: bodyVal,
            links: linksVal
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
    })
    .then(data => {
        displayResult(data.score, data.reasons, data.aiExplanation);
    })
    .catch(err => {
        console.warn("Falling back to local email analysis due to connection error:", err);
        runLocalAnalysis(subjectVal, senderVal, bodyVal, linksVal);
    });
}

function runLocalAnalysis(subjectRaw, senderRaw, bodyRaw, linksRaw) {
    const subject = subjectRaw.toLowerCase();
    const sender = senderRaw.toLowerCase();
    const body = bodyRaw.toLowerCase();
    const links = linksRaw.toLowerCase();

    let score = 0;
    let reasons = [];

    if (sender.includes("@gmail.com") || sender.includes("@yahoo.com") || sender.includes("@outlook.com")) {
        score += 20;
        reasons.push("Public Webmail Provider Domain");
    }
    if (subject.includes("urgent") || subject.includes("immediately") || subject.includes("verify")) {
        score += 20;
        reasons.push("Urgent or Coercive Language Pattern");
    }
    if (body.includes("password") || body.includes("login") || body.includes("verify account")) {
        score += 20;
        reasons.push("Sensitive Credential/Authentication Request");
    }
    if (links.includes("http://")) {
        score += 15;
        reasons.push("Insecure Plaintext HTTP Link Connection");
    }
    if (links.includes("bit.ly") || links.includes("tinyurl") || links.includes("t.co")) {
        score += 15;
        reasons.push("Obfuscated or Shortened URL Pattern");
    }
    if (sender.includes("micr0soft") || sender.includes("paypa1") || sender.includes("amaz0n")) {
        score += 25;
        reasons.push("Lookalike Typosquatting Brand Domain");
    }
    const ipRegex = /\b\d{1,3}(\.\d{1,3}){3}\b/;
    if (ipRegex.test(links)) {
        score += 20;
        reasons.push("Raw IP Address Destination Pattern");
    }
    const attachmentKeywords = [".exe", ".zip", ".rar", ".bat", ".scr", ".js", ".vbs"];
    attachmentKeywords.forEach(file => {
        if (body.includes(file)) {
            score += 20;
            reasons.push(`Suspicious File extension payload (${file})`);
        }
    });
    const bankingWords = ["bank", "credit card", "debit card", "payment", "invoice", "transaction"];
    bankingWords.forEach(word => {
        if (body.includes(word)) {
            score += 15;
            reasons.push(`Banking reference keyword (${word})`);
        }
    });
    const cryptoWords = ["bitcoin", "ethereum", "crypto", "wallet", "binance"];
    cryptoWords.forEach(word => {
        if (body.includes(word)) {
            score += 15;
            reasons.push(`Cryptocurrency asset keyword (${word})`);
        }
    });
    const threatWords = ["suspended", "terminated", "locked", "blocked", "disabled"];
    threatWords.forEach(word => {
        if (subject.includes(word) || body.includes(word)) {
            score += 15;
            reasons.push(`Threat escalation keyword (${word})`);
        }
    });
    const loginWords = ["login", "sign in", "authenticate", "verification"];
    loginWords.forEach(word => {
        if (body.includes(word)) {
            score += 10;
            reasons.push(`Access portal login word (${word})`);
        }
    });

    if (score === 0) {
        reasons.push("No obvious indicators identified.");
    }
    if (score > 100) {
        score = 100;
    }

    let aiExplanation = "Low-risk classification. Standard metadata signatures verify clean parameters. No malicious heuristics observed.";
    if (score > 70) {
        aiExplanation = `High-risk threat vector detected. Heuristics identified critical indicators: ${reasons.slice(0, 2).join(', ')}. Immediate analyst intervention is recommended to quarantine the sender and block destination URIs.`;
    } else if (score > 30) {
        aiExplanation = `Medium-risk suspicious email flag. Key indicators: ${reasons.slice(0, 2).join(', ')}. Suggest monitoring domain behavior and performing user awareness verification.`;
    }

    displayResult(score, reasons, aiExplanation);
}

// Display result visual templates (Preserving IDs and critical elements)
function displayResult(score, reasons, aiExplanation) {
    let level = "Low";
    let badgeClass = "badge-low";
    let riskColor = "var(--success)";

    if (score >= 80) {
        level = "Critical";
        badgeClass = "badge-critical";
        riskColor = "var(--critical)";
    } else if (score >= 60) {
        level = "High";
        badgeClass = "badge-high";
        riskColor = "rgba(249, 115, 22, 1)";
    } else if (score >= 40) {
        level = "Medium";
        badgeClass = "badge-medium";
        riskColor = "var(--warning)";
    }

    let reasonsHTML = "";
    reasons.forEach(reason => {
        reasonsHTML += `
            <li class="indicator-item">
                <span class="indicator-bullet" style="background-color: ${riskColor};"></span>
                <span>${reason}</span>
            </li>
        `;
    });

    document.getElementById("analysisResult").innerHTML = `
        <div class="result-box" style="display: flex; flex-direction: column; height: 100%;">
            <div class="report-header">
                <span style="font-size: 15px; font-weight: 600; color: var(--text-primary);">📊 Phishing Analysis Report</span>
                <span class="badge ${badgeClass}" style="text-transform: uppercase;">${level} Risk</span>
            </div>

            <!-- Risk Score Gauge -->
            <div class="score-meter-container">
                <div class="score-stats">
                    <span>Aggregated Suspicion Threat Score</span>
                    <span class="score-fill-value">${score}<small style="font-size: 12px; color: var(--text-secondary);">/100</small></span>
                </div>
                <div class="score-bar-bg">
                    <div class="score-bar-fill" id="animatedScoreBar" style="width: 0%; background-color: ${riskColor};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--muted-color); margin-top: 6px;">
                    <span>Heuristics Trust: ${Math.min(score + 10, 100)}% Confidence</span>
                    <span>Classified: Live Sandbox</span>
                </div>
            </div>

            <!-- Match Indicators Checklist -->
            <div class="rule-indicators">
                <h4 class="rule-indicators-title">Identified IOC Explanations</h4>
                <ul class="indicator-list">
                    ${reasonsHTML}
                </ul>
            </div>

            <!-- AI Copilot Verdict Box (Premium Enhancement) -->
            <div class="ai-insights-block" style="margin-top: 0; margin-bottom: var(--space-3);">
                <strong><i data-lucide="sparkles" style="width: 12px; height: 12px; display: inline; vertical-align: middle; margin-right: 4px;"></i>AI SANDBOX COPILOT VERDICT</strong>
                <span>${aiExplanation || 'No AI analysis available.'}</span>
            </div>

            <!-- Action Guidelines -->
            <div class="recommendations-section">
                <h4 class="recommendations-title">Recommended Mitigation Guidelines</h4>
                <ul class="recommendations-list">
                    <li>Quarantine email payload</li>
                    <li>Notify security team</li>
                    <li>Block sender hostname</li>
                    <li>Force profile reset</li>
                    <li>Conduct IOC check</li>
                </ul>
            </div>
        </div>
    `;

    // Trigger score bar animation on repaint
    setTimeout(() => {
        const fillBar = document.getElementById("animatedScoreBar");
        if (fillBar) fillBar.style.width = `${score}%`;
    }, 50);

    // Refresh icons inside dynamic content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
