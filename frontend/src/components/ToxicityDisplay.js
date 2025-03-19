import React from "react";

const ToxicityDisplay = ({ text, toxicity }) => {
  return (
    <div>
      <h2>Extracted Text</h2>
      <p>{text}</p>
      <h3>Toxicity Score: {toxicity}</h3>
    </div>
  );
};

export default ToxicityDisplay;
