import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  Sparkles, 
  FileText, 
  Activity, 
  Maximize, 
  VolumeX, 
  DoorOpen 
} from 'lucide-react';

export default function ScoreCard({
  validation,
  onRunSimulation,
  isSimulating,
  onOpenOptimizer,
  onOpenReport,
  bestSwap
}) {
  const score = validation?.score ?? 0;
  const breakdown = validation?.breakdown || {
    spaceScore: 0,
    maxSpace: 25,
    adjacencyScore: 0,
    maxAdjacency: 30,
    egressScore: 0,
    maxEgress: 35,
    safetyScore: 0,
    maxSafety: 10
  };

  // SVG circular gauge calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreStrokeColor = 
    score >= 90 ? '#10b981' :
    score >= 75 ? '#f59e0b' :
    score >= 50 ? '#f97316' : '#ef4444';

  return (
    <div className="bg-space-900 border-b border-space-800 p-4 select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Score Telemetry Gauge */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-space-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={scoreStrokeColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                {score}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                / 100 PTS
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${validation?.badgeBg || 'bg-slate-800 text-slate-300'}`}>
                {validation?.rating || 'CALCULATING'}
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>Suitability Score</span>
              <span className="text-xs font-normal text-slate-400 font-mono">
                (NASA-STD-3001)
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
              {score >= 90
                ? 'All architectural and human factor safety criteria satisfied.'
                : `${validation?.issues?.length || 0} active violations reducing habitat survivability.`}
            </p>
          </div>
        </div>

        {/* Sub-Score Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
          {/* Space Metric */}
          <div className="bg-space-850 border border-space-800 rounded-lg p-2.5 min-w-[110px]">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-mono">
                <Maximize className="w-3 h-3 text-cyan-400" />
                Space
              </span>
              <span className="font-mono font-bold text-slate-200">
                {breakdown.spaceScore}/{breakdown.maxSpace}
              </span>
            </div>
            <div className="w-full bg-space-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.spaceScore / breakdown.maxSpace) * 100}%` }}
              />
            </div>
          </div>

          {/* Adjacency & Noise Metric */}
          <div className="bg-space-850 border border-space-800 rounded-lg p-2.5 min-w-[110px]">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-mono">
                <VolumeX className="w-3 h-3 text-red-400" />
                Acoustics
              </span>
              <span className="font-mono font-bold text-slate-200">
                {breakdown.adjacencyScore}/{breakdown.maxAdjacency}
              </span>
            </div>
            <div className="w-full bg-space-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  breakdown.adjacencyScore < breakdown.maxAdjacency ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${(breakdown.adjacencyScore / breakdown.maxAdjacency) * 100}%` }}
              />
            </div>
          </div>

          {/* Evacuation Egress Metric */}
          <div className="bg-space-850 border border-space-800 rounded-lg p-2.5 min-w-[110px]">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-mono">
                <DoorOpen className="w-3 h-3 text-emerald-400" />
                Egress
              </span>
              <span className="font-mono font-bold text-slate-200">
                {breakdown.egressScore}/{breakdown.maxEgress}
              </span>
            </div>
            <div className="w-full bg-space-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  breakdown.egressScore < breakdown.maxEgress ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${(breakdown.egressScore / breakdown.maxEgress) * 100}%` }}
              />
            </div>
          </div>

          {/* Safety Metric */}
          <div className="bg-space-850 border border-space-800 rounded-lg p-2.5 min-w-[110px]">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                Geometry
              </span>
              <span className="font-mono font-bold text-slate-200">
                {breakdown.safetyScore}/{breakdown.maxSafety}
              </span>
            </div>
            <div className="w-full bg-space-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.safetyScore / breakdown.maxSafety) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Evacuation Sim Button */}
          <button
            onClick={onRunSimulation}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              isSimulating
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-space-800 hover:bg-space-700 text-emerald-400 border-emerald-500/30'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulation Active' : 'Evac Simulation'}</span>
          </button>

          {/* Smart Optimizer Button */}
          <button
            onClick={onOpenOptimizer}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              bestSwap
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse'
                : 'bg-space-800 hover:bg-space-700 text-cyan-400 border-cyan-500/30'
            }`}
            title={bestSwap ? `Smart Fix Available: +${bestSwap.gain} pts` : 'Analyze Layout Optimization'}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{bestSwap ? `Smart Fix (+${bestSwap.gain} pts)` : 'Optimize'}</span>
          </button>

          {/* AI Explanation / Report */}
          <button
            onClick={onOpenReport}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 flex items-center gap-1.5 transition"
            title="Generate NASA Mission Safety Debrief"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Debrief</span>
          </button>
        </div>
      </div>
    </div>
  );
}
