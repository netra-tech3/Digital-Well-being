import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FaChartLine, FaList, FaBrain, FaFileAlt } from "react-icons/fa";

/* const SECTIONS = [
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
]; */

const Home = () => {
  const navigate = useNavigate();
  const [subtitleReady, setSubtitleReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSubtitleReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="home-container">
      {/* background decor (z below content) */}
      <div className="grid-glow" aria-hidden="true" />
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />
      <img
        src="/assets/background-pattern.svg"
        alt=""
        className="background-pattern"
        aria-hidden="true"
      />
      {/* Cards are ALWAYS mounted; animation via CSS only */}
      {/* <div className="cards-container">
        {SECTIONS.map((section, index) => (
          <button
            key={section.path}
            type="button"
            className="card"
            onClick={() => navigate(section.path)}
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
      </div> */}

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Why Digital Well-being Matters</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Track Exposure</h3>
            <p className="feature-text">
              Monitor your daily exposure to toxic content across platforms in
              real-time.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 className="feature-title">Understand Impact</h3>
            <p className="feature-text">
              Learn how online toxicity affects your mental health and
              well-being.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Build Healthy Habits</h3>
            <p className="feature-text">
              Get actionable insights and coping strategies for healthier
              digital living.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Data-Driven Reports</h3>
            <p className="feature-text">
              Generate comprehensive reports to track your progress over time.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Install Extension</h3>
            <p className="step-text">
              Add our browser extension to monitor your online activity
              automatically.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Track & Analyze</h3>
            <p className="step-text">
              Our AI analyzes content for toxicity levels and patterns in
              real-time.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Get Insights</h3>
            <p className="step-text">
              Receive personalized insights and recommendations for healthier
              habits.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3 className="step-title">Improve Well-being</h3>
            <p className="step-text">
              Use the data to make informed decisions and improve your digital
              well-being.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Start Your Digital Well-being Journey</h2>

          <div className="cta-content">
            <div className="cta-left">
              <img src="/assets/logo.png" alt="App Logo" className="logo-img" />
            </div>

            <div className="cta-right">
              <p className="cta-subtitle">
                Take control of your online experience and improve your mental
                health today
              </p>

              <div className="cta-buttons">
                <button
                  className="cta-btn primary-btn"
                  onClick={() => navigate("/toxicity-graph")}
                >
                  View Your Dashboard
                </button>

                {/* <button
                  className="cta-btn secondary-btn"
                  onClick={() => navigate("/mental-health")}
                >
                  Learn More
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
