"use client";

import { useEffect, useState } from "react";
import { Award, Star } from "lucide-react";

export default function DadLevelCard() {
  const [stats, setStats] = useState({ total_xp: 0, current_level: 1 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) setStats(await res.json());
      } catch (e) {}
    };
    fetchStats();
    const int = setInterval(fetchStats, 5000);
    return () => clearInterval(int);
  }, []);

  const nextLevelXp = stats.current_level * 100;
  const currentLevelProgress = stats.total_xp % 100;
  const progressPercent = (currentLevelProgress / 100) * 100;

  return (
    <div className="neo-panel bg-[#fcd53f] p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center rotate-[-3deg]">
          <span className="text-sm font-bold uppercase tracking-widest">Level</span>
          <span className="text-4xl font-black">{stats.current_level}</span>
        </div>
        
        <div>
          <h2 className="text-2xl font-black uppercase flex items-center gap-2">
            <Award size={28} className="text-[#ff499e]" strokeWidth={3} />
            Dad Status
          </h2>
          <p className="font-bold text-lg text-black/80">Total XP: {stats.total_xp}</p>
        </div>
      </div>

      <div className="flex-1 w-full md:max-w-md bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000]">
        <div className="flex justify-between font-bold mb-2 text-sm uppercase">
          <span>Level {stats.current_level}</span>
          <span>Next Level: {nextLevelXp} XP</span>
        </div>
        <div className="w-full h-8 bg-gray-200 border-2 border-black overflow-hidden relative">
          <div 
            className="h-full bg-[#2fe6de] border-r-2 border-black transition-all duration-1000 ease-out flex items-center justify-end pr-2"
            style={{ width: `${progressPercent}%` }}
          >
            {progressPercent > 10 && <Star size={16} strokeWidth={3} />}
          </div>
        </div>
      </div>
    </div>
  );
}
