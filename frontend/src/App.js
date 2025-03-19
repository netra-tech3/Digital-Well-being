// import React, { useEffect, useState } from "react";
// import ToxicityDisplay from "./components/ToxicityDisplay";
// import Navbar from "./components/Navbar";
// import ToxicityGraph from "./components/ToxicityGraph";
// import DailyToxicityGraph from "./components/DailyToxicityGraph";
// import SummarySection from "./components/SummarySection";
// import MentalHealthSection from "./components/MentalHealthSection";
// import ReportGeneration from "./components/ReportGeneration";
// import "./App.css";

// const App = () => {
//   const [data, setData] = useState({ text: "", toxicity: 0 });
//   const [dailyToxicityData, setDailyToxicityData] = useState([]);
//   const [toxicityData, setToxicityData] = useState([]);
//   const [summary, setSummary] = useState("");
//   const [averageToxicity, setAverageToxicity] = useState(0);

//   useEffect(() => {
//     const fetchToxicity = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/latest-report");
//         const result = await response.json();
//         setData(result);
//       } catch (error) {
//         console.error("Error fetching toxicity report:", error);
//       }
//     };

//     const fetchToxicityReport = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/report");
//         const result = await response.json();
//         setToxicityData(result.toxicityData);
//         setAverageToxicity(result.averageToxicity);
//         setSummary(result.recommendation);
//       } catch (error) {
//         console.error("Error fetching toxicity data:", error);
//       }
//     };

//     const fetchDailyToxicity = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/daily-report");
//         const result = await response.json();
//         setDailyToxicityData(result.dailyToxicityData);
//       } catch (error) {
//         console.error("Error fetching daily toxicity data:", error);
//       }
//     };

//     fetchToxicity();
//     fetchToxicityReport();
//     fetchDailyToxicity();
//     const interval = setInterval(() => {
//       fetchToxicity();
//       fetchToxicityReport();
//       fetchDailyToxicity();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="dashboard">
//       <Navbar />
//       <DailyToxicityGraph data={dailyToxicityData} />
//       <ToxicityGraph data={toxicityData} />
//       <SummarySection summary={summary} />
//       <MentalHealthSection averageToxicity={averageToxicity} />
//       <ReportGeneration data={toxicityData} />
//       <ToxicityDisplay text={data.text} toxicity={data.toxicity} />
//     </div>
//   );
// };

// export default App;







import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ToxicityGraphPage from "./pages/ToxicityGraphPage";
import SummaryPage from "./pages/SummaryPage";
import MentalHealthPage from "./pages/MentalHealthPage";
import ReportPage from "./pages/ReportPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/toxicity-graph" element={<ToxicityGraphPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/mental-health" element={<MentalHealthPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
};

export default App;

