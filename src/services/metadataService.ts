import { MetadataItem, MetadataGenerationRequest } from '../types/metadata';

export async function generateMetadataAPI(request: MetadataGenerationRequest): Promise<MetadataItem> {
  const response = await fetch('/api/generate-metadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to generate metadata' }));
    throw new Error(errorData.error || `Metadata generation failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.metadata;
}
