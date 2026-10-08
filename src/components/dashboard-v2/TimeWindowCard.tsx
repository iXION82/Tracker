"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { MoodType, TimeWindow, MOODS, MOOD_COLORS, WINDOW_CONFIG, getMotivationalMessage } from "./constants";
import { cn } from "@/lib/utils";

interface TimeWindowCardProps {
  window: TimeWindow;
  initialHours?: number;
  initialMood?: MoodType;
  initialNote?: string;
  onUpdate: (data: { hours: number; mood?: MoodType; note?: string }) => void;
}

export function TimeWindowCard({ window: windowName, initialHours = 0, initialMood, initialNote = "", onUpdate }: TimeWindowCardProps) {
  const [hours, setHours] = useState(initialHours);
  const [mood, setMood] = useState<MoodType | undefined>(initialMood);
  const [note, setNote] = useState(initialNote);
  const [quote, setQuote] = useState("");
  const [quoteVisible, setQuoteVisible] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = WINDOW_CONFIG[windowName];

  // Sync from parent when data loads from API
  useEffect(() => {
    setHours(initialHours);
    setMood(initialMood);
    setNote(initialNote);
    if (initialMood) {
      setQuote(getMotivationalMessage(initialMood));
      setQuoteVisible(true);
    }
  }, [initialHours, initialMood, initialNote]);

  const debouncedUpdate = (data: { hours: number; mood?: MoodType; note?: string }) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onUpdate(data), 400);
  };

  const handleHoursChange = (value: number | readonly number[]) => {
    const newHours = Array.isArray(value) ? value[0] : value;
    setHours(newHours);
    debouncedUpdate({ hours: newHours, mood, note });
  };

  const handleMoodSelect = (m: MoodType) => {
    const newMood = mood === m ? undefined : m;
    setMood(newMood);
    if (newMood) {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuote(getMotivationalMessage(newMood));
        setQuoteVisible(true);
      }, 150);
    } else {
      setQuoteVisible(false);
    }
    onUpdate({ hours, mood: newMood, note });
  };

  const handleNoteBlur = () => {
    onUpdate({ hours, mood, note });
  };

  return (
    <Card className="bg-[#111113] border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-semibold tracking-wide text-sm">{config.label}</h3>
          <p className="text-zinc-500 text-xs mt-1">{config.time}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{hours} <span className="text-sm text-zinc-500 font-normal">/ 4h</span></div>
          <p className="text-xs text-zinc-500 mt-1">Productive</p>
        </div>
      </div>

      <div className="mb-5">
        <Slider
          value={[hours]}
          max={4}
          step={0.5}
          onValueChange={handleHoursChange}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-zinc-600 px-1 mt-1">
          <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
        </div>
      </div>

      {/* Mood selector — premium cards */}
      <div className="mb-4">
        <p className="text-xs text-zinc-500 mb-2 font-medium tracking-wide">MOOD</p>
        <div className="flex flex-wrap gap-1.5">
          {MOODS.map(m => {
            const colors = MOOD_COLORS[m];
            const isSelected = mood === m;
            return (
              <button
                key={m}
                onClick={() => handleMoodSelect(m)}
                className={cn(
                  "px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-200",
                  isSelected
                    ? `${colors.bg} ${colors.border} ${colors.text}`
                    : "bg-[#18181B] border-white/5 text-zinc-500 hover:border-white/15 hover:text-zinc-300"
                )}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed-height quote area — content fades in, no layout shift */}
      <div className="h-14 mb-4 flex items-center">
        <div
          className={cn(
            "w-full bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/5 transition-opacity duration-300",
            quoteVisible && quote ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-xs text-zinc-400 italic leading-relaxed line-clamp-2">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>

      <div>
        <Input
          placeholder="Note for this session..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleNoteBlur}
          className="bg-[#18181B] border-white/5 h-10 text-sm"
        />
      </div>
    </Card>
  );
}
