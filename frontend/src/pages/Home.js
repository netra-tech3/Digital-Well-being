import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FaChartLine, FaList, FaBrain, FaFileAlt } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";

// Stable, module-scope sections (no useMemo)
const SECTIONS = [
  {
    title: "Toxicity Graph",
    icon: <FaChartLine />,
    path: "/toxicity-graph",
    image: "/assets/toxicity-graph.jpg",
    desc: "See your hourly and 4-day exposure.",
  },
  {
    title: "Toxicity Summary",
    icon: <FaList />,
    path: "/summary",
    image: "/assets/summary.jpg",
    desc: "AI summary with key insights & tips.",
  },
  {
    title: "Mental Health",
    icon: <FaBrain />,
    path: "/mental-health",
    image: "/assets/mental-health.jpg",
    desc: "Impact analysis + coping actions.",
  },
  {
    title: "Full Report",
    icon: <FaFileAlt />,
    path: "/report",
    image: "/assets/full-report.jpg",
    desc: "Download a polished PDF report.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [subtitleReady, setSubtitleReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSubtitleReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleCardKey = (e, path) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <div className="home-container">
      {/* background decor (z below content) */}
      <div className="grid-glow" aria-hidden="true" />
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />

      {/* Logo that moves to corner after intro */}
      <div className={`animated-logo ${subtitleReady ? "move-to-corner" : ""}`}>
        <img src="/assets/logo.png" alt="App Logo" className="logo-img" loading="eager" />
      </div>

      <h1 className="home-title">
        <Typewriter
          words={["Welcome to Your Digital Well-being Dashboard"]}
          loop={false}
          cursor
          cursorStyle="_"
          typeSpeed={64}
          deleteSpeed={0}
          delaySpeed={700}
        />
      </h1>

      <p className={`home-subtitle ${subtitleReady ? "in" : ""}`}>
        Monitor your online toxicity, understand its impact, and build healthier digital habits.
      </p>

      {/* Cards are ALWAYS mounted; animation via CSS only */}
      <div className="cards-container">
        {SECTIONS.map((section, index) => (
          <button
            key={section.path}
            className="card"
            onClick={() => navigate(section.path)}
            onKeyDown={(e) => handleCardKey(e, section.path)}
            title={`Go to ${section.title}`}
            aria-label={`Open ${section.title}`}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="image-container">
              <img
                src={section.image}
                alt={section.title}
                className="card-image"
                loading={index > 1 ? "lazy" : "eager"}
              />
            </div>

            <div className="card-content">
              <div className="card-title-row">
                <h2 className="card-title">{section.title}</h2>
                <span className="card-icon" aria-hidden="true">
                  {section.icon}
                </span>
              </div>
              <p className="card-desc">{section.desc}</p>
            </div>

            <div className="layer" aria-hidden="true">
              <div className="layer-inner">Open</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
