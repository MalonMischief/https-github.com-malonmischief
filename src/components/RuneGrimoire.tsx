import React, { useState } from 'react';
import { Rune } from '../types';
import { FRANKISH_RUNES } from '../data/runes';
import { RuneCard } from './RuneCard';
import { Search, Compass } from 'lucide-react';

interface RuneGrimoireProps {
  onSelectRune: (rune: Rune) => void;
}

export const RuneGrimoire: React.FC<RuneGrimoireProps> = ({ onSelectRune }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSippe, setSelectedSippe] = useState<string>('all');

  const filteredRunes = FRANKISH_RUNES.filter((rune) => {
    const matchesSearch =
      rune.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rune.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rune.frankishOldHighGermanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rune.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSippe = selectedSippe === 'all' || rune.sippe === selectedSippe;

    return matchesSearch && matchesSippe;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49a45]/30 bg-[#211911] px-4 py-1 text-xs text-[#d8b05e] mb-3">
          <Compass className="h-3.5 w-3.5" />
          <span>Stab- & Kerbzeichen des Rheintals</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#f5ebd7] tracking-wider">
          Die 24 Fränkischen Zeichen
        </h2>
        <p className="mt-2 text-sm text-[#b0a390] leading-relaxed">
          Erforsche jedes heilige Zeichen, seine rheinfränkische Lautform und Spruchweisheit, den
          zugeordneten Baum der Auenwälder und den Rat der Seherinnen Albruna und Veleda.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#33271b] bg-[#14110d] p-4 shadow-md">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#786c5c]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zeichen, Fränkisch oder Stichwort..."
            className="w-full rounded-xl border border-[#3d3022] bg-[#1c1712] pl-10 pr-4 py-2 text-xs sm:text-sm text-[#f5ebd7] placeholder-[#6b6051] focus:border-[#c49a45] focus:outline-none"
          />
        </div>

        {/* Sippen Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-[#827563] mr-1 hidden lg:inline">Sippen:</span>
          {[
            { id: 'all', label: 'Alle 24 Zeichen' },
            { id: 'Fülle', label: '1. Sippe der Fülle' },
            { id: 'Härte', label: '2. Sippe der Härte' },
            { id: 'Recht', label: '3. Sippe des Rechts' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSippe(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedSippe === tab.id
                  ? 'border border-[#c49a45]/60 bg-[#c49a45]/20 text-[#f5ebd7]'
                  : 'border border-transparent bg-[#1c1712] text-[#8c806f] hover:text-[#e0d6c5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Runes Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
        {filteredRunes.map((rune) => (
          <div key={rune.id} className="flex justify-center">
            <RuneCard
              rune={rune}
              isRevealed={true}
              onClick={() => onSelectRune(rune)}
              size="sm"
            />
          </div>
        ))}
      </div>

      {filteredRunes.length === 0 && (
        <div className="py-16 text-center text-[#827563]">
          <p className="text-sm">Kein Zeichen mit diesem Merkmal gefunden.</p>
        </div>
      )}
    </div>
  );
};
