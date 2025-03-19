import React from "react";

const ReportGeneration = ({ data }) => {
  return (
    <div className="card">
      <h2>4-Day Digital Well-being Report</h2>
      <ul>
        {data.map((entry, index) => (
          <li key={index}>
            <strong>{entry.date}:</strong> Toxicity Level -{" "}
            {entry.toxicity.toFixed(2)}
          </li>
        ))}
      </ul>
      <button className="download-btn">Download Report</button>
    </div>
  );
};

export default ReportGeneration;
