import React from 'react';
import { LayoutDashboard, Newspaper, Users, LogOut, Globe, Tag } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'news', label: 'My Placements', icon: Newspaper },
    { id: 'tagged', label: 'Tagged News', icon: Tag },
    { id: 'leads', label: 'Leads', icon: Users },
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}
    >
      <div className="h-full flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Globe size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">PartnerPulse</h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="p-4 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
               <img src="https://picsum.photos/100/100?random=user" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
               <p className="text-sm font-semibold text-white">Acme Corp</p>
               <p className="text-xs text-slate-500">Gold Partner</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;