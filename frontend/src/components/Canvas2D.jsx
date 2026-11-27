import React, { useState, useRef, useEffect } from 'react';
import { ROOM_TYPES } from '../constants/habitatRules';
import { 
  AlertTriangle, 
  DoorOpen, 
  Trash2, 
  Copy, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Undo2,
  Moon,
  Activity,
  Droplets,
  Utensils,
  Briefcase,
  HeartPulse,
  Boxes,
  Plus
} from 'lucide-react';

const GRID_SIZE = 24; // 24 pixels per meter
const CANVAS_COLS = 32;
const CANVAS_ROWS = 14;

export default function Canvas2D({
  layout,
  onUpdateLayout,
  selectedRoomId,
  onSelectRoom,
  validation,
  showEvacRoutes = true,
  isSimulating = false,
  onAddRoom,
  onUndo,
  habitatShape = 'cylinder'
}) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [dragState, setDragState] = useState(null);

  const rooms = layout.rooms || [];
  const egressStatus = validation?.evacGraph?.egressStatus || {};

  // Group issues by room ID
  const issuesByRoomId = {};
  (validation?.issues || []).forEach(issue => {
    (issue.affectedRoomIds || []).forEach(rid => {
      if (!issuesByRoomId[rid]) issuesByRoomId[rid] = [];
      issuesByRoomId[rid].push(issue);
    });
  });

  // Icon mapper helper
  const getRoomIcon = (type) => {
    switch (type) {
      case 'SLEEPING': return <Moon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'EXERCISE': return <Activity className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      case 'HYGIENE': return <Droplets className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'GALLEY': return <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'WORK': return <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'MEDICAL': return <HeartPulse className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />;
      case 'STORAGE': return <Boxes className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />;
      case 'AIRLOCK': return <DoorOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      default: return <Boxes className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />;
    }
  };

  // Mouse Drag / Resize logic
  const handleMouseDown = (e, room, mode = 'move') => {
    e.stopPropagation();
    onSelectRoom(room.id);

    setDragState({
      roomId: room.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: room.x,
      initialY: room.y,
      initialW: room.w,
      initialH: room.h,
      mode
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragState) return;

      const deltaX = Math.round((e.clientX - dragState.startX) / (GRID_SIZE * zoom));
      const deltaY = Math.round((e.clientY - dragState.startY) / (GRID_SIZE * zoom));

      if (dragState.mode === 'move') {
        const newX = Math.max(1, Math.min(CANVAS_COLS - 4, dragState.initialX + deltaX));
        const newY = Math.max(1, Math.min(CANVAS_ROWS - 3, dragState.initialY + deltaY));

        const updatedRooms = rooms.map(r => 
          r.id === dragState.roomId ? { ...r, x: newX, y: newY } : r
        );
        onUpdateLayout({ ...layout, rooms: updatedRooms });
      } else if (dragState.mode === 'resize') {
        const newW = Math.max(2, Math.min(16, dragState.initialW + deltaX));
        const newH = Math.max(2, Math.min(10, dragState.initialH + deltaY));

        const updatedRooms = rooms.map(r => 
          r.id === dragState.roomId ? { ...r, w: newW, h: newH } : r
        );
        onUpdateLayout({ ...layout, rooms: updatedRooms });
      }
    };

    const handleMouseUp = () => {
      if (dragState) setDragState(null);
    };

    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, rooms, zoom, layout, onUpdateLayout]);

  const handleDeleteRoom = (id, e) => {
    e?.stopPropagation();
    const updated = rooms.filter(r => r.id !== id);
    onUpdateLayout({ ...layout, rooms: updated });
    if (selectedRoomId === id) onSelectRoom(null);
  };

  const handleDuplicateRoom = (room, e) => {
    e?.stopPropagation();
    const newRoom = {
      ...room,
      id: `room-${Date.now()}`,
      name: `${room.name} (Copy)`,
      x: Math.min(CANVAS_COLS - room.w - 1, room.x + 2),
      y: Math.min(CANVAS_ROWS - room.h - 1, room.y + 1)
    };
    onUpdateLayout({ ...layout, rooms: [...rooms, newRoom] });
    onSelectRoom(newRoom.id);
  };

  // Render Evacuation Route Line Segments
  const renderEvacuationRoutes = () => {
    if (!showEvacRoutes && !isSimulating) return null;

    const lines = [];
    const roomById = new Map(rooms.map(r => [r.id, r]));

    rooms.forEach(room => {
      const status = egressStatus[room.id];
      if (!status || !status.reachable || !status.path || status.path.length <= 1) return;

      const pathIds = status.path;
      const isSelected = selectedRoomId === room.id;

      for (let i = 0; i < pathIds.length - 1; i++) {
        const r1 = roomById.get(pathIds[i]);
        const r2 = roomById.get(pathIds[i + 1]);
        if (!r1 || !r2) continue;

        const x1 = (r1.x + r1.w / 2) * GRID_SIZE;
        const y1 = (r1.y + r1.h / 2) * GRID_SIZE;
        const x2 = (r2.x + r2.w / 2) * GRID_SIZE;
        const y2 = (r2.y + r2.h / 2) * GRID_SIZE;

        lines.push(
          <g key={`evac-${room.id}-${i}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#22c55e"
              strokeWidth={isSelected ? '5' : '3'}
              strokeOpacity={isSelected ? '0.4' : '0.2'}
              strokeLinecap="round"
            />
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isSelected ? '#16a34a' : '#22c55e'}
              strokeWidth={isSelected ? '2.5' : '2'}
              strokeLinecap="round"
              className="animate-evac-path"
            />
            <circle
              cx={(x1 + x2) / 2}
              cy={(y1 + y2) / 2}
              r={isSelected ? '3.5' : '2.5'}
              fill="#16a34a"
            />
          </g>
        );
      }
    });

    return (
      <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-20">
        {lines}
      </svg>
    );
  };

  const paletteOrder = ['SLEEPING', 'EXERCISE', 'HYGIENE', 'GALLEY', 'WORK', 'MEDICAL', 'STORAGE'];

  return (
    <div className="bg-white dark:bg-space-900 border border-slate-200 dark:border-space-800 rounded-2xl shadow-sm p-5 flex flex-col gap-4 select-none transition-colors duration-200">
      {/* Card 02 Header: Number, Title, Instructions & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold flex items-center justify-center border border-slate-300 dark:border-slate-700">
            02
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Zone layout
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a zone, then drag or resize on the habitat hull grid to reposition it.
            </p>
          </div>
        </div>

        {/* Ruler scale & Undo / Zoom */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-space-850 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <span className="tracking-tighter">|--|</span> 1 grid = 1.0 m
          </span>
          {onUndo && (
            <button
              onClick={onUndo}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 transition"
              title="Undo last change"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="flex items-center space-x-1 pl-1">
            <button
              onClick={() => setZoom(z => Math.max(0.7, +(z - 0.1).toFixed(1)))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] min-w-[34px] text-center font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.4, +(z + 0.1).toFixed(1)))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Zone Palette Chips (Matching reference image) */}
      <div className="flex flex-wrap items-center gap-2 pb-1 overflow-x-auto">
        {paletteOrder.map(key => {
          const type = ROOM_TYPES[key];
          return (
            <button
              key={type.id}
              onClick={() => onAddRoom(type, type.id === 'SLEEPING' || type.id === 'WORK' ? 8 : 6, 4)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition shadow-sm hover:scale-[1.02] active:scale-[0.98] ${type.chipBg}`}
            >
              {getRoomIcon(type.id)}
              <span>{type.name}</span>
              <Plus className="w-3 h-3 opacity-60 ml-0.5" />
            </button>
          );
        })}
        {/* Additional corridor & airlock chips */}
        <button
          onClick={() => onAddRoom(ROOM_TYPES.AIRLOCK, 3, 4)}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ${ROOM_TYPES.AIRLOCK.chipBg}`}
        >
          <DoorOpen className="w-3.5 h-3.5 text-purple-600" />
          <span>Airlock</span>
          <Plus className="w-3 h-3 opacity-60" />
        </button>
      </div>

      {/* The Habitat Hull Viewport Surface */}
      <div 
        ref={containerRef}
        onClick={() => onSelectRoom(null)}
        className="w-full overflow-x-auto overflow-y-hidden py-4 flex items-center justify-center bg-slate-50/70 dark:bg-space-950/70 rounded-2xl border border-slate-200/80 dark:border-space-800/80 cursor-crosshair"
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            width: `${CANVAS_COLS * GRID_SIZE + 60}px`,
            height: `${CANVAS_ROWS * GRID_SIZE + 40}px`,
          }}
          className="relative flex items-center justify-center my-2"
        >
          {/* Habitat Hull Capsule Shape (As shown in reference image) */}
          <div
            style={{
              width: `${CANVAS_COLS * GRID_SIZE}px`,
              height: `${CANVAS_ROWS * GRID_SIZE}px`,
            }}
            className={`relative border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 shadow-md ${
              habitatShape === 'cylinder'
                ? 'rounded-[44px]'
                : habitatShape === 'ring'
                ? 'rounded-[60px]'
                : 'rounded-2xl'
            }`}
          >
            {/* Outer Pressure Hull Ring Effect */}
            <div
              className={`absolute inset-[-6px] border border-slate-200 dark:border-slate-800 pointer-events-none ${
                habitatShape === 'cylinder'
                  ? 'rounded-[50px]'
                  : habitatShape === 'ring'
                  ? 'rounded-[66px]'
                  : 'rounded-2xl'
              }`}
            />

            {/* Left Port Docking Collar Tab */}
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-5 h-20 rounded-l-xl bg-slate-100 dark:bg-slate-800 border-2 border-r-0 border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-sm pointer-events-none">
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 [writing-mode:vertical-rl] rotate-180">
                PORT
              </span>
            </div>

            {/* Right Starboard Docking Collar Tab */}
            <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-20 rounded-r-xl bg-slate-100 dark:bg-slate-800 border-2 border-l-0 border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-sm pointer-events-none">
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 [writing-mode:vertical-rl]">
                STBD
              </span>
            </div>

            {/* Interior Clean Blueprint Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-70 pointer-events-none rounded-[inherit]" />

            {/* Evacuation SVG Overlay Lines */}
            {renderEvacuationRoutes()}

            {/* Render Habitat Zone Cards */}
            {rooms.map(room => {
              const rDef = ROOM_TYPES[room.type] || ROOM_TYPES.STORAGE;
              const isSelected = selectedRoomId === room.id;
              const roomIssues = issuesByRoomId[room.id] || [];
              const hasCritical = roomIssues.some(i => i.severity === 'CRITICAL');
              const hasWarning = roomIssues.length > 0;
              const status = egressStatus[room.id];
              const isTrapped = status && !status.reachable;
              const area = room.w * room.h;

              return (
                <div
                  key={room.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoom(room.id);
                  }}
                  onMouseDown={(e) => handleMouseDown(e, room, 'move')}
                  style={{
                    left: `${room.x * GRID_SIZE}px`,
                    top: `${room.y * GRID_SIZE}px`,
                    width: `${room.w * GRID_SIZE}px`,
                    height: `${room.h * GRID_SIZE}px`,
                    zIndex: isSelected ? 25 : 10,
                  }}
                  className={`absolute rounded-xl border-l-[5px] transition-all cursor-grab active:cursor-grabbing select-none group flex flex-col justify-between p-2.5 shadow-sm
                    ${rDef.lightBg} ${rDef.darkBg}
                    ${isSelected
                      ? 'ring-2 ring-blue-500 shadow-md scale-[1.01]'
                      : 'hover:shadow-md hover:brightness-[0.98]'}
                    ${hasCritical && !isSelected ? 'ring-2 ring-rose-500/80 animate-pulse' : ''}
                  `}
                >
                  {/* Card Header: Icon & Name */}
                  <div className="flex items-start justify-between gap-1 pointer-events-none">
                    <div className="flex flex-col items-start gap-1">
                      <div className="p-1 rounded-md bg-white/70 dark:bg-black/30 shadow-2xs">
                        {getRoomIcon(room.type)}
                      </div>
                      <span className="font-bold text-xs leading-none">
                        {room.name}
                      </span>
                    </div>

                    {/* Warning Indicator Badge */}
                    {hasWarning && (
                      <div 
                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-0.5 shadow-xs ${
                          hasCritical ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-900'
                        }`}
                        title={roomIssues.map(i => i.title).join('\n')}
                      >
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>{roomIssues.length}</span>
                      </div>
                    )}

                    {rDef.isExit && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-600 text-white shadow-xs">
                        EXIT
                      </span>
                    )}
                  </div>

                  {/* Card Center/Bottom: Area Metric */}
                  <div className="pointer-events-none">
                    <span className="text-[11px] font-mono opacity-80 font-medium">
                      {area.toFixed(1)} m²
                    </span>
                    {isTrapped && (
                      <div className="text-[9px] font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                        NO ROUTE
                      </div>
                    )}
                  </div>

                  {/* Quick duplicate / delete on hover or select */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 pointer-events-auto bg-white/90 dark:bg-black/80 rounded-lg p-0.5 shadow-sm border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={(e) => handleDuplicateRoom(room, e)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 transition"
                        title="Duplicate"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteRoom(room.id, e)}
                        className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded text-rose-600 dark:text-rose-400 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}

                  {/* Resize Handle (bottom-right corner) */}
                  <div
                    onMouseDown={(e) => handleMouseDown(e, room, 'resize')}
                    className="absolute bottom-1 right-1 w-3 h-3 cursor-se-resize flex items-center justify-center opacity-40 group-hover:opacity-100 text-current transition"
                    title="Drag to resize"
                  >
                    <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-current" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend Footer (Matching reference image) */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-space-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px]">Clear egress route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-[11px]">Noise buffer recommended</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-[11px]">Rule penalty active</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Double-click or drag corner to resize
        </div>
      </div>
    </div>
  );
}
