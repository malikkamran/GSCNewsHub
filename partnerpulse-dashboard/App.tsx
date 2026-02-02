import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import NewsFeed from './components/NewsFeed';
import LeadsTable from './components/LeadsTable';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <Overview onNavigate={setCurrentView} />;
      case 'news':
        return <NewsFeed mode="placements" />;
      case 'tagged':
        return <NewsFeed mode="tagged" />;
      case 'leads':
        return <LeadsTable />;
      default:
        return <Overview onNavigate={setCurrentView} />;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'overview': return 'Dashboard Overview';
      case 'news': return 'My Sponsored Placements';
      case 'tagged': return 'Tagged News';
      case 'leads': return 'Lead Management';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false); // Close sidebar on mobile on selection
        }} 
        isOpen={isSidebarOpen}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <Header 
          title={getPageTitle()} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;