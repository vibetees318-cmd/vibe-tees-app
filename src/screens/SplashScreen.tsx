import React, { useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-zinc-950 text-white select-none">
      {/* Top spacer */}
      <div className="w-full flex justify-end">
        <button
          onClick={onComplete}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800"
        >
          <span>Skip</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Center Brand Lockup */}
      <div className="flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-2xl shadow-amber-500/10 relative overflow-hidden group">
            <span className="font-display font-black text-6xl text-amber-400 tracking-tighter">
              V
            </span>
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          </div>
          {/* Subtle pulse ring */}
          <div className="absolute -inset-2 rounded-3xl border border-amber-400/20 animate-ping opacity-30 pointer-events-none" />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white">
            VIBE<span className="text-amber-400">TEES</span>
          </h1>
          <p className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            Streetwear · Heavyweight Oversized Drops
          </p>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="flex flex-col items-center space-y-3 pb-6">
        <div className="w-36 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full animate-pulse w-3/4" />
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          Loading Winter Collection 2026...
        </span>
      </div>
    </div>
  );
};
