import React from 'react';
import { ROOM_TYPES } from '../constants/habitatRules';
import { Plus, Info, Layers, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function RoomPalette({ onAddRoom, crewSize, isMinimized, onToggleMinimize }) {
  const roomList = Object.values(ROOM_TYPES);

  if (isMinimized) {
    return (
      <div className="w-11 bg-white dark:bg-space-900 border-r border-slate-200 dark:border-space-800 flex flex-col items-center py-3 gap-3 select-none transition-all duration-200 z-20">
        <button
          onClick={onToggleMinimize}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-space-800 dark:hover:bg-space-700 text-cyan-600 dark:text-cyan-400 border border-slate-300 dark:border-space-700 transition"
          title="Expand Module Palette"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-1.5 mt-1">
          {roomList.map(type => (
            <button
              key={type.id}
              onClick={() => {
                const defaultW = type.isPassage ? 10 : (type.id === 'GALLEY' || type.id === 'WORK' ? 5 : 4);
                const defaultH = type.isPassage ? 2 : (type.id === 'GALLEY' || type.id === 'WORK' ? 4 : 3);
                onAddRoom(type, defaultW, defaultH);
              }}
              className="w-6 h-6 rounded-md border border-slate-300 dark:border-space-700 hover:scale-110 transition flex items-center justify-center bg-slate-50 dark:bg-space-850"
              title={`Quick Add: ${type.name}`}
            >
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: type.color }} />
            </button>
          ))}
        </div>

        <div className="mt-auto text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 [writing-mode:vertical-rl] rotate-180">
          MODULES
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-white dark:bg-space-900 border-r border-slate-200 dark:border-space-800 flex flex-col h-full overflow-hidden select-none transition-all duration-200">
      {/* Palette Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-space-800 bg-slate-50 dark:bg-space-850/50">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5" />
            Module Palette
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono bg-slate-200/80 dark:bg-space-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-300 dark:border-space-700">
              Crew: {crewSize}
            </span>
            <button
              onClick={onToggleMinimize}
              className="p-1 rounded bg-slate-200/70 hover:bg-slate-300/80 dark:bg-space-800 dark:hover:bg-space-700 text-slate-600 dark:text-slate-300 transition"
              title="Minimize Module Palette"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Click to deploy compartments conforming to NASA-STD-3001.
        </p>
      </div>

      {/* Palette Item List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {roomList.map(type => {
          const minArea = Math.max(
            type.baseMinArea || 4,
            Math.round((type.minAreaPerCrew || 1) * crewSize * 10) / 10
          );
          const defaultW = type.isPassage ? 10 : (type.id === 'GALLEY' || type.id === 'WORK' ? 5 : 4);
          const defaultH = type.isPassage ? 2 : (type.id === 'GALLEY' || type.id === 'WORK' ? 4 : 3);

          return (
            <div
              key={type.id}
              onClick={() => onAddRoom(type, defaultW, defaultH)}
              className="group p-2.5 rounded-lg border border-slate-200 dark:border-space-800 bg-slate-50/80 dark:bg-space-850/70 hover:bg-slate-100 dark:hover:bg-space-800 hover:border-cyan-500/50 transition cursor-pointer flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition">
                    {type.name}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddRoom(type, defaultW, defaultH);
                  }}
                  className="w-5 h-5 rounded bg-slate-200 dark:bg-space-700 group-hover:bg-cyan-500 text-slate-700 dark:text-slate-300 group-hover:text-white dark:group-hover:text-space-950 flex items-center justify-center transition"
                  title="Add Room"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Specs & Guidance */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  Min Req: <span className="text-slate-900 dark:text-slate-200 font-bold">{minArea} m²</span>
                </span>
                <span className={`px-1 py-0.2 rounded text-[9px] font-semibold
                  ${type.noiseLevel === 'HIGH' ? 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30' : 
                    type.noiseLevel === 'QUIET' ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30' : 
                    'bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300'}
                `}>
                  {type.noiseLevel}
                </span>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                {type.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Add Corridor Helper */}
      <div className="p-3 border-t border-slate-200 dark:border-space-800 bg-slate-50 dark:bg-space-900/90 text-center">
        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
          <Info className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          <span>Tip: Use corridors to bridge noisy & quiet zones.</span>
        </div>
      </div>
    </div>
  );
}
