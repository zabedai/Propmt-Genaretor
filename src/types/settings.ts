import { AssetType, Marketplace } from './prompt';

export interface UserSettings {
  defaultAssetType: AssetType;
  defaultMarketplace: Marketplace;
  defaultPromptCount: number;
  theme: 'dark' | 'light';
  autoCopyOnGenerate: boolean;
  strictQualityCheck: boolean;
  includeKeywordsInCopy: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  defaultAssetType: 'Vector',
  defaultMarketplace: 'Adobe Stock',
  defaultPromptCount: 10,
  theme: 'dark',
  autoCopyOnGenerate: false,
  strictQualityCheck: true,
  includeKeywordsInCopy: true,
};
