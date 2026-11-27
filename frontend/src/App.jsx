import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PRESET_LAYOUTS } from './constants/presets';
import { MISSION_PROFILES } from './constants/habitatRules';
import { validateLayout } from './services/validationEngine';
import { findBestOptimization } from './services/optimizer';

import LeftRail from './components/LeftRail';
import TopHeader from './components/TopHeader';
import MissionParameters from './components/MissionParameters';
import Canvas2D from './components/Canvas2D';
import RightSidebar from './components/RightSidebar';
import RoomInspector from './components/RoomInspector';
import CompareModal from './components/CompareModal';
import OptimizerModal from './components/OptimizerModal';
import AIExplanationModal from './components/AIExplanationModal';

export default function App() {
  // Theme state ('light' as default to match reference, with seamless 'dark' toggle)
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

  // Active rail tab
  const [activeTab, setActiveTab] = useState('grid');

  // Layout & Mission State
  // Initialized with the reference optimal layout matching the uploaded screenshot!
  const [currentLayout, setCurrentLayout] = useState(PRESET_LAYOUTS[0]);
  const [history, setHistory] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [crewSize, setCrewSize] = useState(4);
  const [durationDays, setDurationDays] = useState(180);
  const [habitatShape, setHabitatShape] = useState('cylinder');
  const [missionProfileId, setMissionProfileId] = useState('lunar_surface');
  const [showEvacRoutes, setShowEvacRoutes] = useState(true);

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

  // Handlers with Undo support
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
    if (preset.durationDays) setDurationDays(preset.durationDays);
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
    downloadAnchor.setAttribute('download', `${currentLayout.id || 'habitat-planner'}-export.json`);
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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] dark:bg-space-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* 1. Left Slim Dark Navigation Rail */}
      <LeftRail
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
      />

      {/* 2. Main Right Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader
          onLoadPreset={handleLoadPreset}
          onSaveSnapshot={handleSaveSnapshot}
          onOpenCompare={() => setIsCompareOpen(true)}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
          savedVersionsCount={savedVersions.length}
        />

        {/* Scrollable Main Content: Mission parameters + Zone layout + Right Sidebar */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="max-w-[1560px] mx-auto flex flex-col lg:flex-row gap-5 items-start">
            {/* Left & Center Column: Card 01 (Parameters) + Card 02 (Zone Layout Canvas) */}
            <div className="flex-1 flex flex-col gap-5 w-full">
              {/* Card 01: Mission parameters */}
              <MissionParameters
                crewSize={crewSize}
                onChangeCrewSize={setCrewSize}
                durationDays={durationDays}
                onChangeDuration={setDurationDays}
                habitatShape={habitatShape}
                onChangeHabitatShape={setHabitatShape}
                totalArea={validation?.totalArea || 104}
                recommendedArea={activeMission.recommendedTotalArea}
              />

              {/* Card 02: Zone layout (The Canvas) */}
              <Canvas2D
                layout={currentLayout}
                onUpdateLayout={handleUpdateLayout}
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
                validation={validation}
                showEvacRoutes={showEvacRoutes}
                onAddRoom={handleAddRoom}
                onUndo={history.length > 0 ? handleUndo : null}
                habitatShape={habitatShape}
              />
            </div>

            {/* Right Column: Card 03 (Layout Score) + Automatic checks + Top improvement */}
            <RightSidebar
              validation={validation}
              crewSize={crewSize}
              bestSwap={bestSwap}
              onApplySwap={handleApplySwap}
              onSelectRoom={setSelectedRoomId}
              selectedRoomId={selectedRoomId}
            />
          </div>
        </main>
      </div>

      {/* Floating Module Inspector when a room is clicked */}
      {selectedRoom && (
        <RoomInspector
          room={selectedRoom}
          onClose={() => setSelectedRoomId(null)}
          onUpdateRoom={handleUpdateRoom}
          onDeleteRoom={handleDeleteRoom}
          onDuplicateRoom={handleDuplicateRoom}
          validation={validation}
          crewSize={crewSize}
          isPaletteMinimized={true}
        />
      )}

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
