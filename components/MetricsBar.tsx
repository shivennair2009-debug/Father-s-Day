"use client";

interface MetricsBarProps {
  total: number;
  completed: number;
  pending: number;
}

export default function MetricsBar({ total, completed, pending }: MetricsBarProps) {
  const efficiency = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      <div className="neo-panel bg-[#2fe6de] p-5 flex flex-col justify-between">
        <span className="font-bold text-black uppercase tracking-tight mb-2">Pending Tasks</span>
        <span className="font-sans font-black text-5xl text-black">{pending}</span>
      </div>
      
      <div className="neo-panel bg-[#ff499e] p-5 flex flex-col justify-between">
        <span className="font-bold text-black uppercase tracking-tight mb-2">Efficiency</span>
        <div className="flex items-end space-x-2">
          <span className="font-sans font-black text-5xl text-black">{efficiency}%</span>
        </div>
      </div>

      <div className="neo-panel bg-white p-5 flex flex-col justify-between md:col-span-2">
        <span className="font-bold text-black uppercase tracking-tight mb-4">Task Progress</span>
        <div className="w-full h-6 bg-gray-200 border-2 border-black mt-auto flex overflow-hidden">
          <div className="bg-[#fcd53f] border-r-2 border-black transition-all duration-500" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} />
        </div>
      </div>
    </div>
  );
}
