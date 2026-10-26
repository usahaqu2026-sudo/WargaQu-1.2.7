import React, { useState } from 'react';
import {
  LayoutGrid,
  MessageSquare,
  Calendar,
  Wallet,
  FileCheck,
  Compass,
  List,
  Store,
  Shield,
  ShoppingBag,
  Handshake,
  Plus,
  Clock,
  CreditCard,
  Users,
  ShieldAlert,
  ShieldCheck,
  Heart,
  BookOpen,
  FileCode,
  Sparkles,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { ModuleSwitcherModal, AppQuModuleKey } from './ModuleSwitcherModal';

export interface SubMenuItemConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string | null;
  badgeColor?: string;
}

interface AppQuBottomNavProps {
  activeModule: AppQuModuleKey;
  onSelectModule: (module: AppQuModuleKey) => void;
  onOpenHierarchy?: () => void;
  onOpenRoleModal?: () => void;
  onOpenSettingsDrawer?: () => void;
  onOpenModuleSwitcher?: () => void;
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
  unreadChatCount?: number;
  pendingApprovalsCount?: number;
  activeEmergencyCount?: number;
  witnessCount?: number;
  theme?: 'light' | 'dark';
}

export const AppQuBottomNav: React.FC<AppQuBottomNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenModuleSwitcher,
  activeSubTab = '',
  onSelectSubTab,
  unreadChatCount = 0,
  pendingApprovalsCount = 0,
  activeEmergencyCount = 0,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [isLocalSwitcherOpen, setIsLocalSwitcherOpen] = useState(false);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
  };

  const handleOpenSwitcher = () => {
    triggerHaptic();
    if (onOpenModuleSwitcher) {
      onOpenModuleSwitcher();
    } else {
      setIsLocalSwitcherOpen(true);
    }
  };

  // Get current module metadata and accent colors
  const getModuleMeta = (mod: AppQuModuleKey) => {
    switch (mod) {
      case 'paguyuban':
        return {
          name: 'PaguyubanQu',
          shortName: 'Paguyuban',
          activeColor: 'text-emerald-400',
          activeBg: 'bg-emerald-950 border-emerald-500/40 text-emerald-300',
          accentPill: 'bg-emerald-400',
          switcherGradient: 'from-emerald-600 to-teal-600',
        };
      case 'area':
        return {
          name: 'AreaQu',
          shortName: 'AreaQu',
          activeColor: 'text-teal-400',
          activeBg: 'bg-teal-950 border-teal-500/40 text-teal-300',
          accentPill: 'bg-teal-400',
          switcherGradient: 'from-teal-600 to-cyan-600',
        };
      case 'muamalah':
        return {
          name: 'MuamalahQu',
          shortName: 'Muamalah',
          activeColor: 'text-purple-400',
          activeBg: 'bg-purple-950 border-purple-500/40 text-purple-300',
          accentPill: 'bg-purple-400',
          switcherGradient: 'from-purple-600 to-indigo-600',
        };
      case 'usaha':
        return {
          name: 'UsahaQu',
          shortName: 'UsahaQu',
          activeColor: 'text-amber-400',
          activeBg: 'bg-amber-950 border-amber-500/40 text-amber-300',
          accentPill: 'bg-amber-400',
          switcherGradient: 'from-amber-600 to-orange-600',
        };
      case 'chat':
        return {
          name: 'ChatQu',
          shortName: 'ChatQu',
          activeColor: 'text-sky-400',
          activeBg: 'bg-sky-950 border-sky-500/40 text-sky-300',
          accentPill: 'bg-sky-400',
          switcherGradient: 'from-sky-600 to-blue-600',
        };
      case 'siaga':
        return {
          name: 'SiagaQu',
          shortName: 'SiagaQu',
          activeColor: 'text-red-400',
          activeBg: 'bg-red-950 border-red-500/50 text-red-300',
          accentPill: 'bg-red-500',
          switcherGradient: 'from-red-600 to-rose-700',
        };
      case 'warga':
        return {
          name: 'WargaQu',
          shortName: 'WargaQu',
          activeColor: 'text-emerald-400',
          activeBg: 'bg-emerald-950 border-emerald-500/40 text-emerald-300',
          accentPill: 'bg-emerald-400',
          switcherGradient: 'from-emerald-600 to-teal-600',
        };
      case 'arsitektur':
        return {
          name: 'Arsitektur',
          shortName: 'Skema DB',
          activeColor: 'text-stone-300',
          activeBg: 'bg-stone-800 border-stone-600 text-stone-200',
          accentPill: 'bg-stone-400',
          switcherGradient: 'from-stone-600 to-stone-700',
        };
      default:
        return {
          name: 'WargaQu',
          shortName: 'Modul',
          activeColor: 'text-emerald-400',
          activeBg: 'bg-emerald-950 border-emerald-500/40 text-emerald-300',
          accentPill: 'bg-emerald-400',
          switcherGradient: 'from-emerald-600 via-teal-600 to-amber-500',
        };
    }
  };

  const meta = getModuleMeta(activeModule);

  // Sub-menus for the currently active module ONLY (compact, uncluttered)
  const getSubMenuItems = (): SubMenuItemConfig[] => {
    switch (activeModule) {
      case 'paguyuban':
        return [
          { id: 'beranda', label: 'Beranda', icon: LayoutDashboard },
          { id: 'anggota', label: 'Warga', icon: Users },
          { id: 'kas', label: 'Keuangan', icon: Wallet },
          { id: 'agenda', label: 'Agenda', icon: Calendar },
          { id: 'setting_org', label: 'Setting', icon: Settings },
        ];

      case 'area':
        return [
          { id: 'map', label: 'Peta GPS', icon: Compass },
          { id: 'list', label: 'Daftar Titik', icon: List },
          { id: 'rental', label: 'Sewa Lapak', icon: Store },
          { id: 'netral', label: 'Titik Netral', icon: Shield },
        ];

      case 'muamalah':
        return [
          { id: 'pasar', label: 'Pasar Warga', icon: Store },
          { id: 'konsinyasi', label: 'Titip Jual', icon: Handshake },
          { id: 'tambah', label: '+ Jual/Titip', icon: Plus },
        ];

      case 'usaha':
        return [
          { id: 'katalog', label: 'Katalog & POS', icon: Sparkles },
          { id: 'mode', label: 'Operasional', icon: Clock },
          { id: 'tarif', label: 'Tarif & Fitur', icon: CreditCard },
        ];

      case 'chat':
        return [
          { id: 'transaksi', label: 'Transaksi', icon: ShoppingBag },
          { id: 'komunitas', label: 'Grup Warga', icon: Users },
          {
            id: 'sos',
            label: 'SOS Darurat',
            icon: ShieldAlert,
            badge: activeEmergencyCount > 0 ? activeEmergencyCount : null,
            badgeColor: 'bg-red-600 text-white animate-pulse',
          },
        ];

      case 'siaga':
        return [
          {
            id: 'darurat',
            label: 'SOS Darurat',
            icon: ShieldAlert,
            badge: activeEmergencyCount > 0 ? activeEmergencyCount : null,
            badgeColor: 'bg-red-600 text-white animate-pulse',
          },
          { id: 'patroli', label: 'Jadwal Ronda', icon: ShieldCheck },
          { id: 'solidaritas', label: 'Solidaritas', icon: Heart },
        ];

      case 'warga':
        return [
          { id: 'daftar', label: 'Buku Induk', icon: Users },
          { id: 'tambah', label: '+ Warga Baru', icon: Plus },
        ];

      case 'arsitektur':
        return [
          { id: 'skema', label: 'Skema DB', icon: FileCode },
          { id: 'arsitektur', label: 'Arsitektur', icon: BookOpen },
        ];

      case 'setting':
        return [
          { id: 'profil', label: 'Profil Unit', icon: Store },
          { id: 'printer', label: 'Printer', icon: Settings },
          { id: 'menu', label: 'Katalog', icon: List },
        ];

      default:
        return [];
    }
  };

  const subMenuItems = getSubMenuItems();

  return (
    <>
      <nav
        className={`w-full backdrop-blur-md border-t px-2 pt-1 flex items-center justify-between shrink-0 z-30 shadow-2xl select-none sticky bottom-0 transition-all ${
          isDark
            ? 'bg-slate-900/98 border-slate-800 text-slate-400'
            : 'bg-white/98 border-slate-200 text-slate-600'
        }`}
        style={{
          paddingBottom: 'calc(max(env(safe-area-inset-bottom, 0px), 0.5rem) + 0.25rem)',
          minHeight: 'calc(3.5rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* ========================================================= */}
        {/* 1. SUB-MENUS OF THE SELECTED MODULE ONLY                  */}
        {/* ========================================================= */}
        <div className="flex-1 flex items-center justify-around h-full min-w-0">
          {subMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  triggerHaptic();
                  onSelectSubTab?.(item.id);
                }}
                title={item.label}
                aria-label={item.label}
                className={`relative flex-1 flex flex-col items-center justify-center h-full py-0.5 px-1 rounded-xl transition-all active:scale-95 cursor-pointer min-w-0 ${
                  isActive
                    ? isDark
                      ? `${meta.activeColor} font-bold bg-slate-800/90 shadow-sm`
                      : `${meta.activeColor} font-bold bg-slate-100 shadow-sm`
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                {/* Active Indicator Top Pill */}
                {isActive && (
                  <span
                    className={`absolute -top-1 w-5 h-0.5 ${meta.accentPill} rounded-full`}
                  />
                )}

                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-4.5 h-4.5 transition-transform duration-150 ${
                      isActive ? `scale-105 ${meta.activeColor}` : ''
                    }`}
                  />
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`absolute -top-1 -right-2 text-[8px] font-black min-w-3.5 h-3.5 px-1 rounded-full flex items-center justify-center ring-1 ring-stone-900 shadow-xs ${
                        item.badgeColor || 'bg-stone-700 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[8px] xs:text-[8.5px] font-bold tracking-tight px-1.5 py-0.5 rounded-full mt-0.5 leading-none transition-all truncate max-w-full ${
                    isActive
                      ? `${meta.activeBg} font-extrabold shadow-2xs`
                      : isDark
                      ? 'text-slate-400 bg-slate-800/50 border border-slate-700/60'
                      : 'text-slate-600 bg-slate-100 border border-slate-200'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Separator Divider */}
        <div
          className={`w-[1px] h-6 my-auto shrink-0 mx-1 ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`}
        />

        {/* ========================================================= */}
        {/* 2. MASTER SWITCH MODUL BUTTON (Paling Kanan, Icon Grid)    */}
        {/* ========================================================= */}
        <button
          onClick={handleOpenSwitcher}
          title={`Ganti Modul (Saat ini: ${meta.name})`}
          aria-label="Switch Modul"
          className={`relative flex flex-col items-center justify-center h-full py-0.5 px-2 rounded-xl transition-all active:scale-95 cursor-pointer group shrink-0 ${
            isDark
              ? 'text-slate-200 hover:text-white hover:bg-slate-800/60'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <div
              className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${meta.switcherGradient} p-[1.5px] shadow-sm group-hover:scale-105 transition-transform`}
            >
              <div className="w-full h-full bg-stone-900 rounded-[9px] flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-white group-hover:text-amber-300 transition-colors" />
              </div>
            </div>
          </div>
          <span className="text-[8px] font-black tracking-tight px-1.5 py-0.5 rounded-full mt-0.5 leading-none transition-all truncate text-amber-300 bg-amber-950/80 border border-amber-500/40 shadow-2xs">
            Modul
          </span>
        </button>
      </nav>

      {/* Internal Fallback Modal if parent doesn't provide onOpenModuleSwitcher */}
      {!onOpenModuleSwitcher && (
        <ModuleSwitcherModal
          isOpen={isLocalSwitcherOpen}
          onClose={() => setIsLocalSwitcherOpen(false)}
          activeModule={activeModule}
          onSelectModule={(mod) => {
            onSelectModule(mod);
            setIsLocalSwitcherOpen(false);
          }}
          unreadChatCount={unreadChatCount}
          pendingApprovalsCount={pendingApprovalsCount}
          activeEmergencyCount={activeEmergencyCount}
        />
      )}
    </>
  );
};
