
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ToxicityGraphPage from "./pages/ToxicityGraphPage";
import SummaryPage from "./pages/SummaryPage";
import MentalHealthPage from "./pages/MentalHealthPage";
import ReportPage from "./pages/ReportPage";
import Navbar from "./components/Navbar";

const AppWrapper = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/toxicity-graph" element={<ToxicityGraphPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/mental-health" element={<MentalHealthPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
