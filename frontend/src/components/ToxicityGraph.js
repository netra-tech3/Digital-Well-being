import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ToxicityGraph = ({ data }) => {
  return (
    <div style={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
          <XAxis dataKey="date" stroke="#000000" />
          <YAxis stroke="#000000" />
          <Tooltip />
          {/* Updated line color to extremely dark black */}
          <Line type="monotone" dataKey="toxicity" stroke="#8B0000" strokeWidth={3} dot={{ fill: "#8B0000", r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = {
  chartContainer: {
    width: "100%",
    maxWidth: "900px",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    boxShadow: "0px 8px 16px rgba(255, 255, 255, 0.2)",
  },
};

export default ToxicityGraph;
