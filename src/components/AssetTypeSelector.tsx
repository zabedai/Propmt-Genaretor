import React from 'react';
import { Layers, Image as ImageIcon, Sparkles, Grid, Palette, Layout } from 'lucide-react';
import { AssetType } from '../types/prompt';
import { ASSET_TYPES } from '../services/promptBuilder';

interface AssetTypeSelectorProps {
  selectedAssetType: AssetType;
  onSelectAssetType: (type: AssetType) => void;
}

const ICONS_MAP: Record<AssetType, React.ReactNode> = {
  Vector: <Layers className="h-4 w-4" />,
  JPG: <ImageIcon className="h-4 w-4" />,
  PNG: <Sparkles className="h-4 w-4" />,
  'Icon Pack': <Grid className="h-4 w-4" />,
  Illustration: <Palette className="h-4 w-4" />,
  Background: <Layout className="h-4 w-4" />,
};

export const AssetTypeSelector: React.FC<AssetTypeSelectorProps> = ({
  selectedAssetType,
  onSelectAssetType,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          2. Asset Type
        </label>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          Output media format
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ASSET_TYPES.map((type) => {
          const isSelected = selectedAssetType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              id={`asset-type-${type.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectAssetType(type.id)}
              className={`p-3 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-500 text-zinc-900 dark:text-white shadow-xs ring-1 ring-orange-500/50'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span
                  className={`p-1.5 rounded-lg ${
                    isSelected
                      ? 'bg-orange-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {ICONS_MAP[type.id]}
                </span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-orange-200/70 dark:bg-orange-900/60 text-orange-900 dark:text-orange-200'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {type.badge}
                </span>
              </div>
              <div>
                <div className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-white">
                  {type.label}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 line-clamp-1">
                  {type.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
