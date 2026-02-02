import React from 'react';
import { LayoutDashboard, Newspaper, Users, Tag } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'news', label: 'My Placements', icon: Newspaper },
    { id: 'tagged', label: 'Tagged News', icon: Tag },
    { id: 'leads', label: 'Leads', icon: Users },
  ];

  return (
    <aside 
      className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:relative lg:block
      `}
    >
      <div className="h-full flex flex-col">
        {/* Brand - Simplified to remove redundancy with main header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Partner Portal
          </h2>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${currentView === item.id 
                  ? 'bg-gray-100 text-[#BB1919]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
