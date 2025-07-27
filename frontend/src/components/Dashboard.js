import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Users,
  BookOpen,
  Bell
} from 'lucide-react';
import { mockDashboardData } from '../data/mockData';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-green-600 bg-green-50';
      case 'substitution_needed': return 'text-orange-600 bg-orange-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Good Morning, Dr. Johnson! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                {formatDate(currentTime)}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-2xl md:text-3xl font-mono font-bold text-blue-600">
                {formatTime(currentTime)}
              </div>
              <p className="text-sm text-gray-500">Current Time</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Today's Classes</p>
                <p className="text-3xl font-bold">{dashboardData.todaySchedule.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed Tasks</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Students</p>
                <p className="text-3xl font-bold">156</p>
              </div>
              <Users className="w-10 h-10 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Pending Tasks</p>
                <p className="text-3xl font-bold">{dashboardData.upcomingTasks.length}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                Today's Schedule
              </h2>
              <span className="text-sm text-gray-500">
                {dashboardData.todaySchedule.length} classes
              </span>
            </div>
            
            <div className="space-y-4">
              {dashboardData.todaySchedule.map((schedule, index) => (
                <div key={schedule.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">{schedule.time}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                          {schedule.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mt-2">{schedule.subject}</h3>
                      <p className="text-gray-600">{schedule.class} • {schedule.room}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks & Announcements */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Upcoming Tasks
              </h2>
              
              <div className="space-y-3">
                {dashboardData.upcomingTasks.map((task) => (
                  <div key={task.id} className={`p-3 rounded-lg border ${getPriorityColor(task.priority)} hover:shadow-md transition-all duration-200`}>
                    <h4 className="font-medium text-gray-900">{task.task}</h4>
                    <p className="text-sm text-gray-600 mt-1">Due: {task.dueDate}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-600" />
                Announcements
              </h2>
              
              <div className="space-y-4">
                {dashboardData.announcements.map((announcement) => (
                  <div key={announcement.id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
            Recent Activities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;