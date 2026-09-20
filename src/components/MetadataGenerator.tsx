import React, { useState, useEffect } from 'react';
import { PromptCardItem, Marketplace } from '../types/prompt';
import { MetadataItem } from '../types/metadata';
import { generateMetadataAPI } from '../services/metadataService';
import { exportMetadataCSV, exportToTXT, getSavedMetadata, saveMetadataItem } from '../utils/storage';
import { MARKETPLACES } from '../services/promptBuilder';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  FileSpreadsheet,
  Globe,
  Tag,
  Briefcase,
  Layers,
  History,
  Trash2,
  FolderOpen,
} from 'lucide-react';

interface MetadataGeneratorProps {
  initialPrompt?: PromptCardItem | null;
  availablePrompts: PromptCardItem[];
  onShowToast: (msg: string) => void;
}

export const MetadataGenerator: React.FC<MetadataGeneratorProps> = ({
  initialPrompt,
  availablePrompts,
  onShowToast,
}) => {
  // Input states
  const [selectedPromptId, setSelectedPromptId] = useState<string>(initialPrompt?.id || '');
  const [promptText, setPromptText] = useState(initialPrompt?.prompt || '');
  const [assetTitle, setAssetTitle] = useState(initialPrompt?.title || '');
  const [assetType, setAssetType] = useState(initialPrompt?.assetType || 'Vector');
  const [targetMarketplace, setTargetMarketplace] = useState<Marketplace>(
    initialPrompt?.marketplace || 'Adobe Stock'
  );

  // Output states
  const [metadata, setMetadata] = useState<MetadataItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedMetadata, setCopiedMetadata] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [history, setHistory] = useState<MetadataItem[]>([]);

  useEffect(() => {
    setHistory(getSavedMetadata());
  }, []);

  // Sync if initialPrompt prop changes
  useEffect(() => {
    if (initialPrompt) {
      setSelectedPromptId(initialPrompt.id);
      setPromptText(initialPrompt.prompt);
      setAssetTitle(initialPrompt.title);
      setAssetType(initialPrompt.assetType);
      setTargetMarketplace(initialPrompt.marketplace);
    }
  }, [initialPrompt]);

  const handleSelectExistingPrompt = (id: string) => {
    setSelectedPromptId(id);
    const found = availablePrompts.find((p) => p.id === id);
    if (found) {
      setPromptText(found.prompt);
      setAssetTitle(found.title);
      setAssetType(found.assetType);
      setTargetMarketplace(found.marketplace);
    }
  };

  const handleGenerateMetadata = async () => {
    if (!promptText.trim()) {
      onShowToast('Please provide an asset prompt or description');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMetadataAPI({
        promptText,
        title: assetTitle,
        assetType,
        targetMarketplace,
      });
      setMetadata(result);
      const updatedHistory = saveMetadataItem(result);
      setHistory(updatedHistory);
      onShowToast('Metadata generated successfully!');
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || 'Failed to generate metadata');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAllMetadata = () => {
    if (!metadata) return;
    const formatted = `TITLE:
${metadata.title}

DESCRIPTION:
${metadata.description}

CATEGORY:
${metadata.category}

CONTENT TYPE:
${metadata.contentType} (${metadata.commercialType})

KEYWORDS (${metadata.keywords.length}):
${metadata.keywords.join(', ')}
`;
    navigator.clipboard.writeText(formatted);
    setCopiedMetadata(true);
    onShowToast('Full metadata copied to clipboard');
    setTimeout(() => setCopiedMetadata(false), 2000);
  };

  const handleCopyKeywordsOnly = () => {
    if (!metadata || metadata.keywords.length === 0) return;
    navigator.clipboard.writeText(metadata.keywords.join(', '));
    setCopiedKeywords(true);
    onShowToast(`Copied ${metadata.keywords.length} keywords`);
    setTimeout(() => setCopiedKeywords(false), 2000);
  };

  const handleDownloadCSV = () => {
    if (!metadata) return;
    const safeTitle = (metadata.title || 'stock_asset').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    exportMetadataCSV(metadata, `${safeTitle}_metadata.csv`);
    onShowToast('Downloaded metadata CSV');
  };

  const handleDownloadTXT = () => {
    if (!metadata) return;
    const content = `STOCK ASSET METADATA REPORT
==================================================
Target Marketplace: ${metadata.targetMarketplace}
Commercial Type: ${metadata.commercialType}
Category: ${metadata.category}
Content Type: ${metadata.contentType}

TITLE:
${metadata.title}

DESCRIPTION:
${metadata.description}

KEYWORDS (${metadata.keywords.length}):
${metadata.keywords.join(', ')}
`;
    const safeTitle = (metadata.title || 'stock_asset').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    exportToTXT(content, `${safeTitle}_metadata.txt`);
    onShowToast('Downloaded metadata TXT');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
              Stock Asset Metadata Generator
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Generate commercial titles, descriptions, and 25–50 high-ranking stock keywords for Adobe Stock, Shutterstock, and Freepik.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Configuration */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Source Prompt & Details
            </h2>
            {availablePrompts.length > 0 && (
              <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400">
                {availablePrompts.length} Prompts in Studio
              </span>
            )}
          </div>

          {/* Prompt Selector Dropdown if available */}
          {availablePrompts.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <FolderOpen className="h-3.5 w-3.5" />
                <span>Load from Generated Prompts</span>
              </label>
              <select
                id="select-prompt-source"
                value={selectedPromptId}
                onChange={(e) => handleSelectExistingPrompt(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">-- Choose a generated prompt or type below --</option>
                {availablePrompts.map((p, i) => (
                  <option key={p.id} value={p.id}>
                    #{i + 1}: {p.title} ({p.assetType})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Asset Title (Optional input) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Commercial Asset Title (Optional)
            </label>
            <input
              id="meta-input-title"
              type="text"
              value={assetTitle}
              onChange={(e) => setAssetTitle(e.target.value)}
              placeholder="e.g. Telemedicine Consultation Vector Illustration"
              className="w-full p-3 bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* AI Prompt / Subject description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              AI Generation Prompt or Visual Description *
            </label>
            <textarea
              id="meta-input-prompt"
              rows={5}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Paste the prompt or describe the visual elements, subject, background, and commercial concept..."
              className="w-full p-3 bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Marketplace and Asset Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Asset Type
              </label>
              <select
                id="meta-select-asset-type"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as any)}
                className="w-full p-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold"
              >
                <option value="Vector">Vector (SVG / EPS)</option>
                <option value="JPG">Stock Photo (JPG)</option>
                <option value="PNG">Isolated PNG</option>
                <option value="Icon Pack">Icon Pack</option>
                <option value="Illustration">Illustration</option>
                <option value="Background">Background</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Marketplace
              </label>
              <select
                id="meta-select-marketplace"
                value={targetMarketplace}
                onChange={(e) => setTargetMarketplace(e.target.value as Marketplace)}
                className="w-full p-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold"
              >
                {MARKETPLACES.map((mp) => (
                  <option key={mp} value={mp}>
                    {mp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Generate */}
          <button
            id="btn-generate-metadata"
            type="button"
            disabled={isGenerating || !promptText.trim()}
            onClick={handleGenerateMetadata}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Optimizing Keywords & SEO...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>GENERATE STOCK METADATA</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: Output Result */}
        <div className="lg:col-span-7 space-y-4">
          {metadata ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
              {/* Header with Export buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Generated Metadata
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
                      {metadata.keywords.length} Keywords
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white mt-1">
                    {metadata.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto">
                  <button
                    id="btn-copy-meta-all"
                    type="button"
                    onClick={handleCopyAllMetadata}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 shadow-xs"
                  >
                    {copiedMetadata ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedMetadata ? 'Copied' : 'Copy Metadata'}</span>
                  </button>

                  <button
                    id="btn-download-meta-csv"
                    type="button"
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700"
                    title="Download CSV formatted for Adobe Stock / Shutterstock batch upload"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                    <span>CSV</span>
                  </button>

                  <button
                    id="btn-download-meta-txt"
                    type="button"
                    onClick={handleDownloadTXT}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                    <span>TXT</span>
                  </button>
                </div>
              </div>

              {/* Badges Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Category</div>
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">{metadata.category}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Content Type</div>
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">{metadata.contentType}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Commercial Type</div>
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">{metadata.commercialType}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Marketplace</div>
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">{metadata.targetMarketplace}</div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Marketplace Description
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800 leading-relaxed">
                  {metadata.description}
                </p>
              </div>

              {/* Keywords Tag Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-blue-500" />
                    <span>Commercial Keywords ({metadata.keywords.length})</span>
                  </div>
                  <button
                    id="btn-copy-meta-keywords"
                    type="button"
                    onClick={handleCopyKeywordsOnly}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKeywords ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKeywords ? 'Keywords Copied!' : 'Copy Keywords (CSV)'}</span>
                  </button>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl flex flex-wrap gap-1.5 max-h-60 overflow-y-auto">
                  {metadata.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer select-all ${
                        i < 10
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/80 text-blue-800 dark:text-blue-200 font-semibold'
                          : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                      title={`Keyword #${i + 1} (Priority rank)`}
                    >
                      <span className="text-[10px] text-zinc-400 mr-1">#{i + 1}</span>
                      {kw}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-400 italic">
                  * Highlighted tags (#1–#10) indicate top commercial volume and search ranking impact.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-14 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900/50">
                <FileText className="h-8 w-8 stroke-[1.8]" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">
                  Generate Marketplace Metadata
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Select a generated prompt from the dropdown or paste your prompt description on the left. The AI will generate an SEO title, commercial description, and 25–50 sorted search tags.
                </p>
              </div>
            </div>
          )}

          {/* History list if any */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" />
                  Recent Metadata Sets ({history.length})
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {history.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setMetadata(item)}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 cursor-pointer flex items-center justify-between transition-colors text-xs"
                  >
                    <div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">{item.title}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {item.targetMarketplace} • {item.keywords.length} keywords • {new Date(item.generatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">View</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
