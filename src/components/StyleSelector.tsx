import React from 'react';
import { AssetType } from '../types/prompt';
import { getStylesForAssetType } from '../services/promptBuilder';
import { Sliders } from 'lucide-react';

interface StyleSelectorProps {
  assetType: AssetType;
  selectedStyle: string;
  onSelectStyle: (style: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  assetType,
  selectedStyle,
  onSelectStyle,
}) => {
  const styles = getStylesForAssetType(assetType);
  const isVector = assetType === 'Vector' || assetType === 'Icon Pack';

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          3. Design Style
        </label>
        <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
          <Sliders className="h-3 w-3" />
          {isVector ? 'Vector Aesthetic' : 'Visual Treatment'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {styles.map((style) => {
          const isSelected = selectedStyle === style;
          return (
            <button
              key={style}
              type="button"
              id={`style-btn-${style.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onSelectStyle(style)}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium border transition-all text-center truncate ${
                isSelected
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              }`}
              title={style}
            >
              {style}
            </button>
          );
        })}
      </div>
    </div>
  );
};
