import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled || justInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-full">
        <Check className="w-3.5 h-3.5" />
        PWA Active
      </span>
    );
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) setJustInstalled(true);
  };

  return (
    <>
      {isInstallable && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm active:scale-95"
          title="Install Vibe Tees App on your home screen"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {isIOS && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 transition-colors"
          title="Install on iOS Safari"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Add to iOS</span>
        </button>
      )}

      {/* iOS Installation Instruction Sheet Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-5 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-amber-400/10 text-amber-400">
                  <Smartphone className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-semibold">Install Vibe Tees on iOS</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ol className="text-xs text-zinc-300 space-y-2.5 list-decimal list-inside pl-1">
              <li>
                Tap the <strong className="text-amber-400">Share</strong> icon in your Safari bottom toolbar.
              </li>
              <li>
                Scroll down the share sheet and tap <strong className="text-amber-400">Add to Home Screen</strong>.
              </li>
              <li>
                Tap <strong className="text-amber-400">Add</strong> in the top-right corner to launch Vibe Tees as a standalone app.
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
