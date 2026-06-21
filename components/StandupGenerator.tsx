"use client";

import { useState } from "react";
import { FileText, Copy, CheckCircle } from "lucide-react";
import type { Task } from "./TaskGrid";

export default function StandupGenerator() {
  const [report, setReport] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const tasks: Task[] = await res.json();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const completed = tasks.filter(t => 
        t.status === 'COMPLETED' && 
        t.completed_at && 
        new Date(t.completed_at) > yesterday
      );
      
      const priorityPending = tasks.filter(t => 
        t.status === 'PENDING' && 
        (t.priority === 'VERY_HIGH' || t.priority === 'HIGH')
      );

      let text = "🚀 *Daily Standup Update* 🚀\n\n";
      
      text += "*Completed Yesterday:*\n";
      if (completed.length === 0) text += "- (No tasks marked completed yesterday)\n";
      completed.forEach(t => { text += `- ✅ ${t.title}\n`; });

      text += "\n*Priorities for Today:*\n";
      if (priorityPending.length === 0) text += "- (No high priority tasks queued)\n";
      priorityPending.forEach(t => { text += `- 🎯 [${t.priority}] ${t.title}\n`; });

      text += "\n*Blockers:*\n- None at the moment!";

      setReport(text);
    } catch (e) {
      setReport("Error generating report.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="neo-panel bg-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black text-xl uppercase flex items-center gap-2">
          <FileText size={24} strokeWidth={3} className="text-[#9b51e0]" />
          Standup Generator
        </h3>
        <button 
          onClick={generateReport}
          className="neo-button px-4 py-2 text-sm bg-[#9b51e0] text-white hover:bg-black"
          disabled={loading}
        >
          {loading ? "GENERATING..." : "GENERATE REPORT"}
        </button>
      </div>

      {report && (
        <div className="relative">
          <textarea
            readOnly
            value={report}
            className="w-full h-48 border-4 border-black p-4 font-mono text-sm bg-gray-50 focus:outline-none resize-none"
          />
          <button
            onClick={copyToClipboard}
            className={`absolute top-2 right-2 p-2 border-2 border-black font-bold flex items-center gap-2 transition-all ${copied ? 'bg-[#2fe6de] text-black shadow-none translate-x-0.5 translate-y-0.5' : 'bg-white shadow-[2px_2px_0_0_#000] hover:bg-gray-100'}`}
          >
            {copied ? <><CheckCircle size={16} strokeWidth={3} /> COPIED</> : <><Copy size={16} strokeWidth={3} /> COPY</>}
          </button>
        </div>
      )}
      {!report && (
        <div className="w-full h-24 border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-sm">
          Click generate to compile report
        </div>
      )}
    </div>
  );
}
