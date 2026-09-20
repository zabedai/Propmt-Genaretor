import { PromptCardItem, PromptGenerationRequest } from '../types/prompt';
import { validateBatch } from '../utils/validation';

export async function generatePromptsAPI(request: PromptGenerationRequest): Promise<PromptCardItem[]> {
  const response = await fetch('/api/generate-prompts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  const rawPrompts = data.prompts || [];

  // Run our client-side validation engine to evaluate quality and assign QC scores
  const validated = validateBatch(rawPrompts);
  return validated;
}

export async function regenerateSinglePromptAPI(params: {
  topic: string;
  assetType: string;
  style: string;
  targetMarketplace: string;
  stockRequirements: string[];
  existingConcepts: string[];
}): Promise<Partial<PromptCardItem>> {
  const response = await fetch('/api/regenerate-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Regeneration failed' }));
    throw new Error(errorData.error || 'Failed to regenerate prompt');
  }

  const data = await response.json();
  return data.prompt;
}
