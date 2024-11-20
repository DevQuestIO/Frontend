// components/dashboard/ContributionHeatmap.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Info } from 'lucide-react';

interface ContributionHeatmapProps {
  submissions_by_date: Record<string, number>;
}

interface DayData {
  date: Date;
  count: number;
  level: number;
  month: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ContributionHeatmap = ({ submissions_by_date }: ContributionHeatmapProps) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  const {
    calendarData,
    maxSubmissions,
    totalSubmissions,
    monthLabels
  } = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(today.getDate() + 1);

    const calendarData: (DayData | null)[][] = Array(7).fill(null).map(() => []);
    let maxSubmissions = 0;
    let totalSubmissions = 0;
    const monthLabels: { month: string; startIndex: number; endIndex: number }[] = [];
    
    let currentDate = new Date(oneYearAgo);
    let lastMonth = -1;
    let weekIndex = 0;
    let monthStartIndex = 0;

    while (currentDate <= today) {
      const dayOfWeek = currentDate.getDay();
      const currentMonth = currentDate.getMonth();
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = submissions_by_date[dateStr] || 0;

      // Track month changes and add gaps
      if (currentMonth !== lastMonth) {
        if (lastMonth !== -1) {
          // Add month label for the completed month
          monthLabels.push({
            month: new Date(currentDate.getFullYear(), lastMonth).toLocaleString('default', { month: 'short' }),
            startIndex: monthStartIndex,
            endIndex: weekIndex
          });
          
          // Add a gap column
          for (let i = 0; i < 7; i++) {
            calendarData[i].push(null);
          }
          weekIndex++;
          monthStartIndex = weekIndex;
        }
        lastMonth = currentMonth;
      }

      maxSubmissions = Math.max(maxSubmissions, count);
      totalSubmissions += count;

      calendarData[dayOfWeek].push({
        date: new Date(currentDate),
        count,
        level: count === 0 ? 0 : Math.ceil((count / (maxSubmissions || 1)) * 4),
        month: currentMonth
      });

      currentDate.setDate(currentDate.getDate() + 1);
      if (dayOfWeek === 6) weekIndex++;
    }

    // Add the last month
    monthLabels.push({
      month: new Date(today.getFullYear(), lastMonth).toLocaleString('default', { month: 'short' }),
      startIndex: monthStartIndex,
      endIndex: weekIndex
    });

    return { calendarData, maxSubmissions, totalSubmissions, monthLabels };
  }, [submissions_by_date]);

  const getLevelColor = (level: number) => {
    const colors = [
      'bg-slate-800 dark:bg-slate-800',
      'bg-emerald-900/80 hover:bg-emerald-900',
      'bg-emerald-700/80 hover:bg-emerald-700',
      'bg-emerald-600/80 hover:bg-emerald-600',
      'bg-emerald-500/80 hover:bg-emerald-500'
    ];
    return colors[level];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">
            Contribution Activity
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <span>{totalSubmissions} total submissions</span>
          <Info className="h-4 w-4" />
        </div>
      </div>

      Calendar Grid
      <div className="relative">
        {/* Month Labels
        <div className="flex ml-14 mb-2">
          {monthLabels.map(({ month, startIndex, endIndex }, i) => {
            // Calculate the center position of each month's data
            const centerPosition = startIndex + Math.floor((endIndex - startIndex) / 2);
            return (
              <div
                key={`${month}-${i}`}
                className="text-xs text-slate-400 absolute"
                style={{
                  left: `${centerPosition * 20}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                {month}
              </div>
            );
          })}
        </div> */}

        <div className="flex">
          {/* Day Labels */}
          <div className="flex flex-col justify-between mr-4">
            {DAYS.map(day => (
              <span key={day} className="text-xs text-slate-400 h-[18px]">
                {day}
              </span>
            ))}
          </div>

          {/* Contribution Grid */}
          <div className="flex">
            {calendarData[0].map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1 mr-1">
                {DAYS.map((_, dayIndex) => {
                  const day = calendarData[dayIndex][weekIndex];
                  if (!day) return (
                    <div 
                      key={`gap-${dayIndex}-${weekIndex}`} 
                      className="w-[14px] h-[14px]"
                    />
                  );

                  return (
                    <motion.div
                      key={day.date.toISOString()}
                      whileHover={{ scale: 1.2 }}
                      className={`
                        w-[14px] h-[14px] rounded-sm cursor-pointer
                        transition-colors duration-200
                        ${getLevelColor(day.level)}
                      `}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div
            className="absolute z-10 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm border border-slate-700 shadow-lg"
            style={{
              top: '0',
              left: '50%',
              transform: 'translate(-50%, -120%)'
            }}
          >
            <p className="font-medium">
              {hoveredDay.count} {hoveredDay.count === 1 ? 'submission' : 'submissions'}
            </p>
            <p className="text-slate-300">{formatDate(hoveredDay.date)}</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-end space-x-2 text-sm">
        <span className="text-slate-400">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-[14px] h-[14px] rounded-sm ${getLevelColor(level)}`}
          />
        ))}
        <span className="text-slate-400">More</span>
      </div>
    </div>
  );
};

export default ContributionHeatmap;