import React, { useEffect, useState } from "react";
import ReportGeneration from "../components/ReportGeneration";
import "./ReportPage.css";


const ReportPage = () => {
  const [toxicityData, setToxicityData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/report")
      .then((res) => res.json())
      .then((data) => setToxicityData(data.toxicityData))
      .catch((err) => console.error("Error fetching report:", err));
  }, []);

  return (
    <div className="page">
      <h1>Full Digital Well-being Report</h1>
      <ReportGeneration data={toxicityData} />
    </div>
  );
};

export default ReportPage;
