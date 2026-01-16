import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import MobileHeader from './components/MobileHeader';
import ProjectPage from './pages/ProjectPage';
import AddProjectModal from './components/AddProjectModal';
import { mockProjects, mockNotifications, currentUser } from './config/mockData';
import type { ViewType } from './types';

const App: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState(mockProjects[0].id);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const activeProject = mockProjects.find(p => p.id === activeProjectId);

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Project not found</div>
      </div>
    );
  }

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleCreateProject = () => {
    setShowAddProjectModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const projectsForSidebar = mockProjects.map(p => ({
    id: p.id,
    name: p.name,
    status: p.status
  }));

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader
        projects={projectsForSidebar}
        activeProjectId={activeProjectId}
        onProjectSelect={setActiveProjectId}
        onCreateProject={handleCreateProject}
      />

      {/* Sidebar - Desktop */}
      <Sidebar
        projects={projectsForSidebar}
        activeProjectId={activeProjectId}
        onProjectSelect={setActiveProjectId}
        onCreateProject={handleCreateProject}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav
          projectName={activeProject.name}
          currentView={currentView}
          onViewChange={setCurrentView}
          onSearch={setSearchQuery}
          notifications={notifications}
          currentUser={currentUser}
          onMarkNotificationRead={handleMarkNotificationRead}
          onLogout={handleLogout}
          onCreateProject={handleCreateProject}
        />

        {/* Project Content */}
        <ProjectPage
          key={`${activeProjectId}-${currentView}-${searchQuery}`}
          project={activeProject}
          currentUserId={currentUser.id}
          currentView={currentView}
          searchQuery={searchQuery}
        />
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <AddProjectModal onClose={() => setShowAddProjectModal(false)} />
      )}
    </div>
  );
};

export default App;