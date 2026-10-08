"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MoodType, TimeWindow, MOODS, WINDOW_CONFIG, getMotivationalMessage } from "./constants";
import { cn } from "@/lib/utils";

interface TimeWindowCardProps {
  window: TimeWindow;
  initialHours?: number;
  initialMood?: MoodType;
  initialNote?: string;
  onUpdate: (data: { hours: number; mood?: MoodType; note?: string }) => void;
}

export function TimeWindowCard({ window, initialHours = 0, initialMood, initialNote = "", onUpdate }: TimeWindowCardProps) {
  const [hours, setHours] = useState(initialHours);
  const [mood, setMood] = useState<MoodType | undefined>(initialMood);
  const [note, setNote] = useState(initialNote);
  
  const config = WINDOW_CONFIG[window];
  
  const handleHoursChange = (value: number[]) => {
    const newHours = value[0];
    setHours(newHours);
    onUpdate({ hours: newHours, mood, note });
  };
  
  const handleMoodChange = (val: string) => {
    const newMood = val as MoodType;
    setMood(newMood);
    onUpdate({ hours, mood: newMood, note });
  };
  
  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNote = e.target.value;
    setNote(newNote);
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
      
      <div className="mb-6">
        <Slider 
          value={[hours]} 
          max={4} 
          step={0.5} 
          onValueChange={handleHoursChange}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-zinc-600 px-1 mt-1">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Select value={mood} onValueChange={handleMoodChange}>
            <SelectTrigger className="bg-[#18181B] border-white/5 h-10">
              <SelectValue placeholder="How do you feel?" />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-white/10">
              {MOODS.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {mood && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <p className="text-sm text-zinc-300 italic">
              "{getMotivationalMessage(mood)}"
            </p>
          </div>
        )}
        
        <div>
          <Input 
            placeholder="Note for this session..." 
            value={note}
            onChange={handleNoteChange}
            onBlur={handleNoteBlur}
            className="bg-[#18181B] border-white/5 h-10"
          />
        </div>
      </div>
    </Card>
  );
}
