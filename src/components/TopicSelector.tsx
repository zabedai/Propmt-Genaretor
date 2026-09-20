import React from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { QUICK_TOPICS } from '../services/promptBuilder';

interface TopicSelectorProps {
  topic: string;
  setTopic: (topic: string) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ topic, setTopic }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="topic-input" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          1. Topic / Niche
        </label>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          Commercial concept target
        </span>
      </div>

      {/* Large Input with Icon & Clear button */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-orange-500 transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <input
          id="topic-input"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your topic or niche (e.g. AI Cybersecurity, Healthcare, Finance)..."
          className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm sm:text-base font-medium text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all shadow-xs"
        />
        {topic && (
          <button
            id="clear-topic-btn"
            type="button"
            onClick={() => setTopic('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Quick topic buttons */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          <Sparkles className="h-3 w-3 text-orange-500" />
          <span>Quick Topic Presets</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TOPICS.map((item) => {
            const isSelected = topic.toLowerCase() === item.toLowerCase();
            return (
              <button
                key={item}
                type="button"
                id={`quick-topic-${item.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setTopic(item)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium border ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
