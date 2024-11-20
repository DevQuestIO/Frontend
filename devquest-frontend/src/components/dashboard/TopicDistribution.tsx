// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import { UserStats } from '@/types/index';

// interface TopicDistributionProps {
//   stats: UserStats;
// }

// export default function TopicDistribution({ stats }: TopicDistributionProps) {
//   // Prepare data with exactly 10 elements
//   const data = Object.entries(stats.by_topic)
//     .sort(([, a], [, b]) => b - a) // Sort in descending order
//     .slice(0, 10) // Take the top 10 elements
//     .map(([name, count]) => ({
//       name: name.replace('-', ' '), // Replace hyphens with spaces
//       count: count,
//     }));

//   // Calculate dynamic height to fit 10 items
//   const chartHeight = data.length * 50; // Adjust item spacing

//   return (
//     <div className="bg-gray-800 rounded-lg p-6">
//       <h3 className="text-lg font-semibold mb-4">Top Topics</h3>
//       {/* Adjust container height dynamically */}
//       <ResponsiveContainer width="100%" height={chartHeight}>
//         <BarChart data={data} layout="vertical" barCategoryGap="20%">
//           <CartesianGrid strokeDasharray="3 3" horizontal={false} />
//           <XAxis type="number" />
//           <YAxis
//             dataKey="name"
//             type="category"
//             width={150} // Increase width to fit longer names
//             tick={{ fill: '#9CA3AF' }} // Style Y-axis ticks
//           />
//           <Tooltip
//             contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
//             cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
//           />
//           <Bar dataKey="count" fill="#6366F1" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }


import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { UserStats } from '@/types/index';

interface TopicDistributionProps {
  stats: UserStats;
}

export default function TopicDistribution({ stats }: TopicDistributionProps) {
  const [showAll, setShowAll] = useState(false);

  // Prepare the full dataset
  const fullData = Object.entries(stats.by_topic)
    .sort(([, a], [, b]) => b - a) // Sort in descending order
    .map(([name, count]) => ({
      name: name.replace('-', ' '), // Replace hyphens with spaces
      count: count,
    }));

  // Conditionally slice data for top 10 or full dataset
  const data = showAll ? fullData : fullData.slice(0, 10);

  // Calculate dynamic height based on the number of items
  const chartHeight = data.length * 50;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Top Topics</h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} layout="vertical" barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            width={150}
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Bar dataKey="count" fill="#6366F1" />
        </BarChart>
      </ResponsiveContainer>
      {/* Show More / Show Less Button */}
      <div className="text-center mt-4">
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
}
