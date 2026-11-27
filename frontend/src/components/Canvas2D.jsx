import React, { useState, useRef, useEffect } from 'react';
import { ROOM_TYPES } from '../constants/habitatRules';
import { 
  AlertTriangle, 
  DoorOpen, 
  Footprints, 
  Trash2, 
  Copy, 
  Maximize2, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  CheckCircle2,
  Navigation
} from 'lucide-react';

const GRID_SIZE = 28; // 28 pixels per meter

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
  const [dragState, setDragState] = useState(null); // { roomId, startX, startY, initialX, initialY, mode: 'move'|'resize' }
  const [canvasOffset, setCanvasOffset] = useState({ x: 40, y: 40 });

  const rooms = layout.rooms || [];
  const evacPaths = validation?.evacGraph?.evacuationPaths || {};
  const egressStatus = validation?.evacGraph?.egressStatus || {};

  // Find issues per room for quick badges
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
        const newX = Math.max(0, Math.min(30, dragState.initialX + deltaX));
        const newY = Math.max(0, Math.min(22, dragState.initialY + deltaY));

        const updatedRooms = rooms.map(r => 
          r.id === dragState.roomId ? { ...r, x: newX, y: newY } : r
        );
        onUpdateLayout({ ...layout, rooms: updatedRooms });
      } else if (dragState.mode === 'resize') {
        const newW = Math.max(2, Math.min(18, dragState.initialW + deltaX));
        const newH = Math.max(2, Math.min(18, dragState.initialH + deltaY));

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
      x: room.x + 2,
      y: room.y + 2
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
            {/* Glow backing */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isSelected ? '#10b981' : '#22c55e'}
              strokeWidth={isSelected ? '6' : '3'}
              strokeOpacity={isSelected ? '0.6' : '0.3'}
            />
            {/* Pulsing animated dashed route */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isSelected ? '#34d399' : '#86efac'}
              strokeWidth={isSelected ? '3' : '2'}
              className="animate-evac-path"
            />
            {/* Midpoint directional chevron */}
            <circle
              cx={(x1 + x2) / 2}
              cy={(y1 + y2) / 2}
              r={isSelected ? '4' : '3'}
              fill="#10b981"
            />
          </g>
        );
      }
    });

    return (
      <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-20">
        <defs>
          <marker
            id="evac-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
          </marker>
        </defs>
        {lines}
      </svg>
    );
  };

  return (
    <div className="relative flex-1 bg-space-950 flex flex-col h-full overflow-hidden select-none">
      {/* Canvas Top Bar Controls */}
      <div className="h-12 border-b border-space-800 bg-space-900/90 backdrop-blur px-4 flex items-center justify-between z-30">
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            2D HABITAT VIEWPORT
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Scale: 1 unit = 1.0 m²</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-mono">Modules: {rooms.length}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-mono">Area: {validation?.totalArea || 0} m²</span>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center space-x-2">
          <div className="bg-space-800/80 rounded-lg p-1 flex items-center space-x-1 border border-space-700/60">
            <button
              onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
              className="p-1 hover:bg-space-700 text-slate-300 rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1.5">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
              className="p-1 hover:bg-space-700 text-slate-300 rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:bg-space-700 text-slate-300 rounded transition"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid Canvas Container */}
      <div 
        ref={containerRef}
        onClick={() => onSelectRoom(null)}
        className="flex-1 overflow-auto relative bg-grid-pattern bg-grid-major cursor-crosshair"
      >
        <div 
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: '0 0',
            width: `${34 * GRID_SIZE}px`,
            height: `${24 * GRID_SIZE}px`,
            margin: `${canvasOffset.y}px ${canvasOffset.x}px`,
            position: 'relative'
          }}
          className="border-2 border-dashed border-space-700/60 rounded-xl shadow-2xl bg-space-900/40 relative"
        >
          {/* Evacuation SVG Overlay Lines */}
          {renderEvacuationRoutes()}

          {/* Render Rooms */}
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
                  zIndex: isSelected ? 25 : 10
                }}
                className={`absolute rounded-lg border-2 transition-shadow cursor-grab active:cursor-grabbing select-none backdrop-blur-sm group flex flex-col justify-between p-2
                  ${rDef.bgClass}
                  ${isSelected ? 'ring-2 ring-cyan-400 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.35)]' : 'border-opacity-60'}
                  ${hasCritical ? 'ring-2 ring-red-500 animate-pulse' : ''}
                  ${rDef.isPassage ? 'border-dashed' : 'border-solid'}
                `}
              >
                {/* Header bar: Type & Name */}
                <div className="flex items-start justify-between gap-1 overflow-hidden pointer-events-none">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: rDef.color }}
                    />
                    <span className="font-semibold text-[11px] leading-tight truncate text-slate-100">
                      {room.name}
                    </span>
                  </div>

                  {/* Warning Indicator Badge */}
                  {hasWarning && (
                    <div 
                      className={`flex-shrink-0 px-1 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-0.5 shadow-sm
                        ${hasCritical ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'}
                      `}
                      title={roomIssues.map(i => i.title).join('\n')}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>{roomIssues.length}</span>
                    </div>
                  )}

                  {/* Airlock Glowing Beacon */}
                  {rDef.isExit && (
                    <div className="flex-shrink-0 bg-pink-500 text-white px-1 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-0.5 animate-pulse shadow">
                      <DoorOpen className="w-3 h-3" />
                      <span>EXIT</span>
                    </div>
                  )}
                </div>

                {/* Center Content: Dimensions & Type */}
                <div className="my-auto pointer-events-none text-center">
                  <div className="font-mono text-xs font-bold text-slate-200">
                    {room.w}m × {room.h}m
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {area} m²
                  </div>
                  {isTrapped && (
                    <div className="mt-1 inline-flex items-center gap-1 bg-red-950/80 border border-red-500/50 text-red-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      NO EXIT ROUTE
                    </div>
                  )}
                </div>

                {/* Footer Controls & Evac Steps */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10 pointer-events-auto">
                  <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider truncate">
                    {rDef.category}
                  </span>

                  {/* Quick Action Buttons (shown when selected) */}
                  {isSelected && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDuplicateRoom(room, e)}
                        className="p-1 hover:bg-white/20 rounded text-slate-200 transition"
                        title="Duplicate Room"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteRoom(room.id, e)}
                        className="p-1 hover:bg-red-500/30 text-red-300 rounded transition"
                        title="Delete Room"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Resize Handle (bottom-right) */}
                <div
                  onMouseDown={(e) => handleMouseDown(e, room, 'resize')}
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center text-slate-400 hover:text-white"
                  title="Drag to resize dimensions"
                >
                  <div className="w-2 h-2 border-r-2 border-b-2 border-current"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="border-t border-space-800 bg-space-900/80 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-400 z-30">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-500 font-medium">LEGEND:</span>
          {Object.values(ROOM_TYPES).slice(0, 7).map(t => (
            <div key={t.id} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: t.color }}></span>
              <span className="text-[11px] text-slate-300">{t.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-0.5 bg-emerald-400 inline-block border-b border-dashed"></span>
            <span>BFS Escape Route</span>
          </div>
          <div className="flex items-center gap-1 text-red-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Rule Penalty</span>
          </div>
        </div>
      </div>
    </div>
  );
}
