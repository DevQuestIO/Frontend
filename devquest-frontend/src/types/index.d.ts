// src/types/index.d.ts
import 'react';

declare module 'react' {
  interface AppProps {
    children?: React.ReactNode;
  }
}

export interface LanguageStats {
  languageName: string;
  problemsSolved: number;
}

export interface TagStats {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

export interface ProblemCounts {
  All: number;
  Easy: number;
  Medium: number;
  Hard: number;
}

export interface CalendarStats {
  active_years: number[];
  total_active_days: number;
  streak: number;
  submissions_by_date: Record<string, number>;
  monthly_submissions: Record<string, number>;
  yearly_submissions: Record<string, number>;
  streaks: {
    current: number;
    longest: number;
  };
}

export interface UserStats {
  total_solved: number;
  by_difficulty: Record<string, number>;
  by_topic: Record<string, number>;
  by_language: LanguageStats[];
  tag_stats: {
    advanced: TagStats[];
    intermediate: TagStats[];
    fundamental: TagStats[];
  };
  problem_counts: {
    total: ProblemCounts;
    solved: ProblemCounts;
    beats: Record<string, number>;
  };
  calendar_stats: CalendarStats;
}

export interface UserSession {
  name: string,
  given_name: string,
  family_name: string,
  sub: string,
  email: string,
  preferred_username: string,
  user: {
    id: string;
    name: string;
    email: string;
    roles?: string[];
  };
  accessToken: string; // Include additional properties like tokens if needed
}
