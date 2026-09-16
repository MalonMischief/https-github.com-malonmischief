import React, { useState } from 'react';
import { OracleReading } from '../types';
import { ScrollText, Trash2, Calendar, Shield, ExternalLink, Sparkles } from 'lucide-react';

interface JournalSectionProps {
  readings: OracleReading[];
  onDeleteReading: (id: string) => void;
  onClearAll: () => void;
  onSelectReading: (reading: OracleReading) => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  readings,
  onDeleteReading,
  onClearAll,
  onSelectReading
}) => {
  const [selectedReadingId, setSelectedReadingId] = useState<string | null>(
    readings.length > 0 ? readings[0].id : null
  );

  const activeReading = readings.find((r) => r.id === selectedReadingId) || readings[0];

  if (readings.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 text-center animate-fade-in">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl border border-[#c49a45]/30 bg-[#211911] text-[#c49a45] shadow-inner mb-4">
          <ScrollText className="h-8 w-8" />
        </div>
        <h3 className="font-cinzel text-2xl font-bold text-[#f5ebd7]">
          Die Chronik ist noch unbeschrieben
        </h3>
        <p className="mt-2 text-sm text-[#8c806f] max-w-md mx-auto leading-relaxed">
          Befrage die Seherin Albruna am Ritual-Tisch und klicke auf „In Chronik speichern“, um deine
          Weissagungen für künftige Tage festzuhalten.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d251d] pb-6">
        <div>
          <h2 className="font-cinzel text-3xl font-extrabold text-[#f5ebd7] tracking-wider">
            Chronik der Schicksalsfäden
          </h2>
          <p className="text-sm text-[#a39683] mt-1">
            Gespeicherte Losungen und Weissagungen der rheinfränkischen Seherinnen ({readings.length})
          </p>
        </div>

        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/40 transition-all cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Chronik leeren</span>
        </button>
      </div>

      {/* Main Grid: List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List of Readings */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {readings.map((reading) => {
            const isSelected = reading.id === activeReading?.id;
            return (
              <div
                key={reading.id}
                onClick={() => setSelectedReadingId(reading.id)}
                className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#c49a45] bg-[#241a12] shadow-md ring-1 ring-[#c49a45]/50'
                    : 'border-[#2d251d] bg-[#14110d] hover:border-[#423425] hover:bg-[#1a140f]'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#8c806f] mb-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(reading.date).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="font-medium text-[#c49a45]">{reading.seerName}</span>
                </div>

                <h4 className="font-cinzel text-sm font-bold text-[#f5ebd7] truncate">
                  {reading.question || 'Allgemeine Schicksalsschau'}
                </h4>

                <p className="text-[11px] text-[#8c806f] mt-0.5">
                  {reading.spreadTitle}
                </p>

                {/* Symbols bar */}
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-cinzel text-xs text-[#e8c36a]">
                    {reading.runes.map((r, idx) => (
                      <span key={idx} title={`${r.name} (${r.meaning})`}>
                        {r.symbol}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReading(reading.id);
                    }}
                    title="Eintrag löschen"
                    className="opacity-0 group-hover:opacity-100 text-[#7a6f60] hover:text-red-400 p-1 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail of selected reading */}
        {activeReading && (
          <div className="lg:col-span-8 rounded-2xl border border-[#3d3022] bg-[#14110d] p-6 sm:p-8 shadow-xl">
            <div className="border-b border-[#2d2419] pb-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-[#8c806f] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#c49a45]" />
                  {new Date(activeReading.date).toLocaleString('de-DE', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </span>
                <span className="rounded bg-[#2a2016] px-2.5 py-0.5 text-xs text-[#e8c36a] border border-[#4a3825]">
                  Seherin: {activeReading.seerName}
                </span>
              </div>

              <h3 className="font-cinzel text-xl font-bold text-[#f5ebd7] mt-3">
                {activeReading.question || 'Schau auf den Lebensfaden'}
              </h3>
              <p className="text-xs text-[#a39683] mt-1">
                Legung: {activeReading.spreadTitle}
              </p>
            </div>

            {/* Runes Display */}
            <div className="my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {activeReading.runes.map((rune, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center rounded-xl border border-[#332619] bg-[#1a140f] p-3 text-center"
                >
                  <span className="text-[10px] text-[#8c806f] truncate w-full mb-1">
                    {rune.positionLabel || `Los ${idx + 1}`}
                  </span>
                  <span
                    className={`font-cinzel text-2xl font-bold text-[#e8c36a] ${
                      rune.isReversed ? 'rotate-180 text-[#d48b55]' : ''
                    }`}
                  >
                    {rune.symbol}
                  </span>
                  <span className="font-cinzel text-xs font-semibold text-[#f5ebd7] mt-1">
                    {rune.name}
                  </span>
                  <span className="text-[10px] text-[#8c806f] mt-0.5">
                    {rune.isReversed ? 'Umgekehrt' : 'Aufrecht'}
                  </span>
                </div>
              ))}
            </div>

            {/* Prophecy Text */}
            <div className="space-y-4 text-sm font-serif text-[#d6cdbe] border-t border-[#2d2419] pt-6 leading-relaxed whitespace-pre-line">
              {activeReading.prophecyText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
