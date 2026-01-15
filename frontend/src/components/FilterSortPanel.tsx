import React, { useState } from 'react';
import type { Priority, Stage } from '../types';
import { getPriorityBadgeColor } from '../utils/helpers';

interface FilterSortPanelProps {
  stages: Stage[];
  onFilterChange: (filters: {
    stages: string[];
    priorities: Priority[];
  }) => void;
  onSortChange: (field: 'title' | 'priority' | 'dueDate' | 'createdAt', direction: 'asc' | 'desc') => void;
}

const FilterSortPanel: React.FC<FilterSortPanelProps> = ({
  stages,
  onFilterChange,
  onSortChange
}) => {
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [sortField, setSortField] = useState<'title' | 'priority' | 'dueDate' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];

  const toggleStage = (stageId: string) => {
    const newStages = selectedStages.includes(stageId)
      ? selectedStages.filter(id => id !== stageId)
      : [...selectedStages, stageId];
    setSelectedStages(newStages);
    onFilterChange({ stages: newStages, priorities: selectedPriorities });
  };

  const togglePriority = (priority: Priority) => {
    const newPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter(p => p !== priority)
      : [...selectedPriorities, priority];
    setSelectedPriorities(newPriorities);
    onFilterChange({ stages: selectedStages, priorities: newPriorities });
  };

  const handleSortChange = (field: typeof sortField) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSortChange(field, newDirection);
  };

  const clearFilters = () => {
    setSelectedStages([]);
    setSelectedPriorities([]);
    onFilterChange({ stages: [], priorities: [] });
  };

  const activeFiltersCount = selectedStages.length + selectedPriorities.length;

  return (
    <div className="border-b border-neutral-800 bg-neutral-900">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Sort by:</span>
          <div className="flex gap-1">
            {[
              { field: 'title' as const, label: 'Title' },
              { field: 'priority' as const, label: 'Priority' },
              { field: 'dueDate' as const, label: 'Due Date' },
              { field: 'createdAt' as const, label: 'Created' }
            ].map(option => (
              <button
                key={option.field}
                onClick={() => handleSortChange(option.field)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  sortField === option.field
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {option.label}
                {sortField === option.field && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="px-6 py-4 border-t border-neutral-800 space-y-4">
          {/* Stages Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Stages</h4>
              {selectedStages.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedStages([]);
                    onFilterChange({ stages: [], priorities: selectedPriorities });
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {stages.map(stage => (
                <button
                  key={stage.id}
                  onClick={() => toggleStage(stage.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedStages.includes(stage.id)
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700'
                  }`}
                  style={
                    selectedStages.includes(stage.id)
                      ? { backgroundColor: `${stage.color}40`, borderColor: stage.color, borderWidth: '1px' }
                      : {}
                  }
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    {stage.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Priorities Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Priorities</h4>
              {selectedPriorities.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedPriorities([]);
                    onFilterChange({ stages: selectedStages, priorities: [] });
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {priorities.map(priority => (
                <button
                  key={priority}
                  onClick={() => togglePriority(priority)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    selectedPriorities.includes(priority)
                      ? getPriorityBadgeColor(priority)
                      : 'text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Clear All */}
          {activeFiltersCount > 0 && (
            <div className="pt-2 border-t border-neutral-800">
              <button
                onClick={clearFilters}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSortPanel;
