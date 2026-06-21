import Navigation from "@/components/Navigation";
import { Heart, Star, Shield, Zap } from "lucide-react";

export default function LetterPage() {
  return (
    <main className="min-h-screen relative flex flex-col bg-[var(--color-canvas)]">
      <Navigation />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 flex flex-col justify-center">
        
        <div className="neo-panel bg-white p-8 md:p-12 relative rotate-[-1deg]">
          <div className="absolute -top-6 -left-6 bg-[#fcd53f] border-4 border-black p-4 shadow-[4px_4px_0_0_#000] rotate-[-10deg]">
            <Star size={32} strokeWidth={3} className="text-black" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-[#ff499e] border-4 border-black p-4 shadow-[4px_4px_0_0_#000] rotate-[5deg]">
            <Heart size={32} strokeWidth={3} className="text-black" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase mb-8 border-b-8 border-black pb-4 inline-block">
            Hey Dad,
          </h1>
          
          <div className="space-y-6 text-xl md:text-2xl font-bold leading-relaxed">
            <p>
              I know you spend all day crushing tasks, jumping on calls, and grinding it out. But I built this whole thing just to remind you of one very important fact:
            </p>
            
            <p className="bg-black text-white p-4 inline-block transform rotate-[1deg] shadow-[4px_4px_0_0_#ff499e]">
              YOU ARE AN ABSOLUTE LEGEND.
            </p>

            <p>
              Thank you for everything you do for our family. For all the late nights, the early mornings, and the sacrifices that we sometimes don't even see. You are our rock, our protector, and the smartest guy in the room.
            </p>

            <p className="flex items-center gap-4">
              <Shield className="text-[#2fe6de]" size={32} strokeWidth={3} /> 
              Whenever you're feeling stressed, or a meeting goes too long, or the inbox is overflowing... just come to this page.
            </p>

            <p className="flex items-center gap-4">
              <Zap className="text-[#fcd53f]" size={32} strokeWidth={3} />
              Take a deep breath. You've got this. You always do.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t-8 border-black text-right">
            <p className="text-2xl font-black uppercase tracking-widest text-[#9b51e0]">
              Happy Father's Day!
            </p>
            <p className="text-xl font-bold mt-2">
              Love, your favorite kid, Rohan.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
