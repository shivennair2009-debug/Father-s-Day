"use client";

import { useState, useEffect } from "react";
import { Check, Clock, Swords } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type GamifiedTask = {
  id: string;
  title: string;
  priority: string;
  category: string;
  status: "PENDING" | "COMPLETED";
  created_at: string;
  type: "ONE_OFF" | "HABIT";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  scheduled_time: string | null;
};

export default function GamifiedTimetable() {
  const [tasks, setTasks] = useState<GamifiedTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDiff, setNewTaskDiff] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) setTasks(await res.json());
    } catch (e) {}
  };

  const toggleStatus = async (id: string, currentStatus: "PENDING" | "COMPLETED") => {
    const newStatus = currentStatus === "PENDING" ? "COMPLETED" : "PENDING";
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title: newTaskTitle, 
        priority: "LOW", 
        category: "Quest",
        type: "ONE_OFF",
        difficulty: newTaskDiff,
        scheduled_time: newTime || null
      })
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setNewTaskTitle("");
      setNewTime("");
    }
  };

  const diffColors = {
    EASY: "bg-[#2fe6de]",
    MEDIUM: "bg-[#fcd53f]",
    HARD: "bg-[#ff499e]"
  };
  
  const xpValues = { EASY: 10, MEDIUM: 25, HARD: 50 };

  return (
    <div className="w-full">
      {/* Quest Giver Form */}
      <div className="neo-panel bg-white p-6 mb-8">
        <h3 className="font-black text-xl uppercase mb-4 flex items-center gap-2">
          <Swords size={24} />
          Assign New Quest
        </h3>
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="QUEST OBJECTIVE..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="neo-input px-4 py-3 font-bold flex-1"
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="neo-input px-4 py-3 font-bold cursor-pointer"
          />
          <select 
            value={newTaskDiff} 
            onChange={(e) => setNewTaskDiff(e.target.value as any)}
            className="neo-input px-4 py-3 font-bold cursor-pointer bg-gray-50"
          >
            <option value="EASY">EASY (+10 XP)</option>
            <option value="MEDIUM">MED (+25 XP)</option>
            <option value="HARD">HARD (+50 XP)</option>
          </select>
          <button type="submit" className="neo-button px-8 py-3">
            ADD QUEST
          </button>
        </form>
      </div>

      {/* Timeline */}
      <div className="space-y-4 relative">
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-black z-0 hidden sm:block" />
        
        <AnimatePresence>
          {tasks.sort((a, b) => (a.scheduled_time || '23:59').localeCompare(b.scheduled_time || '23:59')).map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="relative z-10 flex flex-col sm:flex-row items-start gap-4"
            >
              <div className="hidden sm:flex w-12 h-12 bg-white border-4 border-black rounded-full items-center justify-center shadow-[2px_2px_0_0_#000] shrink-0 font-bold">
                {task.scheduled_time ? <Clock size={20} /> : <Swords size={20} />}
              </div>

              <div className="neo-panel flex-1 w-full bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group">
                <button 
                  onClick={() => toggleStatus(task.id, task.status)}
                  className={`w-12 h-12 border-4 border-black flex-shrink-0 flex items-center justify-center shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${task.status === 'COMPLETED' ? 'bg-[#9b51e0] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {task.status === 'COMPLETED' && <Check size={28} strokeWidth={4} />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {task.scheduled_time && (
                      <span className="font-mono font-bold text-sm bg-gray-200 px-2 py-0.5 border-2 border-black">
                        {task.scheduled_time}
                      </span>
                    )}
                    <span className={`font-bold px-2 py-0.5 text-xs border-2 border-black uppercase shadow-[2px_2px_0_0_#000] ${diffColors[task.difficulty]}`}>
                      {task.difficulty}
                    </span>
                    <span className="font-black text-sm text-[#ff499e]">
                      +{xpValues[task.difficulty]} XP
                    </span>
                  </div>
                  <span className={`font-black text-xl uppercase ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-black'}`}>
                    {task.title}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
