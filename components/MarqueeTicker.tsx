'use client';

import React from 'react';

export default function MarqueeTicker() {
  const items = [
    'LATE90S VAULT IS LIVE',
    'INSTANT WHATSAPP CLICK-TO-ORDER',
    '260+ GSM HEAVYWEIGHT COMBED COTTON',
    '480 GSM FRENCH TERRY DISTRESSED HOODIES',
    '100% ORIGINAL NEON POSTGRESQL ARCHIVE',
    'STREETWEAR SILHOUETTES • NO RESTOCKS',
    'SAME DAY DISPATCH & TRACKING',
  ];

  return (
    <div className="bg-white text-black overflow-hidden py-3 font-mono-tech font-bold text-xs uppercase tracking-widest border-y border-white select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.concat(items).map((text, idx) => (
          <div key={idx} className="flex items-center mx-6">
            <span>{text}</span>
            <span className="ml-6 text-black/40">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
