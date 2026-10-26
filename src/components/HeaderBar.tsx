import React from 'react';
import { Menu, ShoppingBag, Printer, Sparkles } from 'lucide-react';
import { PrinterConfig } from '../types';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  onOpenDrawer: () => void;
  onTakeawayClick: () => void;
  printerConfig: PrinterConfig;
  onOpenPrinterModal: () => void;
  showTakeawayBtn?: boolean;
  onBackToAppQu?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  onOpenDrawer,
  onTakeawayClick,
  printerConfig,
  onOpenPrinterModal,
  showTakeawayBtn = true,
  onBackToAppQu,
  theme = 'dark',
  onToggleTheme,
}) => {
  const isDark = theme !== 'light';
  return (
    <header
      className={`sticky top-0 z-30 ${isDark ? 'bg-stone-900 text-stone-100 border-stone-800' : 'bg-white text-stone-900 border-stone-200 shadow-xs'} border-b px-2.5 sm:px-3 pb-1 flex items-center justify-between shrink-0 select-none shadow-sm transition-all`}
      style={{
        paddingTop: 'var(--safe-top-clearance, max(env(safe-area-inset-top, 0px), 1.5rem))',
      }}
    >
      {/* Left: Navigation Drawer Toggle & Back to AppQu */}
      <div className="flex items-center gap-1.5">
        {onBackToAppQu && (
          <button
            onClick={onBackToAppQu}
            className="h-7 px-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white flex items-center gap-1 text-[11px] font-bold shadow-xs active:scale-95 transition-all"
            title="Kembali ke Ekosistem WargaQu"
          >
            <span>◀ WargaQu</span>
          </button>
        )}

        <button
          onClick={onOpenDrawer}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all active:scale-95 ${
            isDark
              ? 'bg-stone-800/90 text-stone-200 hover:text-white hover:bg-stone-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
          aria-label="Buka Menu Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <h1
            className={`text-xs font-bold tracking-tight leading-tight flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={`text-[9px] leading-none mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5">
        {/* Dark / Light Mode Toggle */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold border active:scale-95 transition-all ${
              isDark
                ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-stone-700/60'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        )}

        {/* Bluetooth Printer Indicator Pill */}
        <button
          onClick={onOpenPrinterModal}
          title="Status Printer Thermal Bluetooth"
          className={`h-7 px-2 rounded-lg flex items-center gap-1 text-[10px] font-medium border active:scale-95 transition-all ${
            isDark
              ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700/60'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <Printer className="w-3 h-3 text-amber-500" />
          <span className="hidden xs:inline font-mono">
            {printerConfig.paperSize}
          </span>
        </button>

        {/* Quick Bungkus / Takeaway Button */}
        {showTakeawayBtn && (
          <button
            onClick={onTakeawayClick}
            className="h-7 px-2.5 rounded-lg bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white flex items-center gap-1 text-[11px] font-bold shadow-md shadow-red-950/40 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Bungkus</span>
          </button>
        )}
      </div>
    </header>
  );
};
