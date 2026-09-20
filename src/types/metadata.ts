import { Marketplace } from './prompt';

export interface MetadataItem {
  id: string;
  promptId?: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  contentType: string;
  commercialType: 'Commercial' | 'Editorial';
  targetMarketplace: Marketplace;
  generatedAt: string;
}

export interface MetadataGenerationRequest {
  promptText: string;
  title?: string;
  concept?: string;
  assetType?: string;
  targetMarketplace: Marketplace;
  requestedKeywordCount?: number; // default 35-50
}
