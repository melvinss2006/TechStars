import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Filter, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  Flame,
  Search
} from 'lucide-react';

export default function IssuesList({
  issues = [],
  selectedRoomId,
  onSelectRoom,
  onApplyFix
}) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredIssues = issues.filter(issue => {
    if (filterCategory !== 'ALL' && issue.category !== filterCategory) return false;
    if (filterSeverity !== 'ALL' && issue.severity !== filterSeverity) return false;
    return true;
  });

  const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length;
  const warningCount = issues.filter(i => i.severity === 'HIGH' || i.severity === 'MEDIUM').length;

  return (
    <div className="w-80 bg-space-900 border-l border-space-800 flex flex-col h-full overflow-hidden select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-space-800 bg-space-850/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            Rule Validation Engine
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-space-800 border border-space-700 text-slate-300">
            {issues.length} {issues.length === 1 ? 'Penalty' : 'Penalties'}
          </span>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className={`px-2 py-0.5 rounded border ${
            criticalCount > 0 ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-space-800 text-slate-500 border-space-700'
          }`}>
            {criticalCount} Critical
          </span>
          <span className={`px-2 py-0.5 rounded border ${
            warningCount > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-space-800 text-slate-500 border-space-700'
          }`}>
            {warningCount} Warnings
          </span>
          {issues.length === 0 && (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              100% Compliant
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-2 border-b border-space-800 bg-space-900 flex items-center gap-1 text-[11px] overflow-x-auto">
        {['ALL', 'Adjacency & Noise', 'Emergency Egress', 'Space Allocation'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-2 py-1 rounded text-[10px] whitespace-nowrap font-mono transition ${
              filterCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'All' : cat.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Issues List Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">No Active Penalties</h3>
            <p className="text-xs text-slate-400">
              {issues.length === 0 
                ? 'All compartments satisfy NASA-STD-3001 habitability, noise separation, and exit reachability.'
                : 'No issues match the selected category filter.'}
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isCritical = issue.severity === 'CRITICAL';
            const isHigh = issue.severity === 'HIGH';
            const isFocused = issue.affectedRoomIds?.includes(selectedRoomId);

            return (
              <div
                key={issue.id}
                onClick={() => {
                  if (issue.affectedRoomIds && issue.affectedRoomIds.length > 0) {
                    onSelectRoom(issue.affectedRoomIds[0]);
                  }
                }}
                className={`p-3 rounded-lg border transition cursor-pointer relative group flex flex-col gap-2 ${
                  isCritical
                    ? 'bg-red-950/20 border-red-500/50 hover:border-red-400 hover:bg-red-950/30'
                    : isHigh
                    ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-400 hover:bg-amber-950/30'
                    : 'bg-space-850 border-space-800 hover:border-cyan-500/40'
                } ${isFocused ? 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : ''}`}
              >
                {/* Issue Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      isCritical ? 'bg-red-500 text-white' : 
                      isHigh ? 'bg-amber-500 text-black' : 
                      'bg-space-800 text-slate-300 border border-space-700'
                    }`}>
                      {issue.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {issue.category}
                    </span>
                  </div>

                  <span className="font-mono text-xs font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                    -{issue.penalty} pts
                  </span>
                </div>

                {/* Issue Title */}
                <h4 className="text-xs font-semibold text-slate-100 group-hover:text-cyan-200 transition">
                  {issue.title}
                </h4>

                {/* Reason */}
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {issue.reason}
                </p>

                {/* NASA Reference */}
                {issue.reference && (
                  <div className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/40 p-1.5 rounded border border-cyan-800/40">
                    Ref: {issue.reference}
                  </div>
                )}

                {/* Suggested Fix Action */}
                {issue.fixSuggestion && (
                  <div className="text-[10px] text-slate-300 bg-space-800/80 p-2 rounded border border-space-700/80 flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold flex-shrink-0">Fix:</span>
                    <span>{issue.fixSuggestion}</span>
                  </div>
                )}

                {/* Focus Button */}
                {issue.affectedRoomIds && issue.affectedRoomIds.length > 0 && (
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Click to locate in 2D editor</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
