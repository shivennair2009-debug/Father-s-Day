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
    <nav className="w-full bg-[#fcd53f] border-b-4 border-black shadow-[0_4px_0_0_#000] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-black text-white p-1 border-2 border-black">
            <Terminal size={20} strokeWidth={3} />
          </div>
          <span className="font-bold text-xl tracking-tight text-black uppercase">
            Dad's HQ
          </span>
          <span className="font-mono text-xs font-bold text-black bg-white px-2 py-1 uppercase border-2 border-black shadow-[2px_2px_0_0_#000]">
            DAD_MODE_ACTIVE
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0_0_#000]">
            <div className="w-3 h-3 bg-[#2fe6de] border-2 border-black" />
            <span className="font-bold text-xs text-black uppercase tracking-wider">
              ONLINE
            </span>
          </div>
          <span className="font-mono font-bold text-sm text-black bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0_0_#000]">
            {time}
          </span>
        </div>
      </div>
    </nav>
  );
}
