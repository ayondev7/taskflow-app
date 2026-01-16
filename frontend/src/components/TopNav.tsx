import React, { useState } from 'react';
import type { ViewType, User, Notification } from '../types';

interface TopNavProps {
  projectName: string;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onSearch: (query: string) => void;
  notifications: Notification[];
  currentUser: User;
  onMarkNotificationRead: (notificationId: string) => void;
  onLogout: () => void;
  onCreateProject: () => void;
}

const TopNav: React.FC<TopNavProps> = ({
  projectName,
  currentView,
  onViewChange,
  onSearch,
  notifications,
  currentUser,
  onMarkNotificationRead,
  onLogout,
  onCreateProject
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const views: { id: ViewType; label: string; icon: React.ReactElement }[] = [
    {
      id: 'kanban',
      label: 'Kanban',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      )
    },
    {
      id: 'list',
      label: 'List',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    },
    {
      id: 'board',
      label: 'Board',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
        </svg>
      )
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <nav className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-6 sm:px-4 sm:h-auto sm:flex-wrap sm:py-3">
      {/* Left Section */}
      <div className="flex items-center gap-6 sm:w-full sm:mb-3">
        <h2 className="text-lg font-semibold text-white truncate">{projectName}</h2>
        
        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-neutral-800 rounded-lg p-1 sm:hidden">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                currentView === view.id
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {view.icon}
              <span className="hidden md:inline">{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 sm:w-full">
        {/* New Project Button */}
        <button
          onClick={onCreateProject}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors sm:hidden"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Project</span>
        </button>

        {/* Search */}
        <div className="relative sm:flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search tasks..."
            className="w-64 sm:w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-neutral-800 rounded-lg border border-neutral-700 shadow-xl z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-neutral-700">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-neutral-500 text-sm">No notifications</div>
              ) : (
                <div className="py-1">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`px-4 py-3 hover:bg-neutral-700/50 cursor-pointer border-b border-neutral-700/50 last:border-0 ${
                        !notif.read ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      <p className="text-sm text-white mb-1">{notif.message}</p>
                      <p className="text-xs text-neutral-500">
                        {notif.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full border-2 border-neutral-700"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-56 bg-neutral-800 rounded-lg border border-neutral-700 shadow-xl z-50">
              <div className="p-3 border-b border-neutral-700">
                <p className="text-sm font-medium text-white">{currentUser.name}</p>
                <p className="text-xs text-neutral-500">{currentUser.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                  {currentUser.role}
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-700/50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View Switcher */}
      <div className="hidden sm:flex w-full gap-1 bg-neutral-800 rounded-lg p-1">
        {views.map(view => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
              currentView === view.id
                ? 'bg-neutral-700 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {view.icon}
            <span>{view.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TopNav;
