import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  const measurements = [
    { size: 'S', chestIn: '42"', lengthIn: '28"', shoulderIn: '21"', chestCm: '107 cm', lengthCm: '71 cm', shoulderCm: '53 cm' },
    { size: 'M', chestIn: '44"', lengthIn: '29"', shoulderIn: '22"', chestCm: '112 cm', lengthCm: '74 cm', shoulderCm: '56 cm' },
    { size: 'L', chestIn: '46"', lengthIn: '30"', shoulderIn: '23"', chestCm: '117 cm', lengthCm: '76 cm', shoulderCm: '58 cm' },
    { size: 'XL', chestIn: '48"', lengthIn: '31"', shoulderIn: '24"', chestCm: '122 cm', lengthCm: '79 cm', shoulderCm: '61 cm' },
    { size: 'XXL', chestIn: '50"', lengthIn: '32"', shoulderIn: '25"', chestCm: '127 cm', lengthCm: '81 cm', shoulderCm: '63 cm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-zinc-100 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
              <Ruler className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold">Oversized Boxy Fit Guide</h3>
              <p className="text-[11px] text-zinc-400">Measurements taken laid flat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Fit: Signature drop shoulder with 2" extra drape</span>
          <div className="flex items-center bg-zinc-800 rounded-lg p-0.5 border border-zinc-700">
            <button
              onClick={() => setUnit('inches')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                unit === 'inches' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                unit === 'cm' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest</th>
                <th className="py-2.5 px-3">Length</th>
                <th className="py-2.5 px-3">Shoulder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300 tabular-nums">
              {measurements.map((m) => (
                <tr key={m.size} className="hover:bg-zinc-900/40">
                  <td className="py-2.5 px-3 font-bold text-white">{m.size}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? m.chestIn : m.chestCm}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? m.lengthIn : m.lengthCm}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? m.shoulderIn : m.shoulderCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip */}
        <div className="rounded-xl bg-amber-400/10 border border-amber-400/20 p-3 text-xs text-amber-300">
          <p className="font-medium">Sizing Recommendation:</p>
          <p className="text-[11px] text-zinc-300 mt-0.5">
            If you want the signature oversized streetwear look, choose your regular size. For a standard fit, size down once.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
