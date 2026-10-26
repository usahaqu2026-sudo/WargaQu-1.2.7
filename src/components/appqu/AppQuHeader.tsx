import React, { useState } from 'react';
import {
  VolumeX,
  Sparkles,
  Radio,
  Layers,
  Store,
  Bike,
  Shield,
  Info,
  X,
  CheckCircle,
  Lock,
  ShieldCheck,
  Menu,
  Sun,
  Moon,
  RefreshCw,
  Plus,
  ShoppingBag,
  Building2,
  Heart,
  Flag,
  MessageSquare,
  ShieldAlert,
  Users,
  Calendar,
  Compass,
  FileCode,
  Settings,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { sireneAudio } from '../../services/sireneAudio';
import { ADMIN_MASTER_EMAIL } from '../../services/authSecurityService';
import { UpdateService, UpdateInfo } from '../../services/updateService';
import { OrganizationData, OrganizationType } from '../../services/storageOrganizations';
import { AppQuModuleKey } from './ModuleSwitcherModal';

interface AppQuHeaderProps {
  currentUser: UserProfile;
  activeModule: AppQuModuleKey;
  activeModuleName?: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onCheckUpdate?: () => void;
  availableUpdate?: UpdateInfo | null;
  onOpenSettingsSidebar?: () => void;
  // Auth & Admin Controls
  onOpenAuth?: () => void;
  onOpenAdminCenter?: () => void;
  authSession?: any;
  // Paguyuban Specific Controls (dipindahkan ke header atas)
  activeOrganization?: OrganizationData | null;
  onOpenSwitchOrgModal?: () => void;
  onOpenAddOrgModal?: () => void;
  // AreaQu Specific Controls
  isAreaQu?: boolean;
  areaRadiusMeters?: number;
  onSelectAreaRadius?: (radius: number) => void;
  areaCategory?: string;
  onSelectAreaCategory?: (category: string) => void;
  onOpenAreaRental?: () => void;
  onOpenAreaNeutrality?: () => void;
  // Muamalah Specific Controls
  onOpenAddProduk?: () => void;
  // Usaha Specific Controls
  onSwitchToPOS?: () => void;
  // Warga Specific Controls
  onOpenAddResident?: () => void;
  // Setting Specific Controls
  onOpenRoleSwitcher?: () => void;
}

const RADIUS_OPTIONS = [
  { label: '500m', meters: 500 },
  { label: '1 km', meters: 1000 },
  { label: '3 km', meters: 3000 },
  { label: '5 km', meters: 5000 },
  { label: '10 km', meters: 10000 },
  { label: '25 km', meters: 25000 },
  { label: '50 km', meters: 50000 },
  { label: '100 km', meters: 100000 },
];

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Semua Titik', icon: Layers },
  { id: 'lapak', label: 'Lapak & Warung', icon: Store },
  { id: 'transportasi', label: 'Kurir 🛵', icon: Bike },
  { id: 'fasum', label: 'Fasum & Ronda', icon: Shield },
  { id: 'titik_netral', label: 'Titik Netral Parpol', icon: Info },
];

