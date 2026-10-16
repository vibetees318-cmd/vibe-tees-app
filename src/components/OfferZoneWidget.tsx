import React from 'react';
import { Sparkles, Flame, Tag, ChevronRight, Zap } from 'lucide-react';
import { ProductCategory } from '../types';

// Asset images
import acidWashImg from '../assets/images/tee_oversized_acid_wash_1792082131228.jpg';
import retroCyberImg from '../assets/images/tee_retro_cyber_anime_1792082132438.jpg';
import hoodieHeavyweightImg from '../assets/images/hoodie_heavyweight_slate_1792082132014.jpg';
import streetwearCampaignImg from '../assets/images/vibe_hero_streetwear_1792082130778.jpg';

interface OfferCardData {
  id: string;
  category: ProductCategory;
  label: string;
  badgeTag: string;
  badgeColor: 'rose' | 'amber' | 'emerald';
  image: string;
  highlightText: string;
}

interface OfferZoneWidgetProps {
  onSelectOffer: (category: ProductCategory, label: string) => void;
}

export const OfferZoneWidget: React.FC<OfferZoneWidgetProps> = ({ onSelectOffer }) => {
  const offerCards: OfferCardData[] = [
    {
      id: 'offer-1',
      category: 'Oversized',
      label: 'Oversized Tees',
      badgeTag: 'SALE UPTO 80% OFF',
      badgeColor: 'rose',
      image: acidWashImg,
      highlightText: 'From ₹499',
    },
    {
      id: 'offer-2',
      category: 'Streetwear',
      label: 'Men Fashion',
      badgeTag: 'SALE FROM ₹99',
      badgeColor: 'amber',
      image: streetwearCampaignImg,
      highlightText: 'Top Selling',
    },
    {
      id: 'offer-3',
      category: 'Hoodies',
      label: 'Winter Wear',
      badgeTag: 'UNDER ₹499',
      badgeColor: 'emerald',
      image: hoodieHeavyweightImg,
      highlightText: 'Heavy 450 GSM',
    },
    {
      id: 'offer-4',
      category: 'Retro',
      label: 'Western Wear',
      badgeTag: 'FLAT 70% OFF',
      badgeColor: 'rose',
      image: retroCyberImg,
      highlightText: 'Anime & Vintage',
    },
    {
      id: 'offer-5',
      category: 'Streetwear',
      label: 'Top Brands',
      badgeTag: 'SALE FROM ₹149',
      badgeColor: 'amber',
      image: acidWashImg,
      highlightText: 'DripLab Drops',
    },
    {
      id: 'offer-6',
      category: 'All',
      label: 'Festive Combos',
      badgeTag: 'BUY 1 GET 1 FREE',
      badgeColor: 'emerald',
      image: streetwearCampaignImg,
      highlightText: 'Limited Stock',
    },
  ];

  return (
    <section
      aria-label="Festive Offer Zone"
      className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-rose-950/80 via-zinc-950 to-zinc-950 border border-amber-500/30 shadow-xl"
    >
      {/* Decorative Festive Fairy Lights String */}
      <div className="relative w-full h-8 flex items-center justify-between px-3 overflow-hidden bg-gradient-to-r from-rose-950 via-amber-950/90 to-rose-950 border-b border-amber-500/20">
        {/* Wire SVG */}
        <div className="absolute inset-0 flex items-center pointer-events-none opacity-40">
          <svg className="w-full h-4" viewBox="0 0 400 20" preserveAspectRatio="none">
            <path
              d="M0,8 Q50,18 100,8 T200,8 T300,8 T400,8"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.2"
              strokeDasharray="3,3"
            />
          </svg>
        </div>

        {/* Glowing fairy light bulbs */}
        {[
          { color: 'bg-amber-400 shadow-amber-400/80', delay: '0ms' },
          { color: 'bg-rose-500 shadow-rose-500/80', delay: '150ms' },
          { color: 'bg-yellow-300 shadow-yellow-300/80', delay: '300ms' },
          { color: 'bg-emerald-400 shadow-emerald-400/80', delay: '450ms' },
          { color: 'bg-amber-400 shadow-amber-400/80', delay: '600ms' },
          { color: 'bg-rose-400 shadow-rose-400/80', delay: '750ms' },
          { color: 'bg-yellow-400 shadow-yellow-400/80', delay: '900ms' },
          { color: 'bg-emerald-300 shadow-emerald-300/80', delay: '1050ms' },
          { color: 'bg-amber-300 shadow-amber-300/80', delay: '1200ms' },
        ].map((bulb, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center">
            <div className="w-1 h-1.5 bg-zinc-700 rounded-t-sm" />
            <div
              className={`w-2.5 h-3.5 rounded-full ${bulb.color} shadow-md animate-pulse`}
              style={{ animationDuration: '1.8s', animationDelay: bulb.delay }}
            />
          </div>
        ))}
      </div>

      {/* Marquee Glowing Header Banner */}
      <div className="px-4 pt-3 pb-2 text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono tracking-widest text-amber-300 uppercase mb-1">
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>FESTIVE SPECIAL • DIWALI &amp; WEDDING RUSH</span>
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-100 drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)] uppercase">
            OFFER ZONE
          </h2>
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <p className="text-[11px] text-amber-200/80 font-medium">
          Grab India's hottest streetwear styles at lowest wholesale margins
        </p>
      </div>

      {/* 3-Column Festive Card Grid */}
      <div className="p-3 grid grid-cols-3 gap-2.5 sm:gap-3">
        {offerCards.map((card) => {
          return (
            <button
              key={card.id}
              onClick={() => onSelectOffer(card.category, card.label)}
              type="button"
              className="group relative flex flex-col items-center rounded-xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border border-amber-500/30 hover:border-amber-400 transition-all active:scale-95 shadow-md overflow-hidden text-left"
            >
              {/* Top-Left Discount Badge Tag */}
              <div className="absolute top-1.5 left-1.5 z-20">
                <span
                  className={`text-[8px] sm:text-[9px] font-black tracking-tight px-1.5 py-0.5 rounded shadow-sm leading-none inline-block ${
                    card.badgeColor === 'rose'
                      ? 'bg-rose-600 text-white'
                      : card.badgeColor === 'amber'
                      ? 'bg-amber-400 text-zinc-950'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {card.badgeTag}
                </span>
              </div>

              {/* Product Graphic Sitting on Golden Pedestal */}
              <div className="relative w-full h-24 sm:h-28 flex items-end justify-center pt-5 pb-1 overflow-hidden">
                {/* Golden Radial Glow */}
                <div className="absolute bottom-2 w-16 h-8 bg-amber-400/25 blur-md rounded-full pointer-events-none" />

                {/* 3D Golden Pedestal Base */}
                <div className="absolute bottom-0 w-20 sm:w-24 h-4 rounded-[50%] bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 border-t border-amber-200 shadow-md transform scale-y-75 flex items-center justify-center">
                  <div className="w-16 h-2 rounded-[50%] bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 opacity-80" />
                </div>

                {/* Product Cutout/Graphic Overlay */}
                <img
                  src={card.image}
                  alt={card.label}
                  className="relative z-10 w-20 h-20 sm:w-22 sm:h-22 object-cover rounded-xl shadow-lg transform group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-200"
                />
              </div>

              {/* Bottom Category Label Box with Rounded Corners */}
              <div className="w-full p-1.5 bg-gradient-to-t from-zinc-950 via-zinc-900 to-zinc-900 border-t border-zinc-800 text-center">
                <span className="block text-[11px] sm:text-xs font-bold text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                  {card.label}
                </span>
                <span className="block text-[9px] font-mono text-amber-400 font-semibold mt-0.5">
                  {card.highlightText}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* View All Deals Footer Strip */}
      <div className="px-3 pb-3 pt-1">
        <button
          onClick={() => onSelectOffer('All', 'All Offers')}
          className="w-full py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1 transition-all active:scale-98"
        >
          <span>Explore All 200+ Festive Drop Discounts</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>
    </section>
  );
};
