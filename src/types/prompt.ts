export type AssetType = 'Vector' | 'JPG' | 'PNG' | 'Icon Pack' | 'Illustration' | 'Background';

export type VectorStyle =
  | 'Black & White'
  | 'Monochrome'
  | 'Outline'
  | 'Solid'
  | 'Minimal'
  | 'Flat'
  | 'Monoline'
  | 'Low Path'
  | 'Geometric'
  | 'Silhouette';

export type JpgStyle =
  | 'Photorealistic'
  | 'Commercial Advertising'
  | 'Premium 3D'
  | 'Abstract'
  | 'Minimal'
  | 'Futuristic'
  | 'Corporate'
  | 'Lifestyle'
  | 'Background'
  | 'Copy Space';

export type Marketplace =
  | 'Adobe Stock'
  | 'Shutterstock'
  | 'Vecteezy'
  | 'Freepik'
  | 'iStock'
  | 'Dreamstime'
  | 'Generic Stock';

export interface ValidationScore {
  commerciallyUseful: boolean;
  distinctConcept: boolean;
  marketplaceCompliant: boolean;
  freeOfBannedElements: boolean;
  lowPathOrClean: boolean;
  overallPassed: boolean;
  qualityNotes?: string;
}

export interface PromptCardItem {
  id: string;
  promptNumber: number;
  title: string;
  concept: string;
  prompt: string;
  assetType: AssetType;
  style: string;
  commercialUse: string;
  keywords: string[];
  createdAt: string;
  isFavorite?: boolean;
  topic: string;
  marketplace: Marketplace;
  validationScore?: ValidationScore;
}

export interface PromptGenerationRequest {
  topic: string;
  assetType: AssetType;
  style: string;
  stockRequirements: string[];
  numberOfPrompts: number;
  targetMarketplace: Marketplace;
}

export interface PromptProject {
  id: string;
  name: string;
  topic: string;
  assetType: AssetType;
  style: string;
  marketplace: Marketplace;
  prompts: PromptCardItem[];
  createdAt: string;
  updatedAt: string;
}
