import { useState, useEffect } from 'react';
import { UserStats } from '../types/index';
import Navbar from '../components/layout/Navbar';
import StatsCard from '../components/dashboard/StatsCard';
import LanguageDistribution from '../components/dashboard/LanguageDistribution';
import TopicDistribution from '../components/dashboard/TopicDistribution';
import DifficultyChart from '../components/dashboard/DifficultyChart';
import ActivityCalendar from '../components/dashboard/ActivityCalendar';
import SubmissionTrends from '../components/dashboard/SubmissionTrends';
import TopicsBreakdown from '../components/dashboard/TopicsBreakdown';
import ContributionHeatmap from '../components/dashboard/ContributionHeatMap';
import { Code2, Award, Target, Flame, CircleUserRound } from 'lucide-react';
import ProfileSidebar from '../components/dashboard/ProfileSidebar';
import SuggestedQuestions from '../components/dashboard/SuggestedQuestions';
import React from 'react';
import { useSession } from "../hooks/useSession";

export default function Dashboard() {
  const { session, status } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const initializeSync = async () => {
    try {
      if (!session?.preferred_username) {
        setError("User session not fully loaded or preferred_username is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_IS_KUBERNETES_ENV === "true"
          ? ``
          : "http://127.0.0.1:8000";

      const syncUrl = `${API_BASE_URL}/api/v1/sync/${session.preferred_username}?username=${session.preferred_username}`;

      const response = await fetch(syncUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          foo: "LEETCODE_SESSION=your-session-token",
          "x-csrftoken": "your-csrf-token",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to start sync");
      }

      const { task_id, stats } = await response.json();

      if (stats) {
        setStats(stats);
        setLoading(false);
        return;
      }

      console.log("Sync task started:", task_id);

      // Handle server-sent events (SSE) for sync updates
      const eventSource = new EventSource(
        `${API_BASE_URL}/api/v1/sync/${session.preferred_username}/stream/${task_id}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received update:", data);
      };

      eventSource.addEventListener("complete", (event) => {
        const data = JSON.parse(event.data);
        setStats(data.stats);
        setLoading(false);
        eventSource.close();
      });

      eventSource.addEventListener("error", (event) => {
        setError("Error syncing data. Stream disconnected.");
        setLoading(false);
        eventSource.close();
      });

      // Clean up SSE connection on unmount
      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error("Sync initialization failed:", error);
      setError("Failed to sync data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for session to be loaded before initializing sync
    if (status === "authenticated") {
      initializeSync();
    }
  }, [status]);

  if (loading || !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 relative">
      {/* Profile Button */}
      <button
        className="absolute top-4 right-6 text-white bg-gradient-to-br from-emerald-500/20 to-violet-500/10 px-4 py-2 rounded hover:bg-gradient-to-br"
        onClick={() => setSidebarOpen(true)}
      >
         <CircleUserRound className="h-10 w-10 text-white" />
      </button>

      {/* Profile Sidebar */}
      <ProfileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

<main className="flex-1 px-6 py-8">

        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-white">Coding Progress Dashboard</h1>
<SuggestedQuestions/>   
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
          </div>
        </div>
      </main>
    </div>
  );
}