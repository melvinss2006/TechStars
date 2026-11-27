import React from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2, RefreshCw, Zap } from 'lucide-react';

export default function OptimizerModal({
  isOpen,
  onClose,
  bestSwap,
  onApplySwap
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="bg-space-900 border border-space-700 rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-space-800 flex items-center justify-between bg-space-850">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Smart Layout Optimizer</h3>
              <p className="text-xs text-slate-400">Heuristic room swap & position optimizer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-space-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {bestSwap ? (
            <div className="space-y-5">
              {/* Score Uplift Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                    Projected Score Improvement
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-slate-300">
                      {bestSwap.oldScore}
                    </span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    <span className="text-3xl font-black font-mono text-emerald-400">
                      {bestSwap.newScore}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      +{bestSwap.gain} PTS
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-400">
                  <Zap className="w-6 h-6 animate-bounce" />
                </div>
              </div>

              {/* Recommendation Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                  Recommended Action:
                </h4>

                <div className="p-3.5 rounded-lg bg-space-850 border border-space-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-100">
                    <span className="px-2 py-1 rounded bg-space-800 border border-space-700 text-cyan-300">
                      {bestSwap.roomA?.name}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] uppercase">
                      {bestSwap.type === 'CONNECT' ? 'connects to' : 'swaps with'}
                    </span>
                    <span className="px-2 py-1 rounded bg-space-800 border border-space-700 text-cyan-300">
                      {bestSwap.roomB?.name}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {bestSwap.type === 'CONNECT'
                      ? `Relocates disconnected module ${bestSwap.roomA?.name} to link directly with ${bestSwap.roomB?.name}, opening an uninhibited evacuation route to the surface airlock.`
                      : `Swaps module positions to break acoustic contact between loud equipment and sleeping bunks, resolving high-severity rule penalties.`}
                  </p>

                  <div className="text-[11px] font-mono text-emerald-400 pt-1">
                    Resolves: {bestSwap.resolvedIssuesCount} active rule {bestSwap.resolvedIssuesCount === 1 ? 'penalty' : 'penalties'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onApplySwap(bestSwap.newLayout);
                    onClose();
                  }}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition flex items-center gap-1.5 font-mono"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Recommendation</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Habitat Layout is Already Optimal!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No immediate single-step module swaps were found that would improve the current score. Your layout adheres closely to NASA habitability standards.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
