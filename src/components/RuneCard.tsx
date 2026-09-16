import React from 'react';
import { CastRune, Rune } from '../types';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

interface RuneCardProps {
  rune: CastRune | Rune;
  isRevealed?: boolean;
  positionLabel?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  isReversed?: boolean;
}

export const RuneCard: React.FC<RuneCardProps> = ({
  rune,
  isRevealed = true,
  positionLabel,
  onClick,
  size = 'md',
  isReversed = false
}) => {
  const sizeClasses = {
    sm: 'w-24 h-36 p-2 text-xs',
    md: 'w-36 h-56 p-3 text-sm',
    lg: 'w-44 h-64 p-4 text-base'
  }[size];

  const symbolSizes = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-6xl'
  }[size];

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`group relative flex flex-col items-center justify-between rounded-xl border border-[#3d3326] bg-gradient-to-b from-[#1c1712] via-[#15120e] to-[#0f0c09] text-center transition-all duration-300 stone-shadow cursor-pointer hover:-translate-y-1 hover:border-[#c49a45]/60 hover:shadow-[0_12px_25px_-4px_rgba(196,154,69,0.25)] ${sizeClasses}`}
    >
      {/* Position Header */}
      {positionLabel && (
        <div className="w-full truncate border-b border-[#2d251a] pb-1 text-[11px] font-medium tracking-wide text-[#b8ab96]">
          {positionLabel}
        </div>
      )}

      {/* Card Body with Ancient Wood / Stone Inscription */}
      <div className="my-auto flex flex-col items-center justify-center">
        {/* Glow behind rune */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-2 rounded-full bg-[#c49a45]/10 blur-md group-hover:bg-[#c49a45]/20" />
          <span
            className={`relative font-cinzel font-bold text-[#e6c275] rune-glow transition-transform duration-300 ${symbolSizes} ${
              isReversed ? 'rotate-180 text-[#d48b55]' : ''
            }`}
          >
            {rune.symbol}
          </span>
        </div>

        {/* Rune Name & Subtitle */}
        <div className="mt-2">
          <h4 className="font-cinzel font-bold text-[#f5ebd7] tracking-wider">
            {rune.name}
          </h4>
          <p className="text-[10px] text-[#9c917f] italic truncate max-w-[120px]">
            {rune.frankishOldHighGermanName}
          </p>
        </div>
      </div>

      {/* Card Footer info: Upright or Reversed indicator */}
      <div className="w-full flex items-center justify-between border-t border-[#2d251a] pt-1.5 text-[10px] text-[#8c8170]">
        <span className="flex items-center gap-1 font-medium">
          {isReversed ? (
            <span className="flex items-center gap-0.5 text-[#d48b55]">
              <ArrowDown className="h-3 w-3" /> Umgekehrt
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-[#6db875]">
              <ArrowUp className="h-3 w-3" /> Aufrecht
            </span>
          )}
        </span>

        <span className="flex items-center gap-1 text-[#b8ab96] group-hover:text-[#e6c275]">
          <Info className="h-3 w-3" />
          <span className="hidden sm:inline">Details</span>
        </span>
      </div>
    </div>
  );
};
