"use client";

import { useState, useEffect } from "react";
import { Crosshair } from "lucide-react";

export default function MiniGame() {
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  const startGame = () => {
    setPlaying(true);
    setScore(0);
    setTimeLeft(10);
    moveTarget();
  };

  const moveTarget = () => {
    setTargetPos({
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 80) + 10
    });
  };

  const hitTarget = () => {
    if (!playing) return;
    setScore(s => s + 1);
    moveTarget();
  };

  useEffect(() => {
    if (playing && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setPlaying(false);
    }
  }, [playing, timeLeft]);

  return (
    <div className="neo-panel p-6 mb-8 bg-[#2fe6de]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl uppercase tracking-tight text-black">Idle Breaker: Target Practice</h3>
        <span className="font-mono font-bold bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0_0_#000]">
          SCORE: {score} | TIME: {timeLeft}s
        </span>
      </div>

      <div className="relative w-full h-48 bg-white border-4 border-black overflow-hidden shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.1)]">
        {!playing && timeLeft === 10 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={startGame} className="neo-button px-6 py-3 bg-[#fcd53f]">
              START MINI-GAME
            </button>
          </div>
        )}

        {!playing && timeLeft === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#ff499e]">
            <span className="font-black text-2xl mb-2 text-white drop-shadow-[2px_2px_0_#000]">GAME OVER</span>
            <span className="font-bold mb-4">FINAL SCORE: {score}</span>
            <button onClick={startGame} className="neo-button px-4 py-2 bg-white">
              PLAY AGAIN
            </button>
          </div>
        )}

        {playing && (
          <button 
            onClick={hitTarget}
            className="absolute p-2 transition-all hover:scale-110 active:scale-95"
            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <Crosshair size={32} strokeWidth={3} className="text-[#ff499e]" />
          </button>
        )}
      </div>
    </div>
  );
}
