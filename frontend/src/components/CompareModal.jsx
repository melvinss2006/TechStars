import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeftRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { validateLayout } from '../services/validationEngine';

export default function CompareModal({
  isOpen,
  onClose,
  currentLayout,
  savedVersions = [],
  onLoadVersion,
  crewSize,
  missionProfileId
}) {
  if (!isOpen) return null;

  const currentValidation = validateLayout(currentLayout, crewSize, missionProfileId);
  const [selectedVersionId, setSelectedVersionId] = useState(
    savedVersions[0]?.id || null
  );

  const compareVersion = savedVersions.find(v => v.id === selectedVersionId) || savedVersions[0];
  const compareValidation = compareVersion 
    ? validateLayout(compareVersion.layout, crewSize, missionProfileId)
    : null;

  const scoreDelta = compareValidation 
    ? currentValidation.score - compareValidation.score 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="bg-space-900 border border-space-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-space-800 flex items-center justify-between bg-space-850">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">Compare Layout Versions</h3>
              <p className="text-xs text-slate-400">Side-by-side analysis of score, rule penalties, and space allocation.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-space-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version Selector Tabs */}
        <div className="px-6 py-2.5 bg-space-950/60 border-b border-space-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono text-slate-400 mr-2">Compare Against:</span>
          {savedVersions.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVersionId(v.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                selectedVersionId === v.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-space-800 text-slate-400 hover:text-slate-200 border border-space-700'
              }`}
            >
              {v.name}
            </button>
          ))}
          {savedVersions.length === 0 && (
            <span className="text-xs text-slate-500 italic">No saved snapshots yet. Save snapshots from the top bar!</span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Current Active Layout */}
          <div className="p-4 rounded-xl border border-cyan-500/40 bg-space-850/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                  CURRENT EDITOR
                </span>
                <span className="text-xs font-mono text-slate-400">{currentLayout.rooms?.length || 0} Modules</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{currentLayout.name || 'Active Canvas'}</h4>
              <p className="text-xs text-slate-400 mb-4">{currentLayout.description || 'Current working draft on the 2D canvas.'}</p>

              {/* Score Display */}
              <div className="flex items-center gap-3 p-3 bg-space-900 rounded-lg border border-space-800 mb-4">
                <span className="text-3xl font-black font-mono text-white">
                  {currentValidation.score}
                </span>
                <div>
                  <div className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border inline-block ${currentValidation.badgeBg}`}>
                    {currentValidation.rating}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    Total Habitable Area: {currentValidation.totalArea} m²
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-space-900/50 border border-space-800">
                  <span className="text-slate-400">Space Allocation:</span>
                  <span className="text-slate-200">{currentValidation.breakdown.spaceScore} / 25</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-space-900/50 border border-space-800">
                  <span className="text-slate-400">Acoustics & Adjacency:</span>
                  <span className="text-slate-200">{currentValidation.breakdown.adjacencyScore} / 30</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-space-900/50 border border-space-800">
                  <span className="text-slate-400">Emergency Egress:</span>
                  <span className="text-slate-200">{currentValidation.breakdown.egressScore} / 35</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-space-900/50 border border-space-800">
                  <span className="text-slate-400">Total Rule Penalties:</span>
                  <span className="text-red-400 font-bold">{currentValidation.issues.length} active</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-space-800">
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Active in Editor Viewport
              </span>
            </div>
          </div>

          {/* Right: Selected Compare Version */}
          {compareVersion && compareValidation ? (
            <div className="p-4 rounded-xl border border-space-700 bg-space-850/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400 px-2 py-0.5 rounded bg-space-800 border border-space-700">
                    SAVED SNAPSHOT
                  </span>
                  <span className="text-xs font-mono text-slate-400">{compareVersion.layout?.rooms?.length || 0} Modules</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{compareVersion.name}</h4>
                <p className="text-xs text-slate-400 mb-4">{compareVersion.description || 'Snapshot version.'}</p>

                {/* Score Display */}
                <div className="flex items-center gap-3 p-3 bg-space-900 rounded-lg border border-space-800 mb-4">
                  <span className="text-3xl font-black font-mono text-white">
                    {compareValidation.score}
                  </span>
                  <div>
                    <div className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border inline-block ${compareValidation.badgeBg}`}>
                      {compareValidation.rating}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Total Habitable Area: {compareValidation.totalArea} m²
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-space-900/50 border border-space-800">
                    <span className="text-slate-400">Space Allocation:</span>
                    <span className="text-slate-200">{compareValidation.breakdown.spaceScore} / 25</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-space-900/50 border border-space-800">
                    <span className="text-slate-400">Acoustics & Adjacency:</span>
                    <span className="text-slate-200">{compareValidation.breakdown.adjacencyScore} / 30</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-space-900/50 border border-space-800">
                    <span className="text-slate-400">Emergency Egress:</span>
                    <span className="text-slate-200">{compareValidation.breakdown.egressScore} / 35</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-space-900/50 border border-space-800">
                    <span className="text-slate-400">Total Rule Penalties:</span>
                    <span className="text-red-400 font-bold">{compareValidation.issues.length} active</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-space-800 flex items-center justify-between">
                <span className={`text-xs font-mono font-bold ${scoreDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {scoreDelta >= 0 ? `Current is +${scoreDelta} pts better` : `Current is ${scoreDelta} pts behind`}
                </span>
                <button
                  onClick={() => {
                    onLoadVersion(compareVersion.layout);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center gap-1 font-mono"
                >
                  <span>Restore Snapshot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-space-800 flex flex-col items-center justify-center text-center text-slate-500">
              <p className="text-xs">Select or save a snapshot to compare side-by-side.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
