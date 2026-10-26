import React from 'react';
import {
  X,
  User,
  ShieldCheck,
  Contact,
  Lock,
  Printer,
  Download,
  Sparkles,
  FileCode,
  Store,
  UserCheck,
  Shield,
  Key,
  ChevronRight,
  Zap,
  Info,
  Radio,
  Sliders,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { APP_CURRENT_VERSION } from '../../services/updateService';
import { ADMIN_MASTER_EMAIL } from '../../services/authSecurityService';

export type SettingSubTabKey =
  | 'profil'
  | 'komunitas'
  | 'warga'
  | 'keamanan'
  | 'hardware'
  | 'pemulihan'
  | 'skema'
  | 'toko'
  | 'menu'
  | 'printer'
  | 'update';

interface SettingsSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  activeSubTab?: SettingSubTabKey;
  onSelectSubTab: (subTab: SettingSubTabKey) => void;
  onOpenHierarchy?: () => void;
  onOpenRoleModal?: () => void;
  onOpenAdminCenter?: () => void;
  onOpenAuth?: () => void;
  authSession?: any;
}

export const SettingsSidebarDrawer: React.FC<SettingsSidebarDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeSubTab,
  onSelectSubTab,
  onOpenHierarchy,
  onOpenRoleModal,
  onOpenAdminCenter,
  onOpenAuth,
  authSession,
}) => {
  if (!isOpen) return null;

  const isTier2 =
    currentUser.tierLevel === 'tier2' ||
    currentUser.roleTier === 'tier2_pengurus_rt' ||
    currentUser.roleTier === 'pengurus' ||
    currentUser.roleTier === 'governance';

  const isMasterAdmin =
    authSession?.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase();

  const handleItemClick = (subTab: SettingSubTabKey) => {
    onSelectSubTab(subTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel - Hidden Left Sidebar */}
      <aside className="relative w-80 max-w-[85vw] h-full bg-stone-900 border-r border-stone-800 text-stone-100 flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-200 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border-b border-emerald-800/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-black shadow-xs">
              <Sliders className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white leading-tight">
                Opsi & Pengaturan
              </h2>
              <p className="text-[11px] text-emerald-200/90 font-medium">
                Pusat Kontrol Ekosistem WargaQu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Mini Banner */}
        <div className="p-3 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs shrink-0 ring-2 ring-emerald-500/30">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'W'}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white truncate leading-tight">
                {currentUser.name}
              </h3>
              <p className="text-[10px] text-stone-400 truncate">
                {currentUser.blockNumber || 'RT 04 / RW 09'} • {isTier2 ? 'Tier 2 (Pengurus)' : 'Tier 1 (Warga)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenAuth) onOpenAuth();
            }}
            className="px-2 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/60 text-[10px] font-bold text-emerald-300 shrink-0 cursor-pointer transition active:scale-95"
          >
            {authSession ? 'Sesi Terkunci' : 'Login'}
          </button>
        </div>

        {/* Scrollable Sub Menus */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs">
          {/* GROUP 1: PROFIL & KEPENGURUSAN */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400/90 px-2 block mb-1">
              Identitas & Warga
            </span>

            <button
              type="button"
              onClick={() => handleItemClick('profil')}
              className={`w-full p-2.5 rounded-xl transition flex items-center justify-between text-left cursor-pointer ${
                activeSubTab === 'profil'
                  ? 'bg-emerald-800/90 text-white font-bold shadow-xs'
                  : 'hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="block font-semibold">1. Profil & Hak Akses</span>
                  <span className="text-[10px] text-stone-400 block">Identitas, NIK, foto & masa jabatan</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>

            <button
              type="button"
              onClick={() => handleItemClick('warga')}
              className={`w-full p-2.5 rounded-xl transition flex items-center justify-between text-left cursor-pointer ${
                activeSubTab === 'warga'
                  ? 'bg-sky-800/90 text-white font-bold shadow-xs'
                  : 'hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Contact className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <span className="block font-semibold">2. Buku Induk WargaQu</span>
                  <span className="text-[10px] text-stone-400 block">Database digital & KK warga</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {onOpenHierarchy && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHierarchy();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-stone-800/80 text-stone-300 transition flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="block font-semibold">3. Rantai Validasi (2 Saksi)</span>
                    <span className="text-[10px] text-stone-400 block">Chain of Trust saksi tetangga</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
              </button>
            )}

            {onOpenRoleModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRoleModal();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-stone-800/80 text-stone-300 transition flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <div>
                    <span className="block font-semibold">4. Ganti Role Interaktif</span>
                    <span className="text-[10px] text-stone-400 block">Switch peran RT, RW, Hansip</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
              </button>
            )}
          </div>

          {/* GROUP 2: KOMUNITAS & KEAMANAN */}
          <div className="space-y-1 pt-2 border-t border-stone-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400/90 px-2 block mb-1">
              Komunitas & Keamanan
            </span>

            <button
              type="button"
              onClick={() => handleItemClick('komunitas')}
              className={`w-full p-2.5 rounded-xl transition flex items-center justify-between text-left cursor-pointer ${
                activeSubTab === 'komunitas'
                  ? 'bg-emerald-800/90 text-white font-bold shadow-xs'
                  : 'hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="block font-semibold">5. Opsi Komunitas & Geofence</span>
                  <span className="text-[10px] text-stone-400 block">Radius GPS & sirene darurat</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>

            <button
              type="button"
              onClick={() => handleItemClick('keamanan')}
              className={`w-full p-2.5 rounded-xl transition flex items-center justify-between text-left cursor-pointer ${
                activeSubTab === 'keamanan'
                  ? 'bg-teal-800/90 text-white font-bold shadow-xs'
                  : 'hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <span className="block font-semibold">6. Keamanan HP & PIN</span>
                  <span className="text-[10px] text-stone-400 block">Device lock & PIN transaksi</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>
          </div>

          {/* GROUP 3: HARDWARE & OPERASIONAL TOKO */}
          <div className="space-y-1 pt-2 border-t border-stone-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400/90 px-2 block mb-1">
              Hardware & Usaha
            </span>

            <button
              type="button"
              onClick={() => handleItemClick('hardware')}
              className={`w-full p-2.5 rounded-xl transition flex items-center justify-between text-left cursor-pointer ${
                activeSubTab === 'hardware'
                  ? 'bg-amber-800/90 text-white font-bold shadow-xs'
                  : 'hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="block font-semibold">7. Printer Bluetooth & Kasir</span>
                  <span className="text-[10px] text-stone-400 block">Cetak nota 58mm/80mm thermal</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>

            <button
              type="button"
              onClick={() => handleItemClick('toko')}
              className={`w-full p-2.5 rounded-xl transition flex items-center justify-between text-left cursor-pointer ${
                activeSubTab === 'toko'
                  ? 'bg-amber-800/90 text-white font-bold shadow-xs'
                  : 'hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="block font-semibold">8. Profil Toko & Nota</span>
                  <span className="text-[10px] text-stone-400 block">Header & footer struk kasir</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>
          </div>

          {/* GROUP 4: SISTEM, BACKUP & UPDATE */}
          <div className="space-y-1 pt-2 border-t border-stone-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400/90 px-2 block mb-1">
              Sistem & Data
            </span>

            <button
              type="button"
              onClick={() => handleItemClick('pemulihan')}
              className={`w-full p-2.5 rounded-xl transition flex items-center justify-between text-left cursor-pointer ${
                activeSubTab === 'pemulihan'
                  ? 'bg-red-800/90 text-white font-bold shadow-xs'
                  : 'hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="block font-semibold">9. Backup & Pemulihan Data</span>
                  <span className="text-[10px] text-stone-400 block">Cadangan JSON & reset data</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>

            <button
              type="button"
              onClick={() => handleItemClick('update')}
              className={`w-full p-2.5 rounded-xl transition flex items-center justify-between text-left cursor-pointer ${
                activeSubTab === 'update'
                  ? 'bg-teal-700 text-white font-bold shadow-xs'
                  : 'hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-300 shrink-0" />
                <div>
                  <span className="block font-semibold">10. Update Sistem & APK</span>
                  <span className="text-[10px] text-stone-400 block">Pembaruan otomatis GitHub</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>

            <button
              type="button"
              onClick={() => handleItemClick('skema')}
              className={`w-full p-2.5 rounded-xl transition flex items-center justify-between text-left cursor-pointer ${
                activeSubTab === 'skema'
                  ? 'bg-indigo-700 text-white font-bold shadow-xs'
                  : 'hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="block font-semibold">11. Skema & Arsitektur</span>
                  <span className="text-[10px] text-stone-400 block">Struktur DB & IndexedDB</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {/* Admin Command Center */}
            {isMasterAdmin && onOpenAdminCenter && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminCenter();
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-black transition flex items-center justify-between text-left cursor-pointer shadow-md mt-2"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 fill-stone-950 text-stone-950 shrink-0" />
                  <div>
                    <span className="block">Admin Command Center</span>
                    <span className="text-[10px] text-amber-950/80 block">Panel khusus master hendri.bageur20</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between shrink-0">
          <div>
            <span className="font-bold text-white block">WargaQu v{APP_CURRENT_VERSION}</span>
            <span className="text-[10px] text-emerald-400">Solusi Cerdas Masa Kini</span>
          </div>
          <span className="text-[9px] font-mono text-stone-500 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
            Offline-First
          </span>
        </div>
      </aside>
    </div>
  );
};
