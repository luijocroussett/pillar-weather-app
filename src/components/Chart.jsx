import React from 'react';
import {
  BarChart,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
} from 'recharts';

const Chart = ({ data }) => {
  return (
    <div className="chart">
      <BarChart width={300} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="temp" fill="#8884d8" />
        <Bar dataKey="hum" fill="#82ca9d" />
        <Bar dataKey="pre" fill="#89CFF0" />
      </BarChart>
    </div>
  );
};

export default Chart;
