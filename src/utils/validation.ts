import { PromptCardItem, ValidationScore } from '../types/prompt';

/**
 * Quality Control & Commercial Validation Engine
 * Validates generated prompts against marketplace stock requirements:
 * 1. Commercial utility
 * 2. Uniqueness & conceptual diversity
 * 3. Marketplace compliance
 * 4. Style & asset alignment
 * 5. Free from banned elements (logos, watermarks, arbitrary text)
 * 6. Vector path complexity check
 */

const BANNED_PATTERNS = [
  /\bwatermark\b/i,
  /\bstock photo watermark\b/i,
  /\bshutterstock logo\b/i,
  /\badobe stock logo\b/i,
  /\bgetty images\b/i,
  /\bbrand logo\b/i,
  /\bcopyright\b/i,
  /\btrademark\b/i,
  /\bip\b/i,
  /\bwith logo\b/i,
  /\bfeaturing text\b/i,
];

const VECTOR_BANNED_FOR_CLEAN = [
  /\bheavy gradient\b/i,
  /\bcomplex 3d shading\b/i,
  /\bnoisy texture\b/i,
  /\bphotorealistic depth\b/i,
];

export function validatePromptItem(item: Partial<PromptCardItem>, existingConcepts: string[] = []): ValidationScore {
  const promptText = item.prompt || '';
  const conceptText = item.concept || '';
  const titleText = item.title || '';
  const combined = `${titleText} ${conceptText} ${promptText}`.toLowerCase();

  // 1. Prohibited elements check
  let freeOfBanned = true;
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(combined)) {
      // If it says "no watermark" or "no logo", that is compliant.
      // But if it asks for a watermark or logo, it fails.
      const match = pattern.exec(combined)?.[0];
      if (match && !combined.includes(`no ${match}`) && !combined.includes(`without ${match}`)) {
        freeOfBanned = false;
        break;
      }
    }
  }

  // 2. Vector low-complexity check
  let lowPathOrClean = true;
  if (item.assetType === 'Vector' || item.assetType === 'Icon Pack') {
    for (const pattern of VECTOR_BANNED_FOR_CLEAN) {
      if (pattern.test(combined) && !combined.includes(`no ${pattern.source}`)) {
        lowPathOrClean = false;
        break;
      }
    }
  }

  // 3. Concept diversity vs already evaluated concepts
  const currentTokens = new Set(
    conceptText
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );

  let distinctConcept = true;
  for (const prev of existingConcepts) {
    const prevTokens = new Set(
      prev
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3)
    );

    if (currentTokens.size > 0 && prevTokens.size > 0) {
      let intersection = 0;
      for (const t of currentTokens) {
        if (prevTokens.has(t)) intersection++;
      }
      const jaccard = intersection / (currentTokens.size + prevTokens.size - intersection);
      if (jaccard > 0.65) {
        distinctConcept = false;
        break;
      }
    }
  }

  // 4. Commercial utility
  const hasCommercialUse = Boolean(item.commercialUse && item.commercialUse.length > 5);
  const commerciallyUseful = hasCommercialUse && Boolean(titleText && conceptText);

  // 5. Marketplace compliance
  const marketplaceCompliant = freeOfBanned && Boolean(item.keywords && item.keywords.length >= 5);

  const overallPassed = commerciallyUseful && distinctConcept && marketplaceCompliant && lowPathOrClean;

  const notes: string[] = [];
  if (!distinctConcept) notes.push('Concept is somewhat similar to another prompt');
  if (!freeOfBanned) notes.push('Contains ambiguous branding or watermark reference');
  if (!lowPathOrClean && (item.assetType === 'Vector')) notes.push('May have heavy gradients/textures for vector');
  if (item.keywords && item.keywords.length < 8) notes.push('Keywords are fewer than recommended (10-15 recommended)');

  return {
    commerciallyUseful,
    distinctConcept,
    marketplaceCompliant,
    freeOfBannedElements: freeOfBanned,
    lowPathOrClean,
    overallPassed,
    qualityNotes: notes.length > 0 ? notes.join('; ') : 'Passed all stock marketplace criteria',
  };
}

/**
 * Validates a batch of prompt items and assigns scores
 */
export function validateBatch(items: PromptCardItem[]): PromptCardItem[] {
  const evaluatedConcepts: string[] = [];

  return items.map((item, idx) => {
    const score = validatePromptItem(item, evaluatedConcepts);
    evaluatedConcepts.push(item.concept);
    return {
      ...item,
      promptNumber: idx + 1,
      validationScore: score,
    };
  });
}
