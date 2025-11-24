import React, { useState, useMemo } from 'react';
import { Step, UserData, SurveyResponse, Scores, SSESCategory } from './types';
import { SSES_QUESTIONS, PANAS_QUESTIONS, BRAND_OPTIONS, PURCHASE_INTENTION, GENERAL_BEAUTY_OPTION } from './constants';
import { Button } from './components/Button';
import { Survey } from './components/Survey';
import { ChatIntervention } from './components/ChatIntervention';
import { ResultsView } from './components/ResultsView';

// Helper to calculate scores
const calculateScores = (responses: SurveyResponse): Scores => {
  const scores: Scores = {
    sses: {
      [SSESCategory.PERFORMANCE]: 0,
      [SSESCategory.SOCIAL]: 0,
      [SSESCategory.APPEARANCE]: 0,
    },
    panas: { positive: 0, negative: 0 }
  };

  // SSES Calculation
  Object.values(SSESCategory).forEach(cat => {
    const questions = SSES_QUESTIONS.filter(q => q.category === cat);
    let sum = 0;
    questions.forEach(q => {
      let val = responses[q.id] || 3; // default neutral if missing
      if (q.reverseScore) val = 6 - val; // Reverse 1-5 scale
      sum += val;
    });
    scores.sses[cat] = sum / questions.length;
  });

  // PANAS Calculation
  const posQ = PANAS_QUESTIONS.filter(q => q.category === 'PANAS_POS');
  const negQ = PANAS_QUESTIONS.filter(q => q.category === 'PANAS_NEG');
  
  scores.panas.positive = posQ.reduce((acc, q) => acc + (responses[q.id] || 0), 0) / posQ.length;
  scores.panas.negative = negQ.reduce((acc, q) => acc + (responses[q.id] || 0), 0) / negQ.length;

  // Purchase Intention
  scores.purchaseIntention = responses[PURCHASE_INTENTION.id] || 0;

  return scores;
};

