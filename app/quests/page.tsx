import Navigation from "@/components/Navigation";
import DadLevelCard from "@/components/DadLevelCard";
import GamifiedTimetable from "@/components/GamifiedTimetable";

export default function QuestsPage() {
  return (
    <main className="min-h-screen relative flex flex-col bg-[var(--color-canvas)]">
      <Navigation />
      
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-10 neo-panel p-6 bg-white inline-block rotate-[1deg]">
          <h2 className="text-3xl font-black text-black uppercase mb-1">Quest Log</h2>
          <p className="text-black font-bold uppercase tracking-wider">LEVEL UP YOUR DAY</p>
        </div>

        <DadLevelCard />
        <GamifiedTimetable />
      </div>
    </main>
  );
}
