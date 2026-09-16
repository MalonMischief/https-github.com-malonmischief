export interface Rune {
  id: string;
  name: string; // Rheinfränkischer Hauptname (z. B. Fihu, Ūr, Dorn, Ans)
  frankishOldHighGermanName: string; // Fränkische Lautform & Bedeutung
  symbol: string; // Das geschnitzte Stabzeichen
  letter: string; // Lautwert
  sippe: 'Fülle' | 'Härte' | 'Recht'; // Fränkische Runenfamilie / Sippe
  meaning: string;
  literalMeaning: string;
  element: string;
  sacredTree: string; // Fränkischer heiliger Baum (z. B. Eiche, Birke, Apfelbaum)
  frankishLore: string; // Rheinfränkische Überlieferung
  uprightMeaning: string;
  reversedMeaning: string;
  poem: string; // Fränkischer Seherinnen-Spruch
  keywords: string[];
}

export interface CastRune extends Rune {
  positionIndex: number;
  positionLabel: string;
  positionDescription: string;
  isReversed: boolean;
  drawnAt: number;
  xOffset?: number;
  yOffset?: number;
  rotation?: number;
}

export type SpreadType = 'losstaebe' | 'single' | 'dreiklang' | 'kreuz';

export interface SpreadConfig {
  id: SpreadType;
  title: string;
  subtitle: string;
  runeCount: number;
  description: string;
  frankishContext: string;
  positions: {
    label: string;
    description: string;
  }[];
}

export interface OracleReading {
  id: string;
  date: string;
  question: string;
  spreadType: SpreadType;
  spreadTitle: string;
  seerName: 'Albruna' | 'Veleda' | 'Runa';
  runes: CastRune[];
  prophecyText: string;
  source: 'gemini' | 'traditional';
}

export interface LoreArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'seherinnen' | 'rituale' | 'geschichte' | 'runen';
  summary: string;
  content: string[];
  traditions: string[];
}
