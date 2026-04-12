
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ToxicityGraphPage from "./pages/ToxicityGraphPage";
import SummaryPage from "./pages/SummaryPage";
import MentalHealthPage from "./pages/MentalHealthPage";
import ReportPage from "./pages/ReportPage";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

const AppWrapper = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/';

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/toxicity-graph" element={<ToxicityGraphPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/mental-health" element={<MentalHealthPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
