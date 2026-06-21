"use client";

import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().split('T')[1].substring(0, 8) + " UTC");
    };
    update();
    const int = setInterval(update, 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <nav className="w-full border-b border-[var(--color-border-thin)] bg-black/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Terminal size={16} className="text-[var(--color-text-faded)]" />
          <span className="font-mono text-sm tracking-widest text-[var(--color-text-header)] uppercase">
            Novax
          </span>
          <span className="font-mono text-[10px] text-[var(--color-text-faded)] bg-[#111] px-2 py-0.5 rounded-sm uppercase border border-[#222]">
            Sys_Core_V1
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse shadow-[0_0_8px_#00ccff]" />
            <span className="font-mono text-[10px] text-[var(--color-text-faded)] uppercase tracking-wider">
              Network: Stable
            </span>
          </div>
          <span className="font-mono text-[10px] text-[var(--color-text-faded)]">
            {time}
          </span>
        </div>
      </div>
    </nav>
  );
}
