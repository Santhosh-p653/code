import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Search,
  Filter,
  Plus,
  Edit3,
  Save,
  X,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { mockAttendance } from '../data/mockData';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState(mockAttendance);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [reportType, setReportType] = useState('daily');

  useEffect(() => {
    // Load attendance data from localStorage
    const savedAttendance = localStorage.getItem('attendanceData');
    if (savedAttendance) {
      setAttendanceData(JSON.parse(savedAttendance));
    }
  }, []);

  const saveAttendanceData = (newData) => {
    setAttendanceData(newData);
    localStorage.setItem('attendanceData', JSON.stringify(newData));
  };

  const handleAttendanceChange = (studentId, status) => {
    if (!selectedClass) return;

    const updatedData = attendanceData.map(classData => {
      if (classData.id === selectedClass.id) {
        const updatedStudents = classData.students.map(student =>
          student.id === studentId ? { ...student, status } : student
        );
        
        // Recalculate totals
        const present = updatedStudents.filter(s => s.status === 'present').length;
        const absent = updatedStudents.filter(s => s.status === 'absent').length;
        const late = updatedStudents.filter(s => s.status === 'late').length;
        
        return {
          ...classData,
          students: updatedStudents,
          present,
          absent,
          late: late
        };
      }
      return classData;
    });

    saveAttendanceData(updatedData);
    
    // Update selected class
    const updatedClass = updatedData.find(c => c.id === selectedClass.id);
    setSelectedClass(updatedClass);
  };

  const addClass = () => {
    const newClass = {
      id: Date.now(),
      className: "New Class",
      date: selectedDate,
      totalStudents: 0,
      present: 0,
      absent: 0,
      late: 0,
      students: []
    };
    
    const updatedData = [...attendanceData, newClass];
    saveAttendanceData(updatedData);
    setSelectedClass(newClass);
    setIsEditing(true);
  };

  const addStudent = () => {
    if (!selectedClass) return;
    
    const newStudent = {
      id: Date.now(),
      name: "New Student",
      status: "present"
    };
    
    const updatedData = attendanceData.map(classData => {
      if (classData.id === selectedClass.id) {
        const updatedStudents = [...classData.students, newStudent];
        return {
          ...classData,
          students: updatedStudents,
          totalStudents: updatedStudents.length,
          present: updatedStudents.filter(s => s.status === 'present').length,
          absent: updatedStudents.filter(s => s.status === 'absent').length,
          late: updatedStudents.filter(s => s.status === 'late').length
        };
      }
      return classData;
    });
    
    saveAttendanceData(updatedData);
    setSelectedClass(updatedData.find(c => c.id === selectedClass.id));
  };

  const updateClassName = (newName) => {
    if (!selectedClass) return;
    
    const updatedData = attendanceData.map(classData =>
      classData.id === selectedClass.id
        ? { ...classData, className: newName }
        : classData
    );
    
    saveAttendanceData(updatedData);
    setSelectedClass({ ...selectedClass, className: newName });
  };

  const updateStudentName = (studentId, newName) => {
    if (!selectedClass) return;
    
    const updatedData = attendanceData.map(classData => {
      if (classData.id === selectedClass.id) {
        const updatedStudents = classData.students.map(student =>
          student.id === studentId ? { ...student, name: newName } : student
        );
        return { ...classData, students: updatedStudents };
      }
      return classData;
    });
    
    saveAttendanceData(updatedData);
    setSelectedClass(updatedData.find(c => c.id === selectedClass.id));
  };

  const removeStudent = (studentId) => {
    if (!selectedClass) return;
    
    const updatedData = attendanceData.map(classData => {
      if (classData.id === selectedClass.id) {
        const updatedStudents = classData.students.filter(s => s.id !== studentId);
        return {
          ...classData,
          students: updatedStudents,
          totalStudents: updatedStudents.length,
          present: updatedStudents.filter(s => s.status === 'present').length,
          absent: updatedStudents.filter(s => s.status === 'absent').length,
          late: updatedStudents.filter(s => s.status === 'late').length
        };
      }
      return classData;
    });
    
    saveAttendanceData(updatedData);
    setSelectedClass(updatedData.find(c => c.id === selectedClass.id));
  };

  const filteredStudents = selectedClass ? selectedClass.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50 border-green-200';
      case 'absent': return 'text-red-600 bg-red-50 border-red-200';
      case 'late': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'absent': return <XCircle className="w-4 h-4" />;
      case 'late': return <Clock className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const calculateAttendanceRate = (classData) => {
    if (classData.totalStudents === 0) return 0;
    return Math.round((classData.present / classData.totalStudents) * 100);
  };

  const exportReport = () => {
    if (!selectedClass) return;
    
    const reportData = {
      className: selectedClass.className,
      date: selectedClass.date,
      summary: {
        total: selectedClass.totalStudents,
        present: selectedClass.present,
        absent: selectedClass.absent,
        late: selectedClass.late,
        attendanceRate: calculateAttendanceRate(selectedClass)
      },
      students: selectedClass.students
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedClass.className}-${selectedClass.date}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Attendance Tracker 📊
          </h1>
          <p className="text-lg text-gray-600">
            Mark attendance and generate comprehensive reports
          </p>
        </div>

        {/* Class Selection and Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <select
                value={selectedClass?.id || ''}
                onChange={(e) => {
                  const classData = attendanceData.find(c => c.id === parseInt(e.target.value));
                  setSelectedClass(classData);
                }}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64"
              >
                <option value="">Select a class</option>
                {attendanceData.map(classData => (
                  <option key={classData.id} value={classData.id}>
                    {classData.className} - {classData.date}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={addClass}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>New Class</span>
              </button>
              
              {selectedClass && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? 'View' : 'Edit'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Class Summary */}
          {selectedClass && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Students</p>
                    <p className="text-2xl font-bold">{selectedClass.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Present</p>
                    <p className="text-2xl font-bold">{selectedClass.present}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Absent</p>
                    <p className="text-2xl font-bold">{selectedClass.absent}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Attendance Rate</p>
                    <p className="text-2xl font-bold">{calculateAttendanceRate(selectedClass)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student List */}
        {selectedClass && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedClass.className}
                    onChange={(e) => updateClassName(e.target.value)}
                    className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 outline-none text-gray-900 w-full"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-blue-600" />
                    {selectedClass.className}
                  </h2>
                )}
                <p className="text-gray-600">{selectedClass.date}</p>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
                
                {isEditing && (
                  <button
                    onClick={addStudent}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Student</span>
                  </button>
                )}
                
                <button
                  onClick={exportReport}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Students Grid */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'No students match your current filters' 
                      : 'No students in this class yet'}
                  </p>
                  {isEditing && !searchTerm && filterStatus === 'all' && (
                    <button
                      onClick={addStudent}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Add First Student
                    </button>
                  )}
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div key={student.id} className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={student.name}
                            onChange={(e) => updateStudentName(student.id, e.target.value)}
                            className="font-semibold text-gray-900 bg-transparent border-b border-gray-300 outline-none w-full"
                          />
                        ) : (
                          <span className="font-semibold text-gray-900">{student.name}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Status Buttons */}
                        <div className="flex space-x-1">
                          {['present', 'absent', 'late'].map(status => (
                            <button
                              key={status}
                              onClick={() => handleAttendanceChange(student.id, status)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                                student.status === status 
                                  ? getStatusColor(status) + ' shadow-md transform scale-105'
                                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              {getStatusIcon(status)}
                              <span className="capitalize">{status}</span>
                            </button>
                          ))}
                        </div>
                        
                        {isEditing && (
                          <button
                            onClick={() => removeStudent(student.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg transition-colors"
                            title="Remove Student"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* No Class Selected */}
        {!selectedClass && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="max-w-md mx-auto">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select or Create a Class</h3>
              <p className="text-gray-600 mb-6">
                Choose an existing class from the dropdown or create a new one to start taking attendance
              </p>
              <button
                onClick={addClass}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Class</span>
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Attendance Tracking Tips
          </h4>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>• Select a date and class to start taking attendance</li>
            <li>• Click status buttons (Present, Absent, Late) to mark each student</li>
            <li>• Use search and filters to quickly find specific students</li>
            <li>• Export attendance reports for record keeping</li>
            <li>• Edit mode allows you to modify class details and student list</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Attendance;