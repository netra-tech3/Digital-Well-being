import React from "react";

const ReportGeneration = ({ data }) => {
  return (
    <div className="card">
      
      <ul>
        {data.map((entry, index) => (
          <li key={index}>
            <strong>{entry.date}:</strong> Toxicity Level -{" "}
            {entry.toxicity.toFixed(2)}
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default ReportGeneration;
