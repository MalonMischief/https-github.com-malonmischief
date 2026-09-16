import React, { useState } from 'react';
import { LORE_ARTICLES } from '../data/lore';
import { BookOpen, Scroll } from 'lucide-react';

export const LoreSection: React.FC = () => {
  const [activeArticleId, setActiveArticleId] = useState<string>(LORE_ARTICLES[0].id);

  const currentArticle =
    LORE_ARTICLES.find((a) => a.id === activeArticleId) || LORE_ARTICLES[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49a45]/30 bg-[#211911] px-4 py-1 text-xs text-[#d8b05e] mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Wissens-Schrein der Rheinfränkischen Seherinnen</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#f5ebd7] tracking-wider">
          Albruna, Veleda & das Fränkische Erbe
        </h2>
        <p className="mt-2 text-sm text-[#b0a390] leading-relaxed">
          Überlieferungen und mündliche Zeugnisse zu den Seherinnen des Rheinlands, dem Wurf
          der Loshölzer auf weißem Linnen und den Bräuchen der Rheinfranken.
        </p>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#827563] px-2 block mb-3">
            Themen & Überlieferungen
          </span>
          {LORE_ARTICLES.map((article) => {
            const isActive = article.id === activeArticleId;
            return (
              <button
                key={article.id}
                onClick={() => setActiveArticleId(article.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col ${
                  isActive
                    ? 'border-[#c49a45] bg-[#241a12] shadow-md shadow-black/50 ring-1 ring-[#c49a45]/50'
                    : 'border-[#2d251d] bg-[#14110d] hover:border-[#423425] hover:bg-[#1a140f]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-sm font-bold text-[#f5ebd7]">
                    {article.title}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#2e2318] text-[#c49a45]">
                    {article.category}
                  </span>
                </div>
                <p className="text-xs text-[#8c806f] mt-1 line-clamp-2">
                  {article.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Reader Display */}
        <div className="lg:col-span-8 rounded-2xl border border-[#3d3022] bg-[#14110d] p-6 sm:p-10 shadow-xl shadow-black">
          {/* Article Header */}
          <div className="border-b border-[#2d2419] pb-6">
            <span className="rounded bg-[#2e2318] px-2.5 py-1 text-xs uppercase font-mono text-[#e8c36a] border border-[#4d3a27]">
              Überlieferung: {currentArticle.category}
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f5ebd7] mt-3">
              {currentArticle.title}
            </h3>
            <p className="text-sm font-serif italic text-[#c49a45] mt-1">
              {currentArticle.subtitle}
            </p>
          </div>

          {/* Article Paragraphs */}
          <div className="mt-6 space-y-5 text-sm sm:text-base font-serif text-[#d6cdbe] leading-relaxed">
            {currentArticle.content.map((p, i) => (
              <p key={i} className="text-[#cfc5b4] leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Traditions & Heritage */}
          <div className="mt-8 border-t border-[#2d2419] pt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8a7d6d] flex items-center gap-1.5 mb-3">
              <Scroll className="h-3.5 w-3.5 text-[#c49a45]" />
              Fränkische Überlieferung & Zeugnisse
            </h4>
            <ul className="space-y-1.5 text-xs text-[#a39683]">
              {currentArticle.traditions.map((trad, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#c49a45]" />
                  <span>{trad}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
