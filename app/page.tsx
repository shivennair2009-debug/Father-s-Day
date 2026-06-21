"use client";

import { useState } from "react";
import CollageWelcome from "@/components/CollageWelcome";
import Navigation from "@/components/Navigation";
import MetricsBar from "@/components/MetricsBar";
import TaskGrid from "@/components/TaskGrid";
import Launchpad from "@/components/Launchpad";
import StandupGenerator from "@/components/StandupGenerator";
import FocusTimer from "@/components/FocusTimer";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [metrics, setMetrics] = useState({ total: 0, completed: 0, pending: 0 });

  if (!entered) {
    return <CollageWelcome onEnter={() => setEntered(true)} />;
  }

  return (
    <main className="min-h-screen relative flex flex-col bg-[var(--color-canvas)]">
      <Navigation />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Launchpad />

        <div className="flex flex-col gap-8 mb-8">
          <MetricsBar {...metrics} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <TaskGrid onMetricsChange={setMetrics} />
            <StandupGenerator />
          </div>
          
          <div className="lg:col-span-1">
            <FocusTimer />
          </div>
        </div>
      </div>
    </main>
  );
}
