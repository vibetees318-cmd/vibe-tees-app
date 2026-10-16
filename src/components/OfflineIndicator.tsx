import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/95 border border-amber-500/40 text-amber-300 text-xs font-medium shadow-xl backdrop-blur-md animate-bounce">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — Cached streetwear catalog active</span>
    </div>
  );
};
