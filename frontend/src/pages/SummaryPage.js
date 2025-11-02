import React, { useEffect, useMemo, useState } from "react";
import "./SummaryPage.css";

const SummaryPage = () => {
  const [toxicityData, setToxicityData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  // Fetch latest toxic content from backend
  useEffect(() => {
    fetch("http://localhost:5000/latest-report")
      .then((res) => res.json())
      .then((data) => {
        if (data?.text && data?.toxicity > 0.4) {
          setToxicityData(data);
          generateSummary(data.text);
        }
      })
      .catch((err) => console.error("Error fetching toxicity data:", err));
  }, []);

  // Function to generate summary from toxic content
  const generateSummary = async (text) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) throw new Error("Failed to fetch summary.");

      const data = await res.json();
      setSummaryData(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // ————— UI helpers —————
  const toxicityClass = useMemo(() => {
    if (!toxicityData) return "toxicity-badge neutral";
    const t = Number(toxicityData.toxicity || 0);
    if (t >= 0.8) return "toxicity-badge extreme";
    if (t >= 0.6) return "toxicity-badge high";
    if (t >= 0.4) return "toxicity-badge medium";
    return "toxicity-badge low";
  }, [toxicityData]);

  const truncatedText = useMemo(() => {
    if (!toxicityData?.text) return "";
    const str = toxicityData.text.trim();
    if (showFullText) return str;
    return str.length > 350 ? str.slice(0, 350) + "…" : str;
  }, [toxicityData, showFullText]);

  // Basic client-side extraction of key insights (first 3 meaningful sentences)
  const keyInsights = useMemo(() => {
    const s = summaryData?.summary || "";
    const sentences = s
      .split(/(?<=[.!?])\s+/)
      .map((x) => x.trim())
      .filter((x) => x.length > 0 && x.split(" ").length > 3);
    return sentences.slice(0, 3);
  }, [summaryData]);

  // Lightweight keyword extraction (top N frequent non-stopwords)
  const keywords = useMemo(() => {
    const s = (summaryData?.summary || "").toLowerCase();
    if (!s) return [];
    const stop = new Set([
      "the","a","an","and","or","but","if","then","so","to","of","in","on","for","with","as","by","is","are","was","were",
      "be","been","it","its","that","this","these","those","at","from","into","about","over","after","before","between","within",
      "not","no","yes","you","your","we","they","he","she","i","me","my","our","their","them","his","her"
    ]);
    const counts = {};
    (s.match(/[a-zA-Z]{3,}/g) || []).forEach((w) => {
      if (!stop.has(w)) counts[w] = (counts[w] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([w]) => w);
  }, [summaryData]);

  // Quick actions
  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryData?.summary || "");
    } catch (_) {
      // ignore
    }
  };

  const downloadSummary = () => {
    const blob = new Blob(
      [
        `Toxicity: ${toxicityData?.toxicity?.toFixed(2) ?? "N/A"}\n\nSummary:\n${
          summaryData?.summary ?? ""
        }\n\nRecommendations:\n- ${(summaryData?.recommendations || []).join(
          "\n- "
        )}`,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `toxicity-summary-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="summary-page">
      <h1 className="summary-title">Toxicity Summary & Recommendations</h1>

      {loading && <p className="loading-text">Generating Summary...</p>}

      {toxicityData && (
        <div className="toxicity-info">
          <div className="toxicity-meter">
            <span className="toxicity-label">Toxicity Level</span>
            <span className={toxicityClass}>
              {Number(toxicityData.toxicity).toFixed(2)}
            </span>
          </div>

          <div className="original-snippet">
            <div className="snippet-header">
              <span className="snippet-title">Analyzed Snippet</span>
              <button
                className="btn ghost"
                onClick={() => setShowFullText((s) => !s)}
              >
                {showFullText ? "Show less" : "Show more"}
              </button>
            </div>
            <p className="snippet-body">{truncatedText || "—"}</p>
          </div>
        </div>
      )}

      {summaryData && (
        <div className="summary-container">
          {/* ————— Content Summary (enhanced) ————— */}
          <div className="content-summary-card">
            <div className="section-header">
              <h2>📄 Content Summary</h2>
              <div className="actions">
                <button className="btn" onClick={copySummary} title="Copy">
                  Copy
                </button>
                <button className="btn primary" onClick={downloadSummary} title="Download">
                  Download
                </button>
              </div>
            </div>

            <p className="summary-text">{summaryData.summary}</p>

            {!!keyInsights.length && (
              <div className="insights">
                <div className="insights-title">Key Insights</div>
                <ul className="insights-list">
                  {keyInsights.map((it, idx) => (
                    <li key={idx} className="insight-item">
                      <span className="bullet">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!keywords.length && (
              <div className="keywords">
                {keywords.map((k) => (
                  <span key={k} className="keyword-chip">
                    #{k}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ————— Recommendations (enhanced) ————— */}
          <div className="recommendations-card">
            <p className="recommendation-intro">
              🤖 Based on the analyzed toxicity, here are AI-powered recommendations to improve your digital well-being:
            </p>

            <div className="recommendation-section">
              {(summaryData.recommendations || []).map((rec, index) => {
                const lower = rec.toLowerCase();
                const type = lower.includes("avoid") || lower.includes("limit")
                  ? "alert"
                  : lower.includes("positive") ||
                    lower.includes("healthy") ||
                    lower.includes("mindful") ||
                    lower.includes("practice")
                  ? "positive"
                  : "neutral";
                const icon =
                  type === "alert" ? "⚠️" : type === "positive" ? "🌿" : "💡";

                return (
                  <div key={index} className={`recommendation-card ${type}`}>
                    <div className="rec-icon"><span>{icon}</span></div>
                    <p>{rec}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!toxicityData && !loading && (
        <p className="no-data-text">No recent toxic content detected.</p>
      )}
    </div>
  );
};

export default SummaryPage;
