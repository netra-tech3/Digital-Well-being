import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FaChartLine, FaList, FaBrain, FaFileAlt } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  const sections = [
    { title: "Toxicity Graph", icon: <FaChartLine />, path: "/toxicity-graph" },
    { title: "Toxicity Summary", icon: <FaList />, path: "/summary" },
    { title: "Mental Health", icon: <FaBrain />, path: "/mental-health" },
    { title: "Full Report", icon: <FaFileAlt />, path: "/report" },
  ];

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Your Digital Well-being Dashboard</h1>
      <p className="home-subtitle">Monitor your online toxicity and improve your mental health.</p>
      <div className="cards-container">
        {sections.map((section, index) => (
          <div key={index} className="card" onClick={() => navigate(section.path)}>
            <div className="icon">{section.icon}</div>
            <h2>{section.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
