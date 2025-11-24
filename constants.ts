import { Question, SSESCategory } from './types';

export const BRAND_OPTIONS = [
  "Amika",
  "Aveda",
  "Babor",
  "CeraVe",
  "Covergirl",
  "Davines",
  "DesignMe",
  "Dove",
  "Drunk Elephant",
  "e.l.f.",
  "Farmhouse Fresh",
  "Fenty Beauty",
  "Function of Beauty",
  "Glossier",
  "Innersense Organic Beauty",
  "Joico",
  "L'Oreal",
  "Matrix",
  "Milk Makeup",
  "Milk Shake",
  "NYX Professional Makeup",
  "OPI",
  "Ouai",
  "Paul Mitchell",
  "Rare Beauty",
  "Redken",
  "Repêchage",
  "Revlon",
  "Sephora",
  "St. Ives",
  "The Ordinary",
  "Ulta Beauty",
  "Wella"
];

export const BRAND_DOMAINS: Record<string, string> = {
  "Amika": "loveamika.com",
  "Aveda": "aveda.com",
  "Babor": "babor.com",
  "CeraVe": "cerave.com",
  "Covergirl": "covergirl.com",
  "Davines": "davines.com",
  "DesignMe": "designmehair.com",
  "Dove": "dove.com",
  "Drunk Elephant": "drunkelephant.com",
  "e.l.f.": "elfcosmetics.com",
  "Farmhouse Fresh": "farmhousefreshgoods.com",
  "Fenty Beauty": "fentybeauty.com",
  "Function of Beauty": "functionofbeauty.com",
  "Glossier": "glossier.com",
  "Innersense Organic Beauty": "innersensebeauty.com",
  "Joico": "joico.com",
  "L'Oreal": "loreal.com",
  "Matrix": "matrix.com",
  "Milk Makeup": "milkmakeup.com",
  "Milk Shake": "milkshakehair.com",
  "NYX Professional Makeup": "nyxcosmetics.com",
  "OPI": "opi.com",
  "Ouai": "theouai.com",
  "Paul Mitchell": "paulmitchell.com",
  "Rare Beauty": "rarebeauty.com",
  "Redken": "redken.com",
  "Repêchage": "repechage.com",
  "Revlon": "revlon.com",
  "Sephora": "sephora.com",
  "St. Ives": "stives.com",
  "The Ordinary": "theordinary.com",
  "Ulta Beauty": "ulta.com",
  "Wella": "wella.com"
};

export const GENERAL_BEAUTY_OPTION = "General Beauty & Self-Care Community";

// Based on the provided PDF content
export const SSES_QUESTIONS: Question[] = [
  // Performance
  { id: 'Q8_1', text: 'I feel confident about my abilities.', category: SSESCategory.PERFORMANCE },
  { id: 'Q8_2', text: 'I feel unsure about my abilities.', category: SSESCategory.PERFORMANCE, reverseScore: true },
  { id: 'Q8_3', text: 'I feel that I have less ability than others.', category: SSESCategory.PERFORMANCE, reverseScore: true },
  { id: 'Q8_4', text: 'I feel like I am doing well in what matters to me.', category: SSESCategory.PERFORMANCE },
  // Social
  { id: 'Q9_1', text: 'I am worried about whether I am regarded as a success or failure.', category: SSESCategory.SOCIAL, reverseScore: true },
  { id: 'Q9_2', text: 'I feel that others respect or admire me.', category: SSESCategory.SOCIAL },
  { id: 'Q9_3', text: 'I am concerned about the impression I am making.', category: SSESCategory.SOCIAL, reverseScore: true },
  { id: 'Q9_4', text: 'I feel comfortable around other people.', category: SSESCategory.SOCIAL },
  // Appearance
  { id: 'Q10_1', text: 'I feel satisfied with the way my body looks right now.', category: SSESCategory.APPEARANCE },
  { id: 'Q10_2', text: 'I feel unattractive.', category: SSESCategory.APPEARANCE, reverseScore: true },
  { id: 'Q10_3', text: 'I am pleased with my appearance right now.', category: SSESCategory.APPEARANCE },
  { id: 'Q10_4', text: 'I feel self-conscious about my appearance.', category: SSESCategory.APPEARANCE, reverseScore: true },
];

