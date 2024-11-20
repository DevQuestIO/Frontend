import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { UserStats } from '@/types/index';

interface ActivityCalendarProps {
  stats: UserStats;
}

export default function ActivityCalendar({ stats }: ActivityCalendarProps) {
  // Generate data for all months in the year
  const generateFullYearData = () => {
    const year = 2024;  // Current year from the data
    const allMonths = [];
    
    // Generate all 12 months
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      
      allMonths.push({
        month: date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        submissions: stats.calendar_stats.monthly_submissions[monthKey] || 0,
      });
    }
    
    return allMonths;
  };

  const data = generateFullYearData();

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Activity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            cursor={{ stroke: '#6366F1' }}
          />
          <Area
            type="monotone"
            dataKey="submissions"
            stroke="#6366F1"
            fillOpacity={1}
            fill="url(#colorSubmissions)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}