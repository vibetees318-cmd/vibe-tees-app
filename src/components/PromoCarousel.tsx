import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame, Sparkles, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import streetwearCampaignImg from '../assets/images/vibe_hero_streetwear_1792082130778.jpg';
import acidWashImg from '../assets/images/tee_oversized_acid_wash_1792082131228.jpg';
import retroCyberImg from '../assets/images/tee_retro_cyber_anime_1792082132438.jpg';

interface PromoSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  code?: string;
  image: string;
  ctaText: string;
  categoryFilter?: 'Oversized' | 'Retro' | 'Streetwear' | 'Hoodies';
}

interface PromoCarouselProps {
  onSelectCategory: (cat: 'Oversized' | 'Retro' | 'Streetwear' | 'Hoodies') => void;
  onExploreClick: () => void;
}

export const PromoCarousel: React.FC<PromoCarouselProps> = ({
  onSelectCategory,
  onExploreClick,
}) => {
  const slides: PromoSlide[] = [
    {
      id: 'slide-1',
      badge: 'SEASONAL DROP 04',
      title: 'Midnight Acid Wash & Heavyweights',
      subtitle: '280 GSM combed cotton. Boxy drop-shoulder cut.',
      image: streetwearCampaignImg,
      ctaText: 'Shop Oversized',
      categoryFilter: 'Oversized',
    },
    {
      id: 'slide-2',
      badge: 'LIMITED TIME DEAL',
      title: 'Flat ₹500 Off Drops',
      subtitle: 'Use code VIBESTREET on all streetwear orders over ₹1,999.',
      code: 'VIBESTREET',
      image: acidWashImg,
      ctaText: 'Claim Discount',
      categoryFilter: 'Streetwear',
    },
    {
      id: 'slide-3',
      badge: 'VINTAGE ARCHIVE',
      title: '90s Cyberpunk Aesthetic',
      subtitle: 'Nostalgic retro futurism graphics & raw edge finishes.',
      image: retroCyberImg,
      ctaText: 'View Archive',
      categoryFilter: 'Retro',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg group">
      {/* Background Image with Scrim */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out scale-105 group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/65 to-zinc-950/30" />
      </div>

      {/* Slide Content Overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-semibold tracking-wider uppercase mb-1">
          <Flame className="w-3.5 h-3.5" />
          <span>{currentSlide.badge}</span>
          {currentSlide.code && (
            <span className="ml-2 font-mono text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
              {currentSlide.code}
            </span>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-display font-bold text-white leading-snug drop-shadow-sm max-w-sm">
          {currentSlide.title}
        </h3>
        <p className="text-xs text-zinc-300 mt-0.5 max-w-xs line-clamp-1">
          {currentSlide.subtitle}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentSlide.categoryFilter) {
                onSelectCategory(currentSlide.categoryFilter);
              } else {
                onExploreClick();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-amber-400 transition-colors shadow-sm active:scale-95"
          >
            <span>{currentSlide.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Indicators */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-zinc-600/70 hover:bg-zinc-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next Chevrons on Hover */}
      <button
        onClick={handlePrev}
        className="hidden group-hover:flex absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm text-white items-center justify-center hover:bg-black/90 transition-colors"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={handleNext}
        className="hidden group-hover:flex absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm text-white items-center justify-center hover:bg-black/90 transition-colors"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
