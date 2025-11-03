import React, { useEffect, useMemo, useState } from "react";
import ToxicityGraph from "../components/ToxicityGraph";
import FourDayToxicityGraph from "../components/FourDayToxicityGraph";
import "./ToxicityGraphPage.css";

const tierOf = (v) => {
  const t = Number(v || 0);
  if (t <= 0.2) return { label: "Excellent", key: "excellent" };
  if (t <= 0.4) return { label: "Low", key: "low" };
  if (t <= 0.6) return { label: "Moderate", key: "moderate" };
  if (t <= 0.8) return { label: "High", key: "high" };
  return { label: "Very High", key: "critical" };
};

// normalize shapes from API
const normalizeReportItem = (e, idx) => {
  const toxicity =
    typeof e?.avgToxicity === "number"
      ? e.avgToxicity
      : typeof e?.toxicity === "number"
      ? e.toxicity
      : 0;
  return { date: e?.date || `Day ${idx + 1}`, toxicity: Number(toxicity || 0) };
};

export default function ToxicityGraphPage() {
  const [toxicityData, setToxicityData] = useState([]);      // report -> daily list
  const [fourDayData, setFourDayData] = useState([]);        // /toxicity-four-days
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [r1, r2] = await Promise.all([
        fetch("http://localhost:5000/report"),
        fetch("http://localhost:5000/toxicity-four-days"),
      ]);

      if (!r1.ok) throw new Error(`Report HTTP ${r1.status}`);
      if (!r2.ok) throw new Error(`FourDays HTTP ${r2.status}`);

      const report = await r1.json();
      const four = await r2.json();

      const list = Array.isArray(report?.toxicityData) ? report.toxicityData : [];
      setToxicityData(list.map((e, i) => normalizeReportItem(e, i)));

      // allow either array of {day/date, avgToxicity} or already-normalized
      const mappedFour = Array.isArray(four)
        ? four.map((e, i) => ({
            label: e.date || e.day || `Day ${i + 1}`,
            value:
              typeof e?.avgToxicity === "number"
                ? e.avgToxicity
                : typeof e?.toxicity === "number"
                ? e.toxicity
                : 0,
          }))
        : [];
      setFourDayData(mappedFour);

      setUpdatedAt(new Date());
    } catch (e) {
      setErr(e?.message || "Failed to load graphs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats24h = useMemo(() => {
    if (!toxicityData.length) return null;
    const vals = toxicityData.map((d) => Number(d.toxicity || 0));
    const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    return { avg, min, max, tier: tierOf(avg) };
  }, [toxicityData]);

  const stats4d = useMemo(() => {
    if (!fourDayData.length) return null;
    const vals = fourDayData.map((d) => Number(d.value || 0));
    const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    return { avg, min, max, tier: tierOf(avg) };
  }, [fourDayData]);

  return (
    <div className="tox-page">
      <header className="tox-header">
        <div className="title-wrap">
          <h1 className="tox-title">📊 Toxicity Graphs</h1>
          {updatedAt && (
            <span className="badge time">
              Updated {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        <div className="header-actions">
          <button className="btn ghost" onClick={fetchAll}>Refresh</button>
        </div>
      </header>

      {err && <div className="banner error">⚠️ {err}</div>}
      {loading && (
        <>
          <div className="graph-card skeleton">
            <div className="skeleton-bar" />
            <div className="skeleton-chart" />
          </div>
          <div className="graph-card skeleton">
            <div className="skeleton-bar" />
            <div className="skeleton-chart" />
          </div>
        </>
      )}

      {!loading && (
        <>
          {/* Last 24 Hours */}
          <section className="graph-card">
            <div className="card-head">
              <h2>Last 24 Hours Toxicity</h2>
              {stats24h && (
                <div className="chips">
                  <span className={`chip ${stats24h.tier.key}`}>
                    Avg {stats24h.avg.toFixed(2)} • {stats24h.tier.label}
                  </span>
                  <span className="chip neutral">Min {stats24h.min.toFixed(2)}</span>
                  <span className="chip neutral">Max {stats24h.max.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="graph-wrap">
              <ToxicityGraph data={toxicityData} />
            </div>
            <Legend />
          </section>

          {/* Last 4 Days */}
          <section className="graph-card">
            <div className="card-head">
              <h2>Last 4 Days Average Toxicity</h2>
              {stats4d && (
                <div className="chips">
                  <span className={`chip ${stats4d.tier.key}`}>
                    Avg {stats4d.avg.toFixed(2)} • {stats4d.tier.label}
                  </span>
                  <span className="chip neutral">Min {stats4d.min.toFixed(2)}</span>
                  <span className="chip neutral">Max {stats4d.max.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="graph-wrap">
              <FourDayToxicityGraph data={fourDayData} />
            </div>
            <Legend />
          </section>
        </>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="legend">
      <span className="legend-item">
        <span className="dot excellent" /> ≤ 0.20 Excellent
      </span>
      <span className="legend-item">
        <span className="dot low" /> 0.21–0.40 Low
      </span>
      <span className="legend-item">
        <span className="dot moderate" /> 0.41–0.60 Moderate
      </span>
      <span className="legend-item">
        <span className="dot high" /> 0.61–0.80 High
      </span>
      <span className="legend-item">
        <span className="dot critical" /> ≥ 0.81 Very High
      </span>
    </div>
  );
}
