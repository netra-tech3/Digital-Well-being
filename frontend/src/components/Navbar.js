import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaChartLine, FaList, FaBrain, FaFileAlt, FaHome } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">Toxicity Dashboard</h2>
      <ul>
        <li><Link to="/"><FaHome /> Home</Link></li>
        <li><Link to="/toxicity-graph"><FaChartLine /> Toxicity Graph</Link></li>
        <li><Link to="/summary"><FaList /> Summary</Link></li>
        <li><Link to="/mental-health"><FaBrain /> Mental Health</Link></li>
        <li><Link to="/report"><FaFileAlt /> Report</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
