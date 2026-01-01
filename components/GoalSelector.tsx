import React from 'react';
import { GoalType } from '../types';
import { GOAL_DESCRIPTIONS } from '../constants';
import { Dumbbell, Scale, HeartPulse } from 'lucide-react';

interface GoalSelectorProps {
  selectedGoal: GoalType | null;
  onSelect: (goal: GoalType) => void;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({ selectedGoal, onSelect }) => {
  const goals = [
    { type: GoalType.WEIGHT_LOSS, icon: Scale, label: 'Emagrecimento' },
    { type: GoalType.MUSCLE_GAIN, icon: Dumbbell, label: 'Ganho de Massa' },
    { type: GoalType.GENERAL_HEALTH, icon: HeartPulse, label: 'Saúde Geral' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 text-center">Qual é o seu objetivo hoje?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoal === goal.type;
          
          return (
            <button
              key={goal.type}
              onClick={() => onSelect(goal.type)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 text-center
                ${isSelected 
                  ? 'border-red-600 bg-red-50 text-red-700 shadow-md transform scale-[1.02]' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-gray-50'
                }
              `}
            >
              <Icon size={28} className={isSelected ? 'text-red-600' : 'text-gray-400'} />
              <span className="font-bold">{goal.label}</span>
              <span className="text-xs opacity-80 leading-tight">{GOAL_DESCRIPTIONS[goal.type]}</span>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-sm">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GoalSelector;
