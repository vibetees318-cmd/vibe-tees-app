import React, { useState } from 'react';
import { X, HelpCircle, MessageSquare, Truck, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'What is GSM in your streetwear tees?',
      a: 'GSM stands for Grams per Square Meter. Standard t-shirts are usually 160-180 GSM. At Vibe Tees, our oversized drops range between 260 to 300 GSM for tees, and 450 GSM for hoodies, delivering that signature luxury drape that holds its boxy structure after dozens of washes.',
    },
    {
      q: 'How does doorstep delivery & Cash on Delivery work?',
      a: 'We dispatch all streetwear orders within 24 hours. For Cash on Delivery (COD) orders, you can pay in cash or scan the courier UPI QR code right at your doorstep.',
    },
    {
      q: 'What is your size exchange policy?',
      a: 'We offer a 7-day hassle-free size exchange guarantee on all unworn items with original tags intact. Simply initiate an exchange in the Orders tab or ping our concierge.',
    },
    {
      q: 'How do payouts work for reselling drops?',
      a: 'When an item you listed sells on Vibe Tees, 85% of the selling price is credited directly to your registered UPI ID within 48 hours of doorstep delivery to the buyer.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-zinc-100 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold">Help & Concierge Support</h3>
              <p className="text-[11px] text-zinc-400">24/7 Streetwear assistance & FAQs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Concierge Channel */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Live WhatsApp Concierge</h5>
              <p className="text-[10px] text-zinc-400">Instant answers regarding sizing & orders</p>
            </div>
          </div>
          <button
            onClick={() => {
              alert('Opening Vibe Tees Streetwear Concierge Chat...');
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-colors"
          >
            Chat
          </button>
        </div>

        {/* FAQs */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-display font-bold uppercase tracking-wider text-zinc-400">
            Frequently Asked Questions
          </h4>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-zinc-200 hover:text-amber-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-3.5 h-3.5 shrink-0 text-amber-400 ml-2" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 shrink-0 text-zinc-500 ml-2" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-3 pb-3 text-[11px] text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
