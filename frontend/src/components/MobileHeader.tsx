import React, { useState } from 'react';

interface MobileHeaderProps {
  projects: Array<{ id: string; name: string; status: 'active' | 'archived' }>;
  activeProjectId: string;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  projects,
  activeProjectId,
  onProjectSelect,
  onCreateProject
}) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const activeProjects = projects.filter(p => p.status === 'active');
  const archivedProjects = projects.filter(p => p.status === 'archived');

  return (
    <div className="md:hidden bg-neutral-900 border-b border-neutral-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-white">TaskFlow</h1>
        </div>
        
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showMenu ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {showMenu && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Projects</h2>
              <button
                onClick={() => {
                  onCreateProject();
                  setShowMenu(false);
                }}
                className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div className="space-y-1">
              {activeProjects.map(project => (
                <button
                  key={project.id}
                  onClick={() => {
                    onProjectSelect(project.id);
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeProjectId === project.id
                      ? 'bg-neutral-800 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                  }`}
                >
                  {project.name}
                </button>
              ))}
            </div>

            {archivedProjects.length > 0 && (
              <>
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-2">Archived</h2>
                <div className="space-y-1">
                  {archivedProjects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => {
                        onProjectSelect(project.id);
                        setShowMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeProjectId === project.id
                          ? 'bg-neutral-800 text-white font-medium'
                          : 'text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-400'
                      }`}
                    >
                      {project.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
