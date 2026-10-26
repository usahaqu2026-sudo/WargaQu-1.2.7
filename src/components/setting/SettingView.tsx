import React, { useState } from 'react';
import {
  Settings,
  Store,
  Printer,
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Bluetooth,
  CheckCircle2,
  RefreshCw,
  X,
  Check,
  Smartphone,
  Info,
  Download,
  GitBranch,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
  HelpCircle,
  Users,
  Contact,
  FileCode,
  UserCheck,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Zap,
  Lock,
  MapPin,
  Sliders,
} from 'lucide-react';
import { RestaurantProfile, PrinterConfig, MenuItem, MenuCategory, ResidentData, UserProfile } from '../../types';
import { PrinterService } from '../../services/printer';
import { UpdateService, UpdateInfo, APP_CURRENT_VERSION, APP_BUILD_NUMBER } from '../../services/updateService';
import { AppQuStorageService } from '../../services/storageAppQu';
import { UpdateModal } from '../UpdateModal';
import { WargaView } from '../appqu/WargaView';
import { ArsitekturView } from '../appqu/ArsitekturView';
import {
  Camera,
  AlertTriangle,
  Building2,
  BadgeCheck,
  User,
  Calendar,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Clock,
  Share2,
  Upload,
  Volume2,
  Vibrate,
  Key,
  Shield,
} from 'lucide-react';

interface SettingViewProps {
  profile: RestaurantProfile;
  onSaveProfile: (profile: RestaurantProfile) => void;
  printerConfig: PrinterConfig;
  onSavePrinterConfig: (config: PrinterConfig) => void;
  menuList: MenuItem[];
  onSaveMenu: (menu: MenuItem[]) => void;
  // AppQu Governance & Community Integration
  currentUser?: UserProfile;
  onUpdateCurrentUser?: (user: UserProfile) => void;
  residents?: ResidentData[];
  onUpdateResidents?: (residents: ResidentData[]) => void;
  onOpenRoleModal?: () => void;
  onOpenHierarchy?: () => void;
  witnessCount?: number;
  onNavigateToModule?: (module: 'paguyuban' | 'warga' | 'usaha' | 'area' | 'siaga' | 'chat' | 'arsitektur') => void;
  showNotification?: (msg: string) => void;
  initialSubTab?: 'profil' | 'komunitas' | 'warga' | 'keamanan' | 'hardware' | 'pemulihan' | 'skema' | 'toko' | 'menu' | 'printer' | 'update';
  onOpenAuth?: () => void;
  onOpenAdminCenter?: () => void;
  authSession?: any;
  theme?: 'light' | 'dark';
}

