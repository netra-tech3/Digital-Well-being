import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const DailyToxicityGraph = ({ data }) => {
  return (
    <div className="card">
      <h2>Today's Toxicity Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="toxicity" stroke="#ff4747" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyToxicityGraph;
