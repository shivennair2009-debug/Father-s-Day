"use client";

import { useState, useEffect } from "react";
import { Check, Search, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type Task = {
  id: string;
  title: string;
  priority: "LOW" | "MED" | "HIGH";
  category: string;
  status: "PENDING" | "COMPLETED";
  created_at: string;
  completed_at?: string;
};

export default function TaskGrid({ onMetricsChange }: { onMetricsChange: (metrics: { total: number; completed: number; pending: number }) => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"LOW" | "MED" | "HIGH">("LOW");
  const [sortOrder, setSortOrder] = useState<"NONE" | "HIGH_FIRST" | "LOW_FIRST">("NONE");

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

  const priorityWeights = { HIGH: 3, MED: 2, LOW: 1 };
  
  const filteredTasks = tasks
    .filter(t => t.title.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "HIGH_FIRST") return priorityWeights[b.priority] - priorityWeights[a.priority];
      if (sortOrder === "LOW_FIRST") return priorityWeights[a.priority] - priorityWeights[b.priority];
      return 0;
    });

  const priorityColors = {
    HIGH: "bg-[#ff499e]",
    MED: "bg-[#fcd53f]",
    LOW: "bg-[#2fe6de]"
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-grow neo-input flex items-center px-4 py-3">
          <Search size={20} className="text-black mr-3" strokeWidth={3} />
          <input
            type="text"
            placeholder="SEARCH TASKS..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-black font-bold placeholder:text-gray-500"
          />
        </div>
        
        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-4">
          <select 
            value={newTaskPriority} 
            onChange={(e) => setNewTaskPriority(e.target.value as any)}
            className="neo-input px-4 py-3 bg-white text-black font-bold outline-none cursor-pointer"
          >
            <option value="LOW">LOW PRIORITY</option>
            <option value="MED">MED PRIORITY</option>
            <option value="HIGH">HIGH PRIORITY</option>
          </select>
          <input
            type="text"
            placeholder="NEW TASK..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="neo-input px-4 py-3 bg-white text-black font-bold outline-none placeholder:text-gray-500 sm:w-64"
          />
          <button type="submit" className="neo-button px-6 py-3 flex items-center justify-center">
            ADD TASK
          </button>
        </form>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setSortOrder("NONE")} className={`px-3 py-1 border-2 border-black font-bold text-sm shadow-[2px_2px_0_0_#000] ${sortOrder === "NONE" ? "bg-black text-white" : "bg-white text-black"}`}>DEFAULT</button>
        <button onClick={() => setSortOrder("HIGH_FIRST")} className={`px-3 py-1 border-2 border-black font-bold text-sm shadow-[2px_2px_0_0_#000] ${sortOrder === "HIGH_FIRST" ? "bg-black text-white" : "bg-white text-black"}`}>HIGH PRIORITY FIRST</button>
        <button onClick={() => setSortOrder("LOW_FIRST")} className={`px-3 py-1 border-2 border-black font-bold text-sm shadow-[2px_2px_0_0_#000] ${sortOrder === "LOW_FIRST" ? "bg-black text-white" : "bg-white text-black"}`}>LOW PRIORITY FIRST</button>
      </div>

      {/* Grid */}
      <div className="flex flex-col space-y-4">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="neo-panel relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4"
            >
              <button 
                onClick={() => toggleStatus(task.id, task.status)}
                className={`w-10 h-10 border-3 border-black flex-shrink-0 flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${task.status === 'COMPLETED' ? 'bg-[#9b51e0] text-white' : 'bg-white hover:bg-gray-100'}`}
              >
                {task.status === 'COMPLETED' && <Check size={24} strokeWidth={4} />}
              </button>

              <div className="flex-grow">
                <span className={`font-bold text-lg ${task.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-black'}`}>
                  {task.title}
                </span>
              </div>

              <div className={`px-3 py-1 border-2 border-black font-bold text-xs shadow-[2px_2px_0_0_#000] ${priorityColors[task.priority]}`}>
                {task.priority}
              </div>

              <button 
                onClick={() => deleteTask(task.id)}
                className="p-2 border-2 border-black bg-white shadow-[2px_2px_0_0_#000] hover:bg-[#ff499e] hover:text-white transition-colors active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <Trash2 size={20} strokeWidth={2.5} />
              </button>
            </motion.div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="neo-panel text-center py-12 bg-white">
              <span className="font-bold text-xl uppercase tracking-widest text-black">
                [ NO TASKS FOUND. TAKE A BREAK, DAD! ]
              </span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
