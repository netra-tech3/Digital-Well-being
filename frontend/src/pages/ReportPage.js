import React, { useEffect, useState, useRef } from "react";
import ReportGeneration from "../components/ReportGeneration";
import jsPDF from "jspdf";
import "./ReportPage.css";

const ReportPage = () => {
  const [toxicityData, setToxicityData] = useState([]);
  const reportRef = useRef();

  useEffect(() => {
    fetch("http://localhost:5000/report")
      .then((res) => res.json())
      .then((data) => setToxicityData(data.toxicityData))
      .catch((err) => console.error("Error fetching report:", err));
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    // Draw colorful border
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);

    // Title and Date with styling
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(20);
    doc.text("Digital Well-being Report", 20, 25);

    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(`Date: ${today}`, 150, 25);

    // Intro
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("This report analyzes your online content exposure and toxicity levels over the past 4 days. Regular monitoring ensures balanced mental health and a positive digital experience.", 20, 35, { maxWidth: 170 });

    // Toxicity Data
    let avgToxicity = 0;
    toxicityData.forEach((entry, index) => {
      avgToxicity += entry.toxicity;
      const yOffset = 55 + index * 30;
      let impact = "Low";
      let color = [34, 139, 34];
      if (entry.toxicity > 0.4 && entry.toxicity <= 0.6) {
        impact = "Moderate";
        color = [255, 165, 0];
      } else if (entry.toxicity > 0.6 && entry.toxicity <= 0.8) {
        impact = "High";
        color = [255, 99, 71];
      } else if (entry.toxicity > 0.8) {
        impact = "Very High";
        color = [220, 20, 60];
      }

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(13);
      doc.text(`Day ${index + 1} - ${entry.date}`, 20, yOffset);

      doc.setTextColor(...color);
      doc.text(`Toxicity Level: ${entry.toxicity.toFixed(2)} (${impact})`, 30, yOffset + 10);
    });

    avgToxicity = toxicityData.length ? (avgToxicity / toxicityData.length).toFixed(2) : "0.00";
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text("\nAverage Toxicity Level: " + avgToxicity, 20, 180);

    let overallAssessment = "Balanced Usage";
    let assessColor = [34, 139, 34];
    if (avgToxicity > 0.4 && avgToxicity <= 0.6) {
      overallAssessment = "Monitor Usage";
      assessColor = [255, 165, 0];
    } else if (avgToxicity > 0.6) {
      overallAssessment = "Reduce Toxic Content";
      assessColor = [220, 20, 60];
    }

    doc.setTextColor(...assessColor);
    doc.setFontSize(12);
    doc.text("Overall Assessment: " + overallAssessment, 20, 190);

    doc.setTextColor(0);
    doc.text("\nRecommendations:", 20, 200);
    const insights = [
      "1. Minimize time on toxic content platforms.",
      "2. Engage with positive digital communities.",
      "3. Practice digital detox routines weekly.",
      "4. Use tools to block/mute toxic sources.",
      "5. Focus on mental well-being with mindfulness activities."
    ];

    insights.forEach((tip, i) => {
      doc.setTextColor(0);
      doc.text(tip, 20, 210 + i * 10);
    });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("\nConfidential - For Personal Use Only", 70, 280);

    doc.save("Digital_Wellbeing_Report.pdf");
  };

  return (
    <div className="report-page">
      <h1 className="page-title">Full Digital Well-being Report</h1>

      <div className="report-summary">
        <p>
          This report shows your toxicity exposure over the last 4 days, including daily toxicity levels and
          average exposure. Maintaining awareness of digital consumption is essential for mental health and productivity.
        </p>
      </div>

      <div ref={reportRef}>
        <ReportGeneration data={toxicityData} />
      </div>

      <div className="report-insights">
        <h2>Insights:</h2>
        <ul>
          <li>📊 Monitor your daily online activity and content quality.</li>
          <li>📉 Reduce interaction with high-toxicity content sources.</li>
          <li>🧘 Prioritize positive digital spaces and mindfulness practices.</li>
          <li>📆 Set weekly goals for digital detox and well-being tracking.</li>
        </ul>
      </div>

      <button className="pdf-btn" onClick={generatePDF}>Download PDF Report</button>
    </div>
  );
};

export default ReportPage;
