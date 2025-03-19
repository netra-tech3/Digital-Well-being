import React from "react";

const SummarySection = ({ summary }) => {
  return (
    <div className="card">
      <h2>Summary of Toxicity</h2>
      <p>{summary}</p>
    </div>
  );
};

export default SummarySection;
