import React, { useEffect, useState } from "react";
import ToxicityGraph from "../components/ToxicityGraph";
import FourDayToxicityGraph from "../components/FourDayToxicityGraph";

const ToxicityGraphPage = () => {
  const [toxicityData, setToxicityData] = useState([]);
  const [fourDayData, setFourDayData] = useState([]); // new state for 4-day graph

  useEffect(() => {
    fetch("http://localhost:5000/report")
      .then((res) => res.json())
      .then((data) => setToxicityData(data.toxicityData))
      .catch((err) => console.error("Error fetching data:", err));

    fetch("http://localhost:5000/toxicity-four-days")
      .then((res) => res.json())
      .then((data) => setFourDayData(data))
      .catch((err) => console.error("Error fetching 4-day toxicity data:", err));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>📊 Toxicity Dashboard</h1>
      </div>

      {/* Graph 1: Last 24 Hours */}
      <div style={styles.graphContainer}>
        <h2 style={styles.subheading}>Last 24 Hours Toxicity</h2>
        <div style={styles.graphWrapper}>
          <ToxicityGraph data={toxicityData} />
        </div>
      </div>

      {/* Graph 2: Last 4 Days */}
      <div style={{ ...styles.graphContainer }}>
        <h2 style={styles.subheading}>Last 4 Days Average Toxicity</h2>
        <div style={styles.graphWrapper}>
          <FourDayToxicityGraph data={fourDayData} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1b1b2f, #2a2a4a)",
    color: "white",
    textAlign: "center",
    padding: "40px",
    gap: "40px",
  },
  header: {
    marginBottom: "20px",
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "bold",
    textShadow: "4px 4px 12px rgba(255, 255, 255, 0.8)",
  },
  subheading: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#222",
  },
  graphContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "85%",
    maxWidth: "1100px",
    minHeight: "400px",
    background: "rgb(143, 207, 226)",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0px 12px 25px rgba(255, 255, 255, 0.2)",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  },
  graphWrapper: {
    width: "100%",
    height: "100%",
  },
};

export default ToxicityGraphPage;
