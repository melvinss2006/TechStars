import React from 'react';
import { ROOM_TYPES } from '../constants/habitatRules';
import { X, Trash2, Copy, Move, Maximize, AlertTriangle, CheckCircle, DoorOpen } from 'lucide-react';

export default function RoomInspector({
  room,
  onClose,
  onUpdateRoom,
  onDeleteRoom,
  onDuplicateRoom,
  validation,
  crewSize
}) {
  if (!room) return null;

  const rDef = ROOM_TYPES[room.type] || ROOM_TYPES.STORAGE;
  const area = room.w * room.h;
  const minRequired = Math.max(
    rDef.baseMinArea || 4,
    Math.round((rDef.minAreaPerCrew || 1) * crewSize * 10) / 10
  );

  const status = validation?.evacGraph?.egressStatus?.[room.id];
  const roomIssues = (validation?.issues || []).filter(i => 
    i.affectedRoomIds?.includes(room.id)
  );

  return (
    <div className="absolute bottom-4 left-76 z-30 bg-space-900/95 backdrop-blur-md border border-space-700/80 rounded-xl shadow-2xl p-4 w-96 select-none animate-in fade-in slide-in-from-bottom-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-space-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded" style={{ backgroundColor: rDef.color }}></span>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
            Module Inspector
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateRoom(room)}
            className="p-1 hover:bg-space-800 text-slate-400 hover:text-white rounded transition"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteRoom(room.id)}
            className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-space-800 text-slate-400 hover:text-white rounded transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="py-3 space-y-3 text-xs">
        {/* Name input */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-mono mb-1 block">Module Name</label>
          <input
            type="text"
            value={room.name}
            onChange={(e) => onUpdateRoom({ ...room, name: e.target.value })}
            className="w-full bg-space-850 border border-space-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
          />
        </div>

        {/* Type select */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-mono mb-1 block">Zone Classification</label>
          <select
            value={room.type}
            onChange={(e) => onUpdateRoom({ ...room, type: e.target.value })}
            className="w-full bg-space-850 border border-space-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-xs cursor-pointer"
          >
            {Object.values(ROOM_TYPES).map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.noiseLevel})
              </option>
            ))}
          </select>
        </div>

        {/* Dimensions Stepper */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-mono mb-1 block">Width (m)</label>
            <div className="flex items-center bg-space-850 border border-space-700 rounded px-2 py-1">
              <input
                type="number"
                min="2"
                max="20"
                value={room.w}
                onChange={(e) => onUpdateRoom({ ...room, w: Math.max(2, Number(e.target.value)) })}
                className="w-full bg-transparent text-slate-100 focus:outline-none font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500 font-mono">meters</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-mono mb-1 block">Height (m)</label>
            <div className="flex items-center bg-space-850 border border-space-700 rounded px-2 py-1">
              <input
                type="number"
                min="2"
                max="20"
                value={room.h}
                onChange={(e) => onUpdateRoom({ ...room, h: Math.max(2, Number(e.target.value)) })}
                className="w-full bg-transparent text-slate-100 focus:outline-none font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500 font-mono">meters</span>
            </div>
          </div>
        </div>

        {/* Telemetry Status Bar */}
        <div className="p-2.5 rounded-lg bg-space-850 border border-space-800 space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Area:</span>
            <span className={`font-bold ${area < minRequired && !rDef.isPassage ? 'text-red-400' : 'text-slate-200'}`}>
              {area} m² (Req: {minRequired} m²)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Egress Reachability:</span>
            {rDef.isExit ? (
              <span className="text-pink-400 font-bold">Surface Exit Portal</span>
            ) : status?.reachable ? (
              <span className="text-emerald-400 font-bold">
                Reachable ({status.hops} {status.hops === 1 ? 'hop' : 'hops'}, {status.distance}m)
              </span>
            ) : (
              <span className="text-red-400 font-bold">TRAPPED (No Route)</span>
            )}
          </div>
        </div>

        {/* Specific Warnings */}
        {roomIssues.length > 0 && (
          <div className="space-y-1">
            {roomIssues.map((iss, idx) => (
              <div key={idx} className="p-2 rounded bg-red-950/30 border border-red-500/40 text-[10px] text-red-300 flex items-start gap-1.5">
                <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{iss.reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
