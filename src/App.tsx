import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RuneCastingArea } from './components/RuneCastingArea';
import { ProphecyDisplay } from './components/ProphecyDisplay';
import { RuneGrimoire } from './components/RuneGrimoire';
import { LoreSection } from './components/LoreSection';
import { JournalSection } from './components/JournalSection';
import { RuneDetailModal } from './components/RuneDetailModal';
import { CastRune, Rune, OracleReading } from './types';
import { oracleAudio } from './utils/audio';
import { Sparkles, Shield, Compass, BookOpen, ScrollText } from 'lucide-react';

const STORAGE_KEY = 'albruna_oracle_chronicle_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'oracle' | 'grimoire' | 'lore' | 'journal'>('oracle');
  const [selectedSeer, setSelectedSeer] = useState<'Albruna' | 'Veleda' | 'Runa'>('Albruna');
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Current Oracle Reading State
  const [currentProphecy, setCurrentProphecy] = useState<string | null>(null);
  const [currentRunes, setCurrentRunes] = useState<CastRune[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentSpreadTitle, setCurrentSpreadTitle] = useState<string>('');
  const [currentSource, setCurrentSource] = useState<'gemini' | 'traditional'>('traditional');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Modal inspection state
  const [selectedRuneForDetail, setSelectedRuneForDetail] = useState<Rune | CastRune | null>(null);

  // Saved Chronicle Readings
  const [savedReadings, setSavedReadings] = useState<OracleReading[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedReadings));
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
  }, [savedReadings]);

  const handleToggleSound = () => {
    const muted = oracleAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleProphesyGenerated = (
    prophecy: string,
    runes: CastRune[],
    question: string,
    spreadTitle: string,
    source: 'gemini' | 'traditional'
  ) => {
    setCurrentProphecy(prophecy);
    setCurrentRunes(runes);
    setCurrentQuestion(question);
    setCurrentSpreadTitle(spreadTitle);
    setCurrentSource(source);
    setIsSaved(false);
  };

  const handleSaveReading = () => {
    if (!currentProphecy || isSaved) return;

    const newReading: OracleReading = {
      id: 'reading_' + Date.now(),
      date: new Date().toISOString(),
      question: currentQuestion,
      spreadType: 'losstaebe',
      spreadTitle: currentSpreadTitle,
      seerName: selectedSeer,
      runes: currentRunes,
      prophecyText: currentProphecy,
      source: currentSource
    };

    setSavedReadings((prev) => [newReading, ...prev]);
    setIsSaved(true);
    oracleAudio.playRuneChime(640);
  };

  const handleDeleteReading = (id: string) => {
    setSavedReadings((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAllReadings = () => {
    if (window.confirm('Möchtest du wirklich alle Einträge der Schicksalschronik löschen?')) {
      setSavedReadings([]);
    }
  };

  const handleResetCurrentReading = () => {
    setCurrentProphecy(null);
    setCurrentRunes([]);
    setCurrentQuestion('');
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#ded5c5] flex flex-col selection:bg-[#c49a45]/30 selection:text-[#fff0cc]">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        selectedSeer={selectedSeer}
        setSelectedSeer={setSelectedSeer}
        savedReadingsCount={savedReadings.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {activeTab === 'oracle' && (
          <div className="space-y-8">
            {!currentProphecy ? (
              <RuneCastingArea
                onProphesyGenerated={handleProphesyGenerated}
                onSelectRuneForDetail={(r) => setSelectedRuneForDetail(r)}
                selectedSeer={selectedSeer}
              />
            ) : (
              <ProphecyDisplay
                prophecyText={currentProphecy}
                question={currentQuestion}
                spreadTitle={currentSpreadTitle}
                runes={currentRunes}
                seerName={selectedSeer}
                source={currentSource}
                onSaveReading={handleSaveReading}
                isSaved={isSaved}
                onReset={handleResetCurrentReading}
              />
            )}
          </div>
        )}

        {activeTab === 'grimoire' && (
          <RuneGrimoire onSelectRune={(rune) => setSelectedRuneForDetail(rune)} />
        )}

        {activeTab === 'lore' && <LoreSection />}

        {activeTab === 'journal' && (
          <JournalSection
            readings={savedReadings}
            onDeleteReading={handleDeleteReading}
            onClearAll={handleClearAllReadings}
            onSelectReading={(reading) => {
              setCurrentProphecy(reading.prophecyText);
              setCurrentRunes(reading.runes);
              setCurrentQuestion(reading.question);
              setCurrentSpreadTitle(reading.spreadTitle);
              setSelectedSeer(reading.seerName);
              setCurrentSource(reading.source);
              setIsSaved(true);
              setActiveTab('oracle');
            }}
          />
        )}
      </main>

      {/* Rune Detail Inspector Modal */}
      <RuneDetailModal
        rune={selectedRuneForDetail}
        onClose={() => setSelectedRuneForDetail(null)}
      />

      {/* Atmospheric Footer */}
      <footer className="border-t border-[#211a13] bg-[#090b0e] py-8 text-center text-xs text-[#73695c]">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-cinzel text-sm text-[#b8ab96]">
            Albruna • Rheinfränkisches Seherinnen-Orakel
          </p>
          <p className="text-[11px] leading-relaxed text-[#73695c]">
            Überliefert nach altem rheinfränkischem Brauchtum der Seherinnen Albruna, Veleda und Runa
            an den Ufern des Rheins.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-[#594f43]">
            <span>ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ • Fränkische Kerbzeichen</span>
            <span>•</span>
            <span>Der Rhein-Strom</span>
            <span>•</span>
            <span>Weisheit der Mütterinnen</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
