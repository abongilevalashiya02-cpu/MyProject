import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  {
    name: 'Europe/Asia',
    cost: 100,
  },
  {
    name: 'Africa',
    cost: 45,
  },
];

const CostEffectivenessChart = () => {
  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          layout="horizontal"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            type="number" 
            domain={[0, 120]}
            tick={{ fill: '#D1D5DB', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <YAxis 
            type="category" 
            dataKey="name"
            tick={{ fill: '#D1D5DB', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none', 
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value) => [`${value}%`, 'Relative Event Cost']}
          />
          <Bar 
            dataKey="cost" 
            fill="hsl(var(--bantu-orange))"
            radius={[0, 4, 4, 0]}
          >
            <Cell fill="hsl(var(--bantu-orange))" />
            <Cell fill="hsl(var(--bantu-orange))" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostEffectivenessChart;