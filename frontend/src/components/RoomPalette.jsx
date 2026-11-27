import React from 'react';
import { ROOM_TYPES } from '../constants/habitatRules';
import { Plus, Info, Volume2, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export default function RoomPalette({ onAddRoom, crewSize }) {
  const roomList = Object.values(ROOM_TYPES);

  return (
    <div className="w-72 bg-space-900 border-r border-space-800 flex flex-col h-full overflow-hidden select-none">
      {/* Palette Header */}
      <div className="p-3.5 border-b border-space-800 bg-space-850/50">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5" />
            Module Palette
          </h2>
          <span className="text-[10px] font-mono bg-space-800 text-slate-300 px-1.5 py-0.5 rounded border border-space-700">
            Crew: {crewSize}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
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
              className="group p-2.5 rounded-lg border border-space-800 bg-space-850/70 hover:bg-space-800 hover:border-cyan-500/50 transition cursor-pointer flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                    {type.name}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddRoom(type, defaultW, defaultH);
                  }}
                  className="w-5 h-5 rounded bg-space-700 group-hover:bg-cyan-500 text-slate-300 group-hover:text-space-950 flex items-center justify-center transition"
                  title="Add Room"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Specs & Guidance */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  Min Req: <span className="text-slate-200 font-bold">{minArea} m²</span>
                </span>
                <span className={`px-1 py-0.2 rounded text-[9px] font-semibold
                  ${type.noiseLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                    type.noiseLevel === 'QUIET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                    'bg-slate-700/50 text-slate-300'}
                `}>
                  {type.noiseLevel}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                {type.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Add Corridor Helper */}
      <div className="p-3 border-t border-space-800 bg-space-900/90 text-center">
        <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Tip: Use corridors to bridge noisy & quiet zones.</span>
        </div>
      </div>
    </div>
  );
}
