import { Typewriter } from "react-simple-typewriter";
import "./Header.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [showTypewriter, setShowTypewriter] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypewriter(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);
  return (
    <header className="header">
      <div className="header-container">
        {/* Title Section */}
        {isHome && (
          <div className="header-content">
            <h1 className="home-title">
              {showTypewriter ? (
                <Typewriter
                  words={["Welcome To Digital Well Being Dashboard"]}
                  loop={false}
                  cursor
                  cursorStyle="|"
                  typeSpeed={60}
                  deleteSpeed={0}
                  delaySpeed={800}
                />
              ) : (
                "Welcome To Digital Well Being Dashboard"
              )}
            </h1>
            <p className="header-subtitle">
              Monitor, analyze, and improve your digital habits with AI-powered
              insights
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
