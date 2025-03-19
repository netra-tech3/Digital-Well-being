import React, { useEffect, useState } from "react";
import ToxicityGraph from "../components/ToxicityGraph";

const ToxicityGraphPage = () => {
  const [toxicityData, setToxicityData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/report")
      .then((res) => res.json())
      .then((data) => setToxicityData(data.toxicityData))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Toxicity Graph (Last 4 Days)</h1>
      </div>
      <div style={styles.graphContainer}>
        <div style={styles.graphWrapper}>
          <ToxicityGraph data={toxicityData} />
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
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #1b1b2f, #2a2a4a)",
    color: "white",
    textAlign: "center",
    padding: "40px",
  },
  header: {
    position: "absolute",
    top: "30px",
    textAlign: "center",
    width: "100%",
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "bold",
    textShadow: "4px 4px 12px rgba(255, 255, 255, 0.8)",
  },
  graphContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    maxWidth: "1100px",
    minHeight: "450px",
    background: "rgb(143, 207, 226)", // Removed blur effect and made it simple
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0px 12px 25px rgba(255, 255, 255, 0.2)", // Kept subtle shadow for elegance
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  },
  graphWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default ToxicityGraphPage;
