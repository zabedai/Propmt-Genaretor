import React from 'react';
import { Marketplace, AssetType } from '../types/prompt';
import { STOCK_REQUIREMENTS, PROMPT_COUNT_OPTIONS, MARKETPLACES } from '../services/promptBuilder';
import { CheckSquare, ShieldCheck, Check, Globe } from 'lucide-react';

interface StockOptionsProps {
  stockRequirements: string[];
  setStockRequirements: (reqs: string[]) => void;
  numberOfPrompts: number;
  setNumberOfPrompts: (count: number) => void;
  targetMarketplace: Marketplace;
  setTargetMarketplace: (mp: Marketplace) => void;
  assetType: AssetType;
}

export const StockOptions: React.FC<StockOptionsProps> = ({
  stockRequirements,
  setStockRequirements,
  numberOfPrompts,
  setNumberOfPrompts,
  targetMarketplace,
  setTargetMarketplace,
  assetType,
}) => {
  const toggleRequirement = (label: string) => {
    if (stockRequirements.includes(label)) {
      setStockRequirements(stockRequirements.filter(r => r !== label));
    } else {
      setStockRequirements([...stockRequirements, label]);
    }
  };

  const handleSelectAll = () => {
    setStockRequirements(STOCK_REQUIREMENTS.map(r => r.label));
  };

  const handleClearAll = () => {
    setStockRequirements([]);
  };

  const handleApplyPreset = () => {
    if (assetType === 'Vector' || assetType === 'Icon Pack') {
      setStockRequirements([
        'Commercial Use',
        'High Demand Concept',
        'Unique Concept',
        'No Duplicate Ideas',
        'Clean Composition',
        'Marketplace Friendly',
        'Editable Vector',
        'Low Path',
        'Isolated',
        'White Background',
        'No Text',
        'No Logo',
        'No Watermark',
        'No Mockup',
        'No Gradient',
        'No Shadow',
      ]);
    } else {
      // Photo / JPG preset
      setStockRequirements([
        'Commercial Use',
        'High Demand Concept',
        'Unique Concept',
        'No Duplicate Ideas',
        'Clean Composition',
        'Marketplace Friendly',
        'No Text',
        'No Logo',
        'No Watermark',
        'No Mockup',
      ]);
    }
  };

  return (
    <div className="space-y-5">
      {/* 4. Stock Requirements */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              4. Stock Requirements
            </label>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {stockRequirements.length}/{STOCK_REQUIREMENTS.length} Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              type="button"
              id="req-preset-btn"
              onClick={handleApplyPreset}
              className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
            >
              Recommended
            </button>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <button
              type="button"
              id="req-select-all-btn"
              onClick={handleSelectAll}
              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              All
            </button>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <button
              type="button"
              id="req-clear-all-btn"
              onClick={handleClearAll}
              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Checkbox Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-1 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40">
          {STOCK_REQUIREMENTS.map((req) => {
            const isChecked = stockRequirements.includes(req.label);
            return (
              <label
                key={req.id}
                id={`req-label-${req.id}`}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-medium transition-all select-none ${
                  isChecked
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs border border-zinc-200 dark:border-zinc-700'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  id={`req-checkbox-${req.id}`}
                  checked={isChecked}
                  onChange={() => toggleRequirement(req.label)}
                  className="sr-only"
                />
                <div
                  className={`h-3.5 w-3.5 rounded flex items-center justify-center shrink-0 border transition-all ${
                    isChecked
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                  }`}
                >
                  {isChecked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                </div>
                <span className="truncate">{req.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Number of Prompts & 6. Target Marketplace */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Number of prompts */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span>5. Number of Prompts</span>
            <span className="text-[11px] font-normal text-zinc-400">Batch size</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {PROMPT_COUNT_OPTIONS.map((count) => {
              const isSelected = numberOfPrompts === count;
              return (
                <button
                  key={count}
                  type="button"
                  id={`prompt-count-${count}`}
                  onClick={() => setNumberOfPrompts(count)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target marketplace */}
        <div className="space-y-2">
          <label htmlFor="marketplace-select" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span>6. Target Marketplace</span>
            <span className="text-[11px] font-normal text-zinc-400 flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Guidelines
            </span>
          </label>
          <div className="relative">
            <select
              id="marketplace-select"
              value={targetMarketplace}
              onChange={(e) => setTargetMarketplace(e.target.value as Marketplace)}
              className="w-full py-2.5 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-xs cursor-pointer"
            >
              {MARKETPLACES.map((mp) => (
                <option key={mp} value={mp}>
                  {mp}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
