import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Local Procurement Spend', value: 90.5, color: 'hsl(var(--bantu-orange))' },
  { name: 'Other Spend', value: 9.5, color: '#073B4C' },
];

const COLORS = ['hsl(var(--bantu-orange))', '#073B4C'];

const LocalProcurementChart = () => {
  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none', 
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value) => [`${value}%`, '']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ color: '#D1D5DB' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LocalProcurementChart;