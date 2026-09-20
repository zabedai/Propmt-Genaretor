import React from 'react';
import { UserSettings, DEFAULT_SETTINGS } from '../types/settings';
import { ASSET_TYPES, MARKETPLACES, PROMPT_COUNT_OPTIONS } from '../services/promptBuilder';
import { AssetType, Marketplace } from '../types/prompt';
import { X, Settings, ShieldCheck, Sun, Moon, RotateCcw, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handleChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    onSaveSettings({ ...settings, [key]: value });
  };

  const handleResetDefaults = () => {
    onSaveSettings(DEFAULT_SETTINGS);
    onShowToast('Settings reset to defaults');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white">
                Studio Preferences
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Custom default configurations saved locally.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {/* Default Asset Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">
              Default Asset Type
            </label>
            <select
              value={settings.defaultAssetType}
              onChange={(e) => handleChange('defaultAssetType', e.target.value as AssetType)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-orange-500"
            >
              {ASSET_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} ({t.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Default Marketplace */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">
              Default Target Marketplace
            </label>
            <select
              value={settings.defaultMarketplace}
              onChange={(e) => handleChange('defaultMarketplace', e.target.value as Marketplace)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-orange-500"
            >
              {MARKETPLACES.map((mp) => (
                <option key={mp} value={mp}>
                  {mp}
                </option>
              ))}
            </select>
          </div>

          {/* Default Prompt Count */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">
              Default Batch Prompt Count
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PROMPT_COUNT_OPTIONS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleChange('defaultPromptCount', count)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    settings.defaultPromptCount === count
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {count} Prompts
                </button>
              ))}
            </div>
          </div>

          {/* Theme setting */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">
              Interface Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleChange('theme', 'light')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold ${
                  settings.theme === 'light'
                    ? 'bg-orange-50 border-orange-500 text-orange-700'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Light Theme</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange('theme', 'dark')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold ${
                  settings.theme === 'dark'
                    ? 'bg-orange-950/60 border-orange-500 text-orange-300'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          {/* Strict Quality Check toggle */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-zinc-800 dark:text-zinc-200">
                Quality Control Validation Engine
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Automatically verify conceptual novelty and flag banned elements (logos, text, heavy gradients).
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.strictQualityCheck}
              onChange={(e) => handleChange('strictQualityCheck', e.target.checked)}
              className="h-4 w-4 accent-orange-500 rounded cursor-pointer"
            />
          </div>

          {/* Auto Copy Toggle */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-zinc-800 dark:text-zinc-200">
                Auto-Copy Single Prompts on Click
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                One-click instant clipboard copy with confirmation toast.
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoCopyOnGenerate}
              onChange={(e) => handleChange('autoCopyOnGenerate', e.target.checked)}
              className="h-4 w-4 accent-orange-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
