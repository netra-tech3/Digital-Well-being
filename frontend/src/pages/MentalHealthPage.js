import React, { useEffect, useMemo, useState } from "react";
import "./MentalHealthPage.css";

const BREATH_SECONDS = 60; // 1-minute quick reset

const MentalHealthPage = () => {
  const [toxicityData, setToxicityData] = useState(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathTimeLeft, setBreathTimeLeft] = useState(BREATH_SECONDS);

  useEffect(() => {
    fetch("http://localhost:5000/latest-report")
      .then((res) => res.json())
      .then((data) => setToxicityData(data))
      .catch((err) => console.error("Error fetching toxicity data:", err));
  }, []);

  // Derive tier + labels
  const tier = useMemo(() => {
    const t = Number(toxicityData?.toxicity || 0);
    if (t >= 0.8) return "critical";
    if (t >= 0.6) return "high";
    if (t >= 0.4) return "moderate";
    if (t >= 0.2) return "low";
    return "excellent";
  }, [toxicityData]);

  const impactMessage = useMemo(() => {
    const t = Number(toxicityData?.toxicity || 0);
    if (t <= 0.2) return "Your digital well-being is excellent! Keep maintaining a healthy balance.";
    if (t <= 0.4) return "You're slightly exposed to negativity. Stay mindful of your content consumption.";
    if (t <= 0.6) return "Moderate exposure to toxicity. You may experience mild stress or irritability.";
    if (t <= 0.8) return "High exposure detected! This may cause anxiety and emotional exhaustion.";
    return "Critical toxicity level! You may feel overwhelmed. Reduce exposure immediately.";
  }, [toxicityData]);

  const likelySymptoms = useMemo(() => {
    switch (tier) {
      case "excellent":
        return ["Stable mood", "Good focus", "Healthy sleep rhythm"];
      case "low":
        return ["Slight irritability", "Minor distraction", "Light doom-scrolling urge"];
      case "moderate":
        return ["Noticeable stress", "Shorter attention span", "Compulsive checking pattern"];
      case "high":
        return ["Anxiety spikes", "Tension/restlessness", "Conflict-seeking loops"];
      case "critical":
        return ["Overwhelm/fatigue", "Sleep disruption", "Ruminating on negative content"];
      default:
        return [];
    }
  }, [tier]);

  const copingActions = useMemo(() => {
    switch (tier) {
      case "excellent":
        return [
          "Keep your positive sources pinned and revisit them daily.",
          "Schedule a 5-minute gratitude recap at night.",
          "Review follows monthly; prune accounts that drift negative.",
        ];
      case "low":
        return [
          "Mute 2 accounts or keywords that trigger negativity.",
          "Do a 2-minute breathing reset after any heated thread.",
          "Switch to a positive feed for 10 minutes (uplifting creators).",
        ];
      case "moderate":
        return [
          "Time-box social feeds to 15 minutes; use a timer.",
          "Apply a 30-second pause-before-reply rule to avoid escalation.",
          "Unfollow 3 high-conflict sources; add 3 wellbeing creators.",
        ];
      case "high":
        return [
          "Enable profanity/keyword filters and hide toxic replies.",
          "Block or report repeat offenders; curate aggressively.",
          "Take a 20-minute offline break (move, hydrate, sunlight).",
        ];
      case "critical":
        return [
          "Immediate 60-minute detox: log out or uninstall problem app for the day.",
          "Ask a friend to be an accountability buddy for 24 hours.",
          "If threats or harassment occur, collect evidence and report to the platform.",
        ];
      default:
        return [];
    }
  }, [tier]);

  // Breathing exercise controls
  useEffect(() => {
    if (!showBreathing) return;
    setBreathTimeLeft(BREATH_SECONDS);
    const interval = setInterval(() => {
      setBreathTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setShowBreathing(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showBreathing]);

  const startBreathing = () => setShowBreathing(true);

  // Quick actions: copy / download plan
  const planText = useMemo(() => {
    const t = Number(toxicityData?.toxicity || 0).toFixed(2);
    const lines = [
      `Toxicity Level: ${t} (${tier.toUpperCase()})`,
      "",
      "Impact:",
      `- ${impactMessage}`,
      "",
      "Likely Symptoms:",
      ...likelySymptoms.map((s) => `- ${s}`),
      "",
      "Coping Actions (next 24h):",
      ...copingActions.map((a) => `- ${a}`),
    ];
    return lines.join("\n");
  }, [toxicityData, tier, impactMessage, likelySymptoms, copingActions]);

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(planText);
    } catch {}
  };

  const downloadPlan = () => {
    const blob = new Blob([planText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mental-health-plan-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mental-health-page">
      <h1 className="page-title">Mental Health & Digital Well-being</h1>

      {toxicityData && (
        <div className="impact-section">
          <div className="section-header">
            <h2>Toxicity Impact on Your Mental Health</h2>
            <div className="actions">
              <button className="btn" onClick={copyPlan} title="Copy plan">Copy plan</button>
              <button className="btn primary" onClick={downloadPlan} title="Download plan">Download</button>
            </div>
          </div>

          <div className="meter-row">
            <span className="meter-label">Toxicity</span>
            <div className="risk-meter">
              <div
                className={`risk-fill ${tier}`}
                style={{ width: `${Math.min(100, Math.max(0, Number(toxicityData.toxicity) * 100))}%` }}
              />
            </div>
            <span className={`toxicity-badge ${tier}`}>
              {Number(toxicityData.toxicity).toFixed(2)}
            </span>
          </div>

          <p className="impact-message">{impactMessage}</p>
          <div className="chips">
            <span className={`chip ${tier}`}>{tier === "excellent" ? "Excellent" : tier.charAt(0).toUpperCase() + tier.slice(1)} risk</span>
            <span className="chip neutral">Mindful usage</span>
            <span className="chip neutral">Digital hygiene</span>
          </div>
        </div>
      )}

      <div className="cards-grid">
        <div className="card">
          <h3>Likely Symptoms</h3>
          <ul className="list">
            {likelySymptoms.map((s, i) => (
              <li key={i}><span className="dot">•</span>{s}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Coping Actions (next 24h)</h3>
          <ul className="list">
            {copingActions.map((a, i) => (
              <li key={i}><span className="dot">•</span>{a}</li>
            ))}
          </ul>
          <div className="quick-actions">
            <button className="btn ghost" onClick={startBreathing}>Start 1-min Breathing</button>
            <a
              className="btn link"
              href="https://www.calm.com/blog/how-to-meditate"
              target="_blank"
              rel="noreferrer"
            >
              Learn a 5-min reset
            </a>
          </div>
        </div>

        <div className="card">
          <h3>Healthy Habits</h3>
          <ul className="list">
            <li><span className="dot">•</span>Time-box feeds; avoid late-night scrolling.</li>
            <li><span className="dot">•</span>Replace one doom-scroll with a 10-minute walk.</li>
            <li><span className="dot">•</span>Curate positive sources each week.</li>
            <li><span className="dot">•</span>Pause-before-reply to prevent escalation.</li>
          </ul>
        </div>
      </div>

      {/* Breathing modal */}
      {showBreathing && (
        <div className="breath-overlay" onClick={() => setShowBreathing(false)}>
          <div className="breath-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Box Breathing • {breathTimeLeft}s</h3>
            <p className="breath-instructions">
              Inhale 4s • Hold 4s • Exhale 4s • Hold 4s — repeat
            </p>
            <div className="breath-box">
              <div className="breath-pulse" />
            </div>
            <button className="btn" onClick={() => setShowBreathing(false)}>Close</button>
          </div>
        </div>
      )}

      {!toxicityData && (
        <p className="no-data-text">No recent toxic content detected.</p>
      )}
    </div>
  );
};

export default MentalHealthPage;
