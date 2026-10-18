import React, { useState } from 'react';
import { Search, ShoppingBag, X, Sparkles, Bot, Plus, Crown } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { AppMode, UserRole } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentRole: UserRole;
  appMode?: AppMode;
  onToggleAppMode?: (mode: AppMode) => void;
  onOpenResellerModal: () => void;
  onNavigateHome: () => void;
  activeScreen: string;
  onOpenChatbot?: () => void;
  onOpenAdminAddProduct?: () => void;
  onOpenOwnerPanel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  currentRole,
  appMode = 'Customer',
  onToggleAppMode,
  onOpenResellerModal,
  onNavigateHome,
  onOpenChatbot,
  onOpenAdminAddProduct,
  onOpenOwnerPanel,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 group text-left cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-display font-black text-amber-400 text-lg shadow-sm group-hover:border-amber-400/50 transition-colors">
            V
          </div>
          <div className="leading-none">
            <span className="font-display font-black text-lg tracking-wider text-white">
              VIBE<span className="text-amber-400">TEES</span>
            </span>
            <span className="block text-[9px] tracking-widest text-zinc-400 uppercase font-mono">
              Streetwear Studio
            </span>
          </div>
        </button>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Global Mode Toggle: Customer vs Reseller */}
          {onToggleAppMode && (
            <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-[10px]">
              <button
                onClick={() => onToggleAppMode('Customer')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${
                  appMode === 'Customer'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Shop as Customer"
              >
                Customer
              </button>
              <button
                onClick={() => onToggleAppMode('Reseller')}
                className={`px-2 py-1 rounded-md font-bold transition-all ${
                  appMode === 'Reseller'
                    ? 'bg-amber-400 text-zinc-950 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Resell & Earn Margin"
              >
                Reseller
              </button>
            </div>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Reseller Creator Button */}
          <button
            onClick={onOpenResellerModal}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            title="Resell or Submit Custom Drops"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Resell</span>
          </button>

          {/* Admin Add Product Button */}
          {onOpenAdminAddProduct && (
            <button
              onClick={onOpenAdminAddProduct}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-all active:scale-95 shadow-sm"
              title="Add New Streetwear Product to Catalog"
              aria-label="Add Product"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Add Drop</span>
            </button>
          )}

          {/* Owner Private Panel Button */}
          {onOpenOwnerPanel && (
            <button
              onClick={onOpenOwnerPanel}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-yellow-300 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 transition-all active:scale-95 shadow-sm"
              title="Open Private Owner Panel (POD & Pricing)"
              aria-label="Owner Panel"
            >
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Owner</span>
            </button>
          )}

          {/* VibeBot AI Chatbot Button */}
          {onOpenChatbot && (
            <button
              onClick={onOpenChatbot}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 transition-all active:scale-95 shadow-sm"
              title="Ask VibeBot AI (Gemini Support & Orders)"
              aria-label="Open VibeBot AI"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span className="hidden xs:inline text-[11px] font-bold">VibeBot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          )}

          {/* Search Toggle Button */}
          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className={`p-2 rounded-lg transition-colors ${
              isSearchExpanded || searchQuery ? 'bg-amber-400 text-zinc-950' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
            }`}
            aria-label="Toggle Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Cart Icon with Live Badge */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-lg text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-400 text-zinc-950 text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-sm animate-in zoom-in-50 duration-150">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {isSearchExpanded && (
        <div className="mt-3 pt-2 border-t border-zinc-800/80 animate-in slide-in-from-top-2 duration-150">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search oversized, acid wash, anime, retro hoodies..."
              autoFocus
              className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-0.5 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
