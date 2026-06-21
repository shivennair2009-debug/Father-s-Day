"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<25 | 50>(25);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = (newMode?: 25 | 50) => {
    setIsRunning(false);
    const m = newMode || mode;
    setMode(m);
    setTimeLeft(m * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="neo-panel bg-[#ff499e] text-white p-6 flex flex-col items-center">
      <h3 className="font-black text-xl uppercase mb-6 flex items-center gap-2 w-full justify-center">
        <Timer size={24} strokeWidth={3} />
        Deep Work Timer
      </h3>

      <div className="text-7xl font-mono font-black border-4 border-white bg-black px-6 py-4 shadow-[6px_6px_0_0_#fff] mb-8 rotate-[2deg] tabular-nums">
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={toggleTimer}
          className="flex-1 bg-white text-black border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none flex justify-center items-center gap-2 text-lg"
        >
          {isRunning ? <><Pause size={20} strokeWidth={3} /> PAUSE</> : <><Play size={20} strokeWidth={3} /> START</>}
        </button>
        <button
          onClick={() => resetTimer()}
          className="w-14 bg-white text-black border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none flex justify-center items-center"
        >
          <RotateCcw size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="flex gap-2 mt-6 w-full justify-center">
        <button 
          onClick={() => resetTimer(25)}
          className={`px-3 py-1 border-2 font-bold text-sm shadow-[2px_2px_0_0_#000] ${mode === 25 ? 'bg-black text-white border-black' : 'bg-transparent text-white border-white'}`}
        >
          25 MIN
        </button>
        <button 
          onClick={() => resetTimer(50)}
          className={`px-3 py-1 border-2 font-bold text-sm shadow-[2px_2px_0_0_#000] ${mode === 50 ? 'bg-black text-white border-black' : 'bg-transparent text-white border-white'}`}
        >
          50 MIN
        </button>
      </div>
    </div>
  );
}
