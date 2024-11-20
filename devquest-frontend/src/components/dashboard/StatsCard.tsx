'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  trend?: number;
  // Change the type to accept the icon component itself, not an element
  Icon: LucideIcon;
  color: string;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  Icon,
  trend,
  color,
  description,
  className = ''
}: StatsCardProps) => {
  return (
    <div className={`rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-100">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl text-white">{value}</p>
            {trend && (
              <span className={`ml-2 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        {/* <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div> */}
        <div className={`p-3 rounded-full ${color}`}>
          <Icon />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;