import React, { useState, useEffect, useRef } from 'react';
import { Flame, Sparkles, ChevronLeft, ChevronRight, Volume2, VolumeX, ArrowRight, Zap, Play } from 'lucide-react';
import { VideoReelDeal, Product } from '../types';
import { getDailyReels } from '../data/videoReels';

interface DynamicVideoReelWidgetProps {
  onSelectProductById: (productId: string, specialDealPrice?: number) => void;
}

export const DynamicVideoReelWidget: React.FC<DynamicVideoReelWidgetProps> = ({
  onSelectProductById,
}) => {
  const [reels] = useState<VideoReelDeal[]>(() => getDailyReels());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentReel = reels[currentIndex];

  // Auto-advance reels every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reels.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [reels.length]);

  // When current slide changes, reset video state and ensure playback
  useEffect(() => {
    setIsVideoLoading(true);
    setHasVideoError(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may need muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [currentIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleReelClick = () => {
    onSelectProductById(currentReel.productID, currentReel.dealPrice);
  };

  return (
    <div
      onClick={handleReelClick}
      className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl cursor-pointer group select-none transition-all duration-300"
    >
      {/* Video / Poster Stream Container */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-zinc-950">
        {/* Poster Image (Always present as backdrop/instant fallback) */}
        <img
          src={currentReel.posterImage}
          alt={currentReel.title}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            !hasVideoError && !isVideoLoading ? 'opacity-20' : 'opacity-100 scale-105'
          }`}
        />

        {/* Dynamic Video Reel Element */}
        {!hasVideoError && (
          <video
            ref={videoRef}
            key={currentReel.id}
            src={currentReel.videoUrl}
            poster={currentReel.posterImage}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setIsVideoLoading(false)}
            onError={() => {
              setHasVideoError(true);
              setIsVideoLoading(false);
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-105"
          />
        )}

        {/* Cinematic Gradient Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Floating Dynamic Discount & Sale Overlay Badge (Top Corner) */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 animate-pulse">
        <Flame className="w-4 h-4 fill-zinc-950" />
        <span>{currentReel.badge}</span>
      </div>

      {/* Audio Mute/Unmute Control */}
      {!hasVideoError && (
        <button
          onClick={handleToggleMute}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/80 transition-colors"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
        </button>
      )}

      {/* Reel Details & Direct Shop Now CTA Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 flex flex-col justify-end">
        {/* Live Tagline */}
        <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-semibold mb-1 flex items-center gap-1">
          <Zap className="w-3 h-3 fill-amber-400" />
          <span>Daily Drop Rotation · Tap to Claim</span>
        </span>

        {/* Product Title */}
        <h3 className="text-base sm:text-xl font-display font-black text-white leading-tight drop-shadow-md max-w-md line-clamp-1">
          {currentReel.title}
        </h3>

        {/* Pricing Layout */}
        <div className="flex items-baseline gap-2.5 mt-1.5">
          <span className="text-lg sm:text-2xl font-black font-sans text-amber-400 tabular-nums">
            ₹{currentReel.dealPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-xs sm:text-sm text-zinc-400 line-through tabular-nums">
            ₹{currentReel.originalPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
            Save {currentReel.discountPercent}%
          </span>
        </div>

        {/* CTA Bar & Pagination Dots */}
        <div className="mt-3 flex items-center justify-between gap-3 pt-2 border-t border-white/10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProductById(currentReel.productID, currentReel.dealPrice);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-amber-400/20"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Swipeable Carousel Indicators */}
          <div className="flex items-center gap-1.5">
            {reels.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-6 bg-amber-400' : 'w-1.5 bg-zinc-600/70 hover:bg-zinc-400'
                }`}
                aria-label={`Go to video ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="hidden group-hover:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white items-center justify-center hover:bg-black/90 transition-colors z-20"
        aria-label="Previous Deal Reel"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={handleNext}
        className="hidden group-hover:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white items-center justify-center hover:bg-black/90 transition-colors z-20"
        aria-label="Next Deal Reel"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
