import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import "./ReportPage.css";

// Map numeric value -> label/color tier
const tierOf = (v) => {
  if (v <= 0.2) return { label: "Excellent", key: "excellent", rgb: [34, 139, 34] };
  if (v <= 0.4) return { label: "Low", key: "low", rgb: [46, 204, 113] };
  if (v <= 0.6) return { label: "Moderate", key: "moderate", rgb: [255, 193, 7] };
  if (v <= 0.8) return { label: "High", key: "high", rgb: [255, 99, 71] };
  return { label: "Very High", key: "critical", rgb: [176, 0, 32] };
};

// Normalize entry from backend to { date, toxicity }
const normalize = (entry, idx) => {
  // Your backend (refactored) returns { date, avgToxicity }
  // Older code uses { date, toxicity }
  const toxicity = typeof entry.avgToxicity === "number"
    ? entry.avgToxicity
    : (typeof entry.toxicity === "number" ? entry.toxicity : 0);
  const safeDate = entry.date || `Day ${idx + 1}`;
  return { date: safeDate, toxicity: Number(toxicity || 0) };
};

const ReportPage = () => {
  const [toxicityData, setToxicityData] = useState([]);
  const [averageToxicity, setAverageToxicity] = useState(null);
  const [backendRecommendation, setBackendRecommendation] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/report")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const arr = Array.isArray(data?.toxicityData) ? data.toxicityData : [];
        setToxicityData(arr.map((e, i) => normalize(e, i)));
        setAverageToxicity(
          typeof data?.averageToxicity === "number"
            ? data.averageToxicity
            : (arr.length
                ? arr.reduce((s, e) => s + (e.avgToxicity ?? e.toxicity ?? 0), 0) / arr.length
                : 0)
        );
        setBackendRecommendation(data?.recommendation || "");
      })
      .catch((e) => setErr(e?.message || "Failed to fetch report"))
      .finally(() => setLoading(false));
  }, []);

  const assessment = useMemo(() => tierOf(Number(averageToxicity || 0)), [averageToxicity]);

  const generatePDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const today = new Date().toLocaleDateString();

    // Border
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.8);
    doc.rect(8, 8, 194, 281);

    // Title
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(20);
    doc.text("Digital Well-being Report", 14, 20);

    // Date
    doc.setTextColor(90);
    doc.setFontSize(10);
    doc.text(`Date: ${today}`, 160, 20);

    // Intro
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(
      "This report analyzes your online toxicity exposure for the last 4 days. Regular monitoring helps maintain a balanced, healthy digital routine.",
      14, 28, { maxWidth: 180 }
    );

    // Daily section header
    doc.setFontSize(13);
    doc.setTextColor(0, 102, 204);
    doc.text("Daily Exposure", 14, 40);

    // Bars
    let y = 48;
    toxicityData.forEach((entry, i) => {
      const t = Number(entry.toxicity || 0);
      const tier = tierOf(t);
      // Label
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.text(`${entry.date}`, 14, y);

      // Bar background
      const xBar = 60, wBar = 110, hBar = 6;
      doc.setDrawColor(200);
      doc.setFillColor(235, 235, 235);
      doc.rect(xBar, y - 4.5, wBar, hBar, "FD");

      // Bar fill (toxicity %)
      const fillW = Math.max(0, Math.min(wBar, Math.round(wBar * t)));
      const [r, g, b] = tier.rgb;
      doc.setFillColor(r, g, b);
      doc.rect(xBar, y - 4.5, fillW, hBar, "F");

      // Value + tier
      doc.setTextColor(r, g, b);
      doc.setFontSize(11);
      doc.text(`${t.toFixed(2)} (${tier.label})`, xBar + wBar + 4, y);

      y += 12;
    });

    // Average
    const avg = Number(averageToxicity || 0);
    const avgTier = tierOf(avg);
    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("Average Toxicity", 14, y + 4);

    const [ar, ag, ab] = avgTier.rgb;
    doc.setTextColor(ar, ag, ab);
    doc.setFontSize(14);
    doc.text(`${avg.toFixed(2)} (${avgTier.label})`, 60, y + 4);

    // Recommendation
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(13);
    doc.text("Recommendation", 14, y + 16);

    doc.setTextColor(0);
    doc.setFontSize(12);
    const rec = backendRecommendation || (
      avg > 0.6
        ? "Reduce toxic sources immediately, mute/block repeat offenders, and schedule a digital detox today."
        : avg > 0.4
        ? "Monitor usage, time-box social feeds, and curate positive sources."
        : "Balanced usage. Keep up healthy habits and regular check-ins."
    );
    doc.text(rec, 14, y + 24, { maxWidth: 180 });

    // Footer
    doc.setTextColor(120);
    doc.setFontSize(9);
    doc.text("Confidential - For Personal Use Only", 85, 288);

    doc.save("Digital_Wellbeing_Report.pdf");
  };

  return (
    <div className="report-page">
      <h1 className="page-title">Full Digital Well-being Report</h1>

      {err && <div className="report-banner error">⚠️ {err}</div>}
      {loading && <div className="report-banner">Generating your latest report…</div>}

      {!loading && (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-title">Average Toxicity</div>
              <div className={`summary-value badge ${assessment.key}`}>
                {Number(averageToxicity || 0).toFixed(2)} • {assessment.label}
              </div>
              <div className="meter">
                <div
                  className={`meter-fill ${assessment.key}`}
                  style={{ width: `${Math.min(100, Math.max(0, Number(averageToxicity || 0) * 100))}%` }}
                />
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-title">Recommendation</div>
              <p className="summary-text">
                {backendRecommendation ||
                  (assessment.key === "critical"
                    ? "Reduce toxic sources immediately and take a longer offline break."
                    : assessment.key === "high"
                    ? "Curate aggressively: mute/block and take a 20-minute detox."
                    : assessment.key === "moderate"
                    ? "Time-box feeds, pause-before-reply, and add positive sources."
                    : "Balanced usage. Keep your healthy routine!")}
              </p>
            </div>
          </div>

          <div className="daily-grid">
            {toxicityData.map((d, i) => {
              const t = Number(d.toxicity || 0);
              const tTier = tierOf(t);
              return (
                <div key={i} className="day-card">
                  <div className="day-head">
                    <div className="day-date">{d.date}</div>
                    <div className={`badge ${tTier.key}`}>{t.toFixed(2)} • {tTier.label}</div>
                  </div>
                  <div className="day-meter">
                    <div
                      className={`day-fill ${tTier.key}`}
                      style={{ width: `${Math.min(100, Math.max(0, t * 100))}%` }}
                    />
                  </div>
                  <ul className="day-tips">
                    {t > 0.6 ? (
                      <>
                        <li>Mute/block two repeat offenders today.</li>
                        <li>Take a 20-minute offline reset (move, hydrate, sunlight).</li>
                      </>
                    ) : t > 0.4 ? (
                      <>
                        <li>Time-box feeds to 15 minutes.</li>
                        <li>Follow two positive creators; unfollow one high-conflict source.</li>
                      </>
                    ) : (
                      <>
                        <li>Maintain mindful habits.</li>
                        <li>Weekly review: prune negative accounts.</li>
                      </>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="report-insights">
            <h2>Insights</h2>
            <ul>
              <li>📊 Track daily exposure patterns and trends.</li>
              <li>📉 Reduce interaction with high-toxicity sources.</li>
              <li>🧘 Balance with positive spaces and mindfulness.</li>
              <li>📆 Set weekly goals for digital detox and well-being tracking.</li>
            </ul>
          </div>

          <button className="pdf-btn" onClick={generatePDF}>Download PDF Report</button>
        </>
      )}
    </div>
  );
};

export default ReportPage;
