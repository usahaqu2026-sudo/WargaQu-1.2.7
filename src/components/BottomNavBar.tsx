import React from 'react';
import { UtensilsCrossed, Boxes, TrendingUp, FileText, Settings, LayoutGrid } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  occupiedCount?: number;
  onOpenModuleSwitcher?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  occupiedCount = 0,
  onOpenModuleSwitcher,
}) => {
  const tabs = [
    { id: 'kasir', label: 'Kasir', icon: UtensilsCrossed, badge: occupiedCount > 0 ? occupiedCount : null },
    { id: 'bahan', label: 'Modal', icon: Boxes, badge: null },
    { id: 'omset', label: 'Omset', icon: TrendingUp, badge: null },
    { id: 'laporan', label: 'Laporan', icon: FileText, badge: null },
    { id: 'setting', label: 'Setting', icon: Settings, badge: null },
  ];

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch {}
    }
  };

  return (
    <nav
      className="w-full bg-stone-900/98 backdrop-blur-md border-t border-stone-800 text-stone-400 px-1 pt-1 flex items-center justify-around shrink-0 z-30 shadow-lg select-none sticky bottom-0 transition-all"
      style={{
        paddingBottom: 'calc(max(env(safe-area-inset-bottom, 0px), 0.5rem) + 0.25rem)',
        minHeight: 'calc(3.5rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            title={tab.label}
            aria-label={tab.label}
            onClick={() => {
              triggerHaptic();
              onSelectTab(tab.id);
            }}
            className={`relative flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer min-w-0 ${
              isActive
                ? 'text-amber-400 font-bold bg-stone-800/80 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
            }`}
          >
            {/* Active Pill Accent */}
            {isActive && (
              <span className="absolute -top-1 w-5 h-0.5 bg-amber-500 rounded-full" />
            )}

            <div className="relative flex items-center justify-center">
              <Icon className={`w-4.5 h-4.5 xs:w-5 xs:h-5 transition-transform ${isActive ? 'scale-105 text-amber-400' : ''}`} />
              {tab.badge !== null && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-stone-900 animate-pulse shadow-xs">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[8px] xs:text-[8.5px] font-bold tracking-tight px-1.5 py-0.5 rounded-full mt-0.5 leading-none transition-all truncate max-w-full ${
                isActive
                  ? 'text-amber-300 bg-amber-950 border border-amber-500/40 font-extrabold shadow-2xs'
                  : 'text-stone-400 bg-stone-800/40 border border-stone-800/60'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}

      {/* Switch Modul Button in POS Nav */}
      {onOpenModuleSwitcher && (
        <button
          onClick={() => {
            triggerHaptic();
            onOpenModuleSwitcher();
          }}
          title="Switch Modul (Grid Icon Modul)"
          aria-label="Switch Modul"
          className="relative flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer min-w-0 text-stone-300 hover:text-white hover:bg-stone-800/40 group"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-6.5 h-6.5 xs:w-7 xs:h-7 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-900 rounded-[6px] flex items-center justify-center">
                <LayoutGrid className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-emerald-400 group-hover:text-amber-300 transition-colors" />
              </div>
            </div>
          </div>
          <span className="text-[8px] xs:text-[8.5px] font-black tracking-tight px-1.5 py-0.5 rounded-full mt-0.5 leading-none transition-all truncate max-w-full text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 shadow-2xs">
            Modul
          </span>
        </button>
      )}
    </nav>
  );
};
