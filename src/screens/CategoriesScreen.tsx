import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Heart,
  ShoppingCart,
  Sparkles,
  Flame,
  Layers,
  Gem,
  Footprints,
  Snowflake,
  TrendingUp,
  ChevronRight,
  Filter,
  Check,
  Zap,
} from 'lucide-react';
import { ProductCategory } from '../types';

// Asset images for authentic visuals
import acidWashImg from '../assets/images/tee_oversized_acid_wash_1792082131228.jpg';
import retroCyberImg from '../assets/images/tee_retro_cyber_anime_1792082132438.jpg';
import hoodieHeavyweightImg from '../assets/images/hoodie_heavyweight_slate_1792082132014.jpg';
import streetwearCampaignImg from '../assets/images/vibe_hero_streetwear_1792082130778.jpg';

interface SubCategoryItem {
  id: string;
  title: string;
  image: string;
  targetCategory: ProductCategory;
  badge?: string;
}

interface MainCategorySection {
  id: string;
  title: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  subcategories: SubCategoryItem[];
}

interface CategoriesScreenProps {
  onBack: () => void;
  onSelectCategory: (category: ProductCategory, subCategoryTitle?: string) => void;
  onOpenCart: () => void;
  cartCount: number;
  onOpenWishlist?: () => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  onBack,
  onSelectCategory,
  onOpenCart,
  cartCount,
  onOpenWishlist,
}) => {
  const [activeMainCatId, setActiveMainCatId] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistActive, setWishlistActive] = useState(false);

  const mainCategories: MainCategorySection[] = [
    {
      id: 'popular',
      title: 'Popular & Trending',
      shortLabel: 'Popular',
      icon: Sparkles,
      tag: 'HOT',
      subcategories: [
        { id: 'pop-1', title: 'All Popular', image: acidWashImg, targetCategory: 'All', badge: 'Top 100' },
        { id: 'pop-2', title: 'Top Brands', image: streetwearCampaignImg, targetCategory: 'Streetwear', badge: 'Verified' },
        { id: 'pop-3', title: 'Premium Drops', image: hoodieHeavyweightImg, targetCategory: 'Hoodies', badge: 'High GSM' },
        { id: 'pop-4', title: 'Under ₹499', image: retroCyberImg, targetCategory: 'Retro', badge: 'Budget' },
        { id: 'pop-5', title: 'Best Sellers', image: acidWashImg, targetCategory: 'Oversized', badge: '★ 4.9' },
        { id: 'pop-6', title: 'New Arrivals', image: streetwearCampaignImg, targetCategory: 'Streetwear', badge: 'Fresh' },
        { id: 'pop-7', title: 'Acid Wash Hits', image: acidWashImg, targetCategory: 'Oversized' },
        { id: 'pop-8', title: 'Anime 90s', image: retroCyberImg, targetCategory: 'Retro' },
        { id: 'pop-9', title: 'Winter Layers', image: hoodieHeavyweightImg, targetCategory: 'Hoodies' },
      ],
    },
    {
      id: 'oversized',
      title: 'Oversized & Streetwear',
      shortLabel: 'Oversized',
      icon: Flame,
      tag: 'DROPS',
      subcategories: [
        { id: 'over-1', title: 'Graphic Oversized', image: retroCyberImg, targetCategory: 'Oversized', badge: 'Trending' },
        { id: 'over-2', title: 'Acid Wash Heavies', image: acidWashImg, targetCategory: 'Oversized', badge: '280 GSM' },
        { id: 'over-3', title: 'Boxy Cut Tees', image: streetwearCampaignImg, targetCategory: 'Oversized' },
        { id: 'over-4', title: 'Cyberpunk Prints', image: retroCyberImg, targetCategory: 'Retro' },
        { id: 'over-5', title: 'Minimalist Core', image: acidWashImg, targetCategory: 'Oversized' },
        { id: 'over-6', title: 'Raw Edge Cuts', image: streetwearCampaignImg, targetCategory: 'Streetwear' },
        { id: 'over-7', title: 'Japanese Kanji', image: retroCyberImg, targetCategory: 'Streetwear' },
        { id: 'over-8', title: 'Heavy Cotton Solids', image: acidWashImg, targetCategory: 'Oversized' },
        { id: 'over-9', title: 'Distressed Tees', image: streetwearCampaignImg, targetCategory: 'Streetwear' },
      ],
    },
    {
      id: 'men',
      title: 'Men Fashion & Bottoms',
      shortLabel: 'Men Fashion',
      icon: Layers,
      tag: 'NEW',
      subcategories: [
        { id: 'men-1', title: 'Street Hoodies', image: hoodieHeavyweightImg, targetCategory: 'Hoodies', badge: 'Winter' },
        { id: 'men-2', title: 'Cargo Bottoms', image: streetwearCampaignImg, targetCategory: 'Streetwear' },
        { id: 'men-3', title: 'Drop-Shoulder Tops', image: acidWashImg, targetCategory: 'Oversized' },
        { id: 'men-4', title: 'Denim & Overshirts', image: retroCyberImg, targetCategory: 'Streetwear' },
        { id: 'men-5', title: 'Co-ord Sets', image: streetwearCampaignImg, targetCategory: 'Streetwear', badge: 'Combos' },
        { id: 'men-6', title: 'Tactical Vests', image: hoodieHeavyweightImg, targetCategory: 'Hoodies' },
      ],
    },
    {
      id: 'accessories',
      title: 'Accessories & Drips',
      shortLabel: 'Accessories',
      icon: Gem,
      tag: '₹99+',
      subcategories: [
        { id: 'acc-1', title: 'Cuban Chains', image: retroCyberImg, targetCategory: 'Streetwear', badge: 'Steel' },
        { id: 'acc-2', title: 'Street Caps', image: streetwearCampaignImg, targetCategory: 'Streetwear' },
        { id: 'acc-3', title: 'Crossbody Bags', image: acidWashImg, targetCategory: 'Streetwear' },
        { id: 'acc-4', title: 'Graphic Socks', image: retroCyberImg, targetCategory: 'Streetwear' },
        { id: 'acc-5', title: 'Rings & Badges', image: streetwearCampaignImg, targetCategory: 'Streetwear' },
        { id: 'acc-6', title: 'Sunglasses', image: acidWashImg, targetCategory: 'Streetwear' },
      ],
    },
    {
      id: 'footwear',
      title: 'Footwear & Slides',
      shortLabel: 'Footwear',
      icon: Footprints,
      tag: 'STYLES',
      subcategories: [
        { id: 'foot-1', title: 'Chunky Sneakers', image: streetwearCampaignImg, targetCategory: 'Streetwear', badge: 'High Demand' },
        { id: 'foot-2', title: 'Street Slides', image: acidWashImg, targetCategory: 'Streetwear' },
        { id: 'foot-3', title: 'Canvas High Tops', image: retroCyberImg, targetCategory: 'Streetwear' },
        { id: 'foot-4', title: 'Sneaker Care Kits', image: hoodieHeavyweightImg, targetCategory: 'Streetwear' },
      ],
    },
    {
      id: 'winter',
      title: 'Hoodies & Winter Wear',
      shortLabel: 'Hoodies',
      icon: Snowflake,
      tag: '450 GSM',
      subcategories: [
        { id: 'win-1', title: 'Slate Fleece Hoodie', image: hoodieHeavyweightImg, targetCategory: 'Hoodies', badge: 'Heavy' },
        { id: 'win-2', title: 'Tactical Zip Hoodie', image: hoodieHeavyweightImg, targetCategory: 'Hoodies' },
        { id: 'win-3', title: 'Oversized Sweaters', image: acidWashImg, targetCategory: 'Hoodies' },
        { id: 'win-4', title: 'Puffer Drops', image: streetwearCampaignImg, targetCategory: 'Hoodies' },
      ],
    },
    {
      id: 'reseller',
      title: 'Reseller High Margin Deals',
      shortLabel: 'Reseller Picks',
      icon: TrendingUp,
      tag: 'MARGINS',
      subcategories: [
        { id: 'res-1', title: '70% Profit Deals', image: acidWashImg, targetCategory: 'Oversized', badge: '₹400 Margin' },
        { id: 'res-2', title: 'Bulk 3-Packs', image: streetwearCampaignImg, targetCategory: 'Streetwear', badge: 'Fast Sell' },
        { id: 'res-3', title: 'Under ₹299 Wholesale', image: retroCyberImg, targetCategory: 'Retro' },
        { id: 'res-4', title: 'WhatsApp Viral Hits', image: hoodieHeavyweightImg, targetCategory: 'Hoodies' },
      ],
    },
  ];

  const currentSection =
    mainCategories.find((c) => c.id === activeMainCatId) || mainCategories[0];

  // Filter subcategories if user typed a search query
  const displayedSubcategories = searchQuery.trim()
    ? currentSection.subcategories.filter((sub) =>
        sub.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentSection.subcategories;

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-80px)] bg-zinc-950 text-white select-none overflow-hidden">
      {/* 1. Header with Back Arrow, Title, Search, Wishlist & Cart Badge */}
      <header className="shrink-0 bg-zinc-950 border-b border-zinc-800 px-3 pt-3 pb-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          {/* Back button and title */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-700 active:scale-95 transition-all"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-sm font-display font-black tracking-wider text-white uppercase">
                CATEGORIES
              </h1>
              <span className="text-[10px] text-zinc-400 font-medium block -mt-0.5">
                Explore 500+ Streetwear Drops
              </span>
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1.5">
            {/* Wishlist toggle icon */}
            <button
              onClick={() => {
                setWishlistActive(!wishlistActive);
                if (onOpenWishlist) onOpenWishlist();
              }}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all active:scale-95 ${
                wishlistActive
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistActive ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Cart with live badge */}
            <button
              onClick={onOpenCart}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white relative active:scale-95 transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-4 px-1 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="mt-2.5 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across collections, hoodies, anime tees..."
            className="w-full h-9 bg-zinc-900/90 border border-zinc-800 rounded-xl pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      {/* 2. DUAL-PANE LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR NAVIGATION: Vertical scrollable list with active indicator */}
        <aside
          aria-label="Category Sidebar"
          className="w-24 sm:w-28 shrink-0 bg-zinc-950 border-r border-zinc-800/80 overflow-y-auto no-scrollbar py-1"
        >
          {mainCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeMainCatId;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveMainCatId(cat.id);
                  setSearchQuery('');
                }}
                className={`w-full py-3 px-1.5 flex flex-col items-center justify-center relative transition-all text-center border-b border-zinc-900/60 ${
                  isActive
                    ? 'bg-zinc-900/90 text-amber-400 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                }`}
              >
                {/* Active selection vertical indicator line */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-400 rounded-r-md shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                )}

                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 transition-transform ${
                    isActive
                      ? 'bg-amber-400 text-zinc-950 shadow-sm scale-105'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span className="text-[10px] leading-tight font-medium max-w-[80px]">
                  {cat.shortLabel}
                </span>

                {cat.tag && (
                  <span
                    className={`mt-1 text-[8px] font-mono px-1 py-0.2 rounded-full uppercase tracking-tighter ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-300 font-bold'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {cat.tag}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* RIGHT CONTENT AREA: 3-Column Grid of Circular Category Avatars with Festive Borders */}
        <main
          aria-label="Subcategories Grid"
          className="flex-1 overflow-y-auto p-3.5 space-y-4 no-scrollbar"
        >
          {/* Header Title for Current Section */}
          <div className="flex items-center justify-between bg-gradient-to-r from-zinc-900/90 to-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
            <div>
              <h2 className="text-xs font-display font-black uppercase text-white tracking-wide flex items-center gap-1.5">
                <span>{currentSection.title}</span>
                <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                  {displayedSubcategories.length} Styles
                </span>
              </h2>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Tap any avatar to view collection drops
              </p>
            </div>
            <button
              onClick={() => onSelectCategory('All', currentSection.title)}
              className="text-[10px] text-amber-400 hover:underline flex items-center font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3-Column Grid of Circular Avatars */}
          {displayedSubcategories.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {displayedSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelectCategory(sub.targetCategory, sub.title)}
                  type="button"
                  className="group flex flex-col items-center text-center transition-transform active:scale-95"
                >
                  {/* Circular Avatar with Festive Gradient Border */}
                  <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-yellow-300 shadow-md group-hover:shadow-amber-400/20 transition-all">
                    {sub.badge && (
                      <span className="absolute -top-1 -right-1 z-10 text-[7px] font-bold font-mono px-1 py-0.2 rounded-full bg-rose-600 text-white shadow leading-tight">
                        {sub.badge}
                      </span>
                    )}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-zinc-900 border-2 border-zinc-950 flex items-center justify-center">
                      <img
                        src={sub.image}
                        alt={sub.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                  </div>

                  {/* Text Label Underneath */}
                  <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-200 group-hover:text-amber-300 transition-colors mt-1.5 line-clamp-2 max-w-[80px] leading-tight">
                    {sub.title}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-400 text-xs bg-zinc-900/40 rounded-xl border border-zinc-800">
              No subcategories matching "{searchQuery}".
            </div>
          )}

          {/* Bottom Festive Reseller Callout in Categories */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/20 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-white">Reseller Wholesale Hub</h4>
                <p className="text-[9px] text-zinc-400">Share these catalog pieces directly on WhatsApp</p>
              </div>
            </div>
            <button
              onClick={() => onSelectCategory('All', 'Reseller Catalog')}
              className="px-2.5 py-1 rounded-lg bg-amber-400 text-zinc-950 text-[10px] font-bold shrink-0 active:scale-95"
            >
              Share Drops
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