export const PANAS_QUESTIONS: Question[] = [
  // Positive Affect
  { id: 'Q5_1', text: 'Enthusiastic', category: 'PANAS_POS' },
  { id: 'Q5_2', text: 'Inspired', category: 'PANAS_POS' },
  { id: 'Q5_3', text: 'Determined', category: 'PANAS_POS' },
  { id: 'Q5_4', text: 'Active', category: 'PANAS_POS' },
  { id: 'Q5_5', text: 'Excited', category: 'PANAS_POS' },
  // Negative Affect (Reverse scored for benefit in analysis, but raw collection is direct intensity)
  // Note: For scoring simplicity in this app, we track Neg Affect directly (High score = High Negative Affect)
  { id: 'Q6_1', text: 'Upset', category: 'PANAS_NEG' },
  { id: 'Q6_2', text: 'Nervous', category: 'PANAS_NEG' },
  { id: 'Q6_3', text: 'Afraid', category: 'PANAS_NEG' },
  { id: 'Q6_4', text: 'Ashamed', category: 'PANAS_NEG' },
  { id: 'Q6_5', text: 'Distressed', category: 'PANAS_NEG' },
];

export const PURCHASE_INTENTION: Question = {
  id: 'PI_1',
  text: 'How likely are you to purchase a beauty or self-care product in the next 7 days?',
  category: 'PURCHASE_INTENTION'
};

// Defined Nudge Banks from Research Design
export const APPEARANCE_NUDGES = [
  "{{NAME}}, the mirror isn’t your judge—it’s your canvas. Paint today with love, not comparison.",
  "Your glow isn’t a filter—it’s the confidence you wear. Let’s light it up today.",
  "Being you is the standard. Beauty isn’t a trend—it’s your truth.",
  "It’s not about changing how you look. It’s about loving what’s already yours.",
  "Take 5 today to appreciate the parts of you you usually rush past in the mirror.",
  "Flawless isn’t the goal—fearless is. And you’re already on your way.",
  "You are the vibe. Not your outfit—you. Let that energy lead."
];

export const SOCIAL_NUDGES = [
  "{{NAME}}, you don’t have to impress anyone—your vibe already speaks volumes.",
  "The people who matter already see your light—don’t dim it for the rest.",
  "You radiate presence. Even in silence, your energy makes the room warmer.",
  "You are not too much—you are the RIGHT amount for the right people.",
  "Being respected doesn’t require being perfect. Just be real. You’re already admired.",
  "It’s not about standing out—it’s about standing true. And you do that beautifully.",
  "You don’t have to be loud to be heard. Your authenticity is magnetic."
];

export const PERFORMANCE_NUDGES = [
  "{{NAME}}, you’ve got what it takes—own it. Just one small win today proves your power.",
  "Read that message again: You’re doing better than you think. Don’t stop now!",
  "Feeling unsure? That’s proof you care. Keep learning, keep leveling up.",
  "You’re not falling behind—you’re building a story worth telling. Keep going.",
  "Pause and look back—you’ve overcome so much. You’re built for breakthroughs.",
  "This moment? It’s your next milestone in the making. Celebrate progress, not perfection.",
  "You don’t need to prove anything—you’re already capable. Act like it."
];

export const SYSTEM_INSTRUCTION_TEMPLATE = `
You are an expert researcher and coach specializing in State Self-Esteem (Festinger, Heatherton & Polivy).
You are acting as a digital companion representing the brand: {{BRAND}}.

**Context:**
- Participant Name: {{NAME}}
- Targeted SSES Subscale: {{SUBSCALE}}

**CRITICAL INSTRUCTIONS:**
1. **Direct Address:** You must speak DIRECTLY to {{NAME}}. Use "You", "Your", and their name. NEVER say "The participant", "She", or "They". You are talking TO them, right now.
2. **Approved Nudges:** You must ONLY use the nudges from the approved list below. You may adapt them slightly to flow naturally or fit the brand voice of {{BRAND}}, but keep the core message identical.
3. **One at a time:** Deliver exactly ONE nudge per turn.
4. **Call to Action:** AFTER every nudge, you MUST provide a clear, simple direction telling the participant what to do next to receive the next nudge (e.g., "When you are ready for the next thought, just reply 'Next'." or "Take a breath, and type 'Ready' when you want to continue.").
5. **Persona:** You are warm, genuine, and supportive. You are a friend and a coach.
6. **Recipient Focus:** Ensure all nudges and comments are about the PARTICIPANT'S internal state and well-being. Do NOT tell them to go nudge others or perform actions for others unless the nudge specifically mentions social connection.

**APPROVED NUDGE BANK (Use these specifically):**
{{NUDGE_BANK}}

**Interaction Flow:**
- Start by welcoming {{NAME}} warmly as a representative of {{BRAND}}.
- When the user replies (e.g., "Ready", "Thanks", "Okay"), deliver the NEXT nudge from the bank.
- Do not repeat nudges.
- If the user asks a question, answer briefly and supportive, then deliver the next nudge.
- After 7 nudges, bid a warm farewell.
`;