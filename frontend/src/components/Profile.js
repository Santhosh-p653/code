import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Award,
  Edit3,
  Save,
  X,
  Camera,
  MapPin,
  Clock,
  GraduationCap,
  Building
} from 'lucide-react';
import { mockStaffProfile } from '../data/mockData';

const Profile = () => {
  const [profile, setProfile] = useState(mockStaffProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(mockStaffProfile);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Load profile from localStorage if exists
    const savedProfile = localStorage.getItem('staffProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setEditedProfile(parsedProfile);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = () => {
    setProfile(editedProfile);
    localStorage.setItem('staffProfile', JSON.stringify(editedProfile));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectsChange = (index, value) => {
    const newSubjects = [...editedProfile.subjects];
    newSubjects[index] = value;
    setEditedProfile(prev => ({
      ...prev,
      subjects: newSubjects
    }));
  };

  const addSubject = () => {
    setEditedProfile(prev => ({
      ...prev,
      subjects: [...prev.subjects, '']
    }));
  };

  const removeSubject = (index) => {
    const newSubjects = editedProfile.subjects.filter((_, i) => i !== index);
    setEditedProfile(prev => ({
      ...prev,
      subjects: newSubjects
    }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedProfile(prev => ({
          ...prev,
          avatar: e.target.result
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateYearsOfService = (joinDate) => {
    const join = new Date(joinDate);
    const now = new Date();
    const years = Math.floor((now - join) / (365.25 * 24 * 60 * 60 * 1000));
    return years;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Staff Profile 👤
          </h1>
          <p className="text-lg text-gray-600">
            Manage your professional information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white relative">
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
                  title="Edit Profile"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                    title="Save Changes"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    title="Cancel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 backdrop-blur-sm">
                  {isUploading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <img
                      src={editedProfile.avatar}
                      alt={editedProfile.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-3xl font-bold mb-2 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 w-full backdrop-blur-sm"
                    placeholder="Full Name"
                  />
                ) : (
                  <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
                )}

                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="text-xl mb-4 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 w-full backdrop-blur-sm"
                    placeholder="Job Title"
                  />
                ) : (
                  <p className="text-xl text-blue-100 mb-4">{profile.role}</p>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                    <Building className="w-4 h-4" />
                    <span>{profile.department}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{calculateYearsOfService(profile.joinDate)} years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                Professional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile.employeeId}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile.department}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedProfile.joinDate}
                      onChange={(e) => handleInputChange('joinDate', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {new Date(profile.joinDate).toLocaleDateString()} 
                        ({calculateYearsOfService(profile.joinDate)} years of service)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subjects Taught */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                Subjects Taught
              </h3>
              
              {isEditing ? (
                <div className="space-y-3">
                  {editedProfile.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => handleSubjectsChange(index, e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Subject name"
                      />
                      <button
                        onClick={() => removeSubject(index)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg transition-colors"
                        title="Remove subject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addSubject}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Add Subject</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.subjects.map((subject, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="font-medium text-gray-900">{subject}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Statistics */}
            {!isEditing && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Quick Stats
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Years of Service</p>
                        <p className="text-3xl font-bold">{calculateYearsOfService(profile.joinDate)}</p>
                      </div>
                      <Clock className="w-10 h-10 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Subjects</p>
                        <p className="text-3xl font-bold">{profile.subjects.length}</p>
                      </div>
                      <BookOpen className="w-10 h-10 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Department</p>
                        <p className="text-lg font-bold">{profile.department.split(' ')[0]}</p>
                      </div>
                      <Building className="w-10 h-10 text-purple-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Tips
          </h4>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>• Keep your contact information up to date for important notifications</li>
            <li>• Add all subjects you teach to get relevant template suggestions</li>
            <li>• Your profile information is used to personalize your dashboard</li>
            <li>• Upload a professional photo to make your profile more personable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;