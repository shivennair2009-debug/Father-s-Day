"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

export default function MiniGame() {
  const [active, setActive] = useState(false);
  const [alignment, setAlignment] = useState(50);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setAlignment((prev) => {
        // Drift away from 50
        const drift = Math.random() > 0.5 ? 3 : -3;
        const next = prev + drift;
        if (next <= 0 || next >= 100) {
          setActive(false); // game over
          return 50;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [active]);

  const stabilize = () => {
    if (!active) {
      setActive(true);
      setScore(0);
      setAlignment(50);
      return;
    }
    // Push back towards 50
    setAlignment((prev) => {
      const diff = 50 - prev;
      return prev + diff * 0.5;
    });
    setScore((s) => s + 1);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="glass-panel p-3 flex flex-col items-end group hover:glass-panel-active cursor-pointer" onClick={stabilize}>
        <div className="flex items-center space-x-3 mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
          <Activity size={14} className={active ? "text-neon animate-pulse" : "text-[var(--color-text-faded)]"} />
          <span className="font-mono text-[10px] text-[var(--color-text-faded)] uppercase tracking-wider">
            Reactor Alignment
          </span>
        </div>
        
        {active ? (
          <div className="w-32 h-1 bg-[#111] relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[var(--color-text-faded)] z-10" />
            <div 
              className="absolute top-0 bottom-0 bg-blue-500 transition-all duration-100"
              style={{ left: `${Math.min(alignment, 50)}%`, right: `${100 - Math.max(alignment, 50)}%` }}
            />
          </div>
        ) : (
          <span className="font-mono text-[10px] text-[var(--color-priority-high)] uppercase">
            {score > 0 ? `Max Cycle: ${score}` : "Offline - Click to Start"}
          </span>
        )}
      </div>
    </div>
  );
}
