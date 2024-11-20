'use client';

import { UserStats } from '@/types/index';
import DifficultyChart from './DifficultyChart';
import TopicDistribution from './TopicDistribution';
import ActivityCalendar from './ActivityCalendar';
import SubmissionTrends from './SubmissionTrends';
import TopicsBreakdown from './TopicsBreakdown';
import ContributionHeatmap from './ContributionHeatMap';

interface ChartsGridProps {
  stats: UserStats;
}

const ChartsGrid = ({ stats }: ChartsGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 hover:border-slate-600 transition-colors duration-300">
        <ContributionHeatmap submissions_by_date={stats.calendar_stats.submissions_by_date} />
      </div>
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 hover:border-slate-600 transition-colors duration-300">
        <DifficultyChart stats={stats} />
      </div>
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 hover:border-slate-600 transition-colors duration-300">
        <TopicDistribution stats={stats} />
      </div>
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 hover:border-slate-600 transition-colors duration-300 lg:col-span-2">
        <ActivityCalendar stats={stats} />
      </div>
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 hover:border-slate-600 transition-colors duration-300">
        <SubmissionTrends stats={stats} />
      </div>
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 hover:border-slate-600 transition-colors duration-300">
        <TopicsBreakdown stats={stats} />
      </div>
    </div>
  );
};

export default ChartsGrid;