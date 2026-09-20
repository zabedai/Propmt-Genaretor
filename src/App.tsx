import React, { useState, useEffect } from 'react';
import {
  AssetType,
  Marketplace,
  PromptCardItem,
} from './types/prompt';
import { UserSettings, DEFAULT_SETTINGS } from './types/settings';
import { getSettings, saveSettings, savePrompt, getSavedPrompts } from './utils/storage';
import { generatePromptsAPI, regenerateSinglePromptAPI } from './services/geminiService';
import { Header } from './components/Header';
import { PromptGenerator } from './components/PromptGenerator';
import { MetadataGenerator } from './components/MetadataGenerator';
import { PromptLibrary } from './components/PromptLibrary';
import { SettingsModal } from './components/SettingsModal';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function App() {
  // Settings & Theme
  const [settings, setSettings] = useState<UserSettings>(() => getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'studio' | 'metadata' | 'library'>('studio');

  // Studio configuration states
  const [topic, setTopic] = useState('AI Cybersecurity');
  const [assetType, setAssetType] = useState<AssetType>(settings.defaultAssetType || 'Vector');
  const [style, setStyle] = useState('Minimal');
  const [stockRequirements, setStockRequirements] = useState<string[]>([
    'Commercial Use',
    'High Demand Concept',
    'Unique Concept',
    'No Duplicate Ideas',
    'Clean Composition',
    'Marketplace Friendly',
    'Editable Vector',
    'Low Path',
    'Isolated',
    'White Background',
    'No Text',
    'No Logo',
    'No Watermark',
    'No Mockup',
    'No Gradient',
    'No Shadow',
  ]);
  const [numberOfPrompts, setNumberOfPrompts] = useState<number>(settings.defaultPromptCount || 10);
  const [targetMarketplace, setTargetMarketplace] = useState<Marketplace>(settings.defaultMarketplace || 'Adobe Stock');

  // Generated Prompts state
  const [prompts, setPrompts] = useState<PromptCardItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // For piping prompt into Metadata tab
  const [selectedForMetadata, setSelectedForMetadata] = useState<PromptCardItem | null>(null);

  // Saved prompt count in library
  const [savedCount, setSavedCount] = useState(0);

  // Toast notification system
  const [toast, setToast] = useState<{ id: number; message: string; type?: 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'info' | 'error' = 'info') => {
    setToast({ id: Date.now(), message, type });
  };

  // Sync theme to root DOM
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveSettings(settings);
  }, [settings]);

  // Update saved count from storage
  useEffect(() => {
    setSavedCount(getSavedPrompts().length);
  }, [prompts, activeTab]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  // Handler: Generate batch of prompts
  const handleGeneratePrompts = async () => {
    if (!topic.trim()) {
      showToast('Please enter a topic or niche first', 'error');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const generated = await generatePromptsAPI({
        topic: topic.trim(),
        assetType,
        style,
        stockRequirements,
        numberOfPrompts,
        targetMarketplace,
      });

      setPrompts(generated);
      showToast(`Generated ${generated.length} distinct commercial prompts!`);

      // Auto-copy first prompt if user has setting enabled
      if (settings.autoCopyOnGenerate && generated.length > 0) {
        navigator.clipboard.writeText(generated[0].prompt);
        showToast(`Auto-copied prompt #01`);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.message || 'Failed to generate stock prompts with Gemini AI';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Regenerate a single prompt card with AI
  const handleRegenerateSingle = async (promptItem: PromptCardItem) => {
    setRegeneratingId(promptItem.id);
    try {
      const existingConcepts = prompts.filter(p => p.id !== promptItem.id).map(p => p.concept);
      const newPromptData = await regenerateSinglePromptAPI({
        topic,
        assetType,
        style,
        targetMarketplace,
        stockRequirements,
        existingConcepts,
      });

      const updated: PromptCardItem = {
        ...promptItem,
        title: newPromptData.title || promptItem.title,
        concept: newPromptData.concept || promptItem.concept,
        prompt: newPromptData.prompt || promptItem.prompt,
        commercialUse: newPromptData.commercialUse || promptItem.commercialUse,
        keywords: newPromptData.keywords || promptItem.keywords,
      };

      setPrompts(prev => prev.map(p => (p.id === promptItem.id ? updated : p)));
      showToast(`Regenerated prompt #${promptItem.promptNumber}`);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to regenerate single prompt', 'error');
    } finally {
      setRegeneratingId(null);
    }
  };

  // Handler: Save prompt to library
  const handleSavePrompt = (promptItem: PromptCardItem) => {
    const updated = { ...promptItem, isFavorite: !promptItem.isFavorite };
    savePrompt(updated);
    setPrompts(prev => prev.map(p => (p.id === promptItem.id ? updated : p)));
    setSavedCount(getSavedPrompts().length);
    showToast(updated.isFavorite ? 'Prompt saved to Library!' : 'Prompt unfavorited');
  };

  // Handler: Send prompt to Metadata Generator tab
  const handleSendToMetadata = (promptItem: PromptCardItem) => {
    setSelectedForMetadata(promptItem);
    setActiveTab('metadata');
    showToast(`Loaded "${promptItem.title}" into Metadata Generator`);
  };

  // Handler: Start fresh project
  const handleNewProject = () => {
    if (prompts.length > 0 && !window.confirm('Start a new project? Any unsaved generated prompts in current view will be cleared.')) {
      return;
    }
    setTopic('');
    setPrompts([]);
    setErrorMessage(null);
    showToast('Started new project');
  };

  // Handler: Load project from library back to studio
  const handleLoadProjectToStudio = (loadedPrompts: PromptCardItem[], projectTopic: string) => {
    setTopic(projectTopic);
    setPrompts(loadedPrompts);
    if (loadedPrompts.length > 0) {
      setAssetType(loadedPrompts[0].assetType);
      setStyle(loadedPrompts[0].style);
      setTargetMarketplace(loadedPrompts[0].marketplace);
    }
    setActiveTab('studio');
    showToast(`Loaded ${loadedPrompts.length} prompts into Studio!`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors selection:bg-orange-500 selection:text-white">
      {/* Persistent Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewProject={handleNewProject}
        onOpenSettings={() => setIsSettingsOpen(true)}
        savedCount={savedCount}
        theme={settings.theme}
        onToggleTheme={() =>
          setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))
        }
      />

      {/* Global Error Banner if API error occurs */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-start justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Generation Issue: </strong>
                <span>{errorMessage}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main>
        {activeTab === 'studio' && (
          <PromptGenerator
            topic={topic}
            setTopic={setTopic}
            assetType={assetType}
            setAssetType={setAssetType}
            style={style}
            setStyle={setStyle}
            stockRequirements={stockRequirements}
            setStockRequirements={setStockRequirements}
            numberOfPrompts={numberOfPrompts}
            setNumberOfPrompts={setNumberOfPrompts}
            targetMarketplace={targetMarketplace}
            setTargetMarketplace={setTargetMarketplace}
            prompts={prompts}
            setPrompts={setPrompts}
            isGenerating={isGenerating}
            onGenerate={handleGeneratePrompts}
            onRegenerateSingle={handleRegenerateSingle}
            onSavePrompt={handleSavePrompt}
            onSendToMetadata={handleSendToMetadata}
            regeneratingId={regeneratingId}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'metadata' && (
          <MetadataGenerator
            initialPrompt={selectedForMetadata}
            availablePrompts={prompts}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'library' && (
          <PromptLibrary
            onLoadProjectToStudio={handleLoadProjectToStudio}
            onSendToMetadata={handleSendToMetadata}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onShowToast={showToast}
      />

      {/* Notification Toast */}
      {toast && (
        <div
          id="app-toast"
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs sm:text-sm font-semibold transition-all transform animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-700 dark:border-zinc-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
