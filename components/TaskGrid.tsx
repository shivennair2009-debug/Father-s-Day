"use client";

import { useState, useEffect } from "react";
import { Check, Clock, Plus, Search, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type Task = {
  id: string;
  title: string;
  priority: "LOW" | "MED" | "HIGH";
  category: string;
  status: "PENDING" | "COMPLETED";
  created_at: string;
};

export default function TaskGrid({ onMetricsChange }: { onMetricsChange: (metrics: { total: number; completed: number; pending: number }) => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"LOW" | "MED" | "HIGH">("LOW");

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    onMetricsChange({
      total: tasks.length,
      completed: tasks.filter(t => t.status === "COMPLETED").length,
      pending: tasks.filter(t => t.status === "PENDING").length
    });
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {}
  };

  const toggleStatus = async (id: string, currentStatus: "PENDING" | "COMPLETED") => {
    const newStatus = currentStatus === "PENDING" ? "COMPLETED" : "PENDING";
    
    // Optimistic update
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
  };

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTaskTitle, priority: newTaskPriority, category: "General" })
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setNewTaskTitle("");
      setNewTaskPriority("LOW");
    }
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()));

  const priorityColors = {
    HIGH: "bg-[var(--color-priority-high)]",
    MED: "bg-[var(--color-priority-med)]",
    LOW: "bg-[var(--color-priority-low)]"
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow glass-panel flex items-center px-4 py-2">
          <Search size={16} className="text-[var(--color-text-faded)] mr-3" />
          <input
            type="text"
            placeholder="FILTER NODES..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-[var(--color-text-header)] font-mono text-sm placeholder:text-[#444]"
          />
        </div>
        
        <form onSubmit={addTask} className="flex gap-2">
          <select 
            value={newTaskPriority} 
            onChange={(e) => setNewTaskPriority(e.target.value as any)}
            className="glass-panel px-4 py-2 bg-transparent text-[var(--color-text-header)] font-mono text-sm outline-none cursor-pointer"
          >
            <option value="LOW" className="bg-black text-[#0088ff]">LOW</option>
            <option value="MED" className="bg-black text-[#aaaaaa]">MED</option>
            <option value="HIGH" className="bg-black text-[#ff3333]">HIGH</option>
          </select>
          <input
            type="text"
            placeholder="NEW TASK PAYLOAD..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="glass-panel px-4 py-2 bg-transparent text-[var(--color-text-header)] font-mono text-sm outline-none placeholder:text-[#444] w-64"
          />
          <button type="submit" className="glass-panel px-4 py-2 hover:glass-panel-active text-neon transition-colors flex items-center justify-center">
            <Plus size={18} />
          </button>
        </form>
      </div>

      {/* Grid */}
      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 border-b border-[var(--color-border-thin)] text-[10px] font-mono text-[var(--color-text-faded)] tracking-widest uppercase">
          <div className="w-8">STAT</div>
          <div>PAYLOAD</div>
          <div className="w-24 text-center">PRIORITY</div>
          <div className="w-12 text-center">CMD</div>
        </div>

        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="group glass-panel relative overflow-hidden"
            >
              {/* Priority Indicator Line */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityColors[task.priority]}`} />
              
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-4 py-3 ml-2">
                {/* Status Toggle */}
                <button 
                  onClick={() => toggleStatus(task.id, task.status)}
                  className={`w-6 h-6 border border-[var(--color-border-thin)] flex items-center justify-center transition-colors ${task.status === 'COMPLETED' ? 'bg-[#111] text-neon border-neon/50' : 'hover:bg-[#111]'}`}
                >
                  {task.status === 'COMPLETED' ? <Check size={12} /> : <Clock size={12} className="opacity-30" />}
                </button>

                {/* Title */}
                <span className={`font-sans text-sm tracking-wide transition-all ${task.status === 'COMPLETED' ? 'text-[var(--color-text-faded)] line-through' : 'text-[var(--color-text-header)]'}`}>
                  {task.title}
                </span>

                {/* Priority */}
                <div className="w-24 text-center">
                  <span className="font-mono text-[10px] tracking-widest text-[var(--color-text-faded)]">
                    {task.priority}
                  </span>
                </div>

                {/* Delete */}
                <div className="w-12 text-center flex justify-center">
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--color-text-faded)] hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-[var(--color-text-faded)] font-mono text-sm tracking-widest">
              [ NO NODES FOUND ]
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
