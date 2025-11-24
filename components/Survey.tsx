import React, { useState, useEffect } from 'react';
import { Question, SurveyResponse } from '../types';
import { LikertScale } from './LikertScale';
import { Button } from './Button';

interface SurveyProps {
  questions: Question[];
  onComplete: (responses: SurveyResponse) => void;
  title: string;
  description: string;
}

export const Survey: React.FC<SurveyProps> = ({ questions, onComplete, title, description }) => {
  const [responses, setResponses] = useState<SurveyResponse>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Scroll to top when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex]);

  const handleResponse = (val: number) => {
    setResponses(prev => ({
      ...prev,
      [questions[currentIndex].id]: val
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(responses);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentIndex];
  const canProceed = !!responses[currentQuestion.id];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600">{description}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-brand-100 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <div 
            className="h-full bg-brand-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 mb-8">
           <span className="text-xs font-bold tracking-wider text-brand-500 uppercase">
             Question {currentIndex + 1} of {questions.length}
           </span>
           <h3 className="text-xl sm:text-2xl font-medium text-slate-800 mt-3 leading-relaxed">
             {currentQuestion.text}
           </h3>
        </div>

        <div className="mb-10">
          {currentQuestion.category === 'PURCHASE_INTENTION' ? (
             <LikertScale 
              value={responses[currentQuestion.id] || 0} 
              onChange={handleResponse}
              max={5}
              labels={['Not likely', 'Unlikely', 'Neutral', 'Likely', 'Extremely Likely']}
            />
          ) : (
            <LikertScale 
              value={responses[currentQuestion.id] || 0} 
              onChange={handleResponse}
            />
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleNext} 
            disabled={!canProceed}
            className="w-full sm:w-auto"
          >
            {currentIndex === questions.length - 1 ? 'Complete Survey' : 'Next Question'}
          </Button>
        </div>
      </div>
    </div>
  );
};