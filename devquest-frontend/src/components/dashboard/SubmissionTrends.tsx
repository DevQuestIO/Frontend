import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { UserStats } from '@/types/index';

interface SubmissionTrendsProps {
  stats: UserStats;
}

export default function SubmissionTrends({ stats }: SubmissionTrendsProps) {
  const generateCompleteTimelineData = () => {
    // Get today's date
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0); // Normalize to start of the day
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 59); // Go back 60 days (including today)

    const timelineData = [];
    const currentDate = new Date(startDate);

    // Generate all dates in the 60-day period
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD format

      // Map submissions to the correct date
      timelineData.push({
        fullDate: dateKey,
        date: currentDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        submissions: stats.calendar_stats.submissions_by_date[dateKey] || 0, // Default to 0 if no data
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timelineData;
  };

  const data = generateCompleteTimelineData();

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Daily Submissions (Last 60 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date"
            interval="preserveStartEnd"
            tickFormatter={(value, index) => {
              // Show date every 10 days to prevent overcrowding
              return index % 10 === 0 ? value : '';
            }}
          />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            cursor={{ stroke: '#6366F1' }}
            labelFormatter={(label) => `Date: ${label}`}
            formatter={(value) => [`${value} submissions`, 'Submissions']}
          />
          <Line
            type="monotone"
            dataKey="submissions"
            stroke="#6366F1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
