"use client";

import { useState } from "react";
import CollageWelcome from "@/components/CollageWelcome";
import Navigation from "@/components/Navigation";
import MetricsBar from "@/components/MetricsBar";
import TaskGrid from "@/components/TaskGrid";
import HabitTracker from "@/components/HabitTracker";
import MiniGame from "@/components/MiniGame";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [metrics, setMetrics] = useState({ total: 0, completed: 0, pending: 0 });

  return (
    <main className="min-h-screen relative flex flex-col bg-[var(--color-canvas)]">
      {!entered && <CollageWelcome onEnter={() => setEntered(true)} />}

      <div className={`flex-1 flex flex-col transition-opacity duration-1000 ${entered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <Navigation />
        
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
          <div className="mb-10 neo-panel p-6 bg-[#ff499e] inline-block">
            <h2 className="text-3xl font-black text-black uppercase mb-1">Dad's Dashboard</h2>
            <p className="text-black font-bold uppercase tracking-wider">YOUR PERSONAL TASK MANAGER</p>
          </div>

          <MetricsBar {...metrics} />
          
          <TaskGrid onMetricsChange={setMetrics} />
        </div>
      </div>
    </main>
  );
}
