import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { UserStats } from '@/types/index';

interface LanguageDistributionProps {
  stats: UserStats;
}

export default function LanguageDistribution({ stats }: LanguageDistributionProps) {
  const data = stats.by_language.map(lang => ({
    name: lang.languageName,
    value: lang.problemsSolved,
  }));

  const COLORS = ['#10B981', '#6366F1', '#F59E0B'];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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