import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Filter,
  SlidersHorizontal,
  PackageSearch,
  Share2,
  Layers,
  Film,
  LayoutGrid,
  List,
} from 'lucide-react';
import { AppMode, Product, ProductCategory, ProductSize } from '../types';
import { DynamicVideoReelWidget } from '../components/DynamicVideoReelWidget';
import { OfferZoneWidget } from '../components/OfferZoneWidget';
import { ProductCard } from '../components/ProductCard';
import ProductGrid from '../components/ProductGrid';

interface HomeScreenProps {
  products: Product[];
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectProduct: (product: Product, dealPrice?: number) => void;
  onSelectProductById: (productId: string, specialDealPrice?: number) => void;
  onQuickAdd: (product: Product) => void;
  searchQuery: string;
  onClearSearch: () => void;
  onOpenResellerModal: () => void;
  appMode?: AppMode;
  onToggleAppMode?: (mode: AppMode) => void;
  recentlyAddedId?: string | null;
  onOpenAiVideoModal?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onSelectProductById,
  onQuickAdd,
  searchQuery,
  onClearSearch,
  onOpenResellerModal,
  appMode = 'Customer',
  onToggleAppMode,
  recentlyAddedId,
  onOpenAiVideoModal,
}) => {
  const categories: ProductCategory[] = ['All', 'Oversized', 'Streetwear', 'Retro', 'Hoodies'];
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [activeOfferFilter, setActiveOfferFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');

  const handleSelectOffer = (cat: ProductCategory, label: string) => {
    onSelectCategory(cat);
    setActiveOfferFilter(label);
    setTimeout(() => {
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Filter & sort
  let filtered = [...products];

  if (selectedCategory !== 'All') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tag?.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.discountPrice - b.discountPrice);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.discountPrice - a.discountPrice);
  }

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-20">
      {/* AI Veo Video Banner Callout Strip */}
      {!searchQuery && onOpenAiVideoModal && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-amber-400/30 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 text-zinc-950 flex items-center justify-center shrink-0 shadow">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Animate Hero Video with Veo AI</span>
                <span className="text-[8px] font-mono font-bold uppercase px-1 py-0.2 rounded bg-amber-400 text-zinc-950">
                  Veo 3.1
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 line-clamp-1">
                Upload or select a streetwear photo to generate 16:9 / 9:16 cinematic banners
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAiVideoModal}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold flex items-center gap-1 shrink-0 transition-transform active:scale-95 shadow-sm"
          >
            <span>Animate</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. DYNAMIC VIDEO REEL BANNER WIDGET (Replaces static promo banner) */}
      {!searchQuery && (
        <section aria-label="Dynamic Video Reel Deals">
          <DynamicVideoReelWidget
            onSelectProductById={onSelectProductById}
          />
        </section>
      )}

      {/* 2. DUAL-MODE AWARENESS BANNER (Meesho style) */}
      {!searchQuery && (
        appMode === 'Reseller' ? (
          <div className="rounded-2xl p-3.5 bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-zinc-900 border border-emerald-800/60 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Reseller Mode Active</span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-1.5 rounded">
                    Earn ₹400-₹600/item
                  </span>
                </h4>
                <p className="text-[11px] text-zinc-300 line-clamp-1">
                  Base supplier prices shown. Tap "Share & Earn" to send photos to WhatsApp buyers.
                </p>
              </div>
            </div>
            {onToggleAppMode && (
              <button
                onClick={() => onToggleAppMode('Customer')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-300 border border-zinc-700 shrink-0"
              >
                Exit Reseller
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl p-3.5 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Start Reselling on Vibe Tees</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                    Zero Investment
                  </span>
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-1">
                  Add your profit margin, share on WhatsApp, and we fulfill under your brand.
                </p>
              </div>
            </div>
            {onToggleAppMode ? (
              <button
                onClick={() => onToggleAppMode('Reseller')}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-zinc-950 whitespace-nowrap transition-colors shadow-sm active:scale-95 shrink-0"
              >
                Start Reselling
              </button>
            ) : (
              <button
                onClick={onOpenResellerModal}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white whitespace-nowrap transition-colors border border-zinc-700 active:scale-95 shrink-0"
              >
                List Item
              </button>
            )}
          </div>
        )
      )}

      {/* 3. OFFER ZONE GRID WIDGET (Meesho Signature Festive Marquee & 3-Col Pedestal Cards) */}
      {!searchQuery && (
        <OfferZoneWidget onSelectOffer={handleSelectOffer} />
      )}

      {/* Active Festive Offer Filter Notification Bar */}
      {activeOfferFilter && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>
              Filtered by Offer Zone: <strong className="text-white font-semibold">{activeOfferFilter}</strong>
            </span>
          </div>
          <button
            onClick={() => {
              setActiveOfferFilter(null);
              onSelectCategory('All');
            }}
            className="text-[11px] underline font-medium text-amber-300 hover:text-white"
          >
            Clear Offer Filter
          </button>
        </div>
      )}

      {/* 4. CATEGORY CHIPS & SORT */}
      <section id="products-section" aria-label="Product Categories">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white">
              {searchQuery ? `Results for "${searchQuery}"` : (appMode === 'Reseller' ? 'Reseller Drops Catalog' : 'Streetwear Drops')}
            </h3>
            <span className="text-xs text-zinc-400 font-mono tabular-nums">
              ({filtered.length})
            </span>
          </div>

          {/* View Mode Toggle & Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
                title="2-Column Product Grid (Meesho Style)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('feed')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'feed' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
                title="Expanded Detail Cards"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-300 focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-sm'
                    : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All Pieces' : cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. PRODUCT GRID */}
      <section aria-label="Products Catalog">
        {filtered.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="-mx-4 -mb-4 rounded-b-2xl overflow-hidden">
              <ProductGrid
                products={filtered}
                onSelectProduct={(p) => onSelectProduct(p)}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
                sortBy={sortBy}
                onSortChange={(s) => setSortBy(s as any)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.productID}
                  product={product}
                  onSelect={(p) => onSelectProduct(p)}
                  onQuickAdd={onQuickAdd}
                  isAddedJustNow={recentlyAddedId === product.productID}
                  appMode={appMode}
                />
              ))}
            </div>
          )
        ) : (
          <div className="p-8 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40 my-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 mx-auto flex items-center justify-center text-zinc-400">
              <PackageSearch className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">No streetwear drops found</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Try searching for something else or reset your filter.
              </p>
            </div>
            <button
              onClick={() => {
                onClearSearch();
                onSelectCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 text-xs font-bold transition-transform active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