const getLowestSubscale = (scores: Scores): string => {
  const sses = scores.sses;
  let lowest = SSESCategory.APPEARANCE;
  let minVal = 6; // max is 5

  Object.entries(sses).forEach(([key, value]) => {
    if (value < minVal) {
      minVal = value;
      lowest = key as SSESCategory;
    }
  });
  return lowest;
};

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.CONSENT);
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    age: '',
    gender: '',
    ethnicity: '',
    trustedBrands: []
  });
  const [preTestScores, setPreTestScores] = useState<Scores | null>(null);
  const [postTestScores, setPostTestScores] = useState<Scores | null>(null);

  // Computed state
  const lowestSubscale = useMemo(() => {
    return preTestScores ? getLowestSubscale(preTestScores) : SSESCategory.APPEARANCE;
  }, [preTestScores]);

  const toggleBrand = (brand: string) => {
    setUserData(prev => {
      const isSelected = prev.trustedBrands.includes(brand);
      if (isSelected) {
        return { ...prev, trustedBrands: prev.trustedBrands.filter(b => b !== brand) };
      } else {
        // If selecting a specific brand, ensure "General" is not selected
        const cleanList = prev.trustedBrands.filter(b => b !== GENERAL_BEAUTY_OPTION);
        return { ...prev, trustedBrands: [...cleanList, brand] };
      }
    });
  };

  const selectGeneralOption = () => {
    setUserData(prev => ({
      ...prev,
      trustedBrands: [GENERAL_BEAUTY_OPTION]
    }));
  };

  const displayBrandContext = userData.trustedBrands.join(' & ');

  const renderContent = () => {
    switch (step) {
      case Step.CONSENT:
        return (
          <div className="max-w-2xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
              Lumina
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Welcome to the Digital Nudges research study. We are investigating how AI-driven messages can support emotional well-being and self-esteem.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100 text-left mb-8">
              <h3 className="font-bold text-lg mb-4">Informed Consent</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                <li>Your participation is voluntary.</li>
                <li>Data is anonymous and used for research purposes only.</li>
                <li>The study involves a survey, a short chat interaction, and a follow-up survey.</li>
                <li>Total time: Approximately 15-20 minutes.</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => setStep(Step.DEMOGRAPHICS)}>I Agree & Continue</Button>
            </div>
          </div>
        );

      case Step.DEMOGRAPHICS:
        return (
          <div className="max-w-md mx-auto px-4 py-12">
            <h2 className="text-2xl font-serif font-bold mb-6 text-center">About You</h2>
            <div className="space-y-4 bg-white p-6 rounded-2xl shadow-lg">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name (for personalization only)</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={userData.firstName}
                  onChange={e => setUserData({...userData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input 
                  type="number" 
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={userData.age}
                  onChange={e => setUserData({...userData, age: e.target.value})}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender Identity</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                  value={userData.gender}
                  onChange={e => setUserData({...userData, gender: e.target.value})}
                >
                  <option value="">Select...</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <Button 
                fullWidth 
                disabled={!userData.firstName || !userData.age || !userData.gender}
                onClick={() => setStep(Step.PRE_TEST)}
              >
                Start Pre-Assessment
              </Button>
            </div>
          </div>
        );

      case Step.PRE_TEST:
        return (
          <Survey 
            questions={[...PANAS_QUESTIONS, ...SSES_QUESTIONS]} 
            title="Current State Check-in"
            description="Please indicate how you feel right now, at this moment."
            onComplete={(responses) => {
              const scores = calculateScores(responses);
              setPreTestScores(scores);
              setStep(Step.BRAND_SELECTION);
            }}
          />
        );

      case Step.BRAND_SELECTION:
        return (
          <div className="max-w-2xl mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Brand Preferences</h2>
            <p className="text-slate-600 mb-8">
              Select one or more brands you trust or view positively. 
              <br/>If none apply, select the general option below.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {BRAND_OPTIONS.map(brand => {
                const isSelected = userData.trustedBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`
                      p-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 relative overflow-hidden
                      ${isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-md' 
                        : 'border-slate-100 bg-white text-slate-600 hover:border-brand-200'
                      }
                    `}
                  >
                    {brand}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mb-8">
               <button
                  onClick={selectGeneralOption}
                  className={`
                    w-full max-w-md mx-auto p-4 rounded-xl text-sm font-medium transition-all duration-200 border-2
                    ${userData.trustedBrands.includes(GENERAL_BEAUTY_OPTION)
                      ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-md' 
                      : 'border-slate-100 bg-white text-slate-500 hover:border-brand-200'
                    }
                  `}
                >
                  I don't have a specific preference / General Beauty Interest
                </button>
            </div>
            
            <Button 
              disabled={userData.trustedBrands.length === 0}
              onClick={() => setStep(Step.INTERVENTION_INTRO)}
            >
              Continue to Experience
            </Button>
          </div>
        );

      case Step.INTERVENTION_INTRO:
        return (
          <div className="max-w-xl mx-auto px-4 py-20 text-center">
             <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
             </div>
             <h2 className="text-3xl font-serif font-bold mb-4">Your Personalized Companion</h2>
             <p className="text-slate-600 mb-8 leading-relaxed">
               Based on your responses, we've prepared a brief digital coaching session tailored to you, presented in partnership with {displayBrandContext}.
             </p>
             <Button onClick={() => setStep(Step.INTERVENTION_CHAT)}>Start Session</Button>
          </div>
        );

      case Step.INTERVENTION_CHAT:
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <ChatIntervention 
              userData={userData} 
              lowestSubscale={lowestSubscale}
              onComplete={() => setStep(Step.POST_TEST)}
            />
          </div>
        );

      case Step.POST_TEST:
        return (
          <Survey 
            questions={[...PANAS_QUESTIONS, ...SSES_QUESTIONS, PURCHASE_INTENTION]} 
            title="Final Check-in"
            description="Now that you've completed the session, please indicate how you feel right now."
            onComplete={(responses) => {
              const scores = calculateScores(responses);
              setPostTestScores(scores);
              setStep(Step.RESULTS);
            }}
          />
        );
      
      case Step.RESULTS:
        if (!preTestScores || !postTestScores) return null;
        return <ResultsView preScores={preTestScores} postScores={postTestScores} />;

      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 text-slate-800 font-sans selection:bg-brand-200">
      {renderContent()}
    </div>
  );
};

export default App;