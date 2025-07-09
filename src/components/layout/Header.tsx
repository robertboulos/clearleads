import React from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCreditsStore } from '../../store/creditsStore';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { balance } = useCreditsStore();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Credits Badge */}
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {balance} credits
            </div>
            
            {/* Notifications */}
            <button className="text-gray-400 hover:text-gray-500">
              <Bell className="w-5 h-5" />
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <span className="hidden md:block font-medium">{user?.name}</span>
              </button>
              
              {/* Dropdown would go here */}
            </div>
            
            <button
              onClick={logout}
              className="text-gray-400 hover:text-gray-500"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};