import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PRESET_LAYOUTS } from './constants/presets';
import { MISSION_PROFILES } from './constants/habitatRules';
import { validateLayout } from './services/validationEngine';
import { findBestOptimization } from './services/optimizer';

import Navbar from './components/Navbar';
import RoomPalette from './components/RoomPalette';
import Canvas2D from './components/Canvas2D';
import ScoreCard from './components/ScoreCard';
import IssuesList from './components/IssuesList';
import RoomInspector from './components/RoomInspector';
import CompareModal from './components/CompareModal';
import OptimizerModal from './components/OptimizerModal';
import AIExplanationModal from './components/AIExplanationModal';

export default function App() {
  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('habitat-theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('habitat-theme', theme);
  }, [theme]);

  // Panel minimize states for maximum canvas area
  const [isPaletteMinimized, setIsPaletteMinimized] = useState(false);
  const [isIssuesMinimized, setIsIssuesMinimized] = useState(false);
  const [isScoreMinimized, setIsScoreMinimized] = useState(false);

  const isCanvasFocused = isPaletteMinimized && isIssuesMinimized && isScoreMinimized;

  const handleToggleFocusCanvas = () => {
    const next = !isCanvasFocused;
    setIsPaletteMinimized(next);
    setIsIssuesMinimized(next);
    setIsScoreMinimized(next);
  };

  // Initialize with the reference layout preset
  const [currentLayout, setCurrentLayout] = useState(PRESET_LAYOUTS[0]);
  const [history, setHistory] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [crewSize, setCrewSize] = useState(4);
  const [habitatShape, setHabitatShape] = useState('cylinder');
  const [missionProfileId, setMissionProfileId] = useState('lunar_surface');
  const [showEvacRoutes, setShowEvacRoutes] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  // Modals state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Saved snapshots for side-by-side comparison
  const [savedVersions, setSavedVersions] = useState([
    {
      id: 'snapshot-preset-1',
      name: 'Mission Ready Habitat',
      description: 'Balanced, compliant layout matching reference architecture',
      timestamp: new Date().toLocaleTimeString(),
      layout: PRESET_LAYOUTS[0]
    },
    {
      id: 'snapshot-preset-2',
      name: 'Flawed Architecture Demo',
      description: 'Initial proposal with acoustic and egress flaws',
      timestamp: new Date().toLocaleTimeString(),
      layout: PRESET_LAYOUTS[1]
    }
  ]);

  // Run deterministic validation engine
  const validation = useMemo(() => {
    return validateLayout(currentLayout, crewSize, missionProfileId);
  }, [currentLayout, crewSize, missionProfileId]);

  // Compute best optimization swap recommendation
  const bestSwap = useMemo(() => {
    return findBestOptimization(currentLayout, crewSize, missionProfileId);
  }, [currentLayout, crewSize, missionProfileId]);

  const activeMission = useMemo(() => {
    return MISSION_PROFILES.find(p => p.id === missionProfileId) || MISSION_PROFILES[0];
  }, [missionProfileId]);

  const selectedRoom = useMemo(() => {
    return currentLayout.rooms?.find(r => r.id === selectedRoomId) || null;
  }, [currentLayout.rooms, selectedRoomId]);

  // Handlers
  const pushHistory = (layout) => {
    setHistory(prev => [JSON.parse(JSON.stringify(layout)), ...prev.slice(0, 9)]);
  };

  const handleUpdateLayout = (newLayout) => {
    pushHistory(currentLayout);
    setCurrentLayout(newLayout);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history[0];
      setHistory(h => h.slice(1));
      setCurrentLayout(prev);
    }
  };

  const handleAddRoom = (typeDef, w, h) => {
    pushHistory(currentLayout);
    const newRoom = {
      id: `room-${Date.now()}`,
      type: typeDef.id,
      name: typeDef.name,
      x: 3 + ((currentLayout.rooms.length * 2) % 18),
      y: 2 + ((currentLayout.rooms.length * 2) % 6),
      w: w || 6,
      h: h || 4
    };

    setCurrentLayout(prev => ({
      ...prev,
      rooms: [...prev.rooms, newRoom]
    }));
    setSelectedRoomId(newRoom.id);
  };

  const handleUpdateRoom = (updatedRoom) => {
    pushHistory(currentLayout);
    setCurrentLayout(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r)
    }));
  };

  const handleDeleteRoom = (roomId) => {
    pushHistory(currentLayout);
    setCurrentLayout(prev => ({
      ...prev,
      rooms: prev.rooms.filter(r => r.id !== roomId)
    }));
    if (selectedRoomId === roomId) setSelectedRoomId(null);
  };

  const handleDuplicateRoom = (room) => {
    pushHistory(currentLayout);
    const duplicated = {
      ...room,
      id: `room-${Date.now()}`,
      name: `${room.name} (Copy)`,
      x: Math.min(26, room.x + 2),
      y: Math.min(10, room.y + 1)
    };
    setCurrentLayout(prev => ({
      ...prev,
      rooms: [...prev.rooms, duplicated]
    }));
    setSelectedRoomId(duplicated.id);
  };

  const handleLoadPreset = (preset) => {
    pushHistory(currentLayout);
    setCurrentLayout(preset);
    setSelectedRoomId(null);
    if (preset.crewSize) setCrewSize(preset.crewSize);
    if (preset.habitatShape) setHabitatShape(preset.habitatShape);
    if (preset.missionProfile) setMissionProfileId(preset.missionProfile);
  };

  const handleSaveSnapshot = () => {
    const newSnapshot = {
      id: `snapshot-${Date.now()}`,
      name: `${currentLayout.name || 'Layout Version'} (Score: ${validation.score})`,
      description: `Saved at ${new Date().toLocaleTimeString()} with ${validation.issues.length} penalties`,
      timestamp: new Date().toLocaleTimeString(),
      layout: JSON.parse(JSON.stringify(currentLayout))
    };
    setSavedVersions(prev => [newSnapshot, ...prev]);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.15 }
    });
  };

  const handleApplySwap = (newLayout) => {
    pushHistory(currentLayout);
    setCurrentLayout(newLayout);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentLayout, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentLayout.id || 'habitat-layout'}-export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (importedLayout) => {
    if (importedLayout && Array.isArray(importedLayout.rooms)) {
      pushHistory(currentLayout);
      setCurrentLayout(importedLayout);
      if (importedLayout.crewSize) setCrewSize(importedLayout.crewSize);
      if (importedLayout.missionProfile) setMissionProfileId(importedLayout.missionProfile);
      setSelectedRoomId(null);
    } else {
      alert('Invalid layout JSON structure.');
    }
  };

  const handleResetLayout = () => {
    if (window.confirm('Clear all modules and reset canvas?')) {
      pushHistory(currentLayout);
      setCurrentLayout({
        id: `custom-${Date.now()}`,
        name: 'Empty Custom Habitat',
        tagline: 'Fresh canvas',
        missionProfile: missionProfileId,
        crewSize,
        rooms: []
      });
      setSelectedRoomId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-space-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        missionProfileId={missionProfileId}
        onChangeMissionProfile={setMissionProfileId}
        crewSize={crewSize}
        onChangeCrewSize={setCrewSize}
        onLoadPreset={handleLoadPreset}
        showEvacRoutes={showEvacRoutes}
        onToggleEvacRoutes={() => setShowEvacRoutes(v => !v)}
        onSaveSnapshot={handleSaveSnapshot}
        savedVersionsCount={savedVersions.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onResetLayout={handleResetLayout}
        theme={theme}
        onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        isCanvasFocused={isCanvasFocused}
        onToggleFocusCanvas={handleToggleFocusCanvas}
      />

      {/* Score Telemetry HUD (Minimizable) */}
      <ScoreCard
        validation={validation}
        onRunSimulation={() => setIsSimulating(v => !v)}
        isSimulating={isSimulating}
        onOpenOptimizer={() => setIsOptimizerOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        bestSwap={bestSwap}
        isMinimized={isScoreMinimized}
        onToggleMinimize={() => setIsScoreMinimized(v => !v)}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Module Palette (Minimizable) */}
        <RoomPalette
          onAddRoom={handleAddRoom}
          crewSize={crewSize}
          isMinimized={isPaletteMinimized}
          onToggleMinimize={() => setIsPaletteMinimized(v => !v)}
        />

        {/* Center: The Capsule Design Canvas (Styled exactly as reference) */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100/70 dark:bg-space-950/80">
          <Canvas2D
            layout={currentLayout}
            onUpdateLayout={handleUpdateLayout}
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
            validation={validation}
            showEvacRoutes={showEvacRoutes}
            isSimulating={isSimulating}
            onAddRoom={handleAddRoom}
            onUndo={history.length > 0 ? handleUndo : null}
            habitatShape={habitatShape}
          />
        </div>

        {/* Right: Rules Validation & Penalties (Minimizable) */}
        <IssuesList
          issues={validation.issues}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
          isMinimized={isIssuesMinimized}
          onToggleMinimize={() => setIsIssuesMinimized(v => !v)}
        />

        {/* Floating Room Inspector Drawer when room is clicked */}
        {selectedRoom && (
          <RoomInspector
            room={selectedRoom}
            onClose={() => setSelectedRoomId(null)}
            onUpdateRoom={handleUpdateRoom}
            onDeleteRoom={handleDeleteRoom}
            onDuplicateRoom={handleDuplicateRoom}
            validation={validation}
            crewSize={crewSize}
            isPaletteMinimized={isPaletteMinimized}
          />
        )}
      </div>

      {/* Modals */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentLayout={currentLayout}
        savedVersions={savedVersions}
        onLoadVersion={(layout) => {
          pushHistory(currentLayout);
          setCurrentLayout(layout);
          setSelectedRoomId(null);
        }}
        crewSize={crewSize}
        missionProfileId={missionProfileId}
      />

      <OptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
        bestSwap={bestSwap}
        onApplySwap={handleApplySwap}
      />

      <AIExplanationModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        validation={validation}
        layout={currentLayout}
        crewSize={crewSize}
        missionProfile={activeMission}
      />
    </div>
  );
}
