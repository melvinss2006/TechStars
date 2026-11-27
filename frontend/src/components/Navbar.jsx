import React, { useRef } from 'react';
import { 
  Rocket, 
  Users, 
  Layers, 
  Save, 
  ArrowLeftRight, 
  Download, 
  Upload, 
  RotateCcw, 
  Footprints,
  ChevronDown
} from 'lucide-react';
import { MISSION_PROFILES } from '../constants/habitatRules';
import { PRESET_LAYOUTS } from '../constants/presets';

export default function Navbar({
  missionProfileId,
  onChangeMissionProfile,
  crewSize,
  onChangeCrewSize,
  onLoadPreset,
  showEvacRoutes,
  onToggleEvacRoutes,
  onSaveSnapshot,
  savedVersionsCount,
  onOpenCompare,
  onExportJSON,
  onImportJSON,
  onResetLayout
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
    <header className="h-16 bg-space-900 border-b border-space-800 px-4 flex items-center justify-between select-none z-40">
      {/* Brand & Project Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Rocket className="w-5 h-5 -rotate-45" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-mono">
              HABITAT LAYOUT CREATOR
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              SW-4
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-cyan-400/90 font-medium">TechStars</span>
            <span>•</span>
            <span>NASA-STD-3001 Decision-Support Engine</span>
          </div>
        </div>
      </div>

      {/* Center Controls: Mission Profile, Crew Size, Presets */}
      <div className="hidden lg:flex items-center space-x-3">
        {/* Preset Selector */}
        <div className="relative">
          <select
            onChange={(e) => {
              const preset = PRESET_LAYOUTS.find(p => p.id === e.target.value);
              if (preset) onLoadPreset(preset);
            }}
            defaultValue=""
            className="bg-space-850 hover:bg-space-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 border border-space-700/80 focus:outline-none focus:border-cyan-500 font-mono transition cursor-pointer"
          >
            <option value="" disabled>Load Architecture Template...</option>
            {PRESET_LAYOUTS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mission Type */}
        <div className="flex items-center space-x-1.5 bg-space-850 px-2.5 py-1.5 rounded-lg border border-space-700/80 text-xs font-mono">
          <span className="text-slate-400">Mission:</span>
          <select
            value={missionProfileId}
            onChange={(e) => onChangeMissionProfile(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            {MISSION_PROFILES.map(m => (
              <option key={m.id} value={m.id} className="bg-space-900 text-slate-200">
                {m.name.split(' ')[0]} ({m.gravity})
              </option>
            ))}
          </select>
        </div>

        {/* Crew Size Selector */}
        <div className="flex items-center space-x-1.5 bg-space-850 px-2.5 py-1.5 rounded-lg border border-space-700/80 text-xs font-mono">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Crew:</span>
          <select
            value={crewSize}
            onChange={(e) => onChangeCrewSize(Number(e.target.value))}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold"
          >
            {[2, 4, 6, 8].map(num => (
              <option key={num} value={num} className="bg-space-900 text-slate-200">
                {num} Astronauts
              </option>
            ))}
          </select>
        </div>

        {/* Evacuation Routes Toggle */}
        <button
          onClick={onToggleEvacRoutes}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition border ${
            showEvacRoutes
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-space-850 text-slate-400 border-space-700/80 hover:text-slate-200'
          }`}
          title="Toggle BFS evacuation path overlays"
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>Egress Paths</span>
        </button>
      </div>

      {/* Right Controls: Save, Compare, Export, Reset */}
      <div className="flex items-center space-x-2">
        {/* Save Snapshot */}
        <button
          onClick={onSaveSnapshot}
          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 flex items-center gap-1.5 transition"
          title="Save layout version snapshot"
        >
          <Save className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Save</span>
        </button>

        {/* Compare Versions */}
        <button
          onClick={onOpenCompare}
          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 flex items-center gap-1.5 transition relative"
          title="Side-by-side version comparison"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Compare</span>
          {savedVersionsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-cyan-500 text-space-950 text-[10px] font-bold flex items-center justify-center font-mono">
              {savedVersionsCount}
            </span>
          )}
        </button>

        {/* Export JSON */}
        <button
          onClick={onExportJSON}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-mono bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 flex items-center gap-1.5 transition"
          title="Export Layout as JSON"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Export</span>
        </button>

        {/* Import JSON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-mono bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 flex items-center gap-1.5 transition"
          title="Import Layout JSON"
        >
          <Upload className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Import</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json"
          className="hidden"
        />

        {/* Reset Layout */}
        <button
          onClick={onResetLayout}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-mono bg-space-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-space-700 transition"
          title="Clear canvas"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Clear</span>
        </button>
      </div>
    </header>
  );
}
