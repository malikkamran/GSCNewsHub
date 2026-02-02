import React, { useState } from 'react';
import Sidebar from '../../components/partner/Sidebar';
import Header from '../../components/layout/Header';
import Overview from '../../components/partner/Overview';
import NewsFeed from '../../components/partner/NewsFeed';
import LeadsTable from '../../components/partner/LeadsTable';

const PartnerDashboard: React.FC = () => {
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

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Main Website Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar 
          currentView={currentView} 
          setCurrentView={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false); // Close sidebar on mobile on selection
          }} 
          isOpen={isSidebarOpen}
        />

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative w-full">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PartnerDashboard;
