import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import DadLevelCard from "@/components/DadLevelCard";
import GamifiedTimetable from "@/components/GamifiedTimetable";
import MiniGame from "@/components/MiniGame";
import HabitTracker from "@/components/HabitTracker";

export default function QuestsPage() {
  return (
    <main className="min-h-screen relative flex flex-col bg-[var(--color-canvas)]">
      <Navigation />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold uppercase hover:underline">
            <ArrowLeft size={20} strokeWidth={3} />
            BACK TO DASHBOARD
          </Link>
        </div>
        <div className="neo-panel p-6 bg-white mb-8 border-b-8 border-r-8 border-black shadow-[4px_4px_0_0_#9b51e0]">
          <h2 className="text-3xl font-black text-black uppercase mb-1">Quest Log</h2>
          <p className="text-black font-bold uppercase tracking-wider">LEVEL UP YOUR DAY</p>
        </div>

        <DadLevelCard />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <GamifiedTimetable />
          </div>
          <div className="space-y-8">
            <MiniGame />
            <HabitTracker />
          </div>
        </div>
      </div>
    </main>
  );
}
