import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Top Section */}
        <div className="footer-content">

          {/* About */}
          <div className="footer-section">
            <h3>Digital Well-being</h3>
            <p>
              Monitor your exposure to online toxicity, understand its impact on
              mental health, and build healthier digital habits using AI-powered insights.
            </p>
          </div>

          {/* Features */}
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Real-time Toxicity Tracking</li>
              <li>AI Summaries</li>
              <li>Mental Health Insights</li>
              <li>Detailed Reports</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact</h4>
            <p>support@digitalwellbeing.com</p>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© 2026 Digital Well-being Dashboard. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;