import { PromptCardItem, PromptProject } from '../types/prompt';
import { MetadataItem } from '../types/metadata';
import { UserSettings, DEFAULT_SETTINGS } from '../types/settings';

const STORAGE_KEYS = {
  SAVED_PROMPTS: 'stock_studio_saved_prompts_v1',
  RECENT_PROJECTS: 'stock_studio_projects_v1',
  SETTINGS: 'stock_studio_settings_v1',
  METADATA_HISTORY: 'stock_studio_metadata_v1',
};

// Safe JSON parse helper
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing to localStorage key "${key}":`, e);
  }
}

// User Settings
export function getSettings(): UserSettings {
  return { ...DEFAULT_SETTINGS, ...safeGet<Partial<UserSettings>>(STORAGE_KEYS.SETTINGS, {}) };
}

export function saveSettings(settings: UserSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, settings);
}

// Saved Prompts
export function getSavedPrompts(): PromptCardItem[] {
  return safeGet<PromptCardItem[]>(STORAGE_KEYS.SAVED_PROMPTS, []);
}

export function savePrompt(prompt: PromptCardItem): PromptCardItem[] {
  const current = getSavedPrompts();
  const existingIdx = current.findIndex(p => p.id === prompt.id);
  let updated: PromptCardItem[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = prompt;
  } else {
    updated = [prompt, ...current];
  }
  safeSet(STORAGE_KEYS.SAVED_PROMPTS, updated);
  return updated;
}

export function removeSavedPrompt(id: string): PromptCardItem[] {
  const current = getSavedPrompts();
  const filtered = current.filter(p => p.id !== id);
  safeSet(STORAGE_KEYS.SAVED_PROMPTS, filtered);
  return filtered;
}

export function toggleFavoritePrompt(id: string): PromptCardItem[] {
  const current = getSavedPrompts();
  const updated = current.map(p => {
    if (p.id === id) {
      return { ...p, isFavorite: !p.isFavorite };
    }
    return p;
  });
  safeSet(STORAGE_KEYS.SAVED_PROMPTS, updated);
  return updated;
}

// Projects
export function getSavedProjects(): PromptProject[] {
  return safeGet<PromptProject[]>(STORAGE_KEYS.RECENT_PROJECTS, []);
}

export function saveProject(project: PromptProject): PromptProject[] {
  const current = getSavedProjects();
  const existingIdx = current.findIndex(p => p.id === project.id);
  let updated: PromptProject[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = project;
  } else {
    updated = [project, ...current];
  }
  // Keep last 30 projects
  if (updated.length > 30) updated = updated.slice(0, 30);
  safeSet(STORAGE_KEYS.RECENT_PROJECTS, updated);
  return updated;
}

export function deleteProject(id: string): PromptProject[] {
  const current = getSavedProjects();
  const filtered = current.filter(p => p.id !== id);
  safeSet(STORAGE_KEYS.RECENT_PROJECTS, filtered);
  return filtered;
}

// Metadata History
export function getSavedMetadata(): MetadataItem[] {
  return safeGet<MetadataItem[]>(STORAGE_KEYS.METADATA_HISTORY, []);
}

export function saveMetadataItem(item: MetadataItem): MetadataItem[] {
  const current = getSavedMetadata();
  const filtered = current.filter(m => m.id !== item.id);
  const updated = [item, ...filtered].slice(0, 50);
  safeSet(STORAGE_KEYS.METADATA_HISTORY, updated);
  return updated;
}

// Export Helpers
export function exportToCSV(prompts: PromptCardItem[], filename = 'stock_prompts.csv'): void {
  const headers = ['Prompt Number', 'Title', 'Concept', 'Asset Type', 'Style', 'Marketplace', 'Commercial Use', 'Keywords', 'Full Prompt'];
  const rows = prompts.map(p => [
    `#${String(p.promptNumber).padStart(2, '0')}`,
    `"${(p.title || '').replace(/"/g, '""')}"`,
    `"${(p.concept || '').replace(/"/g, '""')}"`,
    `"${p.assetType}"`,
    `"${p.style}"`,
    `"${p.marketplace}"`,
    `"${(p.commercialUse || '').replace(/"/g, '""')}"`,
    `"${(p.keywords || []).join(', ').replace(/"/g, '""')}"`,
    `"${(p.prompt || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportMetadataCSV(item: MetadataItem, filename = 'stock_asset_metadata.csv'): void {
  // Common format accepted by Adobe Stock / Shutterstock CSV template
  const headers = ['Filename', 'Title', 'Keywords', 'Category', 'Release', 'Commercial/Editorial'];
  const row = [
    `"asset_${Date.now()}"`,
    `"${(item.title || '').replace(/"/g, '""')}"`,
    `"${(item.keywords || []).join(', ').replace(/"/g, '""')}"`,
    `"${(item.category || '').replace(/"/g, '""')}"`,
    `"None"`,
    `"${item.commercialType}"`,
  ];

  const csvContent = [headers.join(','), row.join(',')].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportToTXT(content: string, filename = 'stock_prompts.txt'): void {
  downloadBlob(content, filename, 'text/plain;charset=utf-8;');
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
