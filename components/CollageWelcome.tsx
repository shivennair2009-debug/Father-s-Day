"use client";

import { motion } from "framer-motion";

export default function CollageWelcome({ onEnter }: { onEnter: () => void }) {
  const images = [
    { src: "/images/placeholder-1.jpg", caption: "best dad", alt: "Dad 1" },
    { src: "/images/placeholder-2.jpg", caption: "best husband", alt: "Dad 2" },
    { src: "/images/placeholder-3.jpg", caption: "THE GOAT", alt: "Dad 3" },
    { src: "/images/placeholder-4.jpg", caption: "My OG", alt: "Dad 4" },
    { src: "/images/placeholder-5.jpg", caption: "Legend", alt: "Dad 5" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto bg-black bg-opacity-90 backdrop-blur-md">
      <div className="max-w-5xl w-full p-8 my-auto min-h-fit">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-mono text-neon tracking-widest uppercase mb-2">Novax Automator</h1>
          <p className="text-[var(--color-text-faded)] font-sans tracking-wide">SYSTEM INITIALIZATION SEQUENCE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`relative group overflow-hidden glass-panel ${
                i === 0 ? "md:col-span-2 md:row-span-2 aspect-video" : "aspect-square"
              }`}
            >
              <div className="absolute inset-0 bg-[#111] flex items-center justify-center text-[var(--color-text-faded)] font-mono text-sm border border-[#222]">
                <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
              <div className="absolute bottom-0 left-0 w-full p-4 z-20 translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="font-mono text-sm text-[var(--color-text-header)] uppercase tracking-widest px-2 py-1 bg-black/50 backdrop-blur-sm border border-[var(--color-border-thin)]">
                  {img.caption}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onEnter}
            className="group relative px-8 py-3 font-mono text-lg tracking-widest text-[var(--color-text-header)] uppercase overflow-hidden glass-panel hover:glass-panel-active"
          >
            <span className="relative z-10 group-hover:text-neon transition-colors">Enter System</span>
            <div className="absolute inset-0 bg-blue-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
        </div>
      </div>
    </div>
  );
}
