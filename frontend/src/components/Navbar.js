import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Mic, 
  FileText, 
  User, 
  Calendar, 
  ClipboardList, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/voice-input', icon: Mic, label: 'Voice Input' },
    { path: '/template-form', icon: FileText, label: 'Templates' },
    { path: '/voice-template', icon: Sparkles, label: 'AI Templates' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/attendance', icon: ClipboardList, label: 'Attendance' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl">
        <div className="flex items-center justify-center h-16 px-4 bg-blue-900/50 border-b border-blue-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">StaffUtils</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg transform scale-105'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white hover:transform hover:scale-105'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 transition-colors ${
                  isActive ? 'text-yellow-300' : 'text-blue-200 group-hover:text-white'
                }`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-blue-700/50">
          <div className="text-xs text-blue-200 text-center">
            Voice-Enabled Staff Utility
          </div>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">StaffUtils</h1>
          </div>
          
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={toggleMobileMenu}>
          <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-white">StaffUtils</h1>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="px-2 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleMobileMenu}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? 'text-yellow-300' : 'text-blue-200 group-hover:text-white'
                    }`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;