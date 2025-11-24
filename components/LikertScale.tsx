import React from 'react';

interface LikertScaleProps {
  value: number;
  onChange: (val: number) => void;
  labels?: string[];
  max?: number;
}

export const LikertScale: React.FC<LikertScaleProps> = ({ 
  value, 
  onChange, 
  labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  max = 5
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full mt-4">
      {[...Array(max)].map((_, i) => {
        const rating = i + 1;
        const isSelected = value === rating;
        
        return (
          <div key={rating} className="flex flex-col items-center gap-1 group w-full sm:w-auto cursor-pointer" onClick={() => onChange(rating)}>
             <div 
              className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200
                ${isSelected 
                  ? 'bg-brand-600 border-brand-600 text-white scale-110 shadow-md' 
                  : 'bg-white border-slate-200 text-slate-400 group-hover:border-brand-300 group-hover:text-brand-400'
                }
              `}
            >
              {rating}
            </div>
            <span className={`text-[10px] sm:text-xs text-center font-medium ${isSelected ? 'text-brand-700' : 'text-slate-400'}`}>
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
};