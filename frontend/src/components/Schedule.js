import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Plus,
  AlertTriangle,
  CheckCircle,
  Filter,
  Search
} from 'lucide-react';
import { mockSchedule } from '../data/mockData';

const Schedule = () => {
  const [schedule, setSchedule] = useState(mockSchedule);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newClassForm, setNewClassForm] = useState({
    time: '',
    subject: '',
    class: '',
    room: '',
    day: 'Monday',
    status: 'scheduled'
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load schedule from localStorage if exists
    const savedSchedule = localStorage.getItem('classSchedule');
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }
  }, []);

  const saveSchedule = (newSchedule) => {
    setSchedule(newSchedule);
    localStorage.setItem('classSchedule', JSON.stringify(newSchedule));
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const filteredSchedule = schedule.filter(item => {
    const matchesDay = item.day === selectedDay;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDay && matchesStatus && matchesSearch;
  });

  const handleEdit = (item) => {
    setIsEditing(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = () => {
    const updatedSchedule = schedule.map(item => 
      item.id === isEditing ? { ...editForm } : item
    );
    saveSchedule(updatedSchedule);
    setIsEditing(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditForm({});
  };

  const handleAddNew = () => {
    const newClass = {
      ...newClassForm,
      id: Date.now(),
      day: selectedDay
    };
    const updatedSchedule = [...schedule, newClass];
    saveSchedule(updatedSchedule);
    setIsAddingNew(false);
    setNewClassForm({
      time: '',
      subject: '',
      class: '',
      room: '',
      day: selectedDay,
      status: 'scheduled'
    });
  };

  const handleDelete = (id) => {
    const updatedSchedule = schedule.filter(item => item.id !== id);
    saveSchedule(updatedSchedule);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedSchedule = schedule.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveSchedule(updatedSchedule);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-green-600 bg-green-50 border-green-200';
      case 'substitution_needed': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <CheckCircle className="w-4 h-4" />;
      case 'substitution_needed': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getClassCountByDay = (day) => {
    return schedule.filter(item => item.day === day).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Class Schedule 📅
          </h1>
          <p className="text-lg text-gray-600">
            Manage your teaching schedule and handle substitutions
          </p>
        </div>

        {/* Day Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {daysOfWeek.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  selectedDay === day
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/80 shadow-md'
                }`}
              >
                {day}
                <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-1">
                  {getClassCountByDay(day)}
                </span>
              </button>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes, subjects, or rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="substitution_needed">Needs Substitution</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class</span>
            </button>
          </div>
        </div>

        {/* Schedule for Selected Day */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-600" />
              {selectedDay} Schedule
            </h2>
            <span className="text-sm text-gray-500">
              {filteredSchedule.length} {filteredSchedule.length === 1 ? 'class' : 'classes'}
            </span>
          </div>

          {/* Add New Class Form */}
          {isAddingNew && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Class</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="time"
                  value={newClassForm.time}
                  onChange={(e) => setNewClassForm({...newClassForm, time: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Time"
                />
                <input
                  type="text"
                  value={newClassForm.subject}
                  onChange={(e) => setNewClassForm({...newClassForm, subject: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Subject"
                />
                <input
                  type="text"
                  value={newClassForm.class}
                  onChange={(e) => setNewClassForm({...newClassForm, class: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Class"
                />
                <input
                  type="text"
                  value={newClassForm.room}
                  onChange={(e) => setNewClassForm({...newClassForm, room: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Room"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNew}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add Class
                </button>
              </div>
            </div>
          )}

          {/* Schedule Items */}
          <div className="space-y-4">
            {filteredSchedule.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Scheduled</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No classes match your current filters' 
                    : `No classes scheduled for ${selectedDay}`}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add First Class
                  </button>
                )}
              </div>
            ) : (
              filteredSchedule
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((item) => (
                  <div key={item.id} className="bg-gradient-to-r from-white to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                    {isEditing === item.id ? (
                      /* Edit Mode */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <input
                            type="time"
                            value={editForm.time}
                            onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            value={editForm.subject}
                            onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Subject"
                          />
                          <input
                            type="text"
                            value={editForm.class}
                            onChange={(e) => setEditForm({...editForm, class: e.target.value})}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Class"
                          />
                          <input
                            type="text"
                            value={editForm.room}
                            onChange={(e) => setEditForm({...editForm, room: e.target.value})}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Room"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900">{item.time}</p>
                              <p className="text-sm text-gray-500">Time</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-gray-900">{item.subject}</p>
                            <p className="text-sm text-gray-600">{item.class}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{item.room}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <select
                              value={item.status}
                              onChange={(e) => handleStatusChange(item.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer ${getStatusColor(item.status)}`}
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="substitution_needed">Needs Substitution</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Scheduled</p>
                <p className="text-3xl font-bold">
                  {schedule.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Need Substitution</p>
                <p className="text-3xl font-bold">
                  {schedule.filter(s => s.status === 'substitution_needed').length}
                </p>
              </div>
              <AlertTriangle className="w-10 h-10 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Cancelled</p>
                <p className="text-3xl font-bold">
                  {schedule.filter(s => s.status === 'cancelled').length}
                </p>
              </div>
              <X className="w-10 h-10 text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Classes</p>
                <p className="text-3xl font-bold">{schedule.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;