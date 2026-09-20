import React, { useState, useEffect } from 'react';
import { PromptCardItem, PromptProject } from '../types/prompt';
import {
  getSavedPrompts,
  removeSavedPrompt,
  toggleFavoritePrompt,
  savePrompt,
  getSavedProjects,
  deleteProject,
  exportToCSV,
  exportToTXT,
} from '../utils/storage';
import {
  Bookmark,
  Heart,
  Clock,
  Search,
  Trash2,
  Edit2,
  Copy,
  Check,
  Download,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Save,
  FileSpreadsheet,
} from 'lucide-react';

interface PromptLibraryProps {
  onLoadProjectToStudio: (prompts: PromptCardItem[], topic: string) => void;
  onSendToMetadata: (prompt: PromptCardItem) => void;
  onShowToast: (msg: string) => void;
}

export const PromptLibrary: React.FC<PromptLibraryProps> = ({
  onLoadProjectToStudio,
  onSendToMetadata,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'favorites' | 'projects'>('saved');
  const [savedPrompts, setSavedPrompts] = useState<PromptCardItem[]>([]);
  const [savedProjects, setSavedProjects] = useState<PromptProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = () => {
    setSavedPrompts(getSavedPrompts());
    setSavedProjects(getSavedProjects());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeletePrompt = (id: string) => {
    const updated = removeSavedPrompt(id);
    setSavedPrompts(updated);
    onShowToast('Prompt removed from Library');
  };

  const handleToggleFav = (id: string) => {
    const updated = toggleFavoritePrompt(id);
    setSavedPrompts(updated);
  };

  const handleStartRename = (prompt: PromptCardItem) => {
    setEditingId(prompt.id);
    setEditTitle(prompt.title);
  };

  const handleSaveRename = (prompt: PromptCardItem) => {
    const updated = { ...prompt, title: editTitle };
    const list = savePrompt(updated);
    setSavedPrompts(list);
    setEditingId(null);
    onShowToast('Prompt title updated');
  };

  const handleCopyPrompt = (prompt: PromptCardItem) => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopiedId(prompt.id);
    onShowToast(`Copied prompt #${prompt.promptNumber}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteProject = (id: string) => {
    const updated = deleteProject(id);
    setSavedProjects(updated);
    onShowToast('Project deleted');
  };

  // Filtered prompts based on active tab and search
  const filteredPrompts = savedPrompts.filter((p) => {
    if (activeSubTab === 'favorites' && !p.isFavorite) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.concept.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q) ||
      p.prompt.toLowerCase().includes(q) ||
      p.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const filteredProjects = savedProjects.filter((proj) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      proj.name.toLowerCase().includes(q) ||
      proj.topic.toLowerCase().includes(q) ||
      proj.assetType.toLowerCase().includes(q)
    );
  });

  const handleExportAllSavedCSV = () => {
    if (savedPrompts.length === 0) return;
    exportToCSV(savedPrompts, 'my_saved_stock_prompts.csv');
    onShowToast('Exported CSV of saved prompts');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Bookmark className="h-6 w-6 text-emerald-500" />
            Prompt Library & Saved Assets
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage your saved commercial stock prompts, favorite collections, and generated project batches.
          </p>
        </div>

        {savedPrompts.length > 0 && (
          <button
            type="button"
            onClick={handleExportAllSavedCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 shadow-xs self-start sm:self-auto"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            <span>Export Library CSV</span>
          </button>
        )}
      </div>

      {/* Sub Tabs & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tabs: Saved Prompts / Favorites / Recent Projects */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 w-fit">
          <button
            type="button"
            onClick={() => setActiveSubTab('saved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'saved'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 text-emerald-500" />
            <span>Saved Prompts ({savedPrompts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('favorites')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'favorites'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span>Favorites ({savedPrompts.filter((p) => p.isFavorite).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'projects'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-orange-500" />
            <span>Saved Projects ({savedProjects.length})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search saved prompts or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'projects' ? (
        /* SAVED PROJECTS VIEW */
        <div className="space-y-3">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                        {proj.assetType}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(proj.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white line-clamp-1">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Topic: <strong className="text-zinc-700 dark:text-zinc-300">{proj.topic}</strong> • {proj.prompts.length} Prompts • {proj.marketplace}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3 text-xs">
                    <button
                      type="button"
                      onClick={() => onLoadProjectToStudio(proj.prompts, proj.topic)}
                      className="flex items-center gap-1 font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                      <span>Open in Studio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-1 text-zinc-400 hover:text-rose-600"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center text-zinc-400 text-xs space-y-2">
              <Clock className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-700" />
              <p>No saved projects yet. Generate prompts in Studio and click "Save Project" to store batches here.</p>
            </div>
          )}
        </div>
      ) : (
        /* SAVED OR FAVORITE PROMPTS VIEW */
        <div className="space-y-4">
          {filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrompts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                          {p.assetType}
                        </span>
                        <span className="text-[11px] text-zinc-400">{p.style}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleFav(p.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.isFavorite
                              ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                              : 'text-zinc-400 hover:text-zinc-600'
                          }`}
                          title="Toggle favorite"
                        >
                          <Heart className={`h-4 w-4 ${p.isFavorite ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePrompt(p.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg"
                          title="Remove from library"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title with Rename support */}
                    {editingId === p.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 p-1 text-xs rounded border border-zinc-300 dark:border-zinc-700 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(p)}
                          className="p-1 bg-emerald-500 text-white rounded"
                        >
                          <Save className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group/title">
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{p.title}</h3>
                        <button
                          type="button"
                          onClick={() => handleStartRename(p)}
                          className="opacity-0 group-hover/title:opacity-100 p-1 text-zinc-400 hover:text-zinc-600"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {p.concept}
                    </p>

                    {/* Prompt snippet */}
                    <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-300 line-clamp-3">
                      {p.prompt}
                    </div>

                    {/* Keywords preview */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {p.keywords.slice(0, 8).map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {kw}
                        </span>
                      ))}
                      {p.keywords.length > 8 && (
                        <span className="text-[10px] text-zinc-400 self-center">
                          +{p.keywords.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3 text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(p)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold"
                    >
                      {copiedId === p.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedId === p.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSendToMetadata(p)}
                      className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      <span>Create Metadata</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center text-zinc-400 text-xs space-y-2">
              <Bookmark className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-700" />
              <p>
                {activeSubTab === 'favorites'
                  ? 'No favorite prompts saved yet. Click the bookmark or heart icon on any prompt card in the studio.'
                  : 'No saved prompts found. Use the bookmark icon on any prompt to save it permanently.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
