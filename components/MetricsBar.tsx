"use client";

interface MetricsBarProps {
  total: number;
  completed: number;
  pending: number;
}

export default function MetricsBar({ total, completed, pending }: MetricsBarProps) {
  const efficiency = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="glass-panel p-4 flex flex-col justify-between">
        <span className="font-mono text-[10px] text-[var(--color-text-faded)] uppercase tracking-widest mb-2">Pending Tasks</span>
        <span className="font-sans text-3xl text-[var(--color-text-header)] font-light">{pending}</span>
      </div>
      
      <div className="glass-panel p-4 flex flex-col justify-between">
        <span className="font-mono text-[10px] text-[var(--color-text-faded)] uppercase tracking-widest mb-2">Efficiency</span>
        <div className="flex items-end space-x-2">
          <span className="font-sans text-3xl text-neon font-light">{efficiency}%</span>
        </div>
      </div>

      <div className="glass-panel p-4 flex flex-col justify-between md:col-span-2">
        <span className="font-mono text-[10px] text-[var(--color-text-faded)] uppercase tracking-widest mb-2">Task Progress</span>
        <div className="w-full h-2 bg-[#111] mt-auto flex overflow-hidden">
          <div className="bg-[var(--color-priority-high)] transition-all duration-500" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} />
          <div className="bg-[#222] flex-grow transition-all duration-500" />
        </div>
      </div>
    </div>
  );
}
