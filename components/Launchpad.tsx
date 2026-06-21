"use client";

import { useState, useEffect } from "react";
import { Link2, Plus, Trash2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CustomLink = {
  id: string;
  title: string;
  url: string;
  color: string;
};

const BRUTALIST_COLORS = [
  "bg-white", "bg-[#fcd53f]", "bg-[#2fe6de]", "bg-[#ff499e]", "bg-[#9b51e0]"
];

export default function Launchpad() {
  const [links, setLinks] = useState<CustomLink[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newColor, setNewColor] = useState("bg-[#fcd53f]");

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (res.ok) setLinks(await res.json());
    } catch (e) {}
  };

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, url: newUrl, color: newColor })
    });

    if (res.ok) {
      const added = await res.json();
      setLinks([...links, added]);
      setNewTitle("");
      setNewUrl("");
      setShowForm(false);
    }
  };

  const deleteLink = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLinks(links.filter(l => l.id !== id));
    await fetch(`/api/links/${id}`, { method: "DELETE" });
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-4">
        <div className="neo-panel bg-white p-3 rotate-[-1deg] inline-block">
          <h2 className="text-2xl font-black uppercase flex items-center gap-2">
            <Link2 size={28} strokeWidth={3} />
            The Launchpad
          </h2>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="neo-button px-4 py-2 flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} /> ADD LINK
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form onSubmit={addLink} className="neo-panel bg-white p-6 flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="LINK TITLE (e.g. ZOOM STANDUP)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="neo-input px-4 py-3 font-bold flex-1"
                required
              />
              <input
                type="text"
                placeholder="URL (e.g. zoom.us/j/123)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="neo-input px-4 py-3 font-bold flex-1"
                required
              />
              <select
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className={`neo-input px-4 py-3 font-bold cursor-pointer w-32 ${newColor} ${newColor === 'bg-[#9b51e0]' ? 'text-white' : 'text-black'}`}
              >
                {BRUTALIST_COLORS.map(c => (
                  <option key={c} value={c} className="bg-white text-black">{c.replace('bg-[', '').replace(']', '')}</option>
                ))}
              </select>
              <button type="submit" className="neo-button px-8 py-3">SAVE</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AnimatePresence>
          {links.map(link => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`block border-4 border-black p-4 shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group relative min-h-[100px] flex flex-col items-center justify-center text-center ${link.color} ${link.color === 'bg-[#9b51e0]' || link.color === 'bg-[#ff499e]' ? 'text-white' : 'text-black'}`}
            >
              <span className="font-black text-lg leading-tight uppercase line-clamp-3 break-words w-full">
                {link.title}
              </span>
              <ExternalLink size={16} strokeWidth={3} className="absolute bottom-2 right-2 opacity-50" />
              <button 
                onClick={(e) => deleteLink(e, link.id)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white p-1 hover:bg-red-500"
              >
                <Trash2 size={16} />
              </button>
            </motion.a>
          ))}
          {links.length === 0 && !showForm && (
            <div className="col-span-full border-4 border-dashed border-black p-8 flex items-center justify-center bg-gray-50 opacity-50">
              <span className="font-bold text-xl uppercase tracking-widest">NO LINKS ADDED YET</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
