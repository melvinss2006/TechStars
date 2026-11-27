import React, { useRef } from 'react';
import { 
  ArrowLeftRight, 
  Save, 
  Download, 
  Upload, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { PRESET_LAYOUTS } from '../constants/presets';

export default function TopHeader({
  onLoadPreset,
  onSaveSnapshot,
  onOpenCompare,
  onExportJSON,
  onImportJSON,
  savedVersionsCount = 0
}) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        onImportJSON(parsed);
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-16 bg-white dark:bg-space-900 border-b border-slate-200/80 dark:border-space-800 px-6 flex items-center justify-between select-none z-30 transition-colors duration-200">
      {/* Title & Live Status */}
      <div className="flex flex-col">
        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          MISSION DESIGN SYSTEM
        </span>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
            Habitat Planner
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#dcfce7] text-[#15803d] dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE ANALYSIS
          </span>
        </div>
      </div>

      {/* Right Actions (Matching reference image) */}
      <div className="flex items-center gap-3">
        {/* Architecture Template Selector */}
        <div className="hidden md:block">
          <select
            onChange={(e) => {
              const preset = PRESET_LAYOUTS.find(p => p.id === e.target.value);
              if (preset) onLoadPreset(preset);
            }}
            defaultValue=""
            className="bg-slate-100 dark:bg-space-850 hover:bg-slate-200 dark:hover:bg-space-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-1.5 border border-slate-200 dark:border-space-700/80 focus:outline-none focus:border-emerald-500 font-mono transition cursor-pointer"
          >
            <option value="" disabled>Load Template...</option>
            {PRESET_LAYOUTS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Compare Layouts Button (Blueish-gray pill in reference) */}
        <button
          onClick={onOpenCompare}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-space-850 dark:hover:bg-space-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-space-700 flex items-center gap-1.5 transition shadow-2xs relative"
          title="Compare layouts side-by-side"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Compare layouts</span>
          {savedVersionsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
              {savedVersionsCount}
            </span>
          )}
        </button>

        {/* Save Layout Button (Green pill in reference) */}
        <button
          onClick={onSaveSnapshot}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center gap-1.5 transition shadow-sm hover:shadow-md active:scale-95"
          title="Save layout snapshot"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save layout</span>
        </button>

        {/* Export JSON (Discreet) */}
        <button
          onClick={onExportJSON}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-space-850 dark:hover:bg-space-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-space-700 transition"
          title="Export JSON"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Import JSON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-space-850 dark:hover:bg-space-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-space-700 transition"
          title="Import JSON"
        >
          <Upload className="w-3.5 h-3.5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json"
          className="hidden"
        />

        {/* User Avatar Circle (Melvin S - MS or AK in reference) */}
        <div className="w-8 h-8 rounded-full bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-xs font-black font-mono flex items-center justify-center shadow-2xs" title="Melvin S (TechStars Team Leader)">
          MS
        </div>
      </div>
    </header>
  );
}
