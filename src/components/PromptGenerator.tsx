import React, { useState } from 'react';
import {
  PromptCardItem,
  PromptGenerationRequest,
  AssetType,
  Marketplace,
  PromptProject,
} from '../types/prompt';
import { TopicSelector } from './TopicSelector';
import { AssetTypeSelector } from './AssetTypeSelector';
import { StyleSelector } from './StyleSelector';
import { StockOptions } from './StockOptions';
import { PromptCard } from './PromptCard';
import { exportToCSV, exportToTXT, saveProject } from '../utils/storage';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Layers,
  FileSpreadsheet,
  FileText,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';

interface PromptGeneratorProps {
  topic: string;
  setTopic: (topic: string) => void;
  assetType: AssetType;
  setAssetType: (type: AssetType) => void;
  style: string;
  setStyle: (style: string) => void;
  stockRequirements: string[];
  setStockRequirements: (reqs: string[]) => void;
  numberOfPrompts: number;
  setNumberOfPrompts: (num: number) => void;
  targetMarketplace: Marketplace;
  setTargetMarketplace: (mp: Marketplace) => void;
  prompts: PromptCardItem[];
  setPrompts: React.Dispatch<React.SetStateAction<PromptCardItem[]>>;
  isGenerating: boolean;
  onGenerate: () => void;
  onRegenerateSingle: (prompt: PromptCardItem) => void;
  onSavePrompt: (prompt: PromptCardItem) => void;
  onSendToMetadata: (prompt: PromptCardItem) => void;
  regeneratingId?: string | null;
  onShowToast: (msg: string) => void;
}

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({
  topic,
  setTopic,
  assetType,
  setAssetType,
  style,
  setStyle,
  stockRequirements,
  setStockRequirements,
  numberOfPrompts,
  setNumberOfPrompts,
  targetMarketplace,
  setTargetMarketplace,
  prompts,
  setPrompts,
  isGenerating,
  onGenerate,
  onRegenerateSingle,
  onSavePrompt,
  onSendToMetadata,
  regeneratingId,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPassedOnly, setFilterPassedOnly] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Filtered prompts
  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesQc = filterPassedOnly ? p.validationScore?.overallPassed : true;
    return matchesSearch && matchesQc;
  });

  const handleCopyAll = () => {
    if (prompts.length === 0) return;
    const allText = prompts
      .map(
        (p, idx) =>
          `Prompt #${idx + 1}: ${p.title}\nConcept: ${p.concept}\nAsset Type: ${p.assetType} (${p.style}) - ${p.marketplace}\nCommercial Use: ${p.commercialUse}\nPrompt:\n${p.prompt}\nKeywords: ${p.keywords.join(', ')}\n`
      )
      .join('\n' + '='.repeat(50) + '\n\n');

    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    onShowToast(`Copied all ${prompts.length} prompts to clipboard`);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCSV = () => {
    if (prompts.length === 0) return;
    const safeTopic = (topic || 'stock_prompts').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    exportToCSV(prompts, `${safeTopic}_${assetType.toLowerCase()}_prompts.csv`);
    onShowToast(`Downloaded CSV for ${prompts.length} prompts`);
    setShowExportMenu(false);
  };

  const handleExportTXT = () => {
    if (prompts.length === 0) return;
    const safeTopic = (topic || 'stock_prompts').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const content = prompts
      .map(
        (p, idx) =>
          `==================================================\nPROMPT #${idx + 1}: ${p.title}\n==================================================\nConcept: ${p.concept}\nAsset Type: ${p.assetType}\nStyle: ${p.style}\nMarketplace: ${p.marketplace}\nCommercial Use: ${p.commercialUse}\n\nAI Prompt:\n${p.prompt}\n\nStock Keywords:\n${p.keywords.join(', ')}\n\n`
      )
      .join('\n');
    exportToTXT(content, `${safeTopic}_${assetType.toLowerCase()}_prompts.txt`);
    onShowToast(`Downloaded TXT file`);
    setShowExportMenu(false);
  };

  const handleSaveCurrentProject = () => {
    if (prompts.length === 0) return;
    const project: PromptProject = {
      id: `project_${Date.now()}`,
      name: `${topic || 'Untitled'} - ${assetType} (${prompts.length} concepts)`,
      topic,
      assetType,
      style,
      marketplace: targetMarketplace,
      prompts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProject(project);
    onShowToast(`Project saved to Library!`);
  };

  const handleDeleteSingle = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    onShowToast('Prompt removed from current view');
  };

  const handleUpdateSingle = (updated: PromptCardItem) => {
    setPrompts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    onShowToast('Prompt changes saved');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Configuration Panel */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
            <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              Prompt Studio Configuration
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Select stock market parameters and generation constraints.
            </p>
          </div>

          {/* 1. TOPIC / NICHE */}
          <TopicSelector topic={topic} setTopic={setTopic} />

          <hr className="border-zinc-100 dark:border-zinc-800/80" />

          {/* 2. ASSET TYPE */}
          <AssetTypeSelector
            selectedAssetType={assetType}
            onSelectAssetType={(newType) => {
              setAssetType(newType);
              // reset style if needed
              if (newType === 'Vector' || newType === 'Icon Pack') {
                setStyle('Minimal');
              } else {
                setStyle('Photorealistic');
              }
            }}
          />

          <hr className="border-zinc-100 dark:border-zinc-800/80" />

          {/* 3. DESIGN STYLE */}
          <StyleSelector
            assetType={assetType}
            selectedStyle={style}
            onSelectStyle={setStyle}
          />

          <hr className="border-zinc-100 dark:border-zinc-800/80" />

          {/* 4, 5, 6. STOCK REQUIREMENTS & BATCH OPTIONS */}
          <StockOptions
            stockRequirements={stockRequirements}
            setStockRequirements={setStockRequirements}
            numberOfPrompts={numberOfPrompts}
            setNumberOfPrompts={setNumberOfPrompts}
            targetMarketplace={targetMarketplace}
            setTargetMarketplace={setTargetMarketplace}
            assetType={assetType}
          />

          {/* PRIMARY CTA: GENERATE PROMPTS */}
          <div className="pt-2">
            <button
              id="generate-prompts-btn"
              type="button"
              disabled={isGenerating || !topic.trim()}
              onClick={onGenerate}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99] cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Engineering Commercial Concepts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>GENERATE {numberOfPrompts} PROMPTS</span>
                </>
              )}
            </button>
            {!topic.trim() && (
              <p className="text-[11px] text-zinc-400 text-center mt-2">
                Enter a topic above or pick a quick preset to enable generation
              </p>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Prompt Output & Results */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* Output Toolbar & Stats */}
          {prompts.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white">
                    Generated Prompts ({prompts.length})
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                    {assetType}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                    {targetMarketplace}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Topic: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{topic}</span> • All concepts checked for novelty
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
                <button
                  id="btn-copy-all"
                  type="button"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs"
                  title="Copy all prompts in text format"
                >
                  {copiedAll ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedAll ? 'Copied!' : 'Copy All'}</span>
                </button>

                <button
                  id="btn-save-project"
                  type="button"
                  onClick={handleSaveCurrentProject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs"
                  title="Save this collection to your library"
                >
                  <BookmarkCheck className="h-3.5 w-3.5 text-orange-500" />
                  <span>Save Project</span>
                </button>

                {/* Export Dropdown */}
                <div className="relative">
                  <button
                    id="btn-export-dropdown"
                    type="button"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-colors shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export</span>
                  </button>

                  {showExportMenu && (
                    <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg py-1 z-30 text-xs">
                      <button
                        id="btn-export-csv"
                        type="button"
                        onClick={handleExportCSV}
                        className="w-full text-left px-3 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                        <span>Download CSV</span>
                      </button>
                      <button
                        id="btn-export-txt"
                        type="button"
                        onClick={handleExportTXT}
                        className="w-full text-left px-3 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>Download TXT</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters Bar (when prompts exist) */}
          {prompts.length > 0 && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter by concept, keyword or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterPassedOnly(!filterPassedOnly)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${
                    filterPassedOnly
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>QC Passed Only</span>
                </button>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {isGenerating && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xs">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-2xl bg-orange-500/20 animate-ping" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                  <Sparkles className="h-8 w-8 animate-spin" />
                </div>
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
                  Generating {numberOfPrompts} Commercial Stock Prompts
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  Targeting <strong className="text-zinc-800 dark:text-zinc-200">{targetMarketplace}</strong> standards for <strong className="text-orange-600 dark:text-orange-400">{topic}</strong>.
                </p>
              </div>

              {/* Progress steps pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-xs font-medium text-orange-700 dark:text-orange-300">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                <span>Enforcing anti-repetition & quality control engine</span>
              </div>
            </div>
          )}

          {/* PROMPT CARDS LIST */}
          {!isGenerating && prompts.length > 0 && (
            <div className="space-y-4">
              {filteredPrompts.map((promptItem, idx) => (
                <PromptCard
                  key={promptItem.id}
                  prompt={promptItem}
                  index={idx}
                  onCopy={(text, title) => {
                    navigator.clipboard.writeText(text);
                    onShowToast(title ? `Copied ${title}` : 'Copied to clipboard');
                  }}
                  onRegenerate={onRegenerateSingle}
                  onSave={onSavePrompt}
                  onDelete={handleDeleteSingle}
                  onSendToMetadata={onSendToMetadata}
                  onUpdate={handleUpdateSingle}
                  isRegenerating={regeneratingId === promptItem.id}
                />
              ))}

              {filteredPrompts.length === 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center text-xs text-zinc-500">
                  No prompts match your current filter. Clear search or filters to see all results.
                </div>
              )}
            </div>
          )}

          {/* EMPTY STATE */}
          {!isGenerating && prompts.length === 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-14 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto border border-orange-200 dark:border-orange-900/50">
                <Flame className="h-8 w-8 stroke-[1.8]" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">
                  Ready to Generate Stock Asset Prompts
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Enter your topic on the left (e.g.{' '}
                  <button
                    type="button"
                    onClick={() => setTopic('AI Cybersecurity')}
                    className="text-orange-600 dark:text-orange-400 underline font-medium"
                  >
                    AI Cybersecurity
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    onClick={() => setTopic('Healthcare & Telemedicine')}
                    className="text-orange-600 dark:text-orange-400 underline font-medium"
                  >
                    Healthcare
                  </button>
                  ), choose your Asset Type & Marketplace, then click Generate.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-2 text-[11px] text-zinc-500">
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                  ✓ Non-repetitive commercial concepts
                </span>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                  ✓ Isolated & white background rules
                </span>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                  ✓ Adobe Stock & Shutterstock ready
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
