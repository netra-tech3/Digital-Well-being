import React from "react";

const MentalHealthSection = ({ averageToxicity }) => {
  return (
    <div className="card">
      <h2>Impact on Mental Health</h2>
      {averageToxicity > 0.5 ? (
        <p>
          High exposure to toxic content can lead to stress, anxiety, and
          negative emotions. Consider reducing screen time and engaging in
          positive activities.
        </p>
      ) : (
        <p>
          Your digital well-being is stable. Maintaining a balanced content
          consumption is good for mental health!
        </p>
      )}
    </div>
  );
};

export default MentalHealthSection;
