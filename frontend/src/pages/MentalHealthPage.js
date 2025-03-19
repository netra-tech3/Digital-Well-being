import React, { useEffect, useState } from "react";
import "./MentalHealthPage.css";

const MentalHealthPage = () => {
  const [toxicityData, setToxicityData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/latest-report")
      .then((res) => res.json())
      .then((data) => setToxicityData(data))
      .catch((err) => console.error("Error fetching toxicity data:", err));
  }, []);

  // Determine impact based on toxicity level
  const getImpactMessage = (toxicity) => {
    if (toxicity <= 0.2) return "Your digital well-being is excellent! Keep maintaining a healthy balance.";
    if (toxicity <= 0.4) return "You're slightly exposed to negativity. Stay mindful of your content consumption.";
    if (toxicity <= 0.6) return "Moderate exposure to toxicity. You may experience mild stress or irritability.";
    if (toxicity <= 0.8) return "High exposure detected! This may cause anxiety and emotional exhaustion.";
    return "Critical toxicity level! You may feel overwhelmed. Reduce exposure immediately.";
  };

  return (
    <div className="mental-health-page">
      <h1 className="page-title">Mental Health & Digital Well-being</h1>

      {toxicityData && (
        <div className="impact-section">
          <h2>Toxicity Impact on Your Mental Health</h2>
          <p className="impact-message">{getImpactMessage(toxicityData.toxicity)}</p>
          <p className="toxicity-level">Current Toxicity Level: <strong>{toxicityData.toxicity.toFixed(2)}</strong></p>
        </div>
      )}

      <div className="tips-section">
        <h2>Ways to Reduce Toxicity Consumption</h2>
        <ul>
          <li>✅ Take regular screen breaks & practice digital detox.</li>
          <li>✅ Mute/block toxic content & accounts.</li>
          <li>✅ Follow positive and uplifting communities.</li>
          <li>✅ Engage in mindfulness activities & hobbies.</li>
          <li>✅ Avoid online arguments & negativity.</li>
          <li>✅ Monitor your digital well-being regularly.</li>
        </ul>
      </div>

      <div className="extra-section">
        <h2>The Science Behind Digital Toxicity</h2>
        <p>
          Studies show that prolonged exposure to negative digital content can lead to increased levels of cortisol, the stress hormone.
          It can also impact sleep quality, mood regulation, and overall mental well-being. Reducing toxicity consumption can lead to improved
          focus, better emotional resilience, and a more positive outlook on life.
        </p>
      </div>

      <div className="resources-section">
        <h2>Understanding Mental Well-being</h2>
        <p>
          Mental well-being is influenced by the type of content we consume daily. High exposure to negativity can lead to stress, anxiety,
          and even depression. Developing a mindful digital habit can significantly improve focus, productivity, and overall happiness.
        </p>
        <h3>Steps to Improve Mental Well-being:</h3>
        <ul>
          <li>💡 Start your day with positive affirmations.</li>
          <li>💡 Limit screen time before sleeping for better rest.</li>
          <li>💡 Engage in physical activities to boost mental health.</li>
          <li>💡 Develop a habit of mindful consumption – ask yourself if the content benefits you.</li>
        </ul>
      </div>
    </div>
  );
};

export default MentalHealthPage;
