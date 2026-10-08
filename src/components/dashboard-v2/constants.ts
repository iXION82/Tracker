export type MoodType = 
  | '🔥 Highly Motivated'
  | '💪 Motivated'
  | '😊 Happy'
  | '😌 Calm'
  | '😐 Neutral'
  | '😴 Tired'
  | '😕 Unfocused'
  | '😞 Low'
  | '😔 Sad'
  | '😣 Stressed'
  | '😡 Frustrated';

export type TimeWindow = 'morning' | 'afternoon' | 'evening' | 'night';

export const MOODS: MoodType[] = [
  '🔥 Highly Motivated',
  '💪 Motivated',
  '😊 Happy',
  '😌 Calm',
  '😐 Neutral',
  '😴 Tired',
  '😕 Unfocused',
  '😞 Low',
  '😔 Sad',
  '😣 Stressed',
  '😡 Frustrated'
];

export const WINDOW_CONFIG: Record<TimeWindow, { label: string, time: string }> = {
  morning: { label: 'MORNING', time: '8:00 AM — 12:00 PM' },
  afternoon: { label: 'AFTERNOON', time: '12:00 PM — 4:00 PM' },
  evening: { label: 'EVENING', time: '4:00 PM — 8:00 PM' },
  night: { label: 'NIGHT', time: '8:00 PM — 12:00 AM' }
};

export const getMotivationalMessage = (mood: MoodType): string => {
  const messages: Record<string, string[]> = {
    '🔥 Highly Motivated': [
      "You're locked in. Make this session count.",
      "Protect this momentum.",
      "Great moment for deep work."
    ],
    '💪 Motivated': [
      "You've got momentum. Keep pushing.",
      "You're already moving. Make this session count.",
      "Stay focused — you're building something bigger than today."
    ],
    '😊 Happy': [
      "Great energy. Use it well.",
      "Enjoy the momentum and make something great today.",
      "Keep that energy going."
    ],
    '😌 Calm': [
      "Use this calm state to get into deep focus.",
      "Perfect time for steady, uninterrupted work."
    ],
    '😐 Neutral': [
      "Just focus on the next step.",
      "Consistency is more important than intensity."
    ],
    '😴 Tired': [
      "Take a short break, hydrate, and come back refreshed.",
      "You don't need to sprint every hour. Reset and continue.",
      "Slow down for a moment, then get back to it."
    ],
    '😕 Unfocused': [
      "Don't think about the whole day. Focus only on the next 25 minutes.",
      "Remove one distraction and start with one small task.",
      "You don't need motivation to begin. Just start."
    ],
    '😞 Low': [
      "Not every day has to be perfect. Just take the next small step.",
      "It's okay to have a difficult moment. Be kind to yourself.",
      "You don't have to fix everything right now. Just focus on what you can do next."
    ],
    '😔 Sad': [
      "Not every day has to be perfect. Just take the next small step.",
      "It's okay to have a difficult moment. Be kind to yourself."
    ],
    '😣 Stressed': [
      "Take a breath. You only need to handle the next thing.",
      "Slow down and focus on one task at a time.",
      "Progress doesn't require everything to happen at once."
    ],
    '😡 Frustrated': [
      "Getting stuck is part of getting better.",
      "Take a short reset, then try again from a different angle.",
      "One difficult session doesn't define your progress."
    ]
  };

  const pool = messages[mood] || messages['😐 Neutral'];
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getQuote = (mood?: MoodType): string => {
  const defaultQuotes = [
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don't watch the clock; do what it does. Keep going.",
    "The secret of getting ahead is getting started.",
    "Small progress is still progress.",
    "Discipline is choosing between what you want now and what you want most."
  ];
  // Can expand to mood-specific quote lists later
  return defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
};
