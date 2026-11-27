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
  Compass,
  Grid3X3
} from 'lucide-react';

const GRID_SIZE = 28; // 28 pixels per meter
const CANVAS_COLS = 34;
const CANVAS_ROWS = 24;

export default function Canvas2D({
  layout,
  onUpdateLayout,
  selectedRoomId,
  onSelectRoom,
  validation,
  showEvacRoutes = true,
  isSimulating = false
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

  // Handle Drag / Resize Mouse Events
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
        const newX = Math.max(0, Math.min(CANVAS_COLS - 2, dragState.initialX + deltaX));
        const newY = Math.max(0, Math.min(CANVAS_ROWS - 2, dragState.initialY + deltaY));

        const updatedRooms = rooms.map(r => 
          r.id === dragState.roomId ? { ...r, x: newX, y: newY } : r
        );
        onUpdateLayout({ ...layout, rooms: updatedRooms });
      } else if (dragState.mode === 'resize') {
        const newW = Math.max(2, Math.min(20, dragState.initialW + deltaX));
        const newH = Math.max(2, Math.min(20, dragState.initialH + deltaY));

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
      x: Math.min(CANVAS_COLS - room.w, room.x + 2),
      y: Math.min(CANVAS_ROWS - room.h, room.y + 2)
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
              stroke="#10b981"
              strokeWidth={isSelected ? '6' : '3'}
              strokeOpacity={isSelected ? '0.35' : '0.18'}
              strokeLinecap="round"
            />
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isSelected ? '#10b981' : '#34d399'}
              strokeWidth={isSelected ? '2.5' : '1.75'}
              strokeLinecap="round"
              className="animate-evac-path"
            />
            <circle
              cx={(x1 + x2) / 2}
              cy={(y1 + y2) / 2}
              r={isSelected ? '3.5' : '2.5'}
              fill="#10b981"
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

  // Ruler tick arrays (every 5 meters)
  const xTicks = Array.from({ length: Math.floor(CANVAS_COLS / 5) + 1 }, (_, i) => i * 5);
  const yTicks = Array.from({ length: Math.floor(CANVAS_ROWS / 5) + 1 }, (_, i) => i * 5);

  return (
    <div className="relative flex-1 bg-cad-viewport flex flex-col h-full overflow-hidden select-none transition-colors duration-200">
      {/* Classy CAD Viewport Top Toolbar */}
      <div className="h-10 border-b border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md px-4 flex items-center justify-between z-30">
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2 tracking-wide">
            <Compass className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>DECK 01 — ARCHITECTURAL CANVAS</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <Grid3X3 className="w-3 h-3 text-slate-400" />
            SNAP: 1.0m
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
            {rooms.length} Modules
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-[11px] text-slate-700 dark:text-slate-300 font-mono font-semibold">
            {validation?.totalArea || 0} m²
          </span>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 dark:bg-slate-800/90 rounded-lg p-0.5 flex items-center space-x-0.5 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <button
              onClick={() => setZoom(z => Math.max(0.6, +(z - 0.1).toFixed(1)))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium text-slate-700 dark:text-slate-200 px-2 min-w-[44px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.6, +(z + 0.1).toFixed(1)))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3.5 bg-slate-300 dark:bg-slate-700 mx-0.5" />
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md transition"
              title="Reset Zoom (100%)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Blueprint Sheet Container */}
      <div 
        ref={containerRef}
        onClick={() => onSelectRoom(null)}
        className="flex-1 overflow-auto relative p-8 cursor-crosshair"
      >
        {/* Scaled Wrapper with Architectural Rulers */}
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: '0 0',
            width: `${CANVAS_COLS * GRID_SIZE + 36}px`,
            height: `${CANVAS_ROWS * GRID_SIZE + 36}px`,
          }}
          className="relative"
        >
          {/* Top Horizontal Meter Ruler */}
          <div
            style={{ left: '28px', width: `${CANVAS_COLS * GRID_SIZE}px` }}
            className="absolute top-0 h-6 flex items-end pointer-events-none"
          >
            {xTicks.map(m => (
              <div
                key={`xr-${m}`}
                style={{ left: `${m * GRID_SIZE}px` }}
                className="absolute bottom-0 flex flex-col items-start"
              >
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 -translate-x-1/2 mb-0.5">
                  {m}m
                </span>
                <div className="w-px h-1.5 bg-slate-300 dark:bg-slate-700" />
              </div>
            ))}
          </div>

          {/* Left Vertical Meter Ruler */}
          <div
            style={{ top: '28px', height: `${CANVAS_ROWS * GRID_SIZE}px` }}
            className="absolute left-0 w-6 flex flex-col items-end pointer-events-none"
          >
            {yTicks.map(m => (
              <div
                key={`yr-${m}`}
                style={{ top: `${m * GRID_SIZE}px` }}
                className="absolute right-0 flex items-center"
              >
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 -translate-y-1/2 mr-1">
                  {m}m
                </span>
                <div className="h-px w-1.5 bg-slate-300 dark:bg-slate-700" />
              </div>
            ))}
          </div>

          {/* Blueprint Sheet Surface */}
          <div
            style={{
              left: '28px',
              top: '28px',
              width: `${CANVAS_COLS * GRID_SIZE}px`,
              height: `${CANVAS_ROWS * GRID_SIZE}px`,
            }}
            className="absolute rounded-xl border border-slate-300/90 dark:border-slate-700/70 shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.65)] bg-white/85 dark:bg-[#080d1a]/90 bg-grid-pattern bg-grid-major overflow-hidden"
          >
            {/* Corner CAD Registration Marks */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-400/50 dark:border-cyan-500/30 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-slate-400/50 dark:border-cyan-500/30 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-slate-400/50 dark:border-cyan-500/30 pointer-events-none" />

            {/* Architectural Title Block (Bottom Right of Sheet) */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-sm pointer-events-none flex items-center gap-3 text-[9px] font-mono text-slate-500 dark:text-slate-400 z-10">
              <span className="font-bold text-slate-700 dark:text-slate-300">TECHSTARS • SW-4</span>
              <span>|</span>
              <span>HABITAT DECK PLAN</span>
              <span>|</span>
              <span>NASA-STD-3001</span>
            </div>

            {/* Evacuation SVG Overlay Lines */}
            {renderEvacuationRoutes()}

            {/* Render Architectural Room Modules */}
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
                    borderLeftColor: rDef.color,
                  }}
                  className={`absolute rounded-md border transition-shadow cursor-grab active:cursor-grabbing select-none group flex flex-col justify-between p-2
                    bg-white/95 dark:bg-slate-900/90 backdrop-blur-md
                    border-l-[4px]
                    ${rDef.isPassage ? 'bg-corridor-hatch border-dashed border-slate-400 dark:border-slate-600' : 'border-slate-300/90 dark:border-slate-700/80'}
                    ${isSelected
                      ? 'ring-2 ring-cyan-500 dark:ring-cyan-400 border-cyan-500/60 shadow-[0_10px_30px_rgba(6,182,212,0.22)]'
                      : 'shadow-sm hover:shadow-md dark:hover:border-slate-500/80'}
                    ${hasCritical && !isSelected ? 'ring-1 ring-red-500/80 shadow-[0_0_16px_rgba(239,68,68,0.18)]' : ''}
                  `}
                >
                  {/* Subtle Top Tinted Wash */}
                  <div
                    className="absolute inset-0 rounded-md pointer-events-none opacity-[0.06] dark:opacity-[0.11]"
                    style={{ backgroundColor: rDef.color }}
                  />

                  {/* CAD Selection Corner Anchors */}
                  {isSelected && (
                    <>
                      <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-cyan-500 rounded-[1px] pointer-events-none" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-cyan-500 rounded-[1px] pointer-events-none" />
                      <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-cyan-500 rounded-[1px] pointer-events-none" />
                    </>
                  )}

                  {/* Header bar: Type dot, Name & Status Pill */}
                  <div className="relative flex items-start justify-between gap-1 overflow-hidden pointer-events-none">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-white/50 dark:ring-slate-900/50"
                        style={{ backgroundColor: rDef.color }}
                      />
                      <span className="font-semibold text-[11px] leading-tight truncate text-slate-900 dark:text-slate-100">
                        {room.name}
                      </span>
                    </div>

                    {/* Warning Indicator Badge */}
                    {hasWarning && (
                      <div
                        className={`flex-shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-0.5 shadow-sm
                          ${hasCritical ? 'bg-red-600 text-white' : 'bg-amber-400 text-slate-950'}
                        `}
                        title={roomIssues.map(i => i.title).join('\n')}
                      >
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>{roomIssues.length}</span>
                      </div>
                    )}

                    {/* Airlock Exit Beacon */}
                    {rDef.isExit && (
                      <div className="flex-shrink-0 bg-pink-600/90 text-white px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-0.5 shadow-sm">
                        <DoorOpen className="w-2.5 h-2.5" />
                        <span>EXIT</span>
                      </div>
                    )}
                  </div>

                  {/* Center Content: Clean CAD Dimension Callout */}
                  <div className="relative my-auto pointer-events-none text-center">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70">
                      <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-100">
                        {room.w}×{room.h}m
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="font-mono text-[10px] font-medium text-slate-600 dark:text-slate-300">
                        {area} m²
                      </span>
                    </div>

                    {isTrapped && (
                      <div className="mt-1 flex justify-center">
                        <span className="inline-flex items-center gap-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shadow-sm">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          NO EXIT
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer: Category & Quick Actions */}
                  <div className="relative flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/70 dark:border-slate-800 pointer-events-auto">
                    <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                      {rDef.category}
                    </span>

                    {isSelected && (
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={(e) => handleDuplicateRoom(room, e)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 transition"
                          title="Duplicate Module"
                        >
                          <Copy className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteRoom(room.id, e)}
                          className="p-1 hover:bg-red-500/15 text-red-600 dark:text-red-400 rounded transition"
                          title="Delete Module"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Interactive Resize Handle (bottom-right) */}
                  <div
                    onMouseDown={(e) => handleMouseDown(e, room, 'resize')}
                    className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 cursor-se-resize flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-cyan-500 border border-white rounded-[2px] shadow'
                        : 'text-slate-400 dark:text-slate-500 hover:text-cyan-500'
                    }`}
                    title="Drag to resize dimensions"
                  >
                    {!isSelected && (
                      <div className="w-1.5 h-1.5 border-r-[1.5px] border-b-[1.5px] border-current mr-1 mb-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Minimal Architectural Legend Footer */}
      <div className="border-t border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400 z-30">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider">ZONES:</span>
          {Object.values(ROOM_TYPES).slice(0, 8).map(t => (
            <div key={t.id} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }}></span>
              <span className="text-[11px] text-slate-700 dark:text-slate-300">{t.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block border-b border-dashed"></span>
            <span>BFS Egress</span>
          </div>
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Violation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
