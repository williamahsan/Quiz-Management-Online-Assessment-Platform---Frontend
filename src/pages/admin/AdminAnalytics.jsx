import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../../services/adminService.js';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAnalytics();
        setStats(data);
      } catch (err) {
        setError('Failed to load platform analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Format data for the Pass/Fail Recharts Pie Chart
  const passFailData = stats ? [
    { name: 'Passed', value: stats.passedAttempts },
    { name: 'Failed', value: stats.failedAttempts }
  ] : [];
  const COLORS = ['#10B981', '#EF4444']; // Tailwind Green and Red

  return (
    <div>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Platform Analytics</h1>
        <p className="text-gray-600 mt-1">Get performance and engagement insights for your platform.</p>
      </div>

      {loading ? (

        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="text-center text-gray-600 flex gap-2 items-center">
            <p>Loading Analytics...</p>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center mt-20 text-red-500">{error}</div>
      ) : (
        <div>
          {/* Top Level Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 font-medium">Total Quizzes</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalQuizzes}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.publishedQuizzes} Published</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 font-medium">Total Quiz Attempts</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalAttempts}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 font-medium">Global Average Score</p>
              <p className="text-3xl font-bold text-green-600">{stats.averageScore}%</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pass/Fail Ratio Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Pass/Fail Ratio</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={passFailData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {passFailData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Attempts`, entry => entry.name]} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>)}
    </div>
  );
};

export default AdminAnalytics;