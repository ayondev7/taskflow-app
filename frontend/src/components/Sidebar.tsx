import React from 'react';

interface SidebarProps {
  projects: Array<{ id: string; name: string; status: 'active' | 'archived' }>;
  activeProjectId: string;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  projects,
  activeProjectId,
  onProjectSelect,
  onCreateProject
}) => {
  const activeProjects = projects.filter(p => p.status === 'active');
  const archivedProjects = projects.filter(p => p.status === 'archived');

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen overflow-hidden sm:hidden md:flex">
      {/* App Branding */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">TaskFlow</h1>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Projects</h2>
            <button
              onClick={onCreateProject}
              className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              aria-label="Create new project"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="space-y-1">
            {activeProjects.map(project => (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeProjectId === project.id
                    ? 'bg-neutral-800 text-white font-medium'
                    : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                }`}
              >
                <span className="truncate block">{project.name}</span>
              </button>
            ))}
          </div>

          {archivedProjects.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-6 mb-3">Archived</h2>
              <div className="space-y-1">  
                {archivedProjects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => onProjectSelect(project.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeProjectId === project.id
                        ? 'bg-neutral-800 text-white font-medium'
                        : 'text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-400'
                    }`}
                  >
                    <span className="truncate block">{project.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
