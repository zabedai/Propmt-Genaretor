import React, { useState } from 'react';
import { PromptCardItem } from '../types/prompt';
import {
  Copy,
  Check,
  RefreshCw,
  Edit2,
  Bookmark,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Tag,
  Briefcase,
  Layers,
  X,
  Save,
} from 'lucide-react';

interface PromptCardProps {
  prompt: PromptCardItem;
  index: number;
  onCopy: (text: string, title?: string) => void;
  onRegenerate: (prompt: PromptCardItem) => void;
  onSave: (prompt: PromptCardItem) => void;
  onDelete: (id: string) => void;
  onSendToMetadata: (prompt: PromptCardItem) => void;
  onUpdate: (updated: PromptCardItem) => void;
  isRegenerating?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  index,
  onCopy,
  onRegenerate,
  onSave,
  onDelete,
  onSendToMetadata,
  onUpdate,
  isRegenerating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showQcDetails, setShowQcDetails] = useState(false);

  // Edit draft states
  const [draftTitle, setDraftTitle] = useState(prompt.title);
  const [draftConcept, setDraftConcept] = useState(prompt.concept);
  const [draftPrompt, setDraftPrompt] = useState(prompt.prompt);
  const [draftCommercialUse, setDraftCommercialUse] = useState(prompt.commercialUse);
  const [draftKeywords, setDraftKeywords] = useState(prompt.keywords.join(', '));

  const handleCopyPrompt = () => {
    onCopy(prompt.prompt, prompt.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyKeywords = () => {
    onCopy(prompt.keywords.join(', '), 'Keywords');
  };

  const handleSaveEdit = () => {
    const updated: PromptCardItem = {
      ...prompt,
      title: draftTitle,
      concept: draftConcept,
      prompt: draftPrompt,
      commercialUse: draftCommercialUse,
      keywords: draftKeywords.split(',').map(k => k.trim()).filter(Boolean),
    };
    onUpdate(updated);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraftTitle(prompt.title);
    setDraftConcept(prompt.concept);
    setDraftPrompt(prompt.prompt);
    setDraftCommercialUse(prompt.commercialUse);
    setDraftKeywords(prompt.keywords.join(', '));
    setIsEditing(false);
  };

  const qc = prompt.validationScore;
  const qcPassed = qc ? qc.overallPassed : true;

  return (
    <div
      id={`prompt-card-${prompt.id}`}
      className={`group rounded-2xl border transition-all duration-200 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs hover:shadow-md ${
        prompt.isFavorite
          ? 'border-orange-300 dark:border-orange-800/80 ring-1 ring-orange-500/20'
          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-zinc-50/80 dark:bg-zinc-950/40 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs">
            Prompt #{String(prompt.promptNumber || index + 1).padStart(2, '0')}
          </span>

          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/80">
            {prompt.assetType}
          </span>

          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {prompt.style}
          </span>

          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:inline">
            for {prompt.marketplace}
          </span>
        </div>

        {/* Quality Control badge */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowQcDetails(!showQcDetails)}
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-all ${
              qcPassed
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
            title="Quality control validation status"
          >
            {qcPassed ? (
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            ) : (
              <AlertCircle className="h-3 w-3 text-amber-500" />
            )}
            <span className="hidden xs:inline">{qcPassed ? 'Marketplace Ready' : 'QC Notice'}</span>
          </button>
        </div>
      </div>

      {/* QC Expandable Details */}
      {showQcDetails && qc && (
        <div className="px-4 py-2.5 bg-zinc-100/80 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1 flex items-center justify-between">
            <span>Quality Control Assessment:</span>
            <span className="text-[10px] font-normal text-zinc-500">7 Marketplace Rules</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <span className={qc.commerciallyUseful ? 'text-emerald-500' : 'text-rose-500'}>●</span>
              <span>Commercial Utility: {qc.commerciallyUseful ? 'High' : 'Low'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={qc.distinctConcept ? 'text-emerald-500' : 'text-amber-500'}>●</span>
              <span>Conceptual Novelty: {qc.distinctConcept ? 'Unique' : 'Shared'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={qc.marketplaceCompliant ? 'text-emerald-500' : 'text-rose-500'}>●</span>
              <span>Marketplace Compliance: {qc.marketplaceCompliant ? 'Passed' : 'Review'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={qc.freeOfBannedElements ? 'text-emerald-500' : 'text-rose-500'}>●</span>
              <span>Zero Banned Elements: {qc.freeOfBannedElements ? 'Clean' : 'Detected'}</span>
            </div>
          </div>
          {qc.qualityNotes && (
            <p className="mt-1.5 text-[11px] italic text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-1">
              Note: {qc.qualityNotes}
            </p>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 space-y-3.5">
        {isEditing ? (
          /* Inline Edit Form */
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Title</label>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full mt-1 p-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Concept</label>
              <input
                type="text"
                value={draftConcept}
                onChange={(e) => setDraftConcept(e.target.value)}
                className="w-full mt-1 p-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">AI Prompt</label>
              <textarea
                rows={3}
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                className="w-full mt-1 p-2 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Commercial Use</label>
              <input
                type="text"
                value={draftCommercialUse}
                onChange={(e) => setDraftCommercialUse(e.target.value)}
                className="w-full mt-1 p-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Keywords (comma separated)</label>
              <input
                type="text"
                value={draftKeywords}
                onChange={(e) => setDraftKeywords(e.target.value)}
                className="w-full mt-1 p-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-500 text-white shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          /* Normal Display Mode */
          <>
            {/* Title & Concept */}
            <div>
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white leading-snug">
                {prompt.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Concept: </span>
                {prompt.concept}
              </p>
            </div>

            {/* AI Prompt Box */}
            <div className="relative group/box rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800/90 p-3.5 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Generation Prompt
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {prompt.prompt.length} chars • {prompt.prompt.split(/\s+/).length} words
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-mono text-zinc-800 dark:text-zinc-200 leading-relaxed select-all break-words">
                {prompt.prompt}
              </p>
            </div>

            {/* Commercial Use */}
            <div className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <Briefcase className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Commercial Use: </span>
                <span>{prompt.commercialUse}</span>
              </div>
            </div>

            {/* Stock Keywords */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  <Tag className="h-3 w-3" />
                  <span>Stock Keywords ({prompt.keywords.length})</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyKeywords}
                  className="text-[10px] font-medium text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Copy Tags
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {prompt.keywords.map((kw, i) => (
                  <span
                    key={i}
                    onClick={() => onCopy(kw, `Keyword "${kw}"`)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors"
                    title="Click to copy keyword"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="px-4 py-2.5 bg-zinc-50/60 dark:bg-zinc-950/40 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-2 flex-wrap text-xs">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id={`btn-copy-prompt-${prompt.id}`}
            type="button"
            onClick={handleCopyPrompt}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-xs'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
          </button>

          <button
            id={`btn-regen-prompt-${prompt.id}`}
            type="button"
            disabled={isRegenerating}
            onClick={() => onRegenerate(prompt)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 transition-colors disabled:opacity-50"
            title="Regenerate this specific concept with AI"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin text-orange-500' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <button
            id={`btn-edit-prompt-${prompt.id}`}
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 transition-colors"
            title="Edit prompt details"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            id={`btn-save-prompt-${prompt.id}`}
            type="button"
            onClick={() => onSave(prompt)}
            className={`p-1.5 rounded-lg border transition-colors ${
              prompt.isFavorite
                ? 'bg-orange-100 border-orange-300 text-orange-600 dark:bg-orange-950/60 dark:border-orange-800 dark:text-orange-400'
                : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
            }`}
            title={prompt.isFavorite ? 'Saved to Favorites' : 'Save / Favorite prompt'}
          >
            <Bookmark className={`h-3.5 w-3.5 ${prompt.isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            id={`btn-delete-prompt-${prompt.id}`}
            type="button"
            onClick={() => onDelete(prompt.id)}
            className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800 transition-colors"
            title="Remove prompt from list"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right Action: Send to Metadata Generator */}
        <button
          id={`btn-send-meta-${prompt.id}`}
          type="button"
          onClick={() => onSendToMetadata(prompt)}
          className="flex items-center gap-1 text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline ml-auto"
        >
          <span>Metadata Gen</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