export const AppQuHeader: React.FC<AppQuHeaderProps> = ({
  currentUser,
  activeModule,
  activeModuleName,
  theme,
  onToggleTheme,
  onCheckUpdate,
  availableUpdate,
  onOpenSettingsSidebar,
  onOpenAuth,
  onOpenAdminCenter,
  authSession,
  activeOrganization,
  onOpenSwitchOrgModal,
  onOpenAddOrgModal,
  isAreaQu = false,
  areaRadiusMeters = 3000,
  onSelectAreaRadius,
  areaCategory = 'all',
  onSelectAreaCategory,
  onOpenAreaRental,
  onOpenAreaNeutrality,
  onOpenAddProduk,
  onSwitchToPOS,
  onOpenAddResident,
  onOpenRoleSwitcher,
}) => {
  const isSirenPlaying = sireneAudio.getIsPlaying();
  const [isRadiusOpen, setIsRadiusOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const isDark = theme === 'dark';
  const currentVer = UpdateService.getCurrentVersion();
  const hasUpdate = Boolean(availableUpdate?.hasUpdate);
  const displayVer = hasUpdate ? `v${availableUpdate?.latestVersion}` : `v${currentVer}`;

  const handleStopSiren = () => {
    sireneAudio.stopSiren();
  };

  const isTier2 =
    currentUser.roleTier === 'tier2_pengurus_rt' ||
    currentUser.roleTier === 'pengurus' ||
    currentUser.roleTier === 'governance';

  const currentRadiusLabel =
    RADIUS_OPTIONS.find((r) => r.meters === areaRadiusMeters)?.label || '3 km';

  // Get Org Icon Helper
  const getOrgIcon = (type?: OrganizationType) => {
    switch (type) {
      case 'dkm_masjid':
        return Building2;
      case 'panti_asuhan':
        return Heart;
      case 'partai':
        return Flag;
      case 'ormas':
      case 'komunitas':
        return Users;
      default:
        return Building2;
    }
  };

  const OrgIconComponent = getOrgIcon(activeOrganization?.type);

  // Helper for Org Type label
  const getOrgTypeLabel = (type?: OrganizationType) => {
    switch (type) {
      case 'dkm_masjid':
        return 'DKM Masjid';
      case 'panti_asuhan':
        return 'Panti Asuhan';
      case 'ormas':
        return 'Ormas';
      case 'partai':
        return 'Partai';
      default:
        return 'RT / RW';
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 border-b px-2.5 sm:px-3 pb-1.5 flex items-center justify-between shrink-0 select-none shadow-md transition-colors duration-200 ${
        isDark
          ? 'bg-slate-900/95 border-slate-800 text-white'
          : 'bg-white/95 border-slate-200 text-slate-900'
      }`}
      style={{
        paddingTop: 'var(--safe-top-clearance, max(env(safe-area-inset-top, 0px), 1rem))',
      }}
    >
      {/* ========================================================= */}
      {/* LEFT: HAMBURGER MENU + WARGAQU BRAND + MODUL IDENTITY     */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 min-w-0">
        {onOpenSettingsSidebar && (
          <button
            type="button"
            onClick={onOpenSettingsSidebar}
            className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition active:scale-95 shrink-0 shadow-2xs ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-emerald-700 border border-slate-300'
            }`}
            title="Buka Menu Opsi & Pengaturan (Sidebar Kiri)"
            aria-label="Menu Opsi"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Brand Avatar WQ */}
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-black text-white text-xs shadow-md ring-1 ring-emerald-400/40 shrink-0">
          WQ
        </div>

        {/* Dynamic Module Identity in Header */}
        <div className="min-w-0">
          {/* ================= PAGUYUBANQU HEADER INFO ================= */}
          {activeModule === 'paguyuban' ? (
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                  PaguyubanQu
                </span>
                <span
                  className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold truncate max-w-[90px] ${
                    isDark
                      ? 'bg-slate-800 text-emerald-300 border border-slate-700'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {getOrgTypeLabel(activeOrganization?.type)}
                </span>
              </div>
              <h1
                className={`text-xs font-black truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] leading-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
                title={activeOrganization?.name || 'Organisasi Aktif'}
              >
                {activeOrganization?.name || 'DKM Al-Hidayah'}
              </h1>
            </div>
          ) : activeModule === 'area' ? (
            /* ================= AREAQU HEADER INFO ================= */
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-teal-500 tracking-wider">
                  AreaQu
                </span>
                <span
                  className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                    isDark
                      ? 'bg-slate-800 text-teal-300 border border-slate-700'
                      : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}
                >
                  Peta GPS
                </span>
              </div>
              <p
                className={`text-[10px] font-medium leading-none truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Radius & Lapak Warga
              </p>
            </div>
          ) : activeModule === 'muamalah' ? (
            /* ================= MUAMALAHQU HEADER INFO ================= */
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                  MuamalahQu
                </span>
                <span
                  className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                    isDark
                      ? 'bg-slate-800 text-emerald-300 border border-slate-700'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  Pasar Warga
                </span>
              </div>
              <p
                className={`text-[10px] font-medium leading-none truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Ekonomi Bersih & Titip Jual
              </p>
            </div>
          ) : activeModule === 'usaha' ? (
            /* ================= USAHAQU HEADER INFO ================= */
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                  UsahaQu
                </span>
                <span
                  className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                    isDark
                      ? 'bg-slate-800 text-amber-300 border border-slate-700'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  POS & UMKM
                </span>
              </div>
              <p
                className={`text-[10px] font-medium leading-none truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Katalog & Kasir BaksoQu
              </p>
            </div>
          ) : activeModule === 'chat' ? (
            /* ================= CHATQU HEADER INFO ================= */
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">
                  ChatQu
                </span>
                <span
                  className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                    isDark
                      ? 'bg-slate-800 text-blue-300 border border-slate-700'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  Pesan
                </span>
              </div>
              <p
                className={`text-[10px] font-medium leading-none truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Komunitas & Warga
              </p>
            </div>
          ) : activeModule === 'siaga' ? (
            /* ================= SIAGAQU HEADER INFO ================= */
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">
                  SiagaQu
                </span>
                <span
                  className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                    isDark
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  Darurat
                </span>
              </div>
              <p
                className={`text-[10px] font-medium leading-none truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Keamanan & Ronda
              </p>
            </div>
          ) : activeModule === 'warga' ? (
            /* ================= WARGAQU BUKU INDUK HEADER INFO ================= */
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                  WargaQu
                </span>
                <span
                  className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                    isDark
                      ? 'bg-slate-800 text-emerald-300 border border-slate-700'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  Buku Induk
                </span>
              </div>
              <p
                className={`text-[10px] font-medium leading-none truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Kependudukan & ID Warga
              </p>
            </div>
          ) : activeModule === 'setting' ? (
            /* ================= SETTINGQU HEADER INFO ================= */
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                  SettingQu
                </span>
                <span
                  className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                    isDark
                      ? 'bg-slate-800 text-amber-300 border border-slate-700'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  Pengaturan
                </span>
              </div>
              <p
                className={`text-[10px] font-medium leading-none truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Profil & Opsi Ekosistem
              </p>
            </div>
          ) : activeModule === 'arsitektur' ? (
            /* ================= ARSITEKTUR HEADER INFO ================= */
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                  ArsitekturQu
                </span>
                <span
                  className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                    isDark
                      ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                      : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                  }`}
                >
                  Skema DB
                </span>
              </div>
              <p
                className={`text-[10px] font-medium leading-none truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Struktur Relasi & Alur
              </p>
            </div>
          ) : (
            /* ================= DEFAULT / WARGAQU HEADER INFO ================= */
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black tracking-tight">WargaQu</span>
                <span className="text-[9px] font-semibold text-amber-500 shrink-0">
                  RT 04 / RW 09
                </span>
              </div>
              <p
                className={`text-[10px] truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] font-medium leading-none mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {activeModuleName || 'Ekosistem Komunitas'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT: DYNAMIC TOOLS PER MODULE + THEME TOGGLE + USER     */}
      {/* ========================================================= */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Siren Playing Active Mute Button */}
        {isSirenPlaying && (
          <button
            onClick={handleStopSiren}
            className="h-6.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center gap-1 text-[10px] font-bold animate-bounce shadow-md cursor-pointer shrink-0"
            title="Matikan Suara Sirene"
          >
            <VolumeX className="w-3 h-3" />
            <span className="hidden xs:inline">Mute</span>
          </button>
        )}

        {/* ================= PAGUYUBANQU TOP TOOLS ================= */}
        {activeModule === 'paguyuban' && (
          <div className="flex items-center gap-1">
            {onOpenSwitchOrgModal && (
              <button
                type="button"
                onClick={onOpenSwitchOrgModal}
                className={`h-6.5 px-2 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 shadow-2xs ${
                  isDark
                    ? 'bg-emerald-950/90 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/60'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                }`}
                title="Ganti Organisasi Aktif (DKM, Panti, Ormas, RT, dll)"
              >
                <RefreshCw className="w-3 h-3 text-emerald-500" />
                <span className="hidden xs:inline">Ganti</span>
                <span>Org</span>
              </button>
            )}

            {onOpenAddOrgModal && (
              <button
                type="button"
                onClick={onOpenAddOrgModal}
                className={`h-6.5 w-6.5 rounded-lg flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-emerald-700 border border-slate-300'
                }`}
                title="Tambah Organisasi Baru"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* ================= AREAQU TOP TOOLS ================= */}
        {activeModule === 'area' && (
          <div className="flex items-center gap-1">
            {/* 1. Radius Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsRadiusOpen(!isRadiusOpen);
                  setIsCategoryOpen(false);
                }}
                className={`h-6.5 px-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 ${
                  isRadiusOpen || areaRadiusMeters !== 3000
                    ? isDark
                      ? 'bg-teal-900 text-teal-200 border border-teal-600 shadow-xs'
                      : 'bg-teal-100 text-teal-900 border border-teal-300 shadow-xs'
                    : isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                }`}
                title={`Filter Radius: ${currentRadiusLabel}`}
                aria-label="Pilih Radius"
              >
                <Radio className="w-3 h-3 text-teal-500" />
                <span className="text-[9px] font-mono font-bold leading-none">
                  {currentRadiusLabel.replace(' ', '')}
                </span>
              </button>

              {isRadiusOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRadiusOpen(false)} />
                  <div
                    className={`absolute right-0 top-8 w-44 rounded-2xl shadow-2xl border p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="px-2 py-1 text-[10px] font-black text-teal-500 uppercase tracking-wider flex items-center justify-between border-b border-teal-500/20 mb-1">
                      <span>Jangkauan Radius</span>
                      <button
                        type="button"
                        onClick={() => setIsRadiusOpen(false)}
                        className="hover:opacity-75"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="space-y-0.5 max-h-56 overflow-y-auto">
                      {RADIUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.meters}
                          type="button"
                          onClick={() => {
                            if (onSelectAreaRadius) onSelectAreaRadius(opt.meters);
                            setIsRadiusOpen(false);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                            areaRadiusMeters === opt.meters
                              ? 'bg-teal-600 text-white'
                              : isDark
                              ? 'text-slate-200 hover:bg-slate-800'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {areaRadiusMeters === opt.meters && (
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 2. Category Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsRadiusOpen(false);
                }}
                className={`h-6.5 w-6.5 rounded-lg text-xs font-bold flex items-center justify-center transition cursor-pointer active:scale-95 relative ${
                  isCategoryOpen || areaCategory !== 'all'
                    ? isDark
                      ? 'bg-teal-900 text-teal-200 border border-teal-600 shadow-xs'
                      : 'bg-teal-100 text-teal-900 border border-teal-300 shadow-xs'
                    : isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                }`}
                title={`Filter Titik: ${CATEGORY_OPTIONS.find((c) => c.id === areaCategory)?.label || 'Semua Titik'}`}
                aria-label="Filter Titik"
              >
                <Layers className="w-3 h-3 text-teal-500" />
                {areaCategory !== 'all' && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                )}
              </button>

              {isCategoryOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                  <div
                    className={`absolute right-0 top-8 w-48 rounded-2xl shadow-2xl border p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="px-2 py-1 text-[10px] font-black text-teal-500 uppercase tracking-wider flex items-center justify-between border-b border-teal-500/20 mb-1">
                      <span>Kategori Titik</span>
                      <button
                        type="button"
                        onClick={() => setIsCategoryOpen(false)}
                        className="hover:opacity-75"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="space-y-0.5">
                      {CATEGORY_OPTIONS.map((cat) => {
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              if (onSelectAreaCategory) onSelectAreaCategory(cat.id);
                              setIsCategoryOpen(false);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                              areaCategory === cat.id
                                ? 'bg-teal-600 text-white'
                                : isDark
                                ? 'text-slate-200 hover:bg-slate-800'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{cat.label}</span>
                            {areaCategory === cat.id && (
                              <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3. Sewa Lapak */}
            {onOpenAreaRental && (
              <button
                type="button"
                onClick={onOpenAreaRental}
                className="h-6.5 w-6.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-lg flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition shrink-0"
                title="Sewa Lapak Digital Warga"
                aria-label="Sewa Lapak"
              >
                <Sparkles className="w-3 h-3 text-stone-950" />
              </button>
            )}

            {/* 4. Kebijakan Netral */}
            {onOpenAreaNeutrality && (
              <button
                type="button"
                onClick={onOpenAreaNeutrality}
                className={`h-6.5 w-6.5 font-bold rounded-lg flex items-center justify-center cursor-pointer active:scale-95 transition shrink-0 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-teal-700 border border-slate-300'
                }`}
                title="Kebijakan Netralitas Ormas & Parpol"
                aria-label="Kebijakan Netralitas"
              >
                <Shield className="w-3 h-3 text-teal-500" />
              </button>
            )}
          </div>
        )}

        {/* ================= MUAMALAHQU TOP TOOLS ================= */}
        {activeModule === 'muamalah' && onOpenAddProduk && (
          <button
            type="button"
            onClick={onOpenAddProduk}
            className={`h-6.5 px-2 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 shadow-2xs ${
              isDark
                ? 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/60'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
            }`}
            title="Tambah Produk / Konsinyasi"
          >
            <Plus className="w-3 h-3 text-emerald-500" />
            <span>+ Jual</span>
          </button>
        )}

        {/* ================= USAHAQU TOP TOOLS ================= */}
        {activeModule === 'usaha' && onSwitchToPOS && (
          <button
            type="button"
            onClick={onSwitchToPOS}
            className="h-6.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-[10px] flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition"
            title="Buka POS Kasir BaksoQu"
          >
            <Store className="w-3 h-3 text-stone-950" />
            <span>Mode POS</span>
          </button>
        )}

        {/* ================= WARGAQU BUKU INDUK TOP TOOLS ================= */}
        {activeModule === 'warga' && onOpenAddResident && (
          <button
            type="button"
            onClick={onOpenAddResident}
            className={`h-6.5 px-2 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 shadow-2xs ${
              isDark
                ? 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/60'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
            }`}
            title="Daftarkan Warga Baru ke Buku Induk"
          >
            <Plus className="w-3 h-3 text-emerald-500" />
            <span>+ Warga</span>
          </button>
        )}

        {/* ================= SETTINGQU TOP TOOLS ================= */}
        {activeModule === 'setting' && onOpenRoleSwitcher && (
          <button
            type="button"
            onClick={onOpenRoleSwitcher}
            className={`h-6.5 px-2 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 shadow-2xs ${
              isDark
                ? 'bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-700/60'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
            }`}
            title="Ganti Role & Hak Akses"
          >
            <Users className="w-3 h-3 text-amber-500" />
            <span>Role</span>
          </button>
        )}

        {/* ========================================================= */}
        {/* GLOBAL THEME SWITCHER (☀️ LIGHT / 🌙 DARK - SEMUA MODUL)   */}
        {/* ========================================================= */}
        <button
          type="button"
          onClick={onToggleTheme}
          className={`h-6.5 w-6.5 rounded-lg flex items-center justify-center transition cursor-pointer active:scale-95 shrink-0 shadow-2xs ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
          }`}
          title={isDark ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-in spin-in-180 duration-300" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-700 animate-in spin-in-180 duration-300" />
          )}
        </button>

        {/* Admin Command Center (Only if admin master authenticated) */}
        {authSession?.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase() && onOpenAdminCenter && (
          <button
            type="button"
            onClick={onOpenAdminCenter}
            className="h-6.5 px-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-[9px] flex items-center gap-1 shadow-md cursor-pointer transition active:scale-95 shrink-0"
            title="Admin Command Center"
          >
            <Sparkles className="w-3 h-3 fill-stone-950 text-stone-950" />
            <span>ADM</span>
          </button>
        )}

        {/* Update Badge Shortcut (if update available) */}
        {onCheckUpdate && hasUpdate && (
          <button
            onClick={onCheckUpdate}
            title={`Pembaruan Tersedia: ${displayVer}`}
            className="h-6.5 px-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/80 shadow-xs flex items-center gap-1 text-[8px] font-mono font-bold animate-pulse"
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>Baru</span>
          </button>
        )}

        {/* User Login / Role Badge */}
        <button
          id="btnProfilWargaQu"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onOpenAuth) onOpenAuth();
            const modal = document.getElementById('modalLoginWargaQu');
            if (modal) modal.classList.remove('hidden');
          }}
          className={`flex items-center gap-1 h-6.5 py-0 px-2 rounded-lg border text-[10px] shrink-0 cursor-pointer transition active:scale-95 relative z-30 select-none shadow-xs ${
            isDark
              ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
          }`}
          title={authSession ? `Sesi Login: ${authSession.email}` : 'Masuk / Login Akun'}
        >
          {authSession ? (
            <>
              <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="font-bold truncate max-w-[55px] xs:max-w-[70px] hidden xs:inline leading-none">
                {authSession.name ? authSession.name.split(' ')[0] : currentUser.name.split(' ')[0]}
              </span>
              <span className="font-mono text-[8.5px] px-1 rounded bg-black/40 text-amber-300 font-bold leading-none">
                {authSession.role === 'Admin' ? 'ADM' : isTier2 ? 'T2' : 'T1'}
              </span>
            </>
          ) : (
            <>
              <Lock className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="font-bold text-amber-600 dark:text-amber-400 leading-none">Login</span>
              <span
                className={`font-mono text-[8.5px] px-1 rounded font-bold leading-none ${
                  isDark ? 'bg-slate-900 text-emerald-400' : 'bg-white text-emerald-700'
                }`}
              >
                T1
              </span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
