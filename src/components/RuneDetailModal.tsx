import React from 'react';
import { Rune, CastRune } from '../types';
import { X, Sparkles, TreePine, Flame, Compass, Scroll, ArrowUp, ArrowDown } from 'lucide-react';

interface RuneDetailModalProps {
  rune: Rune | CastRune | null;
  onClose: () => void;
}

export const RuneDetailModal: React.FC<RuneDetailModalProps> = ({ rune, onClose }) => {
  if (!rune) return null;

  const isCast = 'isReversed' in rune;
  const isReversed = isCast ? (rune as CastRune).isReversed : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#c49a45]/40 bg-[#14100c] p-6 text-[#ded5c5] shadow-2xl shadow-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-[#3d3326] bg-[#1c1712] p-2 text-[#9c917f] hover:border-[#c49a45] hover:text-[#f5ebd7] transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with Large Inscribed Rune */}
        <div className="flex items-center gap-5 border-b border-[#2d251a] pb-5">
          <div className="relative flex h-24 w-20 flex-shrink-0 items-center justify-center rounded-xl border border-[#c49a45]/50 bg-gradient-to-b from-[#241c14] to-[#120e0a] stone-shadow">
            <span
              className={`font-cinzel text-5xl font-bold text-[#e6c275] rune-glow ${
                isReversed ? 'rotate-180 text-[#d48b55]' : ''
              }`}
            >
              {rune.symbol}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel text-2xl font-bold text-[#f5ebd7]">
                {rune.name}
              </h3>
              <span className="rounded bg-[#2a2219] px-2 py-0.5 text-xs text-[#d8b05e] border border-[#c49a45]/30">
                Laut: {rune.letter}
              </span>
            </div>
            <p className="text-sm text-[#b8ab96] italic mt-0.5">
              Rheinfränkisch: <span className="text-[#e6c275]">{rune.frankishOldHighGermanName}</span>
            </p>
            <p className="text-xs text-[#8c8170] mt-1">
              Sippe: {rune.sippe} • Element: {rune.element}
            </p>
          </div>
        </div>

        {/* Position Context if in a reading */}
        {isCast && (
          <div className="mt-4 rounded-xl border border-[#c49a45]/30 bg-[#211a13] p-3 text-xs">
            <div className="flex items-center gap-1.5 font-cinzel font-semibold text-[#e6c275]">
              <Sparkles className="h-4 w-4" />
              <span>Gezogenes Losholz: {(rune as CastRune).positionLabel}</span>
              <span className="ml-auto text-[11px] font-sans text-[#a39a8c]">
                {isReversed ? '(Umgekehrt gefallen)' : '(Aufrecht gefallen)'}
              </span>
            </div>
            <p className="mt-1 text-[#c9bea9]">
              {(rune as CastRune).positionDescription}
            </p>
          </div>
        )}

        {/* Core meaning */}
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#a39a8c] flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-[#d8b05e]" /> Bedeutung & fränkisches Wesen
            </h4>
            <p className="mt-1 text-base text-[#f5ebd7] font-medium leading-relaxed">
              {rune.meaning}
            </p>
          </div>

          {/* Upright vs Reversed */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2d3a2b] bg-[#121a11]/60 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#6db875] uppercase">
                <ArrowUp className="h-3.5 w-3.5" /> Aufrechte Kraft
              </div>
              <p className="mt-1.5 text-xs text-[#c2d6bf] leading-relaxed">
                {rune.uprightMeaning}
              </p>
            </div>

            <div className="rounded-xl border border-[#3d2b24] bg-[#1f1410]/60 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#d48b55] uppercase">
                <ArrowDown className="h-3.5 w-3.5" /> Umkehrung / Schatten
              </div>
              <p className="mt-1.5 text-xs text-[#e0c1b4] leading-relaxed">
                {rune.reversedMeaning}
              </p>
            </div>
          </div>

          {/* Fränkische Überlieferung & Heiliger Baum */}
          <div className="rounded-xl border border-[#2d251a] bg-[#19140f] p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#d8b05e] uppercase">
              <TreePine className="h-3.5 w-3.5" /> Heiliger Baum & Fränkische Überlieferung
            </div>
            <p className="mt-1 text-xs text-[#cfc5b4] leading-relaxed">
              <strong className="text-[#f5ebd7]">{rune.sacredTree}:</strong> {rune.frankishLore}
            </p>
          </div>

          {/* Fränkischer Seherinnen-Spruch */}
          <div className="rounded-xl border border-[#2d251a] bg-[#120e0a] p-3.5 italic text-[#b8ab96]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold not-italic text-[#8c8170] uppercase">
              <Scroll className="h-3 w-3" /> Seherinnen-Spruch
            </div>
            <p className="mt-1 text-xs font-serif leading-relaxed text-[#dfd7ca]">
              „{rune.poem}“
            </p>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {rune.keywords.map((kw, i) => (
              <span
                key={i}
                className="rounded-md border border-[#3d3326] bg-[#1c1712] px-2 py-0.5 text-[11px] text-[#b8ab96]"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
