import React from 'react';
import { 
  ShieldCheck, 
  Play, 
  Sparkles, 
  FileText, 
  Maximize, 
  VolumeX, 
  DoorOpen,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export default function ScoreCard({
  validation,
  onRunSimulation,
  isSimulating,
  onOpenOptimizer,
  onOpenReport,
  bestSwap,
  isMinimized,
  onToggleMinimize
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

  // Minimized Compact Telemetry Bar
  if (isMinimized) {
    return (
      <div className="bg-white/95 dark:bg-space-900/95 border-b border-slate-200 dark:border-space-800 px-4 py-1.5 flex items-center justify-between gap-3 select-none transition-all duration-200">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: scoreStrokeColor }}
            />
            <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
              SCORE: {score}/100
            </span>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap ${validation?.badgeBg || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
            {validation?.rating || 'CALCULATING'}
          </span>
          <span className="hidden md:inline text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Space {breakdown.spaceScore}/{breakdown.maxSpace} • Acoustics {breakdown.adjacencyScore}/{breakdown.maxAdjacency} • Egress {breakdown.egressScore}/{breakdown.maxEgress}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onRunSimulation}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition border ${
              isSimulating
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-space-800 dark:hover:bg-space-700 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
            }`}
          >
            <Play className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSimulating ? 'Sim Active' : 'Evac Sim'}</span>
          </button>

          <button
            onClick={onOpenOptimizer}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition border ${
              bestSwap
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-space-800 dark:hover:bg-space-700 text-cyan-700 dark:text-cyan-400 border-cyan-500/30'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">{bestSwap ? `Fix (+${bestSwap.gain})` : 'Optimize'}</span>
          </button>

          <button
            onClick={onOpenReport}
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-space-800 dark:hover:bg-space-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-space-700 flex items-center gap-1 transition"
          >
            <FileText className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">Debrief</span>
          </button>

          <button
            onClick={onToggleMinimize}
            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-space-800 dark:hover:bg-space-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-space-700 transition"
            title="Expand Score HUD"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 dark:bg-space-900 border-b border-slate-200 dark:border-space-800 px-4 py-3 select-none relative transition-colors duration-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Score Telemetry Gauge */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-200 dark:stroke-space-800"
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
              <span className="text-xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {score}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                / 100 PTS
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${validation?.badgeBg || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                {validation?.rating || 'CALCULATING'}
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Suitability Score</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-mono">
                (NASA-STD-3001)
              </span>
            </h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 max-w-xs mt-0.5">
              {score >= 90
                ? 'All architectural and human factor safety criteria satisfied.'
                : `${validation?.issues?.length || 0} active violations reducing habitat survivability.`}
            </p>
          </div>
        </div>

        {/* Sub-Score Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
          {/* Space Metric */}
          <div className="bg-slate-50 dark:bg-space-850 border border-slate-200 dark:border-space-800 rounded-lg p-2.5 min-w-[110px]">
            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-mono">
                <Maximize className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                Space
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                {breakdown.spaceScore}/{breakdown.maxSpace}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-space-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.spaceScore / breakdown.maxSpace) * 100}%` }}
              />
            </div>
          </div>

          {/* Adjacency & Noise Metric */}
          <div className="bg-slate-50 dark:bg-space-850 border border-slate-200 dark:border-space-800 rounded-lg p-2.5 min-w-[110px]">
            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-mono">
                <VolumeX className="w-3 h-3 text-red-500 dark:text-red-400" />
                Acoustics
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                {breakdown.adjacencyScore}/{breakdown.maxAdjacency}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-space-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  breakdown.adjacencyScore < breakdown.maxAdjacency ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${(breakdown.adjacencyScore / breakdown.maxAdjacency) * 100}%` }}
              />
            </div>
          </div>

          {/* Evacuation Egress Metric */}
          <div className="bg-slate-50 dark:bg-space-850 border border-slate-200 dark:border-space-800 rounded-lg p-2.5 min-w-[110px]">
            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-mono">
                <DoorOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Egress
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                {breakdown.egressScore}/{breakdown.maxEgress}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-space-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  breakdown.egressScore < breakdown.maxEgress ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${(breakdown.egressScore / breakdown.maxEgress) * 100}%` }}
              />
            </div>
          </div>

          {/* Safety Metric */}
          <div className="bg-slate-50 dark:bg-space-850 border border-slate-200 dark:border-space-800 rounded-lg p-2.5 min-w-[110px]">
            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                Geometry
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                {breakdown.safetyScore}/{breakdown.maxSafety}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-space-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.safetyScore / breakdown.maxSafety) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls + Minimize Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onRunSimulation}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              isSimulating
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-space-800 dark:hover:bg-space-700 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulation Active' : 'Evac Simulation'}</span>
          </button>

          <button
            onClick={onOpenOptimizer}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              bestSwap
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-space-800 dark:hover:bg-space-700 text-cyan-700 dark:text-cyan-400 border-cyan-500/30'
            }`}
            title={bestSwap ? `Smart Fix Available: +${bestSwap.gain} pts` : 'Analyze Layout Optimization'}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{bestSwap ? `Smart Fix (+${bestSwap.gain} pts)` : 'Optimize'}</span>
          </button>

          <button
            onClick={onOpenReport}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-space-800 dark:hover:bg-space-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-space-700 flex items-center gap-1.5 transition"
            title="Generate NASA Mission Safety Debrief"
          >
            <FileText className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Debrief</span>
          </button>

          <button
            onClick={onToggleMinimize}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-space-800 dark:hover:bg-space-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-space-700 transition"
            title="Minimize Score HUD"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
