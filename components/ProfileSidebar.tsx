"use client";

import { useState } from "react";
import { X, Heart, Shield, Star, Zap, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Profile Button in Nav */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 border-2 border-black rounded-full overflow-hidden hover:scale-105 hover:shadow-[2px_2px_0_0_#000] transition-all cursor-pointer bg-white"
      >
        <img src="/images/dad-profile.jpg" alt="Dad Profile" className="w-full h-full object-cover" />
      </button>

      {/* Slide-out Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />

            {/* Sidebar */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 150 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[var(--color-canvas)] z-[70] border-l-8 border-black shadow-[-8px_0_0_0_#ff499e] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-3xl font-black uppercase text-black">Dad Stats</h2>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 border-2 border-black shadow-[2px_2px_0_0_#000] bg-white hover:bg-[#ff499e] hover:text-white transition-colors"
                  >
                    <X size={24} strokeWidth={3} />
                  </button>
                </div>

                <div className="flex flex-col items-center mb-8">
                  <div className="w-40 h-40 border-4 border-black shadow-[4px_4px_0_0_#000] bg-white p-2 rotate-[-2deg] mb-4">
                    <img src="/images/dad-profile.jpg" alt="Dad" className="w-full h-full object-cover border-2 border-black" />
                  </div>
                  <h3 className="text-2xl font-black uppercase bg-black text-white px-4 py-1 rotate-[1deg]">THE LEGEND</h3>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Stat 1 */}
                  <div className="neo-panel bg-[#2fe6de] p-4 flex items-center gap-4 hover:scale-105 transition-transform">
                    <div className="bg-white p-2 border-2 border-black">
                      <Star size={24} strokeWidth={3} className="text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-black opacity-80">Awesome Rating</p>
                      <p className="text-xl font-black uppercase text-black">100% Awesome</p>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="neo-panel bg-[#fcd53f] p-4 flex items-center gap-4 hover:scale-105 transition-transform">
                    <div className="bg-white p-2 border-2 border-black">
                      <Award size={24} strokeWidth={3} className="text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-black opacity-80">Current Level</p>
                      <p className="text-xl font-black uppercase text-black">LVL 100 Hardworker</p>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="neo-panel bg-[#ff499e] p-4 flex items-center gap-4 hover:scale-105 transition-transform">
                    <div className="bg-white p-2 border-2 border-black">
                      <Heart size={24} strokeWidth={3} className="text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-black opacity-80">Hearts Melted</p>
                      <p className="text-xl font-black uppercase text-white">Infinite & Beyond</p>
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className="neo-panel bg-[#9b51e0] p-4 flex items-center gap-4 hover:scale-105 transition-transform">
                    <div className="bg-white p-2 border-2 border-black">
                      <Shield size={24} strokeWidth={3} className="text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white opacity-80">Superpower</p>
                      <p className="text-xl font-black uppercase text-white">Providing for family</p>
                    </div>
                  </div>

                  {/* Stat 5 */}
                  <div className="neo-panel bg-white p-4 flex items-center gap-4 hover:scale-105 transition-transform border-black border-4 shadow-[4px_4px_0_0_#000]">
                    <div className="bg-black p-2 border-2 border-black">
                      <Zap size={24} strokeWidth={3} className="text-[#fcd53f]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-black opacity-80">Status</p>
                      <p className="text-xl font-black uppercase text-black">Best Dad in the Universe</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <p className="text-sm font-bold uppercase tracking-widest text-gray-500">WE LOVE YOU DAD ❤️</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
