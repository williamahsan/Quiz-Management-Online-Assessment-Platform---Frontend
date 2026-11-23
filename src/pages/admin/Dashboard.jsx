import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService.js";
import StatCard from "../../components/admin/StatCard.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1">Here is what's happening with your platform today.</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="text-center text-gray-600 flex gap-2 items-center">
            <p>Loading Stats...</p>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
          <StatCard title="Students" value={stats.totalStudents} color="bg-green-500" />
          <StatCard title="Admins" value={stats.totalAdmins} color="bg-purple-500" />
          <StatCard title="Total Quizzes" value={stats.totalQuizzes} color="bg-yellow-500" />
          <StatCard title="Total Attempts" value={stats.totalAttempts} color="bg-red-500" />
        </div>)}
      
    </div>
  );
}