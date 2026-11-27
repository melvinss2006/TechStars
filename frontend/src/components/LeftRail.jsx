import React from 'react';
import { 
  LayoutGrid, 
  Home, 
  BarChart3, 
  Sliders, 
  HelpCircle, 
  Sun, 
  Moon,
  Orbit
} from 'lucide-react';

export default function LeftRail({
  activeTab = 'grid',
  onSelectTab,
  theme,
  onToggleTheme
}) {
  return (
    <aside className="w-14 bg-[#0a0f1d] border-r border-slate-800 flex flex-col items-center py-4 justify-between select-none z-40 flex-shrink-0">
      {/* Top Logo (Orbital Ring Icon) */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500/20 to-lime-400/30 border border-emerald-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Orbit className="w-4 h-4 text-emerald-400 -rotate-45" />
        </div>

        {/* Navigation Icon Rail */}
        <nav className="flex flex-col items-center gap-3">
          <button
            onClick={() => onSelectTab && onSelectTab('grid')}
            className={`p-2 rounded-xl transition ${
              activeTab === 'grid'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
            }`}
            title="Habitat 2D Grid Designer"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectTab && onSelectTab('home')}
            className={`p-2 rounded-xl transition ${
              activeTab === 'home'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
            }`}
            title="Mission Architecture"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectTab && onSelectTab('analytics')}
            className={`p-2 rounded-xl transition ${
              activeTab === 'analytics'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
            }`}
            title="NASA Safety Analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectTab && onSelectTab('settings')}
            className={`p-2 rounded-xl transition ${
              activeTab === 'settings'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
            }`}
            title="Rules Configuration"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </nav>
      </div>

      {/* Bottom Rail Controls */}
      <div className="flex flex-col items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-amber-400 hover:bg-slate-800/60 transition"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Help */}
        <button
          className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition"
          title="NASA-STD-3001 Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
