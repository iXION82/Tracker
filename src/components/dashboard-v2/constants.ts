export type MoodType =
  | 'Highly Motivated'
  | 'Motivated'
  | 'Focused'
  | 'Calm'
  | 'Neutral'
  | 'Tired'
  | 'Unfocused'
  | 'Frustrated'
  | 'Stressed'
  | 'Low';

export type TimeWindow = 'morning' | 'afternoon' | 'evening' | 'night';

export const MOODS: MoodType[] = [
  'Highly Motivated',
  'Motivated',
  'Focused',
  'Calm',
  'Neutral',
  'Tired',
  'Unfocused',
  'Frustrated',
  'Stressed',
  'Low'
];

export const MOOD_COLORS: Record<MoodType, { bg: string; border: string; text: string }> = {
  'Highly Motivated': { bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-400' },
  'Motivated':        { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  'Focused':          { bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-400' },
  'Calm':             { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-400' },
  'Neutral':          { bg: 'bg-zinc-500/10', border: 'border-zinc-500/40', text: 'text-zinc-400' },
  'Tired':            { bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', text: 'text-yellow-400' },
  'Unfocused':        { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-400' },
  'Frustrated':       { bg: 'bg-red-500/10', border: 'border-red-500/40', text: 'text-red-400' },
  'Stressed':         { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-400' },
  'Low':              { bg: 'bg-slate-500/10', border: 'border-slate-500/40', text: 'text-slate-400' },
};

export const WINDOW_CONFIG: Record<TimeWindow, { label: string, time: string }> = {
  morning: { label: 'MORNING', time: '8:00 AM — 12:00 PM' },
  afternoon: { label: 'AFTERNOON', time: '12:00 PM — 4:00 PM' },
  evening: { label: 'EVENING', time: '4:00 PM — 8:00 PM' },
  night: { label: 'NIGHT', time: '8:00 PM — 12:00 AM' }
};

export const getMotivationalMessage = (mood: MoodType): string => {
  const messages: Record<MoodType, string[]> = {
    'Highly Motivated': [
      "Don't waste the momentum.",
      "Turn motivation into evidence.",
      "This energy is rare. Use every second.",
      "You're locked in. Execute.",
      "No ceiling today. Go.",
      "Channel this into something permanent.",
    ],
    'Motivated': [
      "Good. Now prove it.",
      "Motivation without action is decoration.",
      "You feel ready. So act like it.",
      "Don't just feel it — build with it.",
      "This is the window. Don't waste it.",
    ],
    'Focused': [
      "Protect your attention. Kill distractions.",
      "Deep work. No notifications. No excuses.",
      "You're in the zone. Stay there.",
      "Focus is a weapon. Use it.",
      "Don't break this flow for anything.",
    ],
    'Calm': [
      "Calm is power. Use it for deep thinking.",
      "Perfect state for hard problems.",
      "Steady pace wins. Keep building.",
      "No rush. Just relentless consistency.",
    ],
    'Neutral': [
      "You don't need to feel great to work great.",
      "Discipline doesn't ask how you feel.",
      "Average mood, above-average output. That's the goal.",
      "Start. The feeling will follow.",
    ],
    'Tired': [
      "If you're tired, do it tired.",
      "You're tired. So what? Keep going.",
      "Rest is earned. Put in the work first.",
      "Tired is not an excuse. It's a condition. Work through it.",
      "The best sessions happen when you don't feel like it.",
      "Your competition isn't tired. Move.",
    ],
    'Unfocused': [
      "Stop waiting to feel focused. Start.",
      "You don't need motivation. You need discipline.",
      "One task. 25 minutes. No negotiation.",
      "Distraction is a choice. Choose differently.",
      "Lock the phone. Open the editor. Begin.",
      "Focus isn't a feeling. It's a decision.",
    ],
    'Frustrated': [
      "Being stuck is not permission to quit.",
      "Figure it out.",
      "Frustration means you're pushing your limit. Good.",
      "Break the problem down. Solve the smallest piece.",
      "You're not failing. You're fighting. Keep fighting.",
      "Anger is fuel if you aim it right.",
    ],
    'Stressed': [
      "One problem at a time. Move.",
      "Stress means you care. Now channel it.",
      "You've handled worse. Handle this.",
      "Stop overthinking. Start executing.",
      "Pressure makes diamonds. Don't crack.",
    ],
    'Low': [
      "Bad day. Fine. Still show up.",
      "You don't need a perfect day. You need one more step.",
      "Showing up on a bad day counts double.",
      "Low days build the discipline that high days can't.",
      "You're not done. You're just at the hard part.",
      "Do something small. Then do one more thing.",
    ],
  };

  const pool = messages[mood] || messages['Neutral'];
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getQuote = (mood?: MoodType): string => {
  const quotes: Record<string, string[]> = {
    motivated: [
      "Hard work beats talent when talent doesn't work hard.",
      "The grind is the shortcut.",
      "Nobody cares. Work harder.",
      "Execution over inspiration. Always.",
    ],
    tired: [
      "Sleep is important. But so is not quitting.",
      "Champions train when they don't want to.",
      "The body achieves what the mind believes.",
    ],
    unfocused: [
      "Eliminate the noise. Amplify the signal.",
      "If everything is a priority, nothing is.",
      "You will never feel ready. Start anyway.",
    ],
    low: [
      "Rock bottom is a foundation, not a grave.",
      "Progress is not linear. Keep going.",
      "The comeback is always stronger than the setback.",
    ],
    stressed: [
      "Pressure is a privilege.",
      "Smooth seas never made a skilled sailor.",
      "You're not overwhelmed. You're under-organized.",
    ],
    default: [
      "Discipline is choosing between what you want now and what you want most.",
      "The pain of discipline is nothing like the pain of regret.",
      "Work in silence. Let results make the noise.",
      "You don't rise to the level of your goals. You fall to the level of your systems.",
      "Consistency is what transforms average into excellence.",
      "The only way to do great work is to keep doing the work.",
      "Every expert was once a beginner who refused to quit.",
      "Your future self is watching you right now through memories.",
    ],
  };

  let pool = quotes.default;
  if (mood) {
    const key = mood.toLowerCase();
    if (key.includes('motivat') || key === 'focused') pool = quotes.motivated;
    else if (key === 'tired') pool = quotes.tired;
    else if (key === 'unfocused') pool = quotes.unfocused;
    else if (key === 'low') pool = quotes.low;
    else if (key === 'stressed' || key === 'frustrated') pool = quotes.stressed;
  }

  return pool[Math.floor(Math.random() * pool.length)];
};
