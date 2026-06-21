"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Film, Tv, Star, Trash2, CheckCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";

type WatchlistItem = {
  id: string;
  title: string;
  type: "MOVIE" | "SHOW";
  platform: string;
  status: "PENDING" | "COMPLETED";
  rating: number;
  created_at: string;
};

const PLATFORMS = ["Netflix", "Prime", "Hotstar", "Zee5", "SonyLiv", "Other"];

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"MOVIE" | "SHOW">("MOVIE");
  const [newPlatform, setNewPlatform] = useState("Netflix");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/watchlist");
      if (res.ok) setItems(await res.json());
    } catch (e) {}
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, type: newType, platform: newPlatform })
    });

    if (res.ok) {
      const added = await res.json();
      setItems([added, ...items]);
      setNewTitle("");
    }
  };

  const markCompleted = async (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, status: "COMPLETED" } : item));
    await fetch(`/api/watchlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED" })
    });
  };

  const updateRating = async (id: string, rating: number) => {
    setItems(items.map(item => item.id === id ? { ...item, rating } : item));
    await fetch(`/api/watchlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating })
    });
  };

  const deleteItem = async (id: string) => {
    setItems(items.filter(item => item.id !== id));
    await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
  };

  const pendingItems = items.filter(i => i.status === "PENDING");
  const watchedItems = items.filter(i => i.status === "COMPLETED");

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Netflix": return "bg-[#ff499e] text-white";
      case "Prime": return "bg-[#2fe6de] text-black";
      case "Hotstar": return "bg-[#fcd53f] text-black";
      case "Zee5": return "bg-[#9b51e0] text-white";
      case "SonyLiv": return "bg-black text-white";
      default: return "bg-white text-black";
    }
  };

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

        <div className="neo-panel p-6 bg-white mb-8 border-b-8 border-r-8 border-black shadow-[4px_4px_0_0_#2fe6de]">
          <h2 className="text-3xl font-black text-black uppercase mb-1">Watchlist</h2>
          <p className="text-black font-bold uppercase tracking-wider">MOVIES & SHOWS RADAR</p>
        </div>

        <form onSubmit={addItem} className="neo-panel bg-white p-6 mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="MOVIE OR SHOW TITLE..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="neo-input px-4 py-3 font-bold flex-1"
            required
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as "MOVIE" | "SHOW")}
            className="neo-input px-4 py-3 font-bold cursor-pointer bg-white"
          >
            <option value="MOVIE">MOVIE</option>
            <option value="SHOW">TV SHOW</option>
          </select>
          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="neo-input px-4 py-3 font-bold cursor-pointer bg-white"
          >
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button type="submit" className="neo-button px-8 py-3 bg-[#fcd53f] hover:bg-black hover:text-white transition-colors">
            ADD TO RADAR
          </button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* UP NEXT */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-black uppercase mb-2 border-b-4 border-black pb-2 inline-block self-start">
              UP NEXT
            </h3>
            <AnimatePresence>
              {pendingItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="neo-panel bg-white p-4 flex items-center gap-4 relative overflow-hidden"
                >
                  <button 
                    onClick={() => markCompleted(item.id)}
                    className="w-12 h-12 border-4 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] hover:bg-[#2fe6de] transition-colors shrink-0"
                  >
                    <CheckCircle size={24} strokeWidth={3} className="text-black" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.type === 'MOVIE' ? <Film size={16} /> : <Tv size={16} />}
                      <span className="font-bold text-lg truncate block">{item.title}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 border-2 border-black uppercase shadow-[2px_2px_0_0_#000] ${getPlatformColor(item.platform)}`}>
                      {item.platform}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="p-2 border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-[#ff499e] hover:text-white transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
              {pendingItems.length === 0 && (
                <div className="neo-panel p-8 text-center bg-gray-50 text-gray-400 font-bold uppercase">
                  No items in queue
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* HALL OF FAME */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-black uppercase mb-2 border-b-4 border-black pb-2 inline-block self-start">
              WATCHED (RATE EM)
            </h3>
            <AnimatePresence>
              {watchedItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="neo-panel bg-white p-4 flex flex-col gap-3 relative overflow-hidden border-r-8 border-black shadow-[4px_4px_0_0_#fcd53f]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 opacity-75">
                        {item.type === 'MOVIE' ? <Film size={16} /> : <Tv size={16} />}
                        <span className="font-bold text-lg truncate block line-through">{item.title}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 border-2 border-black uppercase shadow-[2px_2px_0_0_#000] opacity-75 ${getPlatformColor(item.platform)}`}>
                        {item.platform}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="p-2 border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-[#ff499e] hover:text-white transition-colors shrink-0"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 bg-gray-50 p-2 border-2 border-black w-max">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star}
                        onClick={() => updateRating(item.id, star)}
                        className={`p-1 hover:scale-110 transition-transform ${star <= item.rating ? 'text-[#fcd53f]' : 'text-gray-300'}`}
                      >
                        <Star size={24} strokeWidth={3} fill={star <= item.rating ? '#fcd53f' : 'transparent'} />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
              {watchedItems.length === 0 && (
                <div className="neo-panel p-8 text-center bg-gray-50 text-gray-400 font-bold uppercase">
                  Nothing watched yet
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
