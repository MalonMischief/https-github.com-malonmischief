import React from 'react';
import { Sparkles, BookOpen, ScrollText, Volume2, VolumeX, Shield, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: 'oracle' | 'grimoire' | 'lore' | 'journal';
  setActiveTab: (tab: 'oracle' | 'grimoire' | 'lore' | 'journal') => void;
  isMuted: boolean;
  onToggleSound: () => void;
  selectedSeer: 'Albruna' | 'Veleda' | 'Runa';
  setSelectedSeer: (seer: 'Albruna' | 'Veleda' | 'Runa') => void;
  savedReadingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  onToggleSound,
  selectedSeer,
  setSelectedSeer,
  savedReadingsCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2d251d] bg-[#0d0f14]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#c49a45]/40 bg-[#1a1510] text-[#e8c36a] shadow-md shadow-black/60">
            <span className="font-cinzel text-2xl font-bold">ᛚ</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-lg font-bold tracking-wider text-[#f5ebd7] sm:text-xl">
                ALBRUNA
              </h1>
              <span className="rounded border border-[#c49a45]/30 bg-[#c49a45]/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-[#d8b05e]">
                Rheinfränkisch
              </span>
            </div>
            <p className="text-xs text-[#a39a8c] hidden sm:block">
              Seherinnen-Orakel & Loshölzer am Rhein
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-oracle"
            onClick={() => setActiveTab('oracle')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'oracle'
                ? 'bg-[#c49a45]/20 text-[#f5ebd7] border border-[#c49a45]/50 shadow-sm'
                : 'text-[#a39a8c] hover:bg-[#1f1a14] hover:text-[#e0d6c5]'
            }`}
          >
            <Sparkles className="h-4 w-4 text-[#d8b05e]" />
            <span>Orakel</span>
          </button>

          <button
            id="nav-tab-grimoire"
            onClick={() => setActiveTab('grimoire')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'grimoire'
                ? 'bg-[#c49a45]/20 text-[#f5ebd7] border border-[#c49a45]/50 shadow-sm'
                : 'text-[#a39a8c] hover:bg-[#1f1a14] hover:text-[#e0d6c5]'
            }`}
          >
            <Compass className="h-4 w-4 text-[#d8b05e]" />
            <span>24 Runen</span>
          </button>

          <button
            id="nav-tab-lore"
            onClick={() => setActiveTab('lore')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'lore'
                ? 'bg-[#c49a45]/20 text-[#f5ebd7] border border-[#c49a45]/50 shadow-sm'
                : 'text-[#a39a8c] hover:bg-[#1f1a14] hover:text-[#e0d6c5]'
            }`}
          >
            <BookOpen className="h-4 w-4 text-[#d8b05e]" />
            <span className="hidden xs:inline">Wissen</span>
            <span className="xs:hidden">Lore</span>
          </button>

          <button
            id="nav-tab-journal"
            onClick={() => setActiveTab('journal')}
            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'journal'
                ? 'bg-[#c49a45]/20 text-[#f5ebd7] border border-[#c49a45]/50 shadow-sm'
                : 'text-[#a39a8c] hover:bg-[#1f1a14] hover:text-[#e0d6c5]'
            }`}
          >
            <ScrollText className="h-4 w-4 text-[#d8b05e]" />
            <span className="hidden sm:inline">Chronik</span>
            {savedReadingsCount > 0 && (
              <span className="ml-1 rounded-full bg-[#c49a45] px-1.5 py-0.2 text-[10px] font-bold text-[#0c0e12]">
                {savedReadingsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right side controls: Seer voice & sound toggle */}
        <div className="flex items-center gap-2">
          {/* Seer Selector */}
          <div className="relative hidden md:flex items-center gap-1.5 rounded-lg border border-[#332b22] bg-[#14110d] px-2 py-1 text-xs text-[#c9bea9]">
            <Shield className="h-3.5 w-3.5 text-[#d8b05e]" />
            <span className="text-[#877d70]">Stimme:</span>
            <select
              value={selectedSeer}
              onChange={(e) => setSelectedSeer(e.target.value as any)}
              className="bg-transparent font-semibold text-[#f5ebd7] outline-none cursor-pointer"
            >
              <option value="Albruna" className="bg-[#14110d] text-[#f5ebd7]">
                Albruna (Alben-Geheimnis)
              </option>
              <option value="Veleda" className="bg-[#14110d] text-[#f5ebd7]">
                Veleda (Brukterer-Turm)
              </option>
              <option value="Runa" className="bg-[#14110d] text-[#f5ebd7]">
                Runa (Die Raunende)
              </option>
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            id="ambient-sound-toggle"
            onClick={onToggleSound}
            title={isMuted ? 'Klangritual einschalten (Ambient Drone)' : 'Klang stummschalten'}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
              !isMuted
                ? 'border-[#c49a45] bg-[#c49a45]/20 text-[#e8c36a] shadow-[0_0_12px_rgba(196,154,69,0.3)]'
                : 'border-[#332b22] bg-[#14110d] text-[#736a5e] hover:text-[#b0a595]'
            }`}
          >
            {!isMuted ? <Volume2 className="h-4 w-4 animate-pulse" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
