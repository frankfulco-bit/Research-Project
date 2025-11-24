import React, { useState, useEffect, useRef } from 'react';
import { initializeChat, sendMessageToGemini } from '../services/geminiService';
import { Button } from './Button';
import { Message, UserData } from '../types';
import { GENERAL_BEAUTY_OPTION, BRAND_DOMAINS } from '../constants';

interface ChatInterventionProps {
  userData: UserData;
  lowestSubscale: string;
  onComplete: () => void;
}

export const ChatIntervention: React.FC<ChatInterventionProps> = ({ 
  userData, 
  lowestSubscale, 
  onComplete 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nudgeCount, setNudgeCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine Primary Brand Persona
  // If specific brands are selected, we prioritize the first one to act as the "face" of the intervention.
  const validBrands = userData.trustedBrands.filter(b => b !== GENERAL_BEAUTY_OPTION);
  const primaryBrand = validBrands.length > 0 ? validBrands[0] : null;
  const brandContext = primaryBrand || GENERAL_BEAUTY_OPTION;
  
  // Logic to determine logo URL
  // 1. If it's a specific brand with a known domain, try Clearbit logo API
  // 2. Fallback to UI Avatars with brand initials
  let brandLogoUrl: string | null = null;
  
  if (primaryBrand) {
    if (BRAND_DOMAINS[primaryBrand]) {
       // Clearbit Logo API
       brandLogoUrl = `https://logo.clearbit.com/${BRAND_DOMAINS[primaryBrand]}`;
    } else {
       // Avatar fallback
       brandLogoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(primaryBrand)}&background=db2777&color=fff&size=128&font-size=0.4&bold=true`;
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial Startup
  useEffect(() => {
    const startSession = async () => {
      setIsLoading(true);
      try {
        await initializeChat(userData.firstName, brandContext, lowestSubscale);
        
        // Trigger the first message from the bot
        const prompt = `Hello. I am ready to start. Please welcome me (my name is ${userData.firstName}) warmly, mention you are from ${brandContext}, and give me the first nudge to help with my ${lowestSubscale} self-esteem. Ensure you speak directly to me using 'You' and tell me what to do next.`;
        const response = await sendMessageToGemini(prompt);
        
        setMessages([{ role: 'model', text: response, isNudge: true }]);
        setNudgeCount(1);
      } catch (e) {
        console.error("Failed to start chat", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      // Determine if we are asking for the next nudge or just chatting
      // Logic: If nudgeCount < 7, strictly guide the model to provide the next nudge if the interaction warrants it.
      let contextPrompt = textToSend;
      if (nudgeCount < 7) {
        contextPrompt = `${textToSend} (If this is an acknowledgement or a request to continue, please provide Nudge #${nudgeCount + 1}. Always include a brief instruction on what to do next to continue).`;
      } else {
        contextPrompt = `${textToSend} (I have received all nudges. Please provide a brief closing statement wishing me well).`;
      }

      const response = await sendMessageToGemini(contextPrompt);
      
      setMessages(prev => [...prev, { role: 'model', text: response, isNudge: true }]);
      
      // Heuristic: assume the model followed instructions and gave a nudge
      if (nudgeCount < 7) {
        setNudgeCount(prev => prev + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-100">
      {/* Header */}
      <div className="bg-brand-600 p-4 text-white flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden border-2 border-brand-100">
             {brandLogoUrl ? (
               <img 
                 src={brandLogoUrl} 
                 alt="Logo" 
                 className="w-full h-full object-contain p-0.5" 
                 onError={(e) => {
                   // Fallback on error to avatar
                   e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(primaryBrand || 'Lumina')}&background=db2777&color=fff&size=128&font-size=0.4&bold=true`;
                 }}
               />
             ) : (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#db2777" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
               </svg>
             )}
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg tracking-wide leading-none">
              {primaryBrand ? primaryBrand : "Lumina Companion"}
            </h2>
            <p className="text-brand-100 text-xs uppercase tracking-wider font-medium mt-1">
              {primaryBrand ? "Official Nudge Partner" : "AI Research Assistant"}
            </p>
          </div>
        </div>
        <div className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
          Nudge {Math.min(nudgeCount, 7)}/7
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white border border-brand-200 shadow-sm flex items-center justify-center mt-1">
                {brandLogoUrl ? (
                  <img 
                    src={brandLogoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-contain p-1" 
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(primaryBrand || 'AI')}&background=db2777&color=fff&size=128&font-size=0.4&bold=true`;
                    }}
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#db2777" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                )}
              </div>
            )}

            <div 
              className={`
                max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm text-sm sm:text-base leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
             <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white border border-brand-200 shadow-sm flex items-center justify-center mt-1">
                 {brandLogoUrl ? (
                  <img 
                    src={brandLogoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(primaryBrand || 'AI')}&background=db2777&color=fff&size=128&font-size=0.4&bold=true`;
                    }}
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#db2777" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                )}
             </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Action Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {nudgeCount >= 7 && !isLoading ? (
          <div className="text-center space-y-3">
             <p className="text-slate-600 text-sm">You have completed the daily nudges.</p>
             <Button fullWidth onClick={onComplete}>Continue to Post-Study Survey</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a reply..."
                className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
                disabled={isLoading}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-brand-600 text-white p-3 rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => handleSend("Thank you, I'm ready for the next one.")}
                disabled={isLoading}
                className="text-xs text-brand-600 font-medium hover:underline bg-brand-50 px-3 py-1 rounded-full"
              >
                Quick Reply: "Ready for next"
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};