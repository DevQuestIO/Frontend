// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { fetchUserStats } from 'lib/api';
import { UserStats } from '@/types/index';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import StatsCard from '@/components/dashboard/StatsCard';
import LanguageDistribution from '@/components/dashboard/LanguageDistribution';
import TopicDistribution from '@/components/dashboard/TopicDistribution';
import DifficultyChart from '@/components/dashboard/DifficultyChart';
import ActivityCalendar from '@/components/dashboard/ActivityCalendar';
import SubmissionTrends from '@/components/dashboard/SubmissionTrends';
import TopicsBreakdown from '@/components/dashboard/TopicsBreakdown';
import ContributionHeatmap from '@/components/dashboard/ContributionHeatMap';
// import StreakStats from '@/components/dashboard/StreakStats';
import { Code2, Award, Target, Flame } from 'lucide-react';


export default function Dashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeSync = async () => {
    try {
      setLoading(true);
      
      // Start the sync process
      const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/sync';
      // fetch(`${API_BASE_URL}/stats/${userId}`);
      const response = await fetch(`http://127.0.0.1:8000/api/v1/sync/pbajaj0023?username=pbajaj0023`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'foo': 'LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMzc0MzU3NiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjEzZGMxY2M0MDg1Y2VlMzUwZGZiOWMzYzZmYWQ2ZTVmNzhmZGYyNzExNDI4MWRmNzE5YzAzM2E2ZjE5MTlkZjgiLCJpZCI6Mzc0MzU3NiwiZW1haWwiOiJwYmFqYWowMDIzQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoicGJhamFqMDAyMyIsInVzZXJfc2x1ZyI6InBiYWphajAwMjMiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvcGJhamFqMDAyMy9hdmF0YXJfMTYwOTU4OTAyMC5wbmciLCJyZWZyZXNoZWRfYXQiOjE3MzIzNDg1NjIsImlwIjoiMjYwMTo2NDY6ODAwMDo2YmIwOjkwMTI6ZDM2Yjo3NTM4OjliZjgiLCJpZGVudGl0eSI6IjA4NDViMzA5YzdiOWI5NTdhZmQ5ZWNmNzc1YTRjMjFmIiwiZGV2aWNlX3dpdGhfaXAiOlsiYzY5NjFiNWQ1NWE4YThkNGNjZDhkNTYxNzRlOWZlNzIiLCIyNjAxOjY0Njo4MDAwOjZiYjA6OTAxMjpkMzZiOjc1Mzg6OWJmOCJdLCJzZXNzaW9uX2lkIjoxNTA4NzU3LCJfc2Vzc2lvbl9leHBpcnkiOjEyMDk2MDB9.JLTTjVYcWBD9bWoGN0WYu8MqCnfbinNJzO0XhEbt__4;',
          'x-csrftoken': '8sB8s1cBW6WCBRH3UV5NYyJR9Ba6sMqzyXrLBFJwuIUGNYFZlxeOcjLZ1CnQPL0W'
        },
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to start sync');
      
      const { task_id, stats } = await response.json();
      if(stats) {
        setStats(stats);
        setLoading(false);
        return;
      }
      console.log('Sync task started:', task_id);
      
      // Initialize SSE connection
      const eventSource = new EventSource(
        `${API_BASE_URL}/pbajaj0023/stream/${task_id}`
      );
      
      // Listen for events
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received update:', data);
      };
      
      eventSource.addEventListener('complete', (event) => {
        const data = JSON.parse(event.data);
        setStats(data.stats);
        setLoading(false);
        eventSource.close();
      });
      
      eventSource.addEventListener('error', (event) => {
        // const data = JSON.parse(event.data);
        setError("Failed to sync data");
        setLoading(false);
        eventSource.close();
      });
      
      // Clean up on component unmount
      return () => {
        eventSource.close();
      };
      
    } catch (error) {
      setError("Failed to sync data");
      setLoading(false);
    }
  };

  useEffect(() => {
    // async function loadStats() {
    //   try {
        // const data = await fetchUserStats('pbajaj0023');
    //     setStats(data);
    //   } catch (error) {
    //     console.error('Error loading stats:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // loadStats();
    initializeSync();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* <Navbar /> */}
      <div className="flex">
        {/* <Sidebar /> */}
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-8 text-3xl font-bold text-white">Coding Progress Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Solved"
                value={stats.total_solved}
                Icon={Code2}
                trend={+10}
                color="bg-green-500"
                description="Problems completed"
                className="bg-gradient-to-br from-violet-500/20 to-violet-500/10"
              />
              <StatsCard
                title="Current Streak"
                value={stats.calendar_stats.streaks.current}
                Icon={Flame}
                trend={+2}
                color="bg-blue-500"
                description="Days coding"
                className="bg-gradient-to-br from-amber-500/20 to-amber-500/10"
              />
              <StatsCard
                title="Success Rate"
                value={stats.problem_counts.beats.Medium}
                Icon={Target}
                trend={+5}
                color="bg-yellow-500"
                description="Medium problems"
                className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/10"
              />
              <StatsCard
                title="Best Streak"
                value={stats.calendar_stats.streaks.longest}
                Icon={Award}
                color="bg-red-500"
                description="Days record"
                className="bg-gradient-to-br from-rose-500/20 to-rose-500/10"
              />
            </div>

            {/* Charts Grid */}
            <ContributionHeatmap submissions_by_date={stats.calendar_stats.submissions_by_date} />
            <br />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <DifficultyChart stats={stats} />
              <LanguageDistribution stats={stats} />
              <TopicDistribution stats={stats} />
              <TopicsBreakdown stats={stats} />
              <ActivityCalendar stats={stats} />
              <SubmissionTrends stats={stats} />
              {/* <StreakStats stats={stats} /> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}