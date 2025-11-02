import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FaChartLine, FaList, FaBrain, FaFileAlt } from "react-icons/fa";
import { Typewriter } from 'react-simple-typewriter';

const Home = () => {
  const navigate = useNavigate();
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCards, setShowCards] = useState(false); // 👈 new state

  const sections = [
    { title: "Toxicity Graph", icon: <FaChartLine />, path: "/toxicity-graph", image: "/assets/toxicity-graph.jpg" },
    { title: "Toxicity Summary", icon: <FaList />, path: "/summary", image: "/assets/summary.jpg" },
    { title: "Mental Health", icon: <FaBrain />, path: "/mental-health", image: "/assets/mental-health.jpg" },
    { title: "Full Report", icon: <FaFileAlt />, path: "/report", image: "/assets/full-report.jpg" },
  ];

  useEffect(() => {
    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true);
    }, 2000);

    const cardsTimer = setTimeout(() => {
      setShowCards(true);
    }, 5500); // Cards appear shortly after subtitle

    return () => {
      clearTimeout(subtitleTimer);
      clearTimeout(cardsTimer);
    };
  }, []);

  return (
    <div className="home-container">
    <div className={`animated-logo ${showSubtitle ? 'move-to-corner' : ''}`}>
  <img src="/assets/logo.png" alt="Logo" className="logo-img" />
</div>

      <h1 className="home-title">
      <Typewriter
  words={['Welcome to Your Digital Well-being Dashboard']}
  loop={false}               // ⬅️ Make sure this is false
  cursor
  cursorStyle='_'
  typeSpeed={70}
  deleteSpeed={0}
  delaySpeed={1000}
/>

      </h1>

      {showSubtitle && (
        <p className="home-subtitle ">
          Monitor your online toxicity and improve your mental health.
        </p>
      )}

      {showCards && (
        <div className="cards-container fade-in-delayed">
          {sections.map((section, index) => (
            <div key={index} className="card" onClick={() => navigate(section.path)}>
              <div className="image-container">
                <img src={section.image} alt={section.title} className="card-image" />
              </div>
              <h2 className="card-title">{section.title}</h2>
              <div className="layer">
                <h3>Go to {section.title}</h3>
                <a href="#">{section.icon}</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
