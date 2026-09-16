import React, { useState } from 'react';
import { CastRune, OracleReading } from '../types';
import { Sparkles, Copy, Check, BookmarkPlus, RefreshCw, Volume2, VolumeX, Shield, Feather } from 'lucide-react';

interface ProphecyDisplayProps {
  prophecyText: string;
  question: string;
  spreadTitle: string;
  runes: CastRune[];
  seerName: 'Albruna' | 'Veleda' | 'Runa';
  source: 'gemini' | 'traditional';
  onSaveReading: () => void;
  isSaved: boolean;
  onReset: () => void;
}

export const ProphecyDisplay: React.FC<ProphecyDisplayProps> = ({
  prophecyText,
  question,
  spreadTitle,
  runes,
  seerName,
  source,
  onSaveReading,
  isSaved,
  onReset
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prophecyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown headings/stars for smooth reading
    const cleanText = prophecyText
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'de-DE';
    utterance.rate = 0.92;
    utterance.pitch = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const seerTitles = {
    Albruna: 'Die mit dem Alben-Geheimnis Versehene • Seherin der rheinfränkischen Stämme',
    Veleda: 'Die Seherin der Brukterer am Rhein',
    Runa: 'Die Hüterin der heiligen Raunung & Ahnensprüche'
  }[seerName];

  return (
    <div className="relative mx-auto mt-8 w-full max-w-4xl animate-fade-in">
      {/* Decorative Outer Parchment Glow */}
      <div className="rounded-2xl border border-[#c49a45]/50 bg-gradient-to-b from-[#1c1610] via-[#14100c] to-[#0d0a07] p-6 sm:p-10 shadow-2xl shadow-black">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3d3224] pb-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#c49a45]/60 bg-[#2b2116] text-[#e8c36a] shadow-inner">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f5ebd7]">
                  Weissagung der {seerName}
                </h3>
                {source === 'gemini' && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#c49a45]/40 bg-[#c49a45]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#e8c36a]">
                    <Sparkles className="h-2.5 w-2.5" /> Seherinnen-Geist
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a39683]">{seerTitles}</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {'speechSynthesis' in window && (
              <button
                onClick={handleToggleSpeak}
                title={isSpeaking ? 'Vorlesen stoppen' : 'Weissagung vorlesen'}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  isSpeaking
                    ? 'border-[#c49a45] bg-[#c49a45]/20 text-[#f5ebd7]'
                    : 'border-[#3d3224] bg-[#1c1610] text-[#a39683] hover:text-[#f5ebd7]'
                }`}
              >
                {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                <span>{isSpeaking ? 'Stopp' : 'Lauschen'}</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-[#3d3224] bg-[#1c1610] px-3 py-1.5 text-xs font-medium text-[#a39683] hover:border-[#c49a45] hover:text-[#f5ebd7] transition-all"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#6db875]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Kopiert' : 'Kopieren'}</span>
            </button>

            <button
              onClick={onSaveReading}
              disabled={isSaved}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                isSaved
                  ? 'border-[#2d3a2b] bg-[#1a2b18]/60 text-[#8cd697]'
                  : 'border-[#c49a45]/60 bg-[#c49a45]/20 text-[#f5ebd7] hover:bg-[#c49a45]/30'
              }`}
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span>{isSaved ? 'In Chronik' : 'Speichern'}</span>
            </button>
          </div>
        </div>

        {/* Question & Runes Banner */}
        <div className="mt-6 rounded-xl border border-[#2d2419] bg-[#17120c] p-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[#877c6b] uppercase tracking-wider text-[10px] font-bold">
                Anliegen des Ratsuchenden
              </span>
              <p className="text-sm font-serif italic text-[#e8ded0] mt-0.5">
                „{question || 'Das Schicksalsgewebe der Tage & die geheimen Strömungen'}“
              </p>
            </div>
            <div className="flex items-center gap-1 text-[#877c6b]">
              <span>Legung:</span>
              <span className="font-medium text-[#c49a45]">{spreadTitle}</span>
            </div>
          </div>

          {/* Quick symbols display */}
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#261e15] pt-3">
            <span className="text-[11px] text-[#877c6b]">Gefallene Zeichen:</span>
            {runes.map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded bg-[#241c14] px-2 py-0.5 font-cinzel text-xs font-semibold text-[#e8c36a] border border-[#3d3224]"
              >
                <span>{r.symbol}</span>
                <span>{r.name}</span>
                {r.isReversed && <span className="text-[9px] text-[#d48b55]">(umg.)</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Prophecy Text with Parchment Typography */}
        <div className="mt-8 space-y-6 text-[#ded5c5]">
          <div className="prose prose-invert max-w-none font-serif leading-relaxed text-base sm:text-lg">
            {prophecyText.split('\n\n').map((paragraph, idx) => {
              // Format headings
              if (paragraph.startsWith('### ') || paragraph.startsWith('## ') || paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ') || paragraph.startsWith('5. ')) {
                return (
                  <div key={idx} className="pt-3">
                    <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#e6c275] border-b border-[#2d2419] pb-1.5 flex items-center gap-2">
                      <Feather className="h-4 w-4 text-[#c49a45]" />
                      {paragraph.replace(/#{1,4}\s?/, '')}
                    </h4>
                  </div>
                );
              }

              // Format italic verses / poems
              if (paragraph.startsWith('*') || paragraph.includes('„')) {
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#c49a45]/30 bg-[#211911]/60 p-4 text-center italic text-[#edd9b2] shadow-inner"
                  >
                    <p className="whitespace-pre-line">{paragraph.replace(/\*/g, '')}</p>
                  </div>
                );
              }

              // Standard paragraphs
              return (
                <p key={idx} className="whitespace-pre-line text-[#cfc5b4] leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer with Reset / Cast Again */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#3d3224] pt-6">
          <p className="text-xs text-[#877c6b] italic text-center sm:text-left">
            *Nach altem fränkischem Brauch wird das Los zur selben Frage am selben Tage nicht erneut bedrängt.*
          </p>

          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl border border-[#c49a45]/60 bg-gradient-to-r from-[#8f6d29] to-[#c49a45] px-5 py-2.5 font-cinzel text-xs font-bold uppercase tracking-wider text-[#0e0c09] shadow-md hover:brightness-110 transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Neues Los werfen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
