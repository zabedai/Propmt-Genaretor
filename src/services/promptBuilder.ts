import { AssetType, VectorStyle, JpgStyle, Marketplace } from '../types/prompt';

export const QUICK_TOPICS = [
  'AI Cybersecurity',
  'Business Finance',
  'Healthcare & Telemedicine',
  'E-commerce Logistics',
  'Digital Marketing & SEO',
  'Christmas & Holidays',
  'Halloween & Autumn',
  'Back to School & EdTech',
  'Green Clean Energy',
  'Smart City IoT',
  'Remote Work & Collaboration',
  'Fitness & Mental Wellness',
];

export const ASSET_TYPES: { id: AssetType; label: string; description: string; badge: string }[] = [
  { id: 'Vector', label: 'Vector', description: 'Clean SVG / EPS10 editable paths', badge: 'SVG / EPS' },
  { id: 'JPG', label: 'JPG', description: 'Photorealistic commercial stock images', badge: 'High-Res JPG' },
  { id: 'PNG', label: 'PNG', description: 'Isolated elements with alpha transparency', badge: 'Transparent' },
  { id: 'Icon Pack', label: 'Icon Pack', description: 'Cohesive multi-asset icon sets', badge: 'Symbol Grid' },
  { id: 'Illustration', label: 'Illustration', description: 'Artistic commercial editorial visuals', badge: 'Editorial' },
  { id: 'Background', label: 'Background', description: 'Negative space & banner layouts', badge: 'Copy Space' },
];

export const VECTOR_STYLES: VectorStyle[] = [
  'Black & White',
  'Monochrome',
  'Outline',
  'Solid',
  'Minimal',
  'Flat',
  'Monoline',
  'Low Path',
  'Geometric',
  'Silhouette',
];

export const JPG_STYLES: JpgStyle[] = [
  'Photorealistic',
  'Commercial Advertising',
  'Premium 3D',
  'Abstract',
  'Minimal',
  'Futuristic',
  'Corporate',
  'Lifestyle',
  'Background',
  'Copy Space',
];

export const STOCK_REQUIREMENTS = [
  { id: 'commercial_use', label: 'Commercial Use', defaultChecked: true },
  { id: 'high_demand', label: 'High Demand Concept', defaultChecked: true },
  { id: 'unique_concept', label: 'Unique Concept', defaultChecked: true },
  { id: 'no_duplicate', label: 'No Duplicate Ideas', defaultChecked: true },
  { id: 'clean_composition', label: 'Clean Composition', defaultChecked: true },
  { id: 'marketplace_friendly', label: 'Marketplace Friendly', defaultChecked: true },
  { id: 'editable_vector', label: 'Editable Vector', defaultChecked: true },
  { id: 'low_path', label: 'Low Path', defaultChecked: true },
  { id: 'isolated', label: 'Isolated', defaultChecked: true },
  { id: 'white_background', label: 'White Background', defaultChecked: true },
  { id: 'no_text', label: 'No Text', defaultChecked: true },
  { id: 'no_logo', label: 'No Logo', defaultChecked: true },
  { id: 'no_watermark', label: 'No Watermark', defaultChecked: true },
  { id: 'no_mockup', label: 'No Mockup', defaultChecked: true },
  { id: 'no_gradient', label: 'No Gradient', defaultChecked: true },
  { id: 'no_shadow', label: 'No Shadow', defaultChecked: true },
];

export const PROMPT_COUNT_OPTIONS = [10, 20, 30, 50];

export const MARKETPLACES: Marketplace[] = [
  'Adobe Stock',
  'Shutterstock',
  'Vecteezy',
  'Freepik',
  'iStock',
  'Dreamstime',
  'Generic Stock',
];

export function getStylesForAssetType(assetType: AssetType): string[] {
  if (assetType === 'Vector' || assetType === 'Icon Pack') {
    return VECTOR_STYLES;
  }
  return JPG_STYLES;
}
