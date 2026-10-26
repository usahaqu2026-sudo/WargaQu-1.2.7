import React, { useEffect } from 'react';
import {
  Users,
  MapPin,
  ShoppingBag,
  Store,
  MessageSquare,
  ShieldAlert,
  X,
  LayoutGrid,
  CheckCircle2,
  BookOpen,
  FileCode,
  Layers,
} from 'lucide-react';

export type AppQuModuleKey =
  | 'paguyuban'
  | 'warga'
  | 'usaha'
  | 'area'
  | 'siaga'
  | 'arsitektur'
  | 'chat'
  | 'setting'
  | 'muamalah';

interface ModuleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: AppQuModuleKey;
  currentAppMode?: string;
  onSelectModule: (module: AppQuModuleKey) => void;
  unreadChatCount?: number;
  pendingApprovalsCount?: number;
  activeEmergencyCount?: number;
}

interface ModuleItemConfig {
  id: AppQuModuleKey;
  name: string;
  shortDesc: string;
  tag: string;
  icon: React.ElementType;
  badge?: number | string | null;
  badgeColor?: string;
  theme: {
    bg: string;
    border: string;
    activeBorder: string;
    iconBg: string;
    iconColor: string;
    tagBg: string;
    tagText: string;
  };
}

export const ModuleSwitcherModal: React.FC<ModuleSwitcherModalProps> = ({
  isOpen,
  onClose,
  activeModule,
  currentAppMode = 'appqu',
  onSelectModule,
  unreadChatCount = 0,
  pendingApprovalsCount = 0,
  activeEmergencyCount = 0,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch {}
    }
  };

  // 6 Primary Modules requested in exact specifications:
  // (PaguyubanQu, AreaQu, MuamalahQu, UsahaQu, ChatQu, SiagaQu)
  const primaryModules: ModuleItemConfig[] = [
    {
      id: 'paguyuban',
      name: 'PaguyubanQu',
      shortDesc: 'Sosial, Kas RT & Warga',
      tag: 'Kas & Sosial',
      icon: Users,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
      badgeColor: 'bg-amber-500 text-stone-950',
      theme: {
        bg: 'bg-gradient-to-br from-emerald-950/60 to-stone-900',
        border: 'border-emerald-700/30 hover:border-emerald-500/60',
        activeBorder: 'border-emerald-400 ring-2 ring-emerald-400/40 bg-emerald-950/80',
        iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
        iconColor: 'text-emerald-400',
        tagBg: 'bg-emerald-950 border border-emerald-500/30',
        tagText: 'text-emerald-300',
      },
    },
    {
      id: 'area',
      name: 'AreaQu',
      shortDesc: 'Peta Wilayah & GPS Sekitar',
      tag: 'Peta & Zonasi',
      icon: MapPin,
      badge: null,
      theme: {
        bg: 'bg-gradient-to-br from-teal-950/60 to-stone-900',
        border: 'border-teal-700/30 hover:border-teal-500/60',
        activeBorder: 'border-teal-400 ring-2 ring-teal-400/40 bg-teal-950/80',
        iconBg: 'bg-teal-500/20 text-teal-400 border border-teal-500/40',
        iconColor: 'text-teal-400',
        tagBg: 'bg-teal-950 border border-teal-500/30',
        tagText: 'text-teal-300',
      },
    },
    {
      id: 'muamalah',
      name: 'MuamalahQu',
      shortDesc: 'Pasar Warga & Titip Jual',
      tag: 'C2C Konsinyasi',
      icon: ShoppingBag,
      badge: 'C2C',
      badgeColor: 'bg-purple-600 text-white',
      theme: {
        bg: 'bg-gradient-to-br from-purple-950/60 to-stone-900',
        border: 'border-purple-700/30 hover:border-purple-500/60',
        activeBorder: 'border-purple-400 ring-2 ring-purple-400/40 bg-purple-950/80',
        iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
        iconColor: 'text-purple-400',
        tagBg: 'bg-purple-950 border border-purple-500/30',
        tagText: 'text-purple-300',
      },
    },
    {
      id: 'usaha',
      name: 'UsahaQu',
      shortDesc: 'Lapak UMKM & POS Kasir',
      tag: 'Katalog & POS',
      icon: Store,
      badge: null,
      theme: {
        bg: 'bg-gradient-to-br from-amber-950/60 to-stone-900',
        border: 'border-amber-700/30 hover:border-amber-500/60',
        activeBorder: 'border-amber-400 ring-2 ring-amber-400/40 bg-amber-950/80',
        iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
        iconColor: 'text-amber-400',
        tagBg: 'bg-amber-950 border border-amber-500/30',
        tagText: 'text-amber-300',
      },
    },
    {
      id: 'chat',
      name: 'ChatQu',
      shortDesc: 'Percakapan & Notifikasi',
      tag: 'Pesan Warga',
      icon: MessageSquare,
      badge: unreadChatCount > 0 ? unreadChatCount : null,
      badgeColor: 'bg-emerald-500 text-stone-950',
      theme: {
        bg: 'bg-gradient-to-br from-sky-950/60 to-stone-900',
        border: 'border-sky-700/30 hover:border-sky-500/60',
        activeBorder: 'border-sky-400 ring-2 ring-sky-400/40 bg-sky-950/80',
        iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
        iconColor: 'text-sky-400',
        tagBg: 'bg-sky-950 border border-sky-500/30',
        tagText: 'text-sky-300',
      },
    },
    {
      id: 'siaga',
      name: 'SiagaQu',
      shortDesc: 'Tombol Darurat SOS & Ronda',
      tag: 'SOS Darurat',
      icon: ShieldAlert,
      badge: activeEmergencyCount > 0 ? activeEmergencyCount : null,
      badgeColor: 'bg-red-600 text-white animate-pulse',
      theme: {
        bg: 'bg-gradient-to-br from-red-950/60 to-stone-900',
        border: 'border-red-700/30 hover:border-red-500/60',
        activeBorder: 'border-red-400 ring-2 ring-red-400/40 bg-red-950/80',
        iconBg: 'bg-red-500/20 text-red-400 border border-red-500/40',
        iconColor: 'text-red-400',
        tagBg: 'bg-red-950 border border-red-500/30',
        tagText: 'text-red-300',
      },
    },
  ];

  const handleSelect = (moduleId: AppQuModuleKey) => {
    triggerHaptic();
    onSelectModule(moduleId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-stone-900 border-t sm:border border-stone-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Top Drag Indicator */}
        <div className="w-full pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-stone-700/80" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-stone-800/90 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-1.5 tracking-tight">
                <span>Switch Modul WargaQu</span>
              </h2>
              <p className="text-[11px] text-stone-400 font-medium">
                Pilih modul aplikasi untuk beralih instan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content: 2-Column Grid of 6 Modules */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              6 Modul Ekosistem Utama
            </span>
            <span className="text-[10px] text-stone-400 bg-stone-800/60 px-2 py-0.5 rounded-full">
              Sentuh untuk buka
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {primaryModules.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentAppMode === 'appqu' && activeModule === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`group relative text-left p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                    isActive
                      ? item.theme.activeBorder
                      : `${item.theme.bg} ${item.theme.border}`
                  } shadow-md`}
                >
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-start justify-between w-full mb-2.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-105 ${item.theme.iconBg}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isActive ? (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-400 text-stone-950 shadow-xs">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span
                          className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-md ${item.theme.tagBg} ${item.theme.tagText}`}
                        >
                          {item.tag}
                        </span>
                      )}

                      {item.badge !== null && item.badge !== undefined && !isActive && (
                        <span
                          className={`text-[8.5px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs ${
                            item.badgeColor || 'bg-stone-700 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Module Name and Description */}
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5 leading-snug">
                      {item.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Secondary Quick Links (Buku Warga & Arsitektur) */}
          <div className="pt-2 border-t border-stone-800/80">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block px-1 mb-2">
              Modul Pendukung & Pengaturan
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSelect('warga')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                  currentAppMode === 'appqu' && activeModule === 'warga'
                    ? 'border-emerald-500 bg-stone-800'
                    : 'border-stone-800 bg-stone-900/60 hover:bg-stone-800/80 hover:border-stone-700'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-stone-200 truncate">
                    WargaQu
                  </div>
                  <div className="text-[9px] text-stone-400 truncate">
                    Buku Induk Warga
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSelect('arsitektur')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                  currentAppMode === 'appqu' && activeModule === 'arsitektur'
                    ? 'border-emerald-500 bg-stone-800'
                    : 'border-stone-800 bg-stone-900/60 hover:bg-stone-800/80 hover:border-stone-700'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 shrink-0">
                  <FileCode className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-stone-200 truncate">
                    Arsitektur
                  </div>
                  <div className="text-[9px] text-stone-400 truncate">
                    Skema Data & DB
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>Ekosistem Mandiri RT 04</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs cursor-pointer transition-all active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
