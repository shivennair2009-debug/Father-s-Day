"use client";

import { motion } from "framer-motion";

export default function CollageWelcome({ onEnter }: { onEnter: () => void }) {
  const images = [
    { src: "/images/placeholder-1.jpg", caption: "BEST DAD", alt: "Dad 1", rotate: -2, color: "#fcd53f" },
    { src: "/images/placeholder-2.jpg", caption: "BEST HUSBAND", alt: "Dad 2", rotate: 3, color: "#2fe6de" },
    { src: "/images/placeholder-3.jpg", caption: "THE GOAT", alt: "Dad 3", rotate: -1, color: "#ff499e" },
    { src: "/images/placeholder-4.jpg", caption: "MY OG", alt: "Dad 4", rotate: 2, color: "#9b51e0" },
    { src: "/images/placeholder-5.jpg", caption: "LEGEND", alt: "Dad 5", rotate: -3, color: "#ffffff" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto bg-[var(--color-canvas)] pb-12 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-5xl w-full p-8 my-auto min-h-fit pt-12">
        <div className="text-center mb-16 neo-panel p-6 bg-white max-w-2xl mx-auto rotate-[-1deg]">
          <h1 className="text-5xl font-black text-black uppercase mb-2">Dad's Dashboard</h1>
          <p className="text-black font-bold uppercase tracking-widest">System Initialization Sequence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
              className={`relative neo-panel p-3 pb-12 bg-white ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              style={{ rotate: img.rotate }}
            >
              <div className="relative w-full h-full aspect-square border-2 border-black overflow-hidden bg-black">
                <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 border-2 border-black font-bold text-sm shadow-[2px_2px_0_0_#000]" style={{ backgroundColor: img.color }}>
                {img.caption}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onEnter}
            className="neo-button px-10 py-5 text-2xl"
          >
            ENTER DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
