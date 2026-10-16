import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Package, User } from 'lucide-react';

export type TabId = 'home' | 'categories' | 'cart' | 'orders' | 'account' | 'explore';

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  cartCount: number;
  activeOrdersCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  activeOrdersCount,
}) => {
  const tabs = [
    { id: 'home' as TabId, label: 'Drop', icon: Home },
    { id: 'categories' as TabId, label: 'Categories', icon: LayoutGrid },
    {
      id: 'cart' as TabId,
      label: 'Bag',
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: 'orders' as TabId,
      label: 'Orders',
      icon: Package,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    { id: 'account' as TabId, label: 'Account', icon: User },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 9999,
      }}
      className="fixed bottom-0 left-0 right-0 w-full z-[9999] bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/90 px-2 py-1 select-none"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[48px] py-1 flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                isActive ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-zinc-950 text-[9px] font-bold flex items-center justify-center tabular-nums">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium tracking-tight ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-zinc-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
