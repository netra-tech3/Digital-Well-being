import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FourDayToxicityGraph = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" stroke="#000000" />
        <YAxis domain={[0, 1]} stroke="#000000" />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgToxicity" fill="#36b37e" name="Avg Toxicity" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FourDayToxicityGraph;
