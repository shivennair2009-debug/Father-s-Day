"use client";

import { useState } from "react";
import CollageWelcome from "@/components/CollageWelcome";
import Navigation from "@/components/Navigation";
import MetricsBar from "@/components/MetricsBar";
import TaskGrid from "@/components/TaskGrid";
import MiniGame from "@/components/MiniGame";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [metrics, setMetrics] = useState({ total: 0, completed: 0, pending: 0 });

  return (
    <main className="min-h-screen relative flex flex-col">
      {!entered && <CollageWelcome onEnter={() => setEntered(true)} />}

      {/* Main Dashboard - renders behind but is only interactable/visible properly after entry */}
      <div className={`flex-1 flex flex-col transition-opacity duration-1000 ${entered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <Navigation />
        
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
          <div className="mb-10">
            <h2 className="text-2xl font-mono text-neon tracking-widest uppercase mb-1">Dad's Dashboard</h2>
            <p className="text-[var(--color-text-faded)] font-sans text-sm tracking-wide">YOUR PERSONAL TASK MANAGER</p>
          </div>

          <MetricsBar {...metrics} />
          
          <TaskGrid onMetricsChange={setMetrics} />
        </div>

        <MiniGame />
      </div>
    </main>
  );
}
