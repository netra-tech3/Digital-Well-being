import React, { useEffect, useState } from "react";
import "./SummaryPage.css";

const SummaryPage = () => {
  const [toxicityData, setToxicityData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch latest toxic content from backend
  useEffect(() => {
    fetch("http://localhost:5000/latest-report")
      .then((res) => res.json())
      .then((data) => {
        if (data.text && data.toxicity > 0.45) { // Only summarize if toxicity is high
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

      if (!res.ok) {
        throw new Error("Failed to fetch summary.");
      }

      const data = await res.json();
      setSummaryData(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
    setLoading(false);
  };

  return (
    <div className="summary-page">
      <h1 className="summary-title">Toxicity Summary & Recommendations</h1>

      {loading && <p className="loading-text">Generating Summary...</p>}

      {toxicityData && (
        <div className="toxicity-info">
         
          <p className="toxicity-score">
            <strong>Toxicity Level:</strong> {toxicityData.toxicity.toFixed(2)}
          </p>
        </div>
      )}

      {summaryData && (
        <div className="summary-container">
          <h2>📄 Content Summary</h2>
          <p className="summary-text">{summaryData.summary}</p>

          <h2>🛠 Recommendations</h2>
          <ul className="suggestions-list">
            {summaryData.recommendations.map((rec, index) => (
              <li key={index}>✅ {rec}</li>
            ))}
          </ul>
        </div>
      )}

      {!toxicityData && !loading && <p className="no-data-text">No recent toxic content detected.</p>}
    </div>
  );
};

export default SummaryPage;
