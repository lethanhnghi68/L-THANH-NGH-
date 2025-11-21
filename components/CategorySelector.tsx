import React from 'react';
import { Scenario } from '../types';

interface Props {
  scenarios: Scenario[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const CategorySelector: React.FC<Props> = ({ scenarios, selectedId, onSelect }) => {
  return (
    <div className="w-full overflow-x-auto py-4 mb-4 border-b border-slate-800">
      <div className="flex space-x-3 px-2 min-w-max">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              selectedId === scenario.id
                ? 'bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            {scenario.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
