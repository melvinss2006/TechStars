import React, { useState } from 'react';
import { X, Copy, Check, FileText, Printer, ShieldAlert, Award, Sparkles } from 'lucide-react';

export default function AIExplanationModal({
  isOpen,
  onClose,
  validation,
  layout,
  crewSize,
  missionProfile
}) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const score = validation?.score ?? 0;
  const issues = validation?.issues || [];

  const generateReportText = () => {
    return `# NASA-STD-3001 HUMAN FACTORS & HABITABILITY EVALUATION REPORT
========================================================================
MISSION: ${missionProfile?.name || 'Lunar Surface Habitat'}
CREW COMPLEMENT: ${crewSize} Astronauts | GRAVITY REGIME: ${missionProfile?.gravity || '0.166g'}
TOTAL NET HABITABLE AREA: ${validation?.totalArea || 0} m²
OVERALL SUITABILITY SCORE: ${score} / 100 PTS [${validation?.rating || 'EVALUATION PENDING'}]
DATE OF EVALUATION: ${new Date().toISOString().split('T')[0]}

1. EXECUTIVE SUMMARY
------------------------------------------------------------------------
The evaluated habitat layout was screened against deterministic architectural
and human factors standards specified in NASA-STD-3001 Volume 2 and the NASA
Human Integration Design Handbook (HIDH).

Current Suitability Status: ${score >= 90 ? 'PASSED - Flight Ready' : 'NON-COMPLIANT - Mitigations Required'}
Active Safety & Architectural Violations: ${issues.length} detected.

2. SUB-SYSTEM COMPLIANCE BREAKDOWN
------------------------------------------------------------------------
- Space Allocation & Net Habitable Volume: ${validation?.breakdown?.spaceScore} / 25 pts
- Acoustic Zoning & Compartment Adjacency: ${validation?.breakdown?.adjacencyScore} / 30 pts
- Rapid Egress & Depressurization Safety: ${validation?.breakdown?.egressScore} / 35 pts
- Structural & Coordinate Geometry:        ${validation?.breakdown?.safetyScore} / 10 pts

3. IDENTIFIED HAZARDS & REGULATORY DEFICIENCIES
------------------------------------------------------------------------
${issues.length === 0 ? 'No architectural violations detected. Habitat layout conforms to all primary human habitability parameters.' : issues.map((issue, idx) => `
[${idx + 1}] ${issue.title.toUpperCase()} (Severity: ${issue.severity} | Penalty: -${issue.penalty} pts)
    - Cause: ${issue.reason}
    - Regulatory Standard: ${issue.reference || 'NASA-STD-3001 Vol 2'}
    - Engineering Fix: ${issue.fixSuggestion}
`).join('\n')}

4. HUMAN INTEGRATION RECOMMENDATIONS
------------------------------------------------------------------------
${score < 90 ? `1. Relocate vibrating countermeasures (exercise equipment) away from crew rest compartments, inserting storage or corridor buffers.
2. Ensure personal hygiene / fecal containment modules maintain bio-barrier distance from galley food preparation areas.
3. Verify uninhibited 2-point redundant evacuation paths to all surface airlocks with minimum 1.0m wide corridors.` : `1. Layout fulfills primary habitability requirements. Proceed with structural mass optimization and ECLSS duct routing.`}

Report compiled by TechStars Habitat Layout Creator Engine (SW-4).
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="bg-space-900 border border-space-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-space-800 flex items-center justify-between bg-space-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>NASA Safety Debrief & Findings</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Plain-Language AI Debrief
                </span>
              </h3>
              <p className="text-xs text-slate-400">Comprehensive human factors assessment generated from deterministic rules.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-space-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300 space-y-5 bg-space-950/80">
          {/* Mission Telemetry Summary */}
          <div className="p-4 rounded-lg bg-space-900 border border-space-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Mission</div>
              <div className="font-bold text-slate-200 truncate">{missionProfile?.name || 'Lunar Base'}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Crew Size</div>
              <div className="font-bold text-slate-200">{crewSize} Astronauts</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Hab Area</div>
              <div className="font-bold text-slate-200">{validation?.totalArea || 0} m²</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Suitability</div>
              <div className={`font-bold ${score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {score} / 100
              </div>
            </div>
          </div>

          {/* Detailed Plain-Language Findings */}
          <div>
            <h4 className="text-xs uppercase font-bold text-cyan-400 mb-2 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Plain-Language Explanation
            </h4>
            <div className="p-4 rounded-lg bg-space-900 border border-space-800 leading-relaxed text-slate-300 space-y-3">
              <p>
                {score >= 90 ? (
                  <span className="text-emerald-300">
                    This habitat layout achieves an exemplary suitability rating ({score}/100). Noise emission zones such as the Exercise countermeasures room are properly separated from crew sleeping bunks, personal hygiene facilities do not risk contaminating food preparation zones, and every module maintains uninhibited emergency egress routes to an airlock.
                  </span>
                ) : (
                  <span className="text-amber-300">
                    The current layout triggers {issues.length} architectural penalties under NASA-STD-3001 guidelines, reducing crew survivability and operational efficiency to {score}/100. Key deficiencies must be mitigated prior to flight authorization.
                  </span>
                )}
              </p>

              {issues.map((issue, idx) => (
                <div key={idx} className="p-3 rounded bg-space-850 border border-space-700/80 text-[11px] space-y-1">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{idx + 1}. {issue.title}</span>
                    <span className="text-red-400 font-mono">-{issue.penalty} pts</span>
                  </div>
                  <div className="text-slate-300">{issue.reason}</div>
                  {issue.reference && <div className="text-cyan-400/90 text-[10px]">Reference: {issue.reference}</div>}
                  {issue.fixSuggestion && (
                    <div className="text-emerald-400 font-sans text-[11px]">Suggested Fix: {issue.fixSuggestion}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-space-800 bg-space-850 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Powered by TechStars SW-4 Validation Engine
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 flex items-center gap-1.5 transition font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Report'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition font-mono"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
