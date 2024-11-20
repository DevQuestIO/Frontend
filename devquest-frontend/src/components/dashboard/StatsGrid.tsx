// Example usage in StatsGrid.tsx
'use client';

import { UserStats } from '@/types/index';
import StatsCard from './StatsCard';
import { Code2, Flame, Target, Award, Brain, CheckCircle2, Trophy } from 'lucide-react';

interface StatsGridProps {
  stats: UserStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Problems"
        value={stats.total_solved}
        Icon={CheckCircle2}
        trend={12}
        description="Total problems solved"
        color='bg-green-500'
      />
      <StatsCard
        title="Current Streak"
        value={stats.calendar_stats.streaks.current}
        Icon={Flame}
        trend={2}
        color='bg-blue-500'
        description="Consecutive days coding"
      />
      <StatsCard
        title="Success Rate"
        value={Math.round(stats.problem_counts.beats.Medium || 0)}
        Icon={Target}
        trend={5}
        color='bg-yellow-500'
        description="Medium problems success"
      />
      <StatsCard
        title="Best Streak"
        value={stats.calendar_stats.streaks.longest}
        Icon={Trophy}
        color='bg-red-500'
        description="Your longest streak"
      />
    </div>
  );
}