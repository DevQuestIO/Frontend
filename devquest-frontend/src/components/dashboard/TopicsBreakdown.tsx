import { useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { UserStats } from '@/types/index';

interface TopicsBreakdownProps {
  stats: UserStats;
}

interface RadarDataPoint {
  subject: string;
  value: number;
}

export default function TopicsBreakdown({ stats }: TopicsBreakdownProps) {
  const [filter, setFilter] = useState<'All' | 'Advanced' | 'Intermediate' | 'Fundamental'>('All');

  // Function to generate filtered data based on the selected filter
  const getFilteredData = (): RadarDataPoint[] => {
    let filteredStats = [];
    if (filter === 'Advanced') {
      filteredStats = stats.tag_stats.advanced;
    } else if (filter === 'Intermediate') {
      filteredStats = stats.tag_stats.intermediate;
    } else if (filter === 'Fundamental') {
      filteredStats = stats.tag_stats.fundamental;
    } else {
      // Combine all levels if filter is "All"
      filteredStats = [
        ...stats.tag_stats.advanced,
        ...stats.tag_stats.intermediate,
        ...stats.tag_stats.fundamental,
      ];
    }

    return filteredStats
      .slice(0, 8) // Limit to 8 items for visualization
      .map(tag => ({
        subject: tag.tagName,
        value: typeof tag.problemsSolved === 'object' ? parseInt(tag.problemsSolved['$numberInt'], 10) : tag.problemsSolved,
      }));
  };

  const data = getFilteredData();

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Topics Breakdown</h3>
      {/* Filter Dropdown */}
      <div className="mb-4">
        <label htmlFor="filter" className="block text-gray-300 mb-2">
          Filter by Difficulty:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={e => setFilter(e.target.value as 'All' | 'Advanced' | 'Intermediate' | 'Fundamental')}
          className="bg-gray-700 text-gray-300 rounded-md px-4 py-2"
        >
          <option value="All">All</option>
          <option value="Advanced">Advanced</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Fundamental">Fundamental</option>
        </select>
      </div>

      {/* Radar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF' }} />
          <Radar
            name="Problems Solved"
            dataKey="value"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
