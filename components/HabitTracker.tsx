"use client";

import { useEffect, useState } from "react";
import type { Task } from "./TaskGrid";

export default function HabitTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (e) {}
    };
    fetchTasks();
    
    // Simple polling to keep it updated when TaskGrid changes it
    const int = setInterval(fetchTasks, 5000);
    return () => clearInterval(int);
  }, []);

  // Generate last 30 days
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  // Count completions per day
  const completionsPerDay: Record<string, number> = {};
  tasks.forEach(t => {
    if (t.status === 'COMPLETED' && t.completed_at) {
      const d = new Date(t.completed_at);
      d.setHours(0, 0, 0, 0);
      const key = d.getTime().toString();
      completionsPerDay[key] = (completionsPerDay[key] || 0) + 1;
    }
  });

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count <= 2) return "bg-[#2fe6de]";
    if (count <= 4) return "bg-[#fcd53f]";
    return "bg-[#ff499e]";
  };

  return (
    <div className="neo-panel p-6 mt-8 mb-8 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl uppercase tracking-tight text-black">Consistency Tracker</h3>
        <div className="flex gap-2 items-center text-xs font-bold">
          <span className="text-gray-500">Less</span>
          <div className="w-4 h-4 border-2 border-black bg-gray-100" />
          <div className="w-4 h-4 border-2 border-black bg-[#2fe6de]" />
          <div className="w-4 h-4 border-2 border-black bg-[#fcd53f]" />
          <div className="w-4 h-4 border-2 border-black bg-[#ff499e]" />
          <span className="text-gray-500">More</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {days.map((day, i) => {
          const count = completionsPerDay[day.getTime().toString()] || 0;
          return (
            <div 
              key={i} 
              suppressHydrationWarning
              title={`${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}: ${count} tasks`}
              className={`w-6 h-6 sm:w-8 sm:h-8 border-2 border-black shadow-[2px_2px_0_0_#000] transition-transform hover:-translate-y-1 ${getColor(count)}`}
            />
          );
        })}
      </div>
    </div>
  );
}