export const SettingView: React.FC<SettingViewProps> = ({
  profile,
  onSaveProfile,
  printerConfig,
  onSavePrinterConfig,
  menuList,
  onSaveMenu,
  currentUser,
  onUpdateCurrentUser,
  residents = [],
  onUpdateResidents,
  onOpenRoleModal,
  onOpenHierarchy,
  witnessCount = 2,
  onNavigateToModule,
  showNotification,
  initialSubTab,
  onOpenAuth,
  onOpenAdminCenter,
  authSession,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [activeSubTab, setActiveSubTab] = useState<
    'profil' | 'komunitas' | 'warga' | 'keamanan' | 'hardware' | 'pemulihan' | 'skema' | 'toko' | 'menu' | 'printer' | 'update'
  >(() => initialSubTab || (currentUser ? 'profil' : 'toko'));

  // ====================================================
  // CITIZEN / OFFICER PROFILE FORM & GOVERNANCE STATES
  // ====================================================
  const [citizenName, setCitizenName] = useState(currentUser?.name || '');
  const [citizenNickname, setCitizenNickname] = useState(currentUser?.nickname || 'Bageur');
  const [citizenNik, setCitizenNik] = useState(currentUser?.nik || '3201123456780002');
  const [citizenAlamat, setCitizenAlamat] = useState(
    currentUser?.alamat || currentUser?.blockNumber || ''
  );
  const [citizenStatus, setCitizenStatus] = useState<'warga_asli' | 'pendatang'>(
    currentUser?.statusKependudukan || 'warga_asli'
  );
  const [citizenPhoto, setCitizenPhoto] = useState<string>(
    currentUser?.fotoSelfieCompressed || currentUser?.avatarUrl || ''
  );
  const [photoCompressInfo, setPhotoCompressInfo] = useState<{
    originalKb: number;
    compressedKb: number;
    ratio: number;
  } | null>(null);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  // Opsi Komunitas & Wilayah States
  const [communityRadius, setCommunityRadius] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('appqu_community_radius_meters_v1');
      return saved ? parseInt(saved, 10) : 3000;
    } catch {
      return 3000;
    }
  });
  const [emergencySound, setEmergencySound] = useState<boolean>(() => {
    try {
      return localStorage.getItem('appqu_emergency_sound_v1') !== 'false';
    } catch {
      return true;
    }
  });
  const [emergencyVibrate, setEmergencyVibrate] = useState<boolean>(() => {
    try {
      return localStorage.getItem('appqu_emergency_vibrate_v1') !== 'false';
    } catch {
      return true;
    }
  });

  // Keamanan & Perangkat States
  const [deviceModel, setDeviceModel] = useState<string>(currentUser?.deviceModel || 'Chrome Android (Mobile)');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Pusat Pemulihan Data (Backup, Restore & Reset)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [confirmResetText, setConfirmResetText] = useState('');
  const restoreFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Tier 1 vs Tier 2 Selection
  const [selectedTier, setSelectedTier] = useState<'tier1' | 'tier2'>(
    currentUser?.tierLevel ||
      (currentUser?.roleTier === 'tier2_pengurus_rt' ||
      currentUser?.roleTier === 'pengurus' ||
      currentUser?.roleTier === 'governance'
        ? 'tier2'
        : 'tier1')
  );

  // Tier 2 Roles: RT, Babinsa, Babinkamtibmas, Ketua Paguyuban, Wakil, Sekretaris, Bendahara
  const [selectedJabatanTier2, setSelectedJabatanTier2] = useState<
    'rt' | 'babinsa' | 'bhabinkamtibmas' | 'ketua_paguyuban' | 'wakil' | 'sekretaris' | 'bendahara'
  >(currentUser?.jabatanTier2 || 'rt');

  // Tier 1 Roles: Warga, Relawan
  const [selectedRoleTier1, setSelectedRoleTier1] = useState<'warga' | 'relawan'>(
    currentUser?.roleDetail === 'relawan' ? 'relawan' : 'warga'
  );

  // Masa Jabatan Tier 2 States
  const [masaJabatanStart, setMasaJabatanStart] = useState<string>(
    currentUser?.masaJabatanStart || '2024-01-01'
  );
  const [masaJabatanEnd, setMasaJabatanEnd] = useState<string>(
    currentUser?.masaJabatanEnd || '2027-01-01'
  );

  // SiagaQu Access Toggle State
  const [siagaQuToggle, setSiagaQuToggle] = useState<'aktif' | 'nonaktif'>(
    currentUser?.siagaQuAkses === 'nonaktif' ? 'nonaktif' : 'aktif'
  );

  const [citizenSavedMsg, setCitizenSavedMsg] = useState(false);

  // Sync subTab when initialSubTab prop changes externally from sidebar drawer
  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Sync state when currentUser changes externally
  React.useEffect(() => {
    if (currentUser) {
      setCitizenName(currentUser.name || '');
      setCitizenAlamat(currentUser.alamat || currentUser.blockNumber || '');
      setCitizenStatus(currentUser.statusKependudukan || 'warga_asli');
      setCitizenPhoto(currentUser.fotoSelfieCompressed || currentUser.avatarUrl || '');
      setSelectedTier(
        currentUser.tierLevel ||
          (currentUser.roleTier === 'tier2_pengurus_rt' ||
          currentUser.roleTier === 'pengurus' ||
          currentUser.roleTier === 'governance'
            ? 'tier2'
            : 'tier1')
      );
      if (currentUser.jabatanTier2) {
        setSelectedJabatanTier2(currentUser.jabatanTier2);
      }
      if (currentUser.roleDetail === 'relawan') {
        setSelectedRoleTier1('relawan');
      } else {
        setSelectedRoleTier1('warga');
      }
      if (currentUser.masaJabatanStart) setMasaJabatanStart(currentUser.masaJabatanStart);
      if (currentUser.masaJabatanEnd) setMasaJabatanEnd(currentUser.masaJabatanEnd);
      if (currentUser.siagaQuAkses) setSiagaQuToggle(currentUser.siagaQuAkses === 'nonaktif' ? 'nonaktif' : 'aktif');
    }
  }, [currentUser]);

  // Evaluasi masa jabatan Tier 2 live
  const isSelectedTier2 = selectedTier === 'tier2';
  const isMasaJabatanExpired =
    isSelectedTier2 && masaJabatanEnd
      ? new Date(masaJabatanEnd).getTime() < Date.now()
      : false;

  // Evaluasi syarat SiagaQu RT / Ketua Paguyuban
  const activeWargaCount = residents.length;
  const isSiagaQuEligibleMin2 = activeWargaCount >= 2;
  const daysSinceJoined = currentUser?.joinedAt
    ? Math.floor((Date.now() - new Date(currentUser.joinedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 35;
  const isSiagaQuSuspended30Days = daysSinceJoined >= 30 && activeWargaCount < 10;

  // Handle Photo Upload with Automatic Canvas Compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressingPhoto(true);
    try {
      const res = await AppQuStorageService.compressImageClient(file, 480, 480, 0.72);
      setCitizenPhoto(res.dataUrl);
      const origKb = Math.round(res.originalSize / 1024);
      const compKb = Math.round(res.compressedSize / 1024);
      const saved = Math.max(0, Math.round(((res.originalSize - res.compressedSize) / res.originalSize) * 100));
      setPhotoCompressInfo({ originalKb: origKb, compressedKb: compKb, ratio: saved });
      if (showNotification) {
        showNotification(`Foto dikompres otomatis: ${origKb} KB ➔ ${compKb} KB (Hemat ${saved}%)`);
      }
    } catch (err: any) {
      if (showNotification) showNotification('Gagal memproses foto: ' + err.message);
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  // Handle Save Citizen / Officer Profile
  const handleSaveCitizenProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    let roleTitle = '';
    let roleDetail: any = 'warga';
    let roleTier: any = 'tier1_akar_rumput';

    if (isSelectedTier2) {
      roleTier = 'tier2_pengurus_rt';
      switch (selectedJabatanTier2) {
        case 'rt':
          roleDetail = 'ketua_rt';
          roleTitle = isMasaJabatanExpired
            ? 'Ketua RT (Masa Jabatan Berakhir - Nonaktif Otomatis)'
            : 'Ketua RT 04 (Hak Akses, Verifikasi & Kontrol SiagaQu)';
          break;
        case 'babinsa':
          roleDetail = 'babinsa';
          roleTitle = isMasaJabatanExpired
            ? 'Babinsa (Masa Tugas Berakhir)'
            : 'Babinsa TNI AD (Pembina Kamtibmas Teritorial)';
          break;
        case 'bhabinkamtibmas':
          roleDetail = 'bhabinkamtibmas';
          roleTitle = isMasaJabatanExpired
            ? 'Bhabinkamtibmas (Masa Tugas Berakhir)'
            : 'Bhabinkamtibmas POLRI (Ketertiban & Keamanan Masyarakat)';
          break;
        case 'ketua_paguyuban':
          roleDetail = 'ketua_paguyuban';
          roleTitle = isMasaJabatanExpired
            ? 'Ketua Paguyuban (Masa Jabatan Berakhir - Nonaktif Otomatis)'
            : 'Ketua Paguyuban Warga (Hak Akses, Verifikasi & SiagaQu)';
          break;
        case 'wakil':
          roleDetail = 'wakil_rt';
          roleTitle = isMasaJabatanExpired
            ? 'Wakil Ketua (Masa Jabatan Berakhir)'
            : 'Wakil Ketua RT / Paguyuban (Koordinator Lapangan)';
          break;
        case 'sekretaris':
          roleDetail = 'sekretaris';
          roleTitle = isMasaJabatanExpired
            ? 'Sekretaris (Masa Jabatan Berakhir)'
            : 'Sekretaris RT (Admin Administrasi & Approval Surat)';
          break;
        case 'bendahara':
          roleDetail = 'bendahara';
          roleTitle = isMasaJabatanExpired
            ? 'Bendahara (Masa Jabatan Berakhir)'
            : 'Bendahara Paguyuban (Kas & Iuran Warga)';
          break;
      }
    } else {
      roleTier = 'tier1_akar_rumput';
      roleDetail = selectedRoleTier1;
      roleTitle =
        selectedRoleTier1 === 'relawan'
          ? 'Relawan Tanggap Musibah & Sosial'
          : citizenStatus === 'warga_asli'
          ? 'Warga Asli RT 04 (Tervalidasi Saksi Tetangga)'
          : 'Warga Pendatang (Menunggu Verifikasi & Validasi)';
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      name: citizenName.trim() || currentUser.name,
      nickname: citizenNickname.trim() || 'Bageur',
      nik: citizenNik.trim() || currentUser.nik,
      alamat: citizenAlamat.trim() || currentUser.alamat || currentUser.blockNumber,
      blockNumber: citizenAlamat.trim() || currentUser.blockNumber,
      statusKependudukan: citizenStatus,
      fotoSelfieCompressed: citizenPhoto || currentUser.fotoSelfieCompressed,
      avatarUrl: citizenPhoto || currentUser.avatarUrl,
      deviceModel: deviceModel.trim() || currentUser.deviceModel,
      tierLevel: selectedTier,
      jabatanTier2: isSelectedTier2 ? selectedJabatanTier2 : undefined,
      roleTier,
      roleDetail,
      roleTitle,
      masaJabatanStart: isSelectedTier2 ? masaJabatanStart : undefined,
      masaJabatanEnd: isSelectedTier2 ? masaJabatanEnd : undefined,
      isMasaJabatanAktif: isSelectedTier2 ? !isMasaJabatanExpired : true,
      badgeValidasi: isMasaJabatanExpired
        ? 'ditangguhkan'
        : (currentUser.witnessCount && currentUser.witnessCount >= 2 ? 'tervalidasi' : 'menunggu_validasi'),
      siagaQuAkses: isSelectedTier2
        ? isMasaJabatanExpired
          ? 'ditangguhkan'
          : isSiagaQuSuspended30Days
          ? 'ditangguhkan'
          : !isSiagaQuEligibleMin2
          ? 'ditangguhkan'
          : siagaQuToggle
        : currentUser.siagaQuAkses || 'aktif',
    };

    AppQuStorageService.saveCurrentUser(updatedUser);
    if (onUpdateCurrentUser) {
      onUpdateCurrentUser(updatedUser);
    }
    setCitizenSavedMsg(true);
    setTimeout(() => setCitizenSavedMsg(false), 2500);
    if (showNotification) {
      showNotification('Ketentuan profil & hak akses akun berhasil disimpan!');
    }
  };

  // Backup, Restore & Reset Handlers
  const handleExportBackup = () => {
    try {
      const jsonStr = AppQuStorageService.exportAllDataJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `appqu_backup_${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
      if (showNotification) showNotification('✓ File cadangan JSON berhasil diunduh ke HP Anda!');
    } catch (err: any) {
      if (showNotification) showNotification('Gagal mengekspor data: ' + err.message);
    }
  };

  const handleShareBackup = () => {
    try {
      const jsonStr = AppQuStorageService.exportAllDataJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const dateStr = new Date().toISOString().slice(0, 10);
      const file = new File([blob], `appqu_backup_${dateStr}.json`, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'Cadangan Data AppQu',
          text: 'File cadangan data ekosistem AppQu warga.',
        }).catch(() => {});
      } else {
        handleExportBackup();
      }
    } catch {
      handleExportBackup();
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = AppQuStorageService.importAllDataJson(text);
        if (res.success) {
          if (showNotification) showNotification(res.message);
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          alert(res.message);
        }
      } catch (err: any) {
        alert('Gagal membaca file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteFactoryReset = () => {
    if (confirmResetText.trim().toUpperCase() !== 'RESET') {
      alert('Ketik "RESET" dengan huruf besar untuk mengonfirmasi reset total.');
      return;
    }
    AppQuStorageService.factoryResetAllData();
    setIsResetModalOpen(false);
    alert('Aplikasi telah di-reset ke setelan awal. Halaman akan dimuat ulang.');
    window.location.reload();
  };

  const [pinSuccessMsg, setPinSuccessMsg] = useState(false);
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      if (showNotification) showNotification('PIN baru harus 6 digit angka numerik!');
      return;
    }
    if (newPin !== confirmPin) {
      if (showNotification) showNotification('Konfirmasi PIN tidak cocok!');
      return;
    }
    if (currentUser) {
      const updated = { ...currentUser, pinCode: newPin };
      AppQuStorageService.saveCurrentUser(updated);
      if (onUpdateCurrentUser) onUpdateCurrentUser(updated);
    }
    setPinSuccessMsg(true);
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => setPinSuccessMsg(false), 2500);
    if (showNotification) showNotification('✓ PIN Pengaman HP berhasil diperbarui!');
  };

  const handleUpdateRadius = (val: number) => {
    setCommunityRadius(val);
    try {
      localStorage.setItem('appqu_community_radius_meters_v1', val.toString());
    } catch {}
    if (showNotification) showNotification(`Radius pemantauan wilayah diubah ke ${(val / 1000).toFixed(1)} KM`);
  };

  const handleToggleEmergencySound = () => {
    const next = !emergencySound;
    setEmergencySound(next);
    try {
      localStorage.setItem('appqu_emergency_sound_v1', next ? 'true' : 'false');
    } catch {}
    if (showNotification) showNotification(next ? 'Suara Sirene SiagaQu: AKTIF' : 'Suara Sirene SiagaQu: NONAKTIF');
  };

  const handleToggleEmergencyVibrate = () => {
    const next = !emergencyVibrate;
    setEmergencyVibrate(next);
    try {
      localStorage.setItem('appqu_emergency_vibrate_v1', next ? 'true' : 'false');
    } catch {}
    if (showNotification) showNotification(next ? 'Getar HP Darurat: AKTIF' : 'Getar HP Darurat: NONAKTIF');
  };

  // Update & Auto-Release states
  const [repoInput, setRepoInput] = useState<string>(UpdateService.getGitHubRepo());
  const [knownRepos, setKnownRepos] = useState<string[]>(UpdateService.getKnownRepos());
  const [isCustomRepo, setIsCustomRepo] = useState<boolean>(UpdateService.isCustomRepoSet());
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateInfo | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [repoSavedMsg, setRepoSavedMsg] = useState(false);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(UpdateService.isAutoCheckEnabled());
  const [directInstallEnabled, setDirectInstallEnabled] = useState(UpdateService.isDirectInstallEnabled());
  const [isInstantWebUpdating, setIsInstantWebUpdating] = useState(false);

  // Profile Form state
  const [name, setName] = useState(profile.name);
  const [slogan, setSlogan] = useState(profile.slogan);
  const [address, setAddress] = useState(profile.address);
  const [phone, setPhone] = useState(profile.phone);
  const [receiptHeader, setReceiptHeader] = useState(profile.receiptHeader);
  const [receiptFooter, setReceiptFooter] = useState(profile.receiptFooter);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Bluetooth scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [printerStatusMsg, setPrinterStatusMsg] = useState<string | null>(null);

  // Menu modal state
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuName, setMenuName] = useState('');
  const [menuCat, setMenuCat] = useState<MenuCategory>('bakso_kuah');
  const [menuPrice, setMenuPrice] = useState<number>(20000);
  const [menuDesc, setMenuDesc] = useState('');

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim(),
      slogan: slogan.trim(),
      address: address.trim(),
      phone: phone.trim(),
      receiptHeader: receiptHeader.trim(),
      receiptFooter: receiptFooter.trim(),
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2500);
  };

  const handleCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setUpdateError(null);
    setUpdateResult(null);
    try {
      const res = await UpdateService.checkForUpdates(repoInput);
      setUpdateResult(res);
      if (res.hasUpdate) {
        setIsUpdateModalOpen(true);
      }
    } catch (err: any) {
      setUpdateError(err.message || 'Gagal memeriksa pembaruan.');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleSaveRepo = (e: React.FormEvent) => {
    e.preventDefault();
    UpdateService.setGitHubRepo(repoInput, true);
    setIsCustomRepo(true);
    setKnownRepos(UpdateService.getKnownRepos());
    setRepoSavedMsg(true);
    setTimeout(() => setRepoSavedMsg(false), 2000);
  };

  const handleSelectQuickRepo = (repo: string) => {
    setRepoInput(repo);
    UpdateService.setGitHubRepo(repo, true);
    setIsCustomRepo(true);
    setKnownRepos(UpdateService.getKnownRepos());
    setRepoSavedMsg(true);
    setTimeout(() => setRepoSavedMsg(false), 2000);
  };

  const handleResetToBundled = async () => {
    const detected = await UpdateService.resetToAutoRepo();
    setRepoInput(detected);
    setIsCustomRepo(false);
    setKnownRepos(UpdateService.getKnownRepos());
    setRepoSavedMsg(true);
    setTimeout(() => setRepoSavedMsg(false), 2000);
  };

  const handleToggleAutoCheck = () => {
    const next = !autoCheckEnabled;
    setAutoCheckEnabled(next);
    UpdateService.setAutoCheckEnabled(next);
  };

  const handleToggleDirectInstall = () => {
    const next = !directInstallEnabled;
    setDirectInstallEnabled(next);
    UpdateService.setDirectInstallEnabled(next);
    if (showNotification) {
      showNotification(next ? 'Opsi Update Langsung Install: DIAKTIFKAN' : 'Opsi Update Langsung Install: DINONAKTIFKAN');
    }
  };

  const handleInstantWebUpdate = async () => {
    setIsInstantWebUpdating(true);
    if (showNotification) showNotification('Membersihkan cache lama & memuat ulang rilis terbaru...');
    await new Promise((r) => setTimeout(r, 600));
    await UpdateService.instantWebUpdate();
  };

  const handleScanBluetooth = async () => {
    setIsScanning(true);
    setPrinterStatusMsg('Mencari printer thermal bluetooth terdekat...');
    try {
      const res = await PrinterService.scanAndConnectBluetooth();
      setPrinterStatusMsg(res.message);
      if (res.success && res.deviceName) {
        onSavePrinterConfig({
          ...printerConfig,
          connectedDeviceName: res.deviceName,
        });
      }
    } catch (e: any) {
      setPrinterStatusMsg('Gagal menyambungkan printer: ' + e.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleTestPrint = async () => {
    setPrinterStatusMsg('Mengirim sinyal tes cetak ke printer...');
    const dummyOrder: any = {
      id: 'test-print',
      receiptNumber: 'TEST-PRINT-001',
      type: 'meja',
      tableName: 'Meja Tes',
      customerName: 'Uji Coba Printer',
      items: [
        { menuId: '1', name: 'Bakso Urat Jumbo (Tes)', price: 25000, quantity: 1 },
        { menuId: '2', name: 'Es Teh Manis (Tes)', price: 5000, quantity: 1 },
      ],
      subtotal: 30000,
      discount: 0,
      tax: 0,
      total: 30000,
      status: 'paid',
      createdAt: new Date().toISOString(),
      paymentMethod: 'tunai',
      cashAmount: 50000,
      changeAmount: 20000,
    };

    const res = await PrinterService.printOrder(dummyOrder, profile, printerConfig, false);
    setPrinterStatusMsg(res.message);
    setTimeout(() => setPrinterStatusMsg(null), 3500);
  };

  // Menu Handlers
  const handleOpenAddMenu = () => {
    setEditingMenuItem(null);
    setMenuName('');
    setMenuCat('bakso_kuah');
    setMenuPrice(20000);
    setMenuDesc('');
    setIsMenuModalOpen(true);
  };

  const handleOpenEditMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuName(item.name);
    setMenuCat(item.category);
    setMenuPrice(item.price);
    setMenuDesc(item.description);
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) return;

    if (editingMenuItem) {
      const updated = menuList.map((m) =>
        m.id === editingMenuItem.id
          ? {
              ...m,
              name: menuName.trim(),
              category: menuCat,
              price: menuPrice,
              description: menuDesc.trim(),
            }
          : m
      );
      onSaveMenu(updated);
    } else {
      const newItem: MenuItem = {
        id: `menu-${Date.now()}`,
        name: menuName.trim(),
        category: menuCat,
        price: menuPrice,
        description: menuDesc.trim(),
        imageUrl: menuList[0]?.imageUrl || '',
        isAvailable: true,
      };
      onSaveMenu([...menuList, newItem]);
    }
    setIsMenuModalOpen(false);
  };

  const handleDeleteMenu = (id: string, name: string) => {
    if (confirm(`Yakin hapus menu "${name}"?`)) {
      onSaveMenu(menuList.filter((m) => m.id !== id));
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-stone-900'
      }`}
    >
      {/* Top Header Bar with Close / Return Button */}
      {currentUser && (
        <div
          className={`flex items-center justify-between p-2.5 border-b shadow-2xs shrink-0 transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200/90 text-stone-900'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <Sliders className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h2 className={`text-xs font-black leading-tight truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Opsi & Pengaturan
              </h2>
              <span className={`text-[10px] font-medium leading-none block truncate ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                Pusat Kontrol & Konfigurasi Ekosistem WargaQu
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onNavigateToModule) onNavigateToModule('paguyuban');
            }}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
            title="Tutup Pengaturan & Kembali ke Beranda"
          >
            <span>Tutup ✕</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 pb-6">

      {/* TAB: PROFIL AKUN & KETENTUAN KEPENGURUSAN TIER 1 & TIER 2 */}
      {activeSubTab === 'profil' && (
        <form onSubmit={handleSaveCitizenProfileSubmit} className="space-y-3.5 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 text-white shadow-md border border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                Ketentuan Pengaturan Profil
              </span>
              <span className="text-[11px] font-mono text-emerald-300">
                {isSelectedTier2 ? 'Tier 2: Kepengurusan' : 'Tier 1: Akar Rumput'}
              </span>
            </div>
            <h2 className="text-base font-black text-white leading-tight">
              Profil Pengguna, Verifikasi & Masa Jabatan
            </h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Konfigurasi identitas warga, selfie auto-kompres, rantai verifikasi timbal-balik Tier 1 & 2, masa jabatan otomatis nonaktif, serta wewenang kontrol SiagaQu.
            </p>
          </div>

          {/* Status Badge Akun Terverifikasi / Validasi */}
          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                {citizenPhoto ? (
                  <img
                    src={citizenPhoto}
                    alt="Foto Profil"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-800 flex items-center justify-center font-black text-xl">
                    {citizenName.slice(0, 2).toUpperCase() || 'AQ'}
                  </div>
                )}
                {/* Badge Icon Overlay */}
                <div className="absolute -bottom-1 -right-1">
                  {isMasaJabatanExpired ? (
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shadow" title="Masa Jabatan Habis">
                      ✕
                    </span>
                  ) : currentUser?.badgeValidasi === 'tervalidasi' || currentUser?.isVerified ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow" title="Akun Tervalidasi Resmi">
                      ✓
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-bold shadow" title="Menunggu Validasi">
                      !
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-black text-stone-900 leading-tight">
                    {citizenName || 'Pengguna AppQu'}
                  </h3>
                  {/* Badge Verifikasi Akun */}
                  {isMasaJabatanExpired ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 text-[10px] font-black">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      Hak Akses Ditangguhkan (Jabatan Berakhir)
                    </span>
                  ) : currentUser?.badgeValidasi === 'tervalidasi' || currentUser?.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Akun Tervalidasi Resmi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Menunggu Validasi Tetangga
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 mt-0.5 font-medium">
                  {citizenAlamat || 'Alamat RT 04 / RW 09'} •{' '}
                  <span className="capitalize font-bold text-stone-800">
                    {citizenStatus === 'warga_asli' ? 'Warga Asli' : 'Warga Pendatang'}
                  </span>
                </p>
                <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                  ID: {currentUser?.deviceFingerprint || 'DEV-SECURE-LOCKED'}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-stone-400">
                Tingkat Akun
              </span>
              <span className={`text-xs font-black px-2.5 py-1 rounded-xl block mt-0.5 ${
                isSelectedTier2 ? 'bg-teal-100 text-teal-900 border border-teal-300' : 'bg-stone-100 text-stone-800 border border-stone-300'
              }`}>
                {isSelectedTier2 ? 'Tier 2' : 'Tier 1'}
              </span>
            </div>
          </div>

          {/* Form Utama Profil */}
          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>Data Identitas Warga</span>
            </h3>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nama Lengkap Sesuai KTP / Registrasi:
              </label>
              <input
                type="text"
                required
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Contoh: Ir. H. Hendra Gunawan"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition"
              />
            </div>

            {/* Nama Panggilan & NIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Panggilan (Bageur):
                </label>
                <input
                  type="text"
                  value={citizenNickname}
                  onChange={(e) => setCitizenNickname(e.target.value)}
                  placeholder="Contoh: Kang Bageur"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-emerald-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nomor Induk Kependudukan (NIK):
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={citizenNik}
                  onChange={(e) => setCitizenNik(e.target.value)}
                  placeholder="3201xxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Alamat Lengkap Rumah / Domisili:
              </label>
              <textarea
                rows={2}
                required
                value={citizenAlamat}
                onChange={(e) => setCitizenAlamat(e.target.value)}
                placeholder="Contoh: Jl. Melati Utama Blok A1 No. 01, RT 04 / RW 09"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition resize-none"
              />
            </div>

            {/* Status Warga Asli / Pendatang */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Status Kependudukan:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCitizenStatus('warga_asli')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                    citizenStatus === 'warga_asli'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black block">Warga Asli</span>
                    <span className="text-[10px] text-stone-500">KTP Setempat / Pemilik Tetap</span>
                  </div>
                  {citizenStatus === 'warga_asli' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCitizenStatus('pendatang')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                    citizenStatus === 'pendatang'
                      ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20 text-sky-950'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black block">Pendatang</span>
                    <span className="text-[10px] text-stone-500">Domisili Kontrak / Kos</span>
                  </div>
                  {citizenStatus === 'pendatang' && (
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            {/* Selfie / Foto Auto Kompres */}
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Foto Selfie / Profil Warga (Auto-Kompres)</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Canvas Auto-Compress
                </span>
              </div>

              <div className="flex items-center gap-3">
                {citizenPhoto ? (
                  <img
                    src={citizenPhoto}
                    alt="Selfie Terkompres"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-stone-200 border border-stone-300 text-stone-400 flex items-center justify-center shrink-0">
                    <Camera className="w-6 h-6 text-stone-400" />
                  </div>
                )}

                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    id="selfie-file-input"
                    accept="image/*"
                    capture="user"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="selfie-file-input"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{citizenPhoto ? 'Ganti Foto / Selfie' : 'Ambil Selfie / Pilih Foto'}</span>
                  </label>

                  {isCompressingPhoto && (
                    <p className="text-[11px] text-amber-700 font-bold animate-pulse">
                      Mengompres foto secara otomatis di HP...
                    </p>
                  )}

                  {photoCompressInfo && !isCompressingPhoto && (
                    <div className="text-[10px] font-mono text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded-lg border border-emerald-300/80">
                      Ukuran asli {photoCompressInfo.originalKb} KB ➔ <strong>{photoCompressInfo.compressedKb} KB</strong> (Hemat {photoCompressInfo.ratio}%, ramah offline)
                    </div>
                  )}

                  {!photoCompressInfo && !isCompressingPhoto && (
                    <p className="text-[10px] text-stone-500">
                      Foto otomatis dikompres via Canvas sehingga ringan, aman & hemat memori HP tanpa beban server.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pengaturan Jenjang Peran: Tier 1 vs Tier 2 */}
          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Jenjang Peran (Tier 1 & Tier 2 Saling Validasi)</span>
              </h3>
              <span className="text-[10px] font-bold text-stone-500">
                Chain of Trust
              </span>
            </div>

            {/* Switcher Tier 1 vs Tier 2 */}
            <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedTier('tier1')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedTier === 'tier1'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>Tier 1: Warga & Relawan</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('tier2')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedTier === 'tier2'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>Tier 2: Pengurus & Aparat</span>
              </button>
            </div>

            {/* Detail Tier 1 */}
            {selectedTier === 'tier1' && (
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <div className="text-xs text-stone-700 leading-relaxed">
                  <strong>Ketentuan Tier 1:</strong> Pertama aktivasi / registrasi, akun Tier 1 saling diverifikasi & divalidasi oleh sesama warga (minimal 2 saksi tetangga) dan disahkan pengurus Tier 2.
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedRoleTier1('warga')}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      selectedRoleTier1 === 'warga'
                        ? 'bg-emerald-100 border-emerald-600 font-bold text-emerald-950'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-xs block font-bold">Warga</span>
                    <span className="text-[10px] text-stone-500 block">Warga tetap/kontrak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRoleTier1('relawan')}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      selectedRoleTier1 === 'relawan'
                        ? 'bg-emerald-100 border-emerald-600 font-bold text-emerald-950'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-xs block font-bold">Relawan</span>
                    <span className="text-[10px] text-stone-500 block">Tanggap musibah/sosial</span>
                  </button>
                </div>
              </div>
            )}

            {/* Detail Tier 2: RT, Babinsa, Babinkamtibmas, Ketua Paguyuban, Wakil, Sekretaris, Bendahara */}
            {selectedTier === 'tier2' && (
              <div className="space-y-3">
                <div className="text-xs text-stone-700 leading-relaxed bg-teal-50 p-3 rounded-2xl border border-teal-200">
                  <strong>Ketentuan Tier 2:</strong> Pengurus kepengurusan wilayah & keamanan. Dilengkapi kontrol wewenang SiagaQu, verifikasi surat, dan <strong>masa jabatan otomatis non-aktif</strong> ketika habis periode.
                </div>

                {/* Pilihan 7 Jabatan Tier 2 */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Pilih Jabatan Kepengurusan Tier 2:
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5">
                    {[
                      { id: 'rt' as const, label: 'RT', desc: 'Hak akses verifikasi & ON/OFF SiagaQu' },
                      { id: 'babinsa' as const, label: 'Babinsa', desc: 'TNI AD Pembina Ketertiban Wilayah' },
                      { id: 'bhabinkamtibmas' as const, label: 'Babinkamtibmas', desc: 'POLRI Keamanan & Kamtibmas' },
                      { id: 'ketua_paguyuban' as const, label: 'Ketua Paguyuban', desc: 'Hak akses verifikasi & ON/OFF SiagaQu' },
                      { id: 'wakil' as const, label: 'Wakil', desc: 'Wakil Ketua RT / Paguyuban' },
                      { id: 'sekretaris' as const, label: 'Sekretaris', desc: 'Administrasi surat pengantar digital' },
                      { id: 'bendahara' as const, label: 'Bendahara', desc: 'Pengelola kas paguyuban & iuran warga' },
                    ].map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => setSelectedJabatanTier2(j.id)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          selectedJabatanTier2 === j.id
                            ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500/20 text-teal-950 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black">{j.label}</span>
                          {selectedJabatanTier2 === j.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                          )}
                        </div>
                        <span className="text-[10px] text-stone-500 font-normal mt-0.5">{j.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Masa Jabatan & Auto Non-Aktif */}
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-700" />
                      <span>Registrasi & Masa Jabatan Pengurus</span>
                    </label>
                    {isMasaJabatanExpired ? (
                      <span className="text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                        HABIS / NONAKTIF
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        AKTIF
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-stone-500 font-bold block mb-1">Mulai Jabatan:</span>
                      <input
                        type="date"
                        value={masaJabatanStart}
                        onChange={(e) => setMasaJabatanStart(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-bold block mb-1">Selesai Jabatan:</span>
                      <input
                        type="date"
                        value={masaJabatanEnd}
                        onChange={(e) => setMasaJabatanEnd(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Warning Auto Non-Aktif jika habis masa jabatan */}
                  {isMasaJabatanExpired ? (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-red-700">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Masa Jabatan Telah Berakhir!</span>
                      </div>
                      <p className="text-[11px] text-red-800 leading-relaxed">
                        Hak akses kepengurusan dan wewenang validasi/approval secara <strong>otomatis dinonaktifkan</strong> karena telah melewati tanggal {masaJabatanEnd}. Perpanjang tanggal masa jabatan untuk mengaktifkan kembali hak akses.
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-stone-500">
                      Sistem akan <strong>secara otomatis menonaktifkan hak akses</strong> kepengurusan saat tanggal selesai terlampaui tanpa perlu intervensi manual.
                    </p>
                  )}
                </div>

                {/* Kontrol Hak Akses SiagaQu (Khusus RT & Ketua Paguyuban) */}
                {(selectedJabatanTier2 === 'rt' || selectedJabatanTier2 === 'ketua_paguyuban') && (
                  <div className="p-3.5 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-emerald-400" />
                        <div>
                          <h4 className="text-xs font-black text-white">
                            Kontrol Sakelar SiagaQu (RT / Paguyuban)
                          </h4>
                          <span className="text-[10px] text-stone-400">
                            Wewenang aktivasi/verifikasi/on/off SiagaQu
                          </span>
                        </div>
                      </div>

                      {/* Toggle ON/OFF */}
                      <button
                        type="button"
                        disabled={isMasaJabatanExpired || !isSiagaQuEligibleMin2 || isSiagaQuSuspended30Days}
                        onClick={() => setSiagaQuToggle(siagaQuToggle === 'aktif' ? 'nonaktif' : 'aktif')}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                          siagaQuToggle === 'aktif'
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                            : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                        }`}
                      >
                        {siagaQuToggle === 'aktif' ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                            <span>SIAGAQU: ON</span>
                          </>
                        ) : (
                          <span>SIAGAQU: OFF</span>
                        )}
                      </button>
                    </div>

                    {/* Evaluasi Ketentuan Khusus SiagaQu */}
                    <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-stone-300">
                        <span>Warga Terdaftar Saat Ini:</span>
                        <strong className="text-emerald-400 font-mono text-sm">
                          {activeWargaCount} Warga
                        </strong>
                      </div>

                      {/* Rule 1: Min 2 warga */}
                      <div className="text-[11px] text-stone-400 flex items-start gap-1.5">
                        <span className={isSiagaQuEligibleMin2 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {isSiagaQuEligibleMin2 ? '✓' : '⚠️'}
                        </span>
                        <span>
                          Minimal 2 akun warga baru binaan terdaftar sebelum SiagaQu dapat diaktifkan.
                        </span>
                      </div>

                      {/* Rule 2: 30 hari < 10 warga -> status temporer / ditangguhkan */}
                      <div className="text-[11px] text-stone-400 flex items-start gap-1.5">
                        <span className={isSiagaQuSuspended30Days ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {isSiagaQuSuspended30Days ? '⚠️' : '✓'}
                        </span>
                        <span>
                          Jika wilayah berjalan 30 hari dan warga kurang dari 10, status menjadi temporer dan hak akses SiagaQu ditangguhkan sampai warga minimal 10 orang.
                        </span>
                      </div>

                      {isSiagaQuSuspended30Days && (
                        <div className="p-2 bg-amber-950/80 border border-amber-700 rounded-lg text-amber-200 text-[10px]">
                          ⚠️ <strong>Status Temporer:</strong> Wilayah telah aktif &gt;30 hari namun warga baru {activeWargaCount}/10. Hak akses SiagaQu ditangguhkan sementara sampai mencapai minimal 10 warga.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tombol Simpan Profil */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>SIMPAN PERUBAHAN PROFIL & KETENTUAN HAK AKSES</span>
            </button>

            {citizenSavedMsg && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-center text-xs font-bold animate-in fade-in">
                ✓ Profil, Selfie Kompres, & Status Hak Akses Berhasil Diperbarui!
              </div>
            )}
          </div>
        </form>
      )}

      {/* TAB 0: OPSI KOMUNITAS (WARGA, ROLE, 2 SAKSI, SKEMA) */}
      {activeSubTab === 'komunitas' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 text-white shadow-md border border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                Pusat Tata Kelola & Opsi
              </span>
              <span className="text-[11px] font-mono text-emerald-300">RT 04 / RW 09</span>
            </div>
            <h2 className="text-base font-black text-white leading-tight">
              Tata Kelola Komunitas & Pengaturan
            </h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Manajemen buku induk warga, ganti peran (role switcher), validasi 2 saksi tetangga, arsitektur sistem, printer struk, dan pembaruan aplikasi.
            </p>
          </div>

          {/* OPSI WILAYAH & NOTIFIKASI DARURAT SIAGAQU */}
          <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 text-stone-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Radius Wilayah & Sinyal Darurat SiagaQu
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                {(communityRadius / 1000).toFixed(1)} KM
              </span>
            </div>

            {/* Radius Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 font-medium">Radius Pemantauan Area:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {(communityRadius / 1000).toFixed(1)} Kilometer (Bawaan: 3.0 KM)
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={communityRadius}
                onChange={(e) => handleUpdateRadius(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>0.5 KM (Dekat)</span>
                <span>3.0 KM (Default)</span>
                <span>10.0 KM (Luas)</span>
              </div>
            </div>

            {/* Notifikasi Darurat SiagaQu */}
            <div className="pt-2 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-200">Suara Sirene SiagaQu</p>
                    <p className="text-[10px] text-stone-500">Bunyi darurat saat bahaya</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleEmergencySound}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                    emergencySound ? 'bg-emerald-600 justify-end' : 'bg-stone-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Vibrate className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-200">Getar Khusus HP</p>
                    <p className="text-[10px] text-stone-500">Getaran ritme sinyal bahaya</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleEmergencyVibrate}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                    emergencyVibrate ? 'bg-emerald-600 justify-end' : 'bg-stone-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* 4 Interactive Hub Cards for Warga, Role, 2 Saksi, Skema + Auth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Card 0: Autentikasi Berlapis & Panel Admin */}
            <div className="sm:col-span-2 p-4 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Otentikasi & Keamanan Berlapis
                  </span>
                  {authSession && (
                    <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-800">
                      {authSession.role}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-white">
                  {authSession ? `Sesi Aktif: ${authSession.name}` : 'Login & Otorisasi Perangkat'}
                </h3>
                <p className="text-[11px] text-stone-400 leading-relaxed max-w-lg">
                  {authSession
                    ? `Perangkat terkunci (${authSession.deviceFingerprint}). Dilengkapi SHA-256 session lock dan transfer sesi via Master Recovery Key.`
                    : 'Masuk dengan Email, Password, dan PIN 6-angka. Fitur deteksi Hidden Device Fingerprint & anti-tamper finansial.'}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="flex-1 sm:flex-initial py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{authSession ? 'Detail Akun & Kunci' : 'Masuk / Login Akun'}</span>
                </button>

                {authSession?.email?.toLowerCase() === 'hendri.bageur20@gmail.com' && (
                  <button
                    type="button"
                    onClick={onOpenAdminCenter}
                    className="flex-1 sm:flex-initial py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
                    <span>Panel Admin</span>
                  </button>
                )}
              </div>
            </div>

            {/* Card 1: Buku Induk WargaQu */}
            <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    <Contact className="w-5 h-5 text-sky-700" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 font-bold text-[10px] border border-sky-200">
                    {residents?.length || 48} Warga Terdaftar
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Buku Induk WargaQu
                </h3>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Direktori kependudukan warga RT 04: NIK, nomor KK, alamat rumah, status domisili (tetap/kontrak/kos), dan kartu tanda warga digital ber-QR.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('warga')}
                className="w-full py-2.5 px-3 bg-sky-600 hover:bg-sky-500 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Buka Buku Induk Warga</span>
              </button>
            </div>

            {/* Card 2: Ganti Peran (Role Switcher) */}
            <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5 text-teal-700" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-200">
                    {currentUser?.roleTier === 'tier2_pengurus_rt' ? 'Tier 2: Pengurus' : 'Tier 1: Warga'}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Ganti Peran Pengguna (Role)
                </h3>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Peran aktif: <strong className="text-stone-900">{currentUser?.roleTitle || currentUser?.name || 'Warga RT 04'}</strong>. Beralih peran antara Warga Biasa, Ketua RT, Hansip, Relawan, dan Pedagang Lapak.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onOpenRoleModal) onOpenRoleModal();
                }}
                className="w-full py-2.5 px-3 bg-teal-700 hover:bg-teal-600 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Ganti Peran Pengguna (Role)</span>
              </button>
            </div>

            {/* Card 3: Validasi Berantai (2 Saksi) */}
            <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5 text-purple-700" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 font-bold text-[10px] border border-purple-200">
                    {witnessCount >= 2 ? '2/2 Saksi Lengkap' : '0/2 Saksi (Menunggu)'}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Validasi 2 Saksi (Chain of Trust)
                </h3>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Rantai kepercayaan warga lokal tanpa pihak ketiga: Setiap akun baru divalidasi oleh 2 tetangga berstatus tetap dan disahkan oleh pengurus RT.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onOpenHierarchy) onOpenHierarchy();
                }}
                className="w-full py-2.5 px-3 bg-purple-700 hover:bg-purple-600 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Buka Skema 2 Saksi & Hierarki</span>
              </button>
            </div>

            {/* Card 4: Skema & Arsitektur Sistem */}
            <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <FileCode className="w-5 h-5 text-indigo-700" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 font-bold text-[10px] border border-indigo-200">
                    Offline-First & P2P
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Skema & Arsitektur Sistem
                </h3>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Dokumentasi teknis bagan arsitektur modular, skema penyimpanan IndexedDB lokal di HP, dan protokol real-time tanpa biaya server.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('skema')}
                className="w-full py-2.5 px-3 bg-indigo-700 hover:bg-indigo-600 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Lihat Dokumen Skema Sistem</span>
              </button>
            </div>
          </div>

          {/* Quick Hardware & Update Tools */}
          <div className="p-4 rounded-3xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Perangkat Keras & Pembaruan
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('printer')}
                className="p-3 bg-white hover:bg-stone-100 border border-stone-200 rounded-2xl text-left flex items-center gap-2.5 cursor-pointer transition-all"
              >
                <Printer className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-900">Printer Thermal</p>
                  <p className="text-[10px] text-stone-500">Cetak Bluetooth 58/80mm</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('update')}
                className="p-3 bg-white hover:bg-stone-100 border border-stone-200 rounded-2xl text-left flex items-center gap-2.5 cursor-pointer transition-all"
              >
                <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-900">Update APK</p>
                  <p className="text-[10px] text-stone-500">Auto-Release & Multi-Akun</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BUKU INDUK WARGAQU */}
      {activeSubTab === 'warga' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between p-2.5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveSubTab('komunitas')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Opsi</span>
            </button>
            <span className="text-xs font-bold text-stone-700">Buku Induk WargaQu</span>
          </div>

          {currentUser && residents ? (
            <WargaView
              currentUser={currentUser}
              residents={residents}
              onUpdateResidents={onUpdateResidents || (() => {})}
              showNotification={showNotification || (() => {})}
            />
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
              <Contact className="w-10 h-10 text-sky-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-800">Data Warga Belum Tersedia</p>
            </div>
          )}
        </div>
      )}

      {/* TAB: DOKUMEN ARSITEKTUR & SKEMA */}
      {activeSubTab === 'skema' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between p-2.5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveSubTab('komunitas')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Opsi</span>
            </button>
            <span className="text-xs font-bold text-stone-700">Skema & Arsitektur Sistem</span>
          </div>
          <ArsitekturView />
        </div>
      )}

      {/* TAB 4: KEAMANAN & PERANGKAT (DEVICE BINDING) */}
      {activeSubTab === 'keamanan' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-teal-950 via-stone-900 to-emerald-950 text-white shadow-md border border-teal-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-900/60 px-2.5 py-0.5 rounded-full border border-teal-700/50">
                Device Binding & Session Security
              </span>
              <span className="text-[11px] font-mono text-teal-300">HP Terikat</span>
            </div>
            <h2 className="text-base font-black text-white leading-tight">
              Keamanan Akun & Penguncian Perangkat
            </h2>
            <p className="text-xs text-teal-100/80 leading-relaxed">
              Setiap akun diikat dengan sidik jari digital (Hidden Device Fingerprint) untuk mencegah pembajakan akun atau login liar dari HP asing.
            </p>
          </div>

          {/* Info Perangkat Saat Ini */}
          <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 text-stone-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Informasi Perangkat Saat Ini
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>TERIKAT KE AKUN</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
                <span className="text-stone-400 text-[11px]">Model / Merek HP:</span>
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{deviceModel || 'Chrome Android (Mobile)'}</span>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded">Aktif</span>
                </div>
              </div>

              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
                <span className="text-stone-400 text-[11px]">ID Unik Perangkat (Fingerprint SHA-256):</span>
                <div className="font-mono font-bold text-teal-400 text-[11px] truncate" title={authSession?.deviceFingerprint || 'DEV-SEC-84638-NODE-01'}>
                  {authSession?.deviceFingerprint || 'DEV-SEC-84638-NODE-01'}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-[11px] text-teal-200/90 leading-relaxed">
              🛡️ <strong>Proteksi Anti-Hijack:</strong> Akun Anda hanya dapat melakukan transaksi dan perubahan data dari perangkat yang telah terdaftar ini. Sesi finansial dilindungi enkripsi lokal tanpa server perantara.
            </div>
          </div>

          {/* Riwayat Login Perangkat */}
          <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 text-stone-100 shadow-sm space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-800 pb-2">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Riwayat Login Perangkat</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span>{deviceModel || 'HP Android Utama'}</span>
                    <span className="text-[10px] text-emerald-400 font-normal">(Sesi Ini)</span>
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono">IP: 192.168.1.104 • Browser PWA LocalStorage</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Online
                </span>
              </div>

              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800/60 flex items-center justify-between text-stone-400">
                <div>
                  <p className="font-semibold text-stone-300">Verifikasi Terakhir</p>
                  <p className="text-[10px] text-stone-500">Autentikasi 2 Saksi Warga Tetangga</p>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Tersertifikasi</span>
              </div>
            </div>
          </div>

          {/* Form Ubah PIN / Kata Sandi */}
          <form onSubmit={handleChangePin} className="p-4 rounded-3xl bg-stone-900 border border-stone-800 text-stone-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-800 pb-2">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Ubah PIN Pengaman 6-Digit</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  PIN Baru (6 Angka):
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="******"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-center font-mono text-base tracking-widest text-amber-300 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Konfirmasi PIN:
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="******"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-center font-mono text-base tracking-widest text-amber-300 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            {pinSuccessMsg && (
              <div className="p-2.5 bg-emerald-950 border border-emerald-700 text-emerald-200 rounded-xl text-center text-xs font-bold">
                ✓ PIN pengaman berhasil disimpan!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Perbarui PIN Pengaman</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: MANAJEMEN HARDWARE & OPERASIONAL */}
      {activeSubTab === 'hardware' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-stone-950 text-white shadow-md border border-amber-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-900/60 px-2.5 py-0.5 rounded-full border border-amber-700/50">
                Hardware & Toko Usaha
              </span>
              <span className="text-[11px] font-mono text-amber-300">Thermal 58/80mm</span>
            </div>
            <h2 className="text-base font-black text-white leading-tight">
              Manajemen Hardware & Unit Usaha
            </h2>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              Pengaturan printer struk thermal bluetooth dan konfigurasi toko/warung warga untuk cetak struk kasir RitelQu & KulinerQu.
            </p>
          </div>

          {/* Printer Thermal Bluetooth Section */}
          <div className="p-4 rounded-3xl bg-stone-900 text-stone-100 border border-stone-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Bluetooth className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">Printer Thermal Bluetooth</h4>
                  <p className="text-[10px] text-stone-400">Koneksi printer mobile kasir</p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                Terkoneksi
              </span>
            </div>

            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
              <div className="text-[11px] text-stone-400">Nama Perangkat:</div>
              <div className="font-bold text-sm text-amber-400 font-mono">
                {printerConfig.connectedDeviceName || 'POS-58-BT (Thermal)'}
              </div>
            </div>

            {/* Scan & Connect Button */}
            <button
              onClick={handleScanBluetooth}
              disabled={isScanning}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 border border-stone-700 active:scale-98 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Memindai Bluetooth...' : 'Pindai & Hubungkan Printer'}</span>
            </button>

            {printerStatusMsg && (
              <div className="p-3 bg-stone-800 text-amber-300 border border-amber-500/30 rounded-2xl text-xs font-medium flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{printerStatusMsg}</span>
              </div>
            )}

            {/* Paper Size Setting */}
            <div className="pt-2 border-t border-stone-800 space-y-2">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Ukuran Kertas Thermal
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSavePrinterConfig({ ...printerConfig, paperSize: '58mm' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    printerConfig.paperSize === '58mm'
                      ? 'border-amber-500 bg-amber-950/60 text-amber-200 font-bold'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-sm font-extrabold">58 mm</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">Standar Mini POS (32 Kolom)</div>
                </button>

                <button
                  type="button"
                  onClick={() => onSavePrinterConfig({ ...printerConfig, paperSize: '80mm' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    printerConfig.paperSize === '80mm'
                      ? 'border-amber-500 bg-amber-950/60 text-amber-200 font-bold'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-sm font-extrabold">80 mm</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">Lebar Resto (48 Kolom)</div>
                </button>
              </div>

              {/* Test Print Button */}
              <button
                onClick={handleTestPrint}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-700 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer mt-2"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Uji Coba Tes Cetak Struk (Test Print)</span>
              </button>
            </div>
          </div>

          {/* Form Profil Unit Usaha / Toko */}
          <form onSubmit={handleSaveProfileSubmit} className="p-4 rounded-3xl bg-stone-900 border border-stone-800 text-stone-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-800 pb-2">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Profil Unit Usaha / Warung Warga</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Nama Warung / Usaha:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-bold text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Slogan / Deskripsi:
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nomor Telepon:
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Mata Uang:
                </label>
                <input
                  type="text"
                  disabled
                  value="Rp (IDR)"
                  className="w-full px-3 py-2 bg-stone-950/50 border border-stone-800 text-stone-500 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Alamat Operasional:
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Pesan Header Struk (Atas):
                </label>
                <input
                  type="text"
                  value={receiptHeader}
                  onChange={(e) => setReceiptHeader(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Pesan Footer Struk (Bawah):
                </label>
                <input
                  type="text"
                  value={receiptFooter}
                  onChange={(e) => setReceiptFooter(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            {profileSavedMsg && (
              <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Profil unit usaha & struk berhasil disimpan!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-700 to-amber-600 text-white font-bold text-xs shadow-md active:scale-98 transition-all cursor-pointer"
            >
              Simpan Profil Toko & Struk
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: PUSAT PEMULIHAN DATA (BACKUP, RESTORE & RESET) */}
      {activeSubTab === 'pemulihan' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 text-white shadow-md border border-red-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-900/60 px-2.5 py-0.5 rounded-full border border-amber-700/50">
                Pusat Pemulihan Data
              </span>
              <span className="text-[11px] font-mono text-amber-300">Offline-First JSON</span>
            </div>
            <h2 className="text-base font-black text-white leading-tight">
              Cadangan, Pemulihan & Reset Pabrik
            </h2>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              Ekspor seluruh data warga, transaksi kasir, dan pengaturan ke file JSON. Anda dapat membagikannya ke WhatsApp atau mengimpornya kembali saat ganti HP.
            </p>
          </div>

          {/* Hidden File Input for Restore */}
          <input
            ref={restoreFileInputRef}
            type="file"
            accept=".json"
            onChange={handleRestoreFile}
            className="hidden"
          />

          {/* Card 1: Backup Data */}
          <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 text-stone-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Backup Data (Ekspor JSON)
                </h3>
                <p className="text-[11px] text-stone-400">Unduh seluruh data lokal aplikasi ke dalam file cadangan .json</p>
              </div>
            </div>

            <p className="text-[11px] text-stone-300 leading-relaxed">
              Seluruh basis data (Buku Warga, Kasir POS, Omset, Inventaris Bahan, Profil Usaha, dan Log SiagaQu) akan dibundel secara offline.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportBackup}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Cadangan (.json)</span>
              </button>

              <button
                type="button"
                onClick={handleShareBackup}
                className="w-full py-3 bg-teal-800 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan ke WhatsApp (Share)</span>
              </button>
            </div>
          </div>

          {/* Card 2: Restore Data */}
          <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 text-stone-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Restore Data (Impor JSON)
                </h3>
                <p className="text-[11px] text-stone-400">Pulihkan data saat ganti HP atau setelah instal ulang</p>
              </div>
            </div>

            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-[11px] text-stone-400 leading-relaxed space-y-1">
              <p>✓ Dilengkapi validasi format berkas JSON otomatis untuk mencegah kerusakan basis data.</p>
              <p>✓ Menimpa data lokal dengan data cadangan yang valid dan memuat ulang aplikasi secara instan.</p>
            </div>

            <button
              type="button"
              onClick={() => restoreFileInputRef.current?.click()}
              className="w-full py-3 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Pilih File Cadangan & Pulihkan Data</span>
            </button>
          </div>

          {/* Card 3: Factory Reset */}
          <div className="p-4 rounded-3xl bg-red-950/40 border border-red-800/60 text-stone-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Reset Pabrik (Factory Reset)
                </h3>
                <p className="text-[10px] text-red-300">Pengamanan berlapis untuk mengembalikan aplikasi ke kondisi awal</p>
              </div>
            </div>

            <p className="text-[11px] text-stone-300 leading-relaxed">
              Tindakan ini akan <strong>menghapus total</strong> seluruh database lokal (profil, data warga, pesanan, omset, dan pengaturan) dari HP ini. Pastikan Anda sudah membuat cadangan (ekspor JSON) sebelum melanjutkan!
            </p>

            <button
              type="button"
              onClick={() => {
                setConfirmResetText('');
                setIsResetModalOpen(true);
              }}
              className="w-full py-3 bg-red-800 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Total Aplikasi ke Setelan Pabrik</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: PROFIL RESTO */}
      {activeSubTab === 'toko' && (
        <form onSubmit={handleSaveProfileSubmit} className="space-y-3">
          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Identitas Restoran & Struk
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nama Toko / Resto:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Slogan / Deskripsi:
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nomor Telepon:
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mata Uang:
                </label>
                <input
                  type="text"
                  disabled
                  value="Rp (IDR)"
                  className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Alamat Lengkap:
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Pesan Header Struk (Atas):
              </label>
              <input
                type="text"
                value={receiptHeader}
                onChange={(e) => setReceiptHeader(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Pesan Footer Struk (Bawah):
              </label>
              <input
                type="text"
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {profileSavedMsg && (
            <div className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profil berhasil disimpan dan diperbarui!</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-700 to-amber-600 text-white font-bold text-xs shadow-md active:scale-98 transition-all"
          >
            Simpan Perubahan Profil
          </button>
        </form>
      )}

      {/* TAB 2: KELOLA MENU */}
      {activeSubTab === 'menu' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-stone-800">
              Daftar Menu ({menuList.length} Item)
            </span>
            <button
              onClick={handleOpenAddMenu}
              className="px-3 py-1.5 rounded-xl bg-red-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Menu Baru</span>
            </button>
          </div>

          <div className="space-y-2">
            {menuList.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3"
              >
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-stone-900 truncate">{m.name}</h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 uppercase font-semibold">
                      {m.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="font-extrabold text-amber-700 text-xs mt-0.5">
                    {formatCurrency(m.price)}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditMenu(m)}
                    className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMenu(m.id, m.name)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BLUETOOTH THERMAL PRINTER */}
      {activeSubTab === 'printer' && (
        <div className="space-y-3">
          {/* Status Box */}
          <div className="p-4 rounded-3xl bg-stone-900 text-stone-100 border border-stone-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Bluetooth className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">Printer Thermal Bluetooth</h4>
                  <p className="text-[10px] text-stone-400">Koneksi printer mobile kasir</p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                Terkoneksi
              </span>
            </div>

            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
              <div className="text-[11px] text-stone-400">Nama Perangkat:</div>
              <div className="font-bold text-sm text-amber-400 font-mono">
                {printerConfig.connectedDeviceName || 'POS-58-BT (Thermal)'}
              </div>
            </div>

            {/* Scan & Connect Button */}
            <button
              onClick={handleScanBluetooth}
              disabled={isScanning}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 border border-stone-700 active:scale-98 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Memindai Bluetooth...' : 'Pindai & Hubungkan Printer'}</span>
            </button>
          </div>

          {printerStatusMsg && (
            <div className="p-3 bg-stone-800 text-amber-300 border border-amber-500/30 rounded-2xl text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{printerStatusMsg}</span>
            </div>
          )}

          {/* Paper Size Setting */}
          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Ukuran Kertas Thermal
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSavePrinterConfig({ ...printerConfig, paperSize: '58mm' })}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  printerConfig.paperSize === '58mm'
                    ? 'border-amber-500 bg-amber-50/50 text-stone-950 font-bold'
                    : 'border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
              >
                <div className="text-sm font-extrabold">58 mm</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Standar Mini POS (32 Kolom)</div>
              </button>

              <button
                type="button"
                onClick={() => onSavePrinterConfig({ ...printerConfig, paperSize: '80mm' })}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  printerConfig.paperSize === '80mm'
                    ? 'border-amber-500 bg-amber-50/50 text-stone-950 font-bold'
                    : 'border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
              >
                <div className="text-sm font-extrabold">80 mm</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Lebar Resto (48 Kolom)</div>
              </button>
            </div>

            {/* Test Print Button */}
            <div className="pt-2">
              <button
                onClick={handleTestPrint}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-700 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Uji Coba Tes Cetak Struk (Test Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UPDATE APK & VERSI (AUTO-RELEASE CI/CD) */}
      {activeSubTab === 'update' && (
        <div className="space-y-3">
          {/* Version Header Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-900/90 via-emerald-800/90 to-teal-900/90 text-white shadow-md border border-emerald-700/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">AppQu & BaksoQu POS</h3>
                  <p className="text-[11px] text-emerald-200">Kompilasi Otomatis GitHub Actions CI/CD</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold">
                v{APP_CURRENT_VERSION}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-700/50 text-[11px]">
              <div className="bg-emerald-950/40 p-2 rounded-xl">
                <span className="text-emerald-300 block text-[10px]">Build Number:</span>
                <span className="font-mono font-bold text-white">#{APP_BUILD_NUMBER}</span>
              </div>
              <div className="bg-emerald-950/40 p-2 rounded-xl">
                <span className="text-emerald-300 block text-[10px]">Target Platform:</span>
                <span className="font-bold text-white">Android APK / Web</span>
              </div>
            </div>

            {/* Check Updates Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCheckUpdate}
                disabled={isCheckingUpdate}
                className="w-full py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all hover:bg-emerald-50 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 text-emerald-700 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                <span>{isCheckingUpdate ? 'Memeriksa ke GitHub Releases...' : 'Periksa Pembaruan Sekarang'}</span>
              </button>
            </div>
          </div>

          {/* Update Check Result Status Message */}
          {updateError && (
            <div className="p-3.5 bg-red-950/80 border border-red-800/80 rounded-2xl text-xs text-red-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold mb-0.5">Pemeriksaan Tidak Dapat Dilakukan</p>
                <p className="text-[11px] text-red-300 leading-relaxed">{updateError}</p>
              </div>
            </div>
          )}

          {updateResult && !updateResult.hasUpdate && (
            <div className="p-3.5 bg-emerald-950/70 border border-emerald-800/70 rounded-2xl text-xs text-emerald-200 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">Aplikasi Anda Sudah Versi Terbaru!</p>
                <p className="text-[11px] text-emerald-300">v{APP_CURRENT_VERSION} adalah versi rilis termutakhir.</p>
              </div>
            </div>
          )}

          {updateResult && updateResult.hasUpdate && (
            <div className="p-3.5 bg-amber-950/80 border border-amber-700/80 rounded-2xl text-xs text-amber-200 flex items-center justify-between gap-2 shadow-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                <div>
                  <p className="font-bold text-white">Versi Baru v{updateResult.latestVersion} Tersedia!</p>
                  <p className="text-[11px] text-amber-300">Siap dipasang langsung tanpa hapus data.</p>
                </div>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xs shadow-sm cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
                <span>Langsung Install</span>
              </button>
            </div>
          )}

          {/* Configuration GitHub Repository */}
          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-emerald-700" />
                <span>Target Repositori GitHub & Auto-Update</span>
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isCustomRepo
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {isCustomRepo ? 'Kustom Manual' : 'Auto-Deteksi Bawaan APK'}
              </span>
            </div>

            <form onSubmit={handleSaveRepo} className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Nama Akun & Repository (contoh: <code className="text-stone-800">akun-anda/appqu-pos</code>):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={repoInput}
                    onChange={(e) => setRepoInput(e.target.value)}
                    placeholder="smbsyariah/baksoqu-pos"
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono text-stone-900 focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer shrink-0"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToBundled}
                    className="py-2 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs cursor-pointer shrink-0"
                    title="Deteksi nama repo bawaan dari version.json APK ini"
                  >
                    Auto-Deteksi
                  </button>
                </div>
                {repoSavedMsg && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✓ Repositori target berhasil diperbarui & disimpan!
                  </p>
                )}
              </div>
            </form>

            {/* Quick Account Switcher Chips */}
            {knownRepos.length > 0 && (
              <div className="pt-1">
                <span className="text-[10px] text-stone-500 font-medium block mb-1">
                  Pindah Cepat Akun / Repositori Tersimpan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {knownRepos.map((kr) => (
                    <button
                      key={kr}
                      type="button"
                      onClick={() => handleSelectQuickRepo(kr)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                        repoInput === kr
                          ? 'bg-emerald-800 text-white border-emerald-900 font-bold shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                      }`}
                    >
                      {repoInput === kr && <Check className="w-3 h-3 text-emerald-300" />}
                      <span>{kr}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-stone-800">Pemeriksaan Otomatis saat Buka App</p>
                <p className="text-[10px] text-stone-500">Cek rilis APK baru di latar belakang</p>
              </div>
              <button
                type="button"
                onClick={handleToggleAutoCheck}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                  autoCheckEnabled ? 'bg-emerald-600 justify-end' : 'bg-stone-300 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-stone-800 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Opsi Update: Langsung Install (Auto-Install)</span>
                </p>
                <p className="text-[10px] text-stone-500">Memicu Package Installer Android otomatis tanpa unduh manual</p>
              </div>
              <button
                type="button"
                onClick={handleToggleDirectInstall}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                  directInstallEnabled ? 'bg-emerald-600 justify-end' : 'bg-stone-300 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>

          {/* Dedicated Direct Install Hub Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 text-white shadow-md border border-emerald-800/40 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black">
                <Zap className="w-5 h-5 text-stone-950 fill-stone-950" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">
                  Fitur Update Langsung Pasang (Direct Installer)
                </h4>
                <p className="text-[10px] text-emerald-300">
                  Update 1-Klik APK Android & Instant Reload Versi Web
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-emerald-700/30 text-[11px] text-emerald-100/90 space-y-1.5 leading-relaxed">
              <p>
                • <strong>Untuk Pengguna HP Android:</strong> Saat rilis baru terbit, ketuk tombol <strong>[⚡ Langsung Install]</strong>. Sistem akan mengunduh paket pembaruan dan secara otomatis memicu jendela <em>Package Installer Android</em> untuk menimpa versi lama tanpa menghapus data usaha & database kasir Anda.
              </p>
              <p>
                • <strong>Untuk Pengguna Browser / PWA:</strong> Anda dapat memperbarui versi web secara instan dalam 1 detik dengan membersihkan cache lawas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={handleCheckUpdate}
                disabled={isCheckingUpdate}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-60"
              >
                {isCheckingUpdate ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />}
                <span>Periksa & Pasang APK Langsung</span>
              </button>

              <button
                type="button"
                onClick={handleInstantWebUpdate}
                disabled={isInstantWebUpdating}
                className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-stone-700 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isInstantWebUpdating ? 'animate-spin' : ''}`} />
                <span>Update Versi Web Instan</span>
              </button>
            </div>
          </div>

          {/* Multi-Account & Ganti Akun Guide Box */}
          <div className="p-4 rounded-3xl bg-emerald-950 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">
                  Bisa Auto-Update Walaupun Ganti Akun di GitHub?
                </h4>
                <p className="text-[10px] text-emerald-300">
                  Jawaban: <span className="font-bold underline">YA, SANGAT BISA!</span> Sudah didukung penuh & fleksibel.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-[11px] leading-relaxed text-emerald-100/90 bg-emerald-900/40 p-3 rounded-2xl border border-emerald-700/40">
              <p>
                <strong>1. CI/CD Otomatis Adaptif:</strong> Skrip GitHub Actions menggunakan variabel otomatis <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-emerald-300">${'{'}github.repository{'}'}</code>. Jadi akun GitHub mana pun yang Anda pakai (misal: fork/push ke akun baru), rilis APK akan langsung terbit di akun baru tersebut.
              </p>
              <p>
                <strong>2. Keystore Konsisten (Tanpa Error Bentrok Kunci):</strong> Kunci tanda tangan digital APK (<code className="font-mono bg-black/40 px-1 py-0.5 rounded text-emerald-300">debug.keystore</code>) tersimpan permanen di proyek. Meskipun Anda ganti akun GitHub, sertifikat APK tetap sama sehingga HP Android mengizinkan instalasi tumpuk (update langsung tanpa hapus data).
              </p>
              <p>
                <strong>3. Ganti Sumber Update Kapan Saja:</strong> Jika HP Anda saat ini terpasang APK dari akun lama dan ingin menarik update dari akun baru, cukup ketik nama <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-emerald-300">akun-baru/nama-repo</code> pada kolom di atas lalu simpan!
              </p>
            </div>

            <div className="pt-1">
              <a
                href={`https://github.com/${repoInput}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Rilis GitHub ({repoInput})</span>
              </a>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Sub-Tabs Switcher Docked Above Bottom Navbar */}
      <div className="bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 z-20 shadow-[0_-2px_6px_rgba(0,0,0,0.04)]">
        {currentUser ? (
          <>
            <button
              type="button"
              onClick={() => setActiveSubTab('profil')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'profil'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>Profil</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('komunitas')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'komunitas'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Komunitas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('warga')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'warga'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <Contact className="w-3.5 h-3.5 shrink-0" />
              <span>Buku Warga</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('keamanan')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'keamanan'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Keamanan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('hardware')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'hardware'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>Printer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('toko')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'toko'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span>Toko</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('pemulihan')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'pemulihan'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Backup</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('update')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'update'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Update</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('skema')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'skema'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 shrink-0" />
              <span>Skema DB</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveSubTab('toko')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'toko'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span>Toko</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('menu')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'menu'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" />
              <span>Menu</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('printer')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'printer'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>Printer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('update')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'update'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Update</span>
            </button>
          </>
        )}
      </div>

      {/* Update Modal */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        updateInfo={updateResult}
      />

      {/* Menu Modal (Add / Edit) */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsMenuModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-stone-900 text-stone-100 rounded-3xl p-4 shadow-2xl border border-stone-800 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-sm font-bold text-white">
                {editingMenuItem ? 'Edit Menu' : 'Tambah Menu Baru'}
              </h3>
              <button onClick={() => setIsMenuModalOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuSubmit} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Nama Menu:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bakso Urat Keju"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Kategori:</label>
                  <select
                    value={menuCat}
                    onChange={(e: any) => setMenuCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="bakso_kuah">Bakso Kuah</option>
                    <option value="pelengkap">Pelengkap</option>
                    <option value="minuman">Minuman Segar</option>
                    <option value="paket">Paket Hemat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Harga (Rp):</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Deskripsi Porsi:</label>
                <textarea
                  rows={2}
                  placeholder="Isi dan kelengkapan mangkuk..."
                  value={menuDesc}
                  onChange={(e) => setMenuDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-amber-600 text-white font-bold shadow-md"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FACTORY RESET CONFIRMATION MODAL */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={() => setIsResetModalOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-stone-900 border border-red-700/60 rounded-3xl p-5 shadow-2xl z-10 text-stone-100 space-y-3.5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-red-400">
              <div className="w-10 h-10 rounded-2xl bg-red-950 border border-red-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Konfirmasi Reset Pabrik</h3>
                <p className="text-[10px] text-stone-400">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed bg-black/40 p-3 rounded-2xl border border-stone-800">
              Seluruh data lokal di HP Anda (Buku Warga, Kasir POS, Omset, Akun Pengurus, dan Pengaturan) akan <strong>DIHAPUS PERMANEN</strong>.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="block text-stone-300 font-semibold text-[11px]">
                Ketik kata <strong className="text-red-400 font-mono">RESET</strong> di bawah ini untuk melanjutkan:
              </label>
              <input
                type="text"
                value={confirmResetText}
                onChange={(e) => setConfirmResetText(e.target.value)}
                placeholder="Ketik RESET di sini"
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-red-800/80 text-white font-mono text-center tracking-widest text-sm focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteFactoryReset}
                disabled={confirmResetText.trim().toUpperCase() !== 'RESET'}
                className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Total</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
