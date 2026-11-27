import React, { useState, useMemo } from 'react';
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
  // Initialize with the flawed layout preset to clearly showcase problem & solution
  const [currentLayout, setCurrentLayout] = useState(PRESET_LAYOUTS[0]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [crewSize, setCrewSize] = useState(4);
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
      name: 'Baseline Flawed Layout',
      description: 'Initial manual proposal with acoustic and egress flaws',
      timestamp: new Date().toLocaleTimeString(),
      layout: PRESET_LAYOUTS[0]
    },
    {
      id: 'snapshot-preset-2',
      name: 'NASA Compliant Revision',
      description: 'Optimized revision with acoustic buffer and direct exit',
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
  const handleAddRoom = (typeDef, w, h) => {
    // Find an unoccupied spot
    const newRoom = {
      id: `room-${Date.now()}`,
      type: typeDef.id,
      name: typeDef.name,
      x: 3 + ((currentLayout.rooms.length * 2) % 18),
      y: 3 + ((currentLayout.rooms.length * 2) % 12),
      w: w || 4,
      h: h || 3
    };

    setCurrentLayout(prev => ({
      ...prev,
      rooms: [...prev.rooms, newRoom]
    }));
    setSelectedRoomId(newRoom.id);
  };

  const handleUpdateRoom = (updatedRoom) => {
    setCurrentLayout(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r)
    }));
  };

  const handleDeleteRoom = (roomId) => {
    setCurrentLayout(prev => ({
      ...prev,
      rooms: prev.rooms.filter(r => r.id !== roomId)
    }));
    if (selectedRoomId === roomId) setSelectedRoomId(null);
  };

  const handleDuplicateRoom = (room) => {
    const duplicated = {
      ...room,
      id: `room-${Date.now()}`,
      name: `${room.name} (Copy)`,
      x: room.x + 2,
      y: room.y + 2
    };
    setCurrentLayout(prev => ({
      ...prev,
      rooms: [...prev.rooms, duplicated]
    }));
    setSelectedRoomId(duplicated.id);
  };

  const handleLoadPreset = (preset) => {
    setCurrentLayout(preset);
    setSelectedRoomId(null);
    if (preset.crewSize) setCrewSize(preset.crewSize);
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

    // Visual feedback
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.2 }
    });
  };

  const handleApplySwap = (newLayout) => {
    setCurrentLayout(newLayout);
    confetti({
      particleCount: 100,
      spread: 70,
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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-space-950 text-slate-100 font-sans">
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
      />

      {/* Score Telemetry HUD */}
      <ScoreCard
        validation={validation}
        onRunSimulation={() => setIsSimulating(v => !v)}
        isSimulating={isSimulating}
        onOpenOptimizer={() => setIsOptimizerOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        bestSwap={bestSwap}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Module Palette */}
        <RoomPalette
          onAddRoom={handleAddRoom}
          crewSize={crewSize}
        />

        {/* Center: 2D Interactive Canvas */}
        <Canvas2D
          layout={currentLayout}
          onUpdateLayout={setCurrentLayout}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
          validation={validation}
          showEvacRoutes={showEvacRoutes}
          isSimulating={isSimulating}
        />

        {/* Right: Rules Validation & Penalties */}
        <IssuesList
          issues={validation.issues}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
          onApplyFix={handleApplySwap}
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
