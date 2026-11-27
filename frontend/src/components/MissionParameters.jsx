import React from 'react';
import { Minus, Plus, Users, Clock, Box } from 'lucide-react';

export default function MissionParameters({
  crewSize,
  onChangeCrewSize,
  durationDays = 180,
  onChangeDuration,
  habitatShape = 'cylinder',
  onChangeHabitatShape,
  totalArea = 104,
  recommendedArea = 80
}) {
  return (
    <div className="bg-white dark:bg-space-900 border border-slate-200 dark:border-space-800 rounded-2xl shadow-sm p-4 select-none transition-colors duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold flex items-center justify-center border border-slate-300 dark:border-slate-700">
            01
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Mission parameters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Define your crew and journey
            </p>
          </div>
        </div>

        {/* Parameters Controls Row */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Crew Size Counter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
              <Users className="w-3 h-3" />
              CREW SIZE
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-space-850 border border-slate-200 dark:border-space-750 rounded-xl p-1 gap-2">
              <button
                onClick={() => onChangeCrewSize(Math.max(2, crewSize - 1))}
                className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs transition shadow-2xs font-bold"
                title="Decrease Crew"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono font-bold text-sm min-w-[20px] text-center text-slate-900 dark:text-slate-100">
                {crewSize}
              </span>
              <button
                onClick={() => onChangeCrewSize(Math.min(10, crewSize + 1))}
                className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs transition shadow-2xs font-bold"
                title="Increase Crew"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Mission Duration */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              DURATION
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-space-850 border border-slate-200 dark:border-space-750 rounded-xl px-2.5 py-1 gap-1.5 h-[34px]">
              <input
                type="number"
                min="30"
                max="1000"
                step="30"
                value={durationDays}
                onChange={(e) => onChangeDuration && onChangeDuration(Number(e.target.value))}
                className="w-12 bg-transparent text-sm font-bold font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">days</span>
            </div>
          </div>

          {/* Habitat Shape Pills */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
              <Box className="w-3 h-3" />
              HABITAT SHAPE
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-space-850 border border-slate-200 dark:border-space-750 rounded-xl p-0.5 gap-1">
              {[
                { id: 'cylinder', label: 'Cylinder' },
                { id: 'ring', label: 'Ring' },
                { id: 'rectangular', label: 'Rectangular' }
              ].map(shape => (
                <button
                  key={shape.id}
                  onClick={() => onChangeHabitatShape(shape.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    habitatShape === shape.id
                      ? 'bg-[#dcfce7] text-[#15803d] dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-700 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {shape.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculated Volume / Habitable Area Metric */}
        <div className="flex flex-col items-start lg:items-end pl-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
            HABITABLE AREA
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100">
              {totalArea}
            </span>
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              m²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
