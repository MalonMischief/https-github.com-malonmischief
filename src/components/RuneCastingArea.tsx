import React, { useState } from 'react';
import { SpreadConfig, CastRune, Rune } from '../types';
import { SPREADS } from '../data/spreads';
import { FRANKISH_RUNES } from '../data/runes';
import { RuneCard } from './RuneCard';
import { oracleAudio } from '../utils/audio';
import { Sparkles, HelpCircle, Dices, RotateCcw, Wand2, ShieldAlert } from 'lucide-react';

interface RuneCastingAreaProps {
  onProphesyGenerated: (
    prophecy: string,
    runes: CastRune[],
    question: string,
    spreadTitle: string,
    source: 'gemini' | 'traditional'
  ) => void;
  onSelectRuneForDetail: (rune: Rune | CastRune) => void;
  selectedSeer: 'Albruna' | 'Veleda' | 'Runa';
}

const QUESTION_SUGGESTIONS = [
  'Welche verborgene Strömung lenkt mein Schicksal?',
  'Welcher Weg bringt Heil in meiner Prüfung?',
  'Was hemmt meinen Schritt am Ufer des Stroms?',
  'Welchen Rat geben mir die Ahninnen für heute?'
];

export const RuneCastingArea: React.FC<RuneCastingAreaProps> = ({
  onProphesyGenerated,
  onSelectRuneForDetail,
  selectedSeer
}) => {
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfig>(SPREADS[0]);
  const [question, setQuestion] = useState<string>('');
  const [drawnRunes, setDrawnRunes] = useState<CastRune[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [isLoadingProphecy, setIsLoadingProphecy] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cast ritual (Obstbaum-Zweige auf weißes Leinentuch)
  const handleCastRunes = () => {
    setIsCasting(true);
    setErrorMessage(null);
    oracleAudio.playWoodClick();

    // Shuffle and pick runes without repetition
    const shuffled = [...FRANKISH_RUNES].sort(() => 0.5 - Math.random());
    const count = selectedSpread.runeCount;
    const selected = shuffled.slice(0, count);

    const cast: CastRune[] = selected.map((rune, idx) => {
      // 30% chance for rune to fall reversed (if the rune allows distinct inversion)
      const nonReversible = ['geba', 'hagal', 'is', 'jar', 'iwa', 'sunna', 'ing', 'tag'];
      const canReverse = !nonReversible.includes(rune.id);
      const isReversed = canReverse && Math.random() < 0.33;

      const pos = selectedSpread.positions[idx] || {
        label: `Los ${idx + 1}`,
        description: 'Bedeutung des Loses'
      };

      return {
        ...rune,
        positionIndex: idx,
        positionLabel: pos.label,
        positionDescription: pos.description,
        isReversed,
        drawnAt: Date.now()
      };
    });

    setDrawnRunes(cast);
    // Reveal all with slight dramatic stagger
    cast.forEach((_, i) => {
      setTimeout(() => {
        setRevealedIndices((prev) => new Set([...prev, i]));
        oracleAudio.playRuneChime(360 + i * 72);
      }, (i + 1) * 260);
    });

    setTimeout(() => {
      setIsCasting(false);
    }, count * 260 + 300);
  };

  // Consult the Seherin
  const handleRequestProphecy = async () => {
    if (drawnRunes.length === 0) return;
    setIsLoadingProphecy(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/oracle/prophesy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          spreadName: selectedSpread.title,
          seerName: selectedSeer,
          runes: drawnRunes
        })
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Kontaktaufnahme mit dem Seherinnen-Heiligtum');
      }

      const data = await response.json();
      oracleAudio.playRuneChime(528);
      onProphesyGenerated(
        data.text,
        drawnRunes,
        question.trim(),
        selectedSpread.title,
        data.source || 'traditional'
      );
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        'Die Stimmen im Nebel waren schwer zu vernehmen. Eine traditionelle Schau wird vorbereitet...'
      );
    } finally {
      setIsLoadingProphecy(false);
    }
  };

  const handleResetCasting = () => {
    setDrawnRunes([]);
    setRevealedIndices(new Set());
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49a45]/30 bg-[#211911] px-4 py-1 text-xs text-[#d8b05e] mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Das Heiligtum der {selectedSeer} am Rhein</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#f5ebd7] tracking-wider">
          Losung der Zweige & Fränkische Schau
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#b0a390] leading-relaxed">
          Tritt vor das reine weiße Leinentuch. Wie es seit Urzeiten im Rheinland Brauch ist,
          empfange die Weisheit der gefallenen Hölzer und den Rat der rheinfränkischen Seherinnen.
        </p>
      </div>

      {/* Spread Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SPREADS.map((spread) => {
          const isSelected = selectedSpread.id === spread.id;
          return (
            <button
              key={spread.id}
              id={`spread-${spread.id}`}
              onClick={() => {
                if (drawnRunes.length > 0) handleResetCasting();
                setSelectedSpread(spread);
              }}
              className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-[#c49a45] bg-[#241a12] shadow-lg shadow-black/60 ring-1 ring-[#c49a45]/60'
                  : 'border-[#2d251d] bg-[#14110d] hover:border-[#4a3b2c] hover:bg-[#1a1510]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-cinzel text-sm font-bold text-[#f5ebd7]">
                  {spread.title}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#332517] text-[#e8c36a] border border-[#523d26]">
                  {spread.runeCount} {spread.runeCount === 1 ? 'Los' : 'Hölzer'}
                </span>
              </div>
              <p className="text-xs text-[#a39683] mt-1 font-medium">
                {spread.subtitle}
              </p>
              <p className="text-[11px] text-[#736758] mt-2 line-clamp-2 leading-relaxed">
                {spread.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Question Input & Suggestions */}
      <div className="rounded-2xl border border-[#33271b] bg-[#14110d] p-5 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-2">
          <label
            htmlFor="oracle-question"
            className="text-xs font-semibold uppercase tracking-wider text-[#b8ab96] flex items-center gap-1.5"
          >
            <HelpCircle className="h-4 w-4 text-[#c49a45]" />
            <span>Deine Frage an die Seherin (optional)</span>
          </label>
          {question && (
            <button
              onClick={() => setQuestion('')}
              className="text-[11px] text-[#8c806f] hover:text-[#e8ded0]"
            >
              Leeren
            </button>
          )}
        </div>

        <div className="relative">
          <input
            id="oracle-question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="z.B. Welcher Schritt bringt mir Klarheit und Schutz?"
            className="w-full rounded-xl border border-[#3d3022] bg-[#1c1712] px-4 py-3 text-sm text-[#f5ebd7] placeholder-[#6b6051] focus:border-[#c49a45] focus:outline-none focus:ring-1 focus:ring-[#c49a45]"
          />
        </div>

        {/* Suggestion Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#786c5c]">Eingebungen:</span>
          {QUESTION_SUGGESTIONS.map((sugg, i) => (
            <button
              key={i}
              onClick={() => setQuestion(sugg)}
              className="rounded-full border border-[#2d2419] bg-[#1b1510] px-3 py-1 text-[11px] text-[#a89b88] hover:border-[#c49a45]/50 hover:text-[#f5ebd7] transition-all cursor-pointer"
            >
              „{sugg}“
            </button>
          ))}
        </div>
      </div>

      {/* The Sacred White Linen Cloth */}
      <div className="relative rounded-3xl border border-[#423425] bg-gradient-to-b from-[#171410] via-[#110e0b] to-[#0d0a08] p-6 sm:p-10 shadow-2xl shadow-black overflow-hidden">
        {/* Subtle cloth texture background */}
        <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-[#c49a45]/20 pointer-events-none" />

        {/* Header of the Ritual Cloth */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#a39480]">
              Altes Rheinisches Brauchtum
            </span>
            <h3 className="font-cinzel text-xl font-bold text-[#f5ebd7]">
              Das weiße Leinentuch der Seherin
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {drawnRunes.length === 0 ? (
              <button
                id="cast-runes-button"
                onClick={handleCastRunes}
                disabled={isCasting}
                className="flex items-center gap-2 rounded-xl border border-[#c49a45] bg-gradient-to-r from-[#947029] to-[#c49a45] px-6 py-3 font-cinzel text-xs font-bold uppercase tracking-wider text-[#0f0c09] shadow-lg shadow-black/80 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Dices className={`h-4 w-4 ${isCasting ? 'animate-spin' : ''}`} />
                <span>{isCasting ? 'Hölzer fallen...' : 'Loshölzer werfen'}</span>
              </button>
            ) : (
              <button
                id="reset-casting-button"
                onClick={handleResetCasting}
                className="flex items-center gap-1.5 rounded-xl border border-[#3d3123] bg-[#1a140f] px-4 py-2 text-xs font-medium text-[#a39683] hover:border-[#c49a45] hover:text-[#f5ebd7] transition-all cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Tuch räumen</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State on the Cloth */}
        {drawnRunes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#c49a45]/30 bg-[#211911] text-[#c49a45] shadow-inner mb-4">
              <span className="font-cinzel text-4xl">ᚦ</span>
            </div>
            <h4 className="font-cinzel text-lg font-bold text-[#e6dbca]">
              Das weiße Linnen liegt bereit
            </h4>
            <p className="mt-1 max-w-md text-xs sm:text-sm text-[#8a7e6e] leading-relaxed">
              Klicke auf <strong className="text-[#d8b05e]">„Loshölzer werfen“</strong>, um Zweige
              eines fruchttragenden Obstbaums mit fränkischen Merkzeichen auf das Linnen fallen zu lassen.
            </p>
          </div>
        )}

        {/* Casted Runes Board */}
        {drawnRunes.length > 0 && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4">
              {drawnRunes.map((rune, idx) => {
                const isRevealed = revealedIndices.has(idx);
                return (
                  <div
                    key={rune.id + idx}
                    className="flex flex-col items-center animate-fade-in"
                  >
                    {isRevealed ? (
                      <RuneCard
                        rune={rune}
                        isRevealed={true}
                        positionLabel={rune.positionLabel}
                        isReversed={rune.isReversed}
                        onClick={() => onSelectRuneForDetail(rune)}
                        size={selectedSpread.runeCount > 3 ? 'sm' : 'md'}
                      />
                    ) : (
                      <div
                        onClick={() => {
                          setRevealedIndices((prev) => new Set([...prev, idx]));
                          oracleAudio.playRuneChime(440);
                        }}
                        className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-[#524130] bg-[#17130e] p-4 text-center cursor-pointer hover:border-[#c49a45] ${
                          selectedSpread.runeCount > 3 ? 'w-24 h-36' : 'w-36 h-56'
                        }`}
                      >
                        <Wand2 className="h-6 w-6 text-[#73634f] animate-pulse" />
                        <span className="mt-2 text-[10px] text-[#8a7c6a]">
                          Tippen zum Enthüllen
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Prompt to consult Seherin Albruna */}
            <div className="border-t border-[#33271b] pt-6 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-[#b8ab96] max-w-lg mb-4">
                Die Zeichen liegen offen vor dir. Lasse nun {selectedSeer} in die Strömungen hineinhorchen,
                um das Geflecht der Zeit zu deuten und ihren Spruch an dich zu richten.
              </p>

              <button
                id="consult-seer-button"
                onClick={handleRequestProphecy}
                disabled={isLoadingProphecy}
                className="flex items-center gap-2.5 rounded-xl border border-[#c49a45] bg-gradient-to-r from-[#c49a45] to-[#dfba63] px-8 py-3.5 font-cinzel text-sm font-bold uppercase tracking-wider text-[#0e0b08] shadow-xl shadow-black/80 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${isLoadingProphecy ? 'animate-spin' : ''}`} />
                <span>
                  {isLoadingProphecy
                    ? `${selectedSeer} lauscht dem Strom...`
                    : `Weisheit der ${selectedSeer} empfangen`}
                </span>
              </button>

              {errorMessage && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-2 text-xs text-red-300">
                  <ShieldAlert className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

