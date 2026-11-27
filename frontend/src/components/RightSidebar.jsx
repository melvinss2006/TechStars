import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Zap, 
  Sparkles,
  Maximize2,
  Volume2,
  DoorOpen,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function RightSidebar({
  validation,
  crewSize,
  bestSwap,
  onApplySwap,
  onSelectRoom,
  selectedRoomId
}) {
  const score = validation?.score ?? 0;
  const issues = validation?.issues || [];
  const breakdown = validation?.breakdown || {
    spaceScore: 25,
    maxSpace: 25,
    adjacencyScore: 30,
    maxAdjacency: 30,
    egressScore: 35,
    maxEgress: 35,
    safetyScore: 10,
    maxSafety: 10
  };

  const [expandedCheck, setExpandedCheck] = useState(null);

  // Categorize checks
  const spaceIssues = issues.filter(i => i.category === 'Space Allocation');
  const adjacencyIssues = issues.filter(i => i.category === 'Adjacency & Noise');
  const egressIssues = issues.filter(i => i.category === 'Emergency Egress');
  const geometryIssues = issues.filter(i => i.category === 'Geometry');

  // Gauge calculations
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const scoreStrokeColor = 
    score >= 90 ? '#10b981' :
    score >= 75 ? '#f59e0b' :
    score >= 50 ? '#f97316' : '#ef4444';

  const checksPassed = [
    spaceIssues.length === 0,
    adjacencyIssues.length === 0,
    egressIssues.length === 0,
    geometryIssues.length === 0
  ].filter(Boolean).length;

  return (
    <div className="w-full lg:w-80 flex flex-col gap-4 select-none">
      {/* Card 03: LAYOUT SCORE */}
      <div className="bg-white dark:bg-space-900 border border-slate-200 dark:border-space-800 rounded-2xl shadow-sm p-4 transition-colors duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold flex items-center justify-center border border-slate-300 dark:border-slate-700">
              03
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              LAYOUT SCORE
            </span>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            score >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700' :
            score >= 75 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700' :
            'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700'
          }`}>
            {score >= 90 ? 'OPTIMAL' : score >= 75 ? 'REVIEW' : 'CRITICAL'}
          </span>
        </div>

        {/* Circular Progress & Status Title */}
        <div className="flex items-center gap-4 py-1">
          <div className="relative w-18 h-18 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 84 84">
              <circle
                cx="42"
                cy="42"
                r={radius}
                className="stroke-slate-100 dark:stroke-space-800"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="42"
                cy="42"
                r={radius}
                stroke={scoreStrokeColor}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {score}
              </span>
              <span className="text-[8px] font-mono text-slate-400 -mt-0.5">
                /100
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {score >= 90 ? 'Mission ready' : score >= 75 ? 'Minor revisions' : 'Hazard flagged'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
              {score >= 90 
                ? 'A well-balanced, safe layout.'
                : `${issues.length} active rule penalties to resolve.`}
            </p>
          </div>
        </div>

        {/* Subtle Horizontal Meter */}
        <div className="w-full bg-slate-100 dark:bg-space-800 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${score}%`,
              backgroundColor: scoreStrokeColor 
            }}
          />
        </div>
      </div>

      {/* Card: Automatic checks */}
      <div className="bg-white dark:bg-space-900 border border-slate-200 dark:border-space-800 rounded-2xl shadow-sm p-4 flex flex-col gap-3 transition-colors duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-space-800 pb-2">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Automatic checks
          </span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {checksPassed}/4 passed
          </span>
        </div>

        {/* Check Items List */}
        <div className="space-y-2">
          {/* 1. Habitable volume */}
          <div
            onClick={() => setExpandedCheck(expandedCheck === 'volume' ? null : 'volume')}
            className="p-2.5 rounded-xl border border-slate-100 dark:border-space-800 hover:bg-slate-50 dark:hover:bg-space-850 cursor-pointer transition flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {spaceIssues.length === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Habitable volume
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {validation?.totalArea || 0} m² total • {((validation?.totalArea || 0) / crewSize).toFixed(1)} m² per crew
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedCheck === 'volume' ? 'rotate-90' : ''}`} />
            </div>

            {expandedCheck === 'volume' && (
              <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-space-700/60 space-y-1">
                {spaceIssues.length === 0 ? (
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                    NASA-STD-3001 net habitable volume requirement fully satisfied.
                  </div>
                ) : (
                  spaceIssues.map((iss, i) => (
                    <div key={i} className="text-amber-700 dark:text-amber-300">
                      • {iss.title}: {iss.reason}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 2. Zone adjacency */}
          <div
            onClick={() => setExpandedCheck(expandedCheck === 'adjacency' ? null : 'adjacency')}
            className="p-2.5 rounded-xl border border-slate-100 dark:border-space-800 hover:bg-slate-50 dark:hover:bg-space-850 cursor-pointer transition flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {adjacencyIssues.length === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Zone adjacency
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {adjacencyIssues.length === 0 
                      ? 'All critical separations are clear'
                      : `${adjacencyIssues.length} separation conflict detected`}
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedCheck === 'adjacency' ? 'rotate-90' : ''}`} />
            </div>

            {expandedCheck === 'adjacency' && (
              <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-space-700/60 space-y-1">
                {adjacencyIssues.length === 0 ? (
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                    No acoustic or cross-contamination overlaps present.
                  </div>
                ) : (
                  adjacencyIssues.map((iss, i) => (
                    <div key={i} className="text-rose-700 dark:text-rose-300">
                      • {iss.title}: {iss.reason}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 3. Emergency egress */}
          <div
            onClick={() => setExpandedCheck(expandedCheck === 'egress' ? null : 'egress')}
            className="p-2.5 rounded-xl border border-slate-100 dark:border-space-800 hover:bg-slate-50 dark:hover:bg-space-850 cursor-pointer transition flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {egressIssues.length === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Emergency egress
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {egressIssues.length === 0 
                      ? 'Direct BFS path to primary airlock' 
                      : 'Blocked or disconnected route detected'}
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedCheck === 'egress' ? 'rotate-90' : ''}`} />
            </div>

            {expandedCheck === 'egress' && (
              <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-space-700/60 space-y-1">
                {egressIssues.length === 0 ? (
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Every compartment has verified reachability to surface airlocks.
                  </div>
                ) : (
                  egressIssues.map((iss, i) => (
                    <div key={i} className="text-rose-700 dark:text-rose-300">
                      • {iss.title}: {iss.reason}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 4. Essential zones */}
          <div
            onClick={() => setExpandedCheck(expandedCheck === 'essential' ? null : 'essential')}
            className="p-2.5 rounded-xl border border-slate-100 dark:border-space-800 hover:bg-slate-50 dark:hover:bg-space-850 cursor-pointer transition flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {validation?.roomCount >= 6 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Essential zones
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {validation?.roomCount >= 6 ? 'Full zone coverage deployed' : 'Missing essential compartments'}
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedCheck === 'essential' ? 'rotate-90' : ''}`} />
            </div>

            {expandedCheck === 'essential' && (
              <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-space-700/60">
                Habitat includes sleeping, hygiene, galley, medical, work, exercise, storage, and emergency airlock egress.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dark Recommendation Card: Top improvement */}
      <div className="bg-[#111827] text-white rounded-2xl p-4 shadow-md flex flex-col gap-2.5 border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
          <Zap className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Top improvement</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {bestSwap ? (
            bestSwap.type === 'CONNECT'
              ? `Connect trapped module ${bestSwap.roomA?.name} to corridor to restore airlock access (+${bestSwap.gain} pts).`
              : `Swap ${bestSwap.roomA?.name} with ${bestSwap.roomB?.name} to eliminate acoustic interference (+${bestSwap.gain} pts).`
          ) : (
            'Add additional storage buffer zone near food preparation for faster daily operations.'
          )}
        </p>

        {bestSwap && onApplySwap && (
          <button
            onClick={() => onApplySwap(bestSwap.newLayout)}
            className="self-start text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition pt-1 group"
          >
            <span>Apply suggestion</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </button>
        )}
      </div>
    </div>
  );
}
