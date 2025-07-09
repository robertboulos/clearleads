import React from 'react';
import { Bell, User, LogOut, CreditCard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCreditsStore } from '../../store/creditsStore';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { balance } = useCreditsStore();
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-900">
              Good morning, {user?.name}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Credits Badge */}
            <Link 
              to="/billing"
              className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">{balance} credits</span>
            </Link>
            
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-gray-600" />
                )}
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};