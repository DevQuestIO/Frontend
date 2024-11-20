import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { UserStats } from '@/types/index';

interface DifficultyChartProps {
  stats: UserStats;
}

export default function DifficultyChart({ stats }: DifficultyChartProps) {
  const data = [
    { name: 'Easy', value: stats.problem_counts.solved.Easy, color: '#10B981' },
    { name: 'Medium', value: stats.problem_counts.solved.Medium, color: '#F59E0B' },
    { name: 'Hard', value: stats.problem_counts.solved.Hard, color: '#EF4444' },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Problem Difficulty</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}