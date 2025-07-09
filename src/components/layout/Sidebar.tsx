import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  History, 
  CreditCard, 
  Settings, 
  BarChart3,
  Shield
} from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Validate', href: '/validate', icon: CheckSquare },
  { name: 'History', href: '/history', icon: History },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-gray-900">
      <div className="flex items-center h-16 px-4 bg-gray-800">
        <Shield className="w-8 h-8 text-blue-400" />
        <span className="ml-2 text-xl font-bold text-white">ClearLeads</span>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              clsx(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};