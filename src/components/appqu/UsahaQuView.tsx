import React, { useState, useEffect } from 'react';
import {
  Store,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  QrCode,
  Calendar,
  AlertTriangle,
  X,
  Copy,
  Check,
  ChevronRight,
  Flame,
  Truck,
  Scissors,
  HardHat,
  Building,
  Wrench,
  Activity,
  ShoppingBag,
  Info,
  CreditCard,
  Trash2,
  ExternalLink,
  ArrowLeft,
  MapPin,
  Bike,
  Tent,
} from 'lucide-react';
import {
  UserProfile,
  LocalBusiness,
  UsahaQuPricingConfig,
  UserSubCategorySelection,
} from '../../types';
import { AppQuStorageService } from '../../services/storageAppQu';

interface UsahaQuViewProps {
  currentUser: UserProfile;
  businesses: LocalBusiness[];
  onSwitchToBaksoQu: () => void;
  onSwitchToBengkelQu: () => void;
  onSwitchToKlinikQu: () => void;
  onSwitchToRitelQu: () => void;
  onSwitchToKulinerQu?: () => void;
  onSwitchToTransportasiQu?: () => void;
  onSwitchToPelayananQu?: () => void;
  onSwitchToProyekQu?: () => void;
  onSwitchToLapakQu?: () => void;
  onSwitchToMuamalahQu?: () => void;
  onOpenAreaQu?: () => void;
  onOpenChat?: (threadId?: string) => void;
  onUpdateBusinesses: (businesses: LocalBusiness[]) => void;
  showNotification: (msg: string) => void;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
  theme?: 'light' | 'dark';
}

export interface BusinessCategoryDefinition {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  bgGradient: string;
  themeColor: string;
  accentBg: string;
  description: string;
  moduleKey: string;
  subCategories: {
    id: string;
    name: string;
    tagline: string;
    icon: string;
  }[];
}

export const USAHAQU_CATEGORIES: BusinessCategoryDefinition[] = [
  {
    id: 'kuliner',
    name: 'Kuliner & Warung Makan',
    badge: 'POS Dapur & Meja',
    icon: Flame,
    bgGradient: 'from-amber-600 via-orange-600 to-amber-700',
    themeColor: 'text-amber-500',
    accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-900',
    description: 'Sistem operasional kasir, denah meja makan, pesanan bungkus, dan dapur warung.',
    moduleKey: 'kulinerqu',
    subCategories: [
      { id: 'sub-kul-1', name: 'Bakso, Mie Ayam & Soto', tagline: 'POS Meja Makan & Cetak Dapur', icon: '🍲' },
      { id: 'sub-kul-2', name: 'Warung Nasi Rames & Tegal', tagline: 'Katalog Lauk & Kasir Prasmanan', icon: '🍛' },
      { id: 'sub-kul-3', name: 'Kopi, Minuman Segar & Boba', tagline: 'Takeaway Cup & Struk Kasir Cepat', icon: '☕' },
      { id: 'sub-kul-4', name: 'Aneka Kue, Roti Basah & Snack Box', tagline: 'Pesanan Hajatan & Kotakan', icon: '🧁' },
      { id: 'sub-kul-5', name: 'Frozen Food & Makanan Olahan', tagline: 'Manajemen Stok Beku & Eceran', icon: '🥟' },
      { id: 'sub-kul-6', name: 'Kuliner Gerobak Mangkal & Keliling', tagline: 'POS Mobile Roda Dua / Kaki Lima', icon: '🍢' },
    ],
  },
  {
    id: 'jasa',
    name: 'Jasa & Pelayanan Warga (PelayananQu)',
    badge: 'Jasa Akar Rumput',
    icon: Scissors,
    bgGradient: 'from-orange-600 via-amber-600 to-orange-700',
    themeColor: 'text-orange-500',
    accentBg: 'bg-orange-500/10 border-orange-500/30 text-orange-900',
    description: 'Layanan jasa reparasi, kebersihan, pangkas rambut, penjahit, dan sewa alat hajatan.',
    moduleKey: 'pelayananqu',
    subCategories: [
      { id: 'sub-jas-1', name: 'Servis Elektronik, HP, TV & AC', tagline: 'Nota Servis, Garansi & Suku Cadang', icon: '📱' },
      { id: 'sub-jas-2', name: 'Barbershop, Pangkas Rambut & Salon', tagline: 'Antrean Pelanggan & Tarif Model', icon: '✂️' },
      { id: 'sub-jas-3', name: 'Laundry Kiloan, Cuci Kering & Setrika', tagline: 'Nota Timbangan Kg & Status Rak', icon: '🧺' },
      { id: 'sub-jas-4', name: 'Penjahit, Bordir & Permak Busana', tagline: 'Buku Ukuran Badan & Fitting', icon: '🧵' },
      { id: 'sub-jas-5', name: 'Sedot WC & Instalasi Sanitasi Mampet', tagline: 'Panggilan Urgent Siaga Warga', icon: '🪠' },
      { id: 'sub-jas-6', name: 'Rental Tenda, Sound System & Kursi', tagline: 'Booking Jadwal Acara Warga', icon: '🎪' },
    ],
  },
  {
    id: 'otomotif',
    name: 'Bengkel & Otomotif (BengkelQu)',
    badge: 'Kasir & Servis',
    icon: Wrench,
    bgGradient: 'from-emerald-700 via-teal-700 to-emerald-800',
    themeColor: 'text-emerald-500',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900',
    description: 'Sistem kasir bengkel motor/mobil, pencatatan sparepart, dan histori servis pelanggan.',
    moduleKey: 'bengkelqu',
    subCategories: [
      { id: 'sub-oto-1', name: 'Bengkel Motor Roda 2 & Tune Up', tagline: 'Antrean Motor, Ganti Oli & Servis', icon: '🛵' },
      { id: 'sub-oto-2', name: 'Bengkel Mobil & Spooring Balancing', tagline: 'Pemeriksaan Mesin & Kaki-kaki', icon: '🚗' },
      { id: 'sub-oto-3', name: 'Tambal Ban Tubeless & Cuci Steam', tagline: 'Layanan Cepat Kilat Tanpa Antre', icon: '💨' },
      { id: 'sub-oto-4', name: 'Toko Sparepart & Aksesoris Motor', tagline: 'Katalog Suku Cadang & Stok Rak', icon: '⚙️' },
    ],
  },
  {
    id: 'kesehatan',
    name: 'Kesehatan & Klinik Warga (KlinikQu)',
    badge: 'Faskes & Apotek',
    icon: Activity,
    bgGradient: 'from-teal-600 via-cyan-700 to-teal-800',
    themeColor: 'text-teal-500',
    accentBg: 'bg-teal-500/10 border-teal-500/30 text-teal-900',
    description: 'Pencatatan rekam medis sederhana, antrean pasien, dan stok obat apotek mikro.',
    moduleKey: 'klinikqu',
    subCategories: [
      { id: 'sub-kes-1', name: 'Klinik Pratama & Dokter Umum', tagline: 'Rekam Medis & Kartu Berobat', icon: '🩺' },
      { id: 'sub-kes-2', name: 'Apotek Warga & Toko Obat Berizin', tagline: 'Resep Obat & Peringatan Kadaluarsa', icon: '💊' },
      { id: 'sub-kes-3', name: 'Praktik Bidan Mandiri & Ibu-Anak', tagline: 'Jadwal Imunisasi, KB & Timbang', icon: '👶' },
      { id: 'sub-kes-4', name: 'Terapi Refleksi, Fisioterapi & Bekam', tagline: 'Pemesanan Sesi Terapi Kesehatan', icon: '🌿' },
    ],
  },
  {
    id: 'ritel',
    name: 'Ritel, Toko & Kelontong (RitelQu)',
    badge: '7 Kategori Eceran',
    icon: ShoppingBag,
    bgGradient: 'from-emerald-600 via-teal-700 to-emerald-700',
    themeColor: 'text-emerald-500',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900',
    description: 'Manajemen dagangan grosir/eceran sembako, sayuran segar, pulsa, dan pakan ternak.',
    moduleKey: 'ritelqu',
    subCategories: [
      { id: 'sub-rit-1', name: 'Toko Sembako & Kelontong Madura', tagline: '7 Kategori Produk Pokok Harian', icon: '🥫' },
      { id: 'sub-rit-2', name: 'Sayur Mayur Segar & Bumbu Dapur', tagline: 'Timbangan Harian & Bahan Masak', icon: '🥬' },
      { id: 'sub-rit-3', name: 'Konter Pulsa, Token PLN & PPOB', tagline: 'Pembayaran Tagihan & Pulsa Kilat', icon: '⚡' },
      { id: 'sub-rit-4', name: 'Pakan Burung, Ikan, Kucing & Ternak', tagline: 'Kios Pakan Hewan Peliharaan', icon: '🦜' },
      { id: 'sub-rit-5', name: 'Toko Plastik, Kemasan & ATK', tagline: 'Perlengkapan Usaha & Pembungkus', icon: '📦' },
      { id: 'sub-rit-6', name: 'Pakaian, Hijab & Daster Rumahan', tagline: 'Fashion & Konveksi Warga', icon: '👗' },
    ],
  },
  {
    id: 'proyek',
    name: 'UsahaQu - Proyek & Bengkel Las (ProyekQu)',
    badge: 'RAB & Termin',
    icon: HardHat,
    bgGradient: 'from-stone-900 via-neutral-900 to-stone-950',
    themeColor: 'text-amber-500',
    accentBg: 'bg-stone-900/10 border-stone-700 text-stone-900',
    description: 'Pembuatan Rencana Anggaran Biaya (RAB), termin pembayaran, dan catatan bon material.',
    moduleKey: 'proyekqu',
    subCategories: [
      { id: 'sub-pro-1', name: 'Bengkel Las, Kanopi & Pagar Besi', tagline: 'Kalkulasi Besi Holo, Alderon & Cat', icon: '🔥' },
      { id: 'sub-pro-2', name: 'Tukang Kayu, Mebel & Kitchen Set', tagline: 'HPL, Triplek & Upah Tukang', icon: '🪵' },
      { id: 'sub-pro-3', name: 'Kusen Aluminium & Partisi Kaca', tagline: 'Presisi Profil & Kaca Tempered', icon: '🪟' },
      { id: 'sub-pro-4', name: 'Bangunan Sipil & Renovasi Borongan', tagline: 'Termin DP 30%, 40%, 30%', icon: '🧱' },
      { id: 'sub-pro-5', name: 'Pengecatan & Plafon Gypsum Rumah', tagline: 'Hitung Luas M² & Cat Dinding', icon: '🎨' },
      { id: 'sub-pro-6', name: 'Sumur Bor Jet Pump & Instalasi Toren', tagline: 'Pipa Paralon, Casing & Kedalaman', icon: '💧' },
    ],
  },
  {
    id: 'transportasi',
    name: 'Transportasi & Logistik (TransportasiQu)',
    badge: 'Ojek & Angkutan',
    icon: Truck,
    bgGradient: 'from-teal-700 via-emerald-800 to-teal-900',
    themeColor: 'text-teal-500',
    accentBg: 'bg-teal-500/10 border-teal-500/30 text-teal-900',
    description: 'Jasa kurir paket lokal, antar-jemput anak sekolah, dan sewa pikap angkutan.',
    moduleKey: 'transportasiqu',
    subCategories: [
      { id: 'sub-tra-1', name: 'Kurir Paket & Titip Belanja Lokal', tagline: 'Antar Barang Cepat Antar Gang RT', icon: '📦' },
      { id: 'sub-tra-2', name: 'Ojek Warga & Antar Jemput Sekolah', tagline: 'Langganan Tetangga Terpercaya', icon: '🛵' },
      { id: 'sub-tra-3', name: 'Sewa Mobil Pikap & Pindahan Rumah', tagline: 'Angkutan Muatan Barang Berat', icon: '🛻' },
      { id: 'sub-tra-4', name: 'Becak Motor & Odong-Odong Warga', tagline: 'Transportasi Wisata & Keliling', icon: '🛺' },
    ],
  },
  {
    id: 'lapak',
    name: 'LapakQu (Sewa Properti & Kios)',
    badge: 'Sewa Properti',
    icon: Building,
    bgGradient: 'from-[#556B2F] via-[#3f5022] to-[#2c3817]',
    themeColor: 'text-emerald-500',
    accentBg: 'bg-[#556B2F]/10 border-[#556B2F]/30 text-emerald-950',
    description: 'Penyewaan kios usaha, kamar kost, garasi parkir, dan gedung serbaguna warga.',
    moduleKey: 'lapakqu',
    subCategories: [
      { id: 'sub-lap-1', name: 'Sewa Kios & Lapak Usaha Warga', tagline: 'Kontrak Bulanan / Tahunan Tempat', icon: '🏪' },
      { id: 'sub-lap-2', name: 'Kamar Kost & Kontrakan Rumah', tagline: 'Pendataan Penghuni & Tagihan Listrik', icon: '🏠' },
      { id: 'sub-lap-3', name: 'Sewa Garasi Mobil & Penitipan Motor', tagline: 'Slot Parkir Aman Berpagar', icon: '🅿️' },
      { id: 'sub-lap-4', name: 'Gedung Balai Warga & Tenda Acara', tagline: 'Fasilitas Pertemuan & Hajatan', icon: '🏛️' },
    ],
  },
  {
    id: 'muamalah',
    name: 'MuamalahQu (Pasar & Konsinyasi Warga)',
    badge: 'C2C & B2B Lokal',
    icon: Store,
    bgGradient: 'from-emerald-700 via-emerald-800 to-teal-900',
    themeColor: 'text-emerald-500',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950',
    description: 'Etalase pasar produk warga (kuliner, sembako, preloved, jasa) dan titip jual konsinyasi warung.',
    moduleKey: 'muamalahqu',
    subCategories: [
      { id: 'sub-mua-1', name: 'Pasar Warga C2C (Etalase Produk)', tagline: 'Kuliner, Sembako, Preloved & Jasa Warga', icon: '🛒' },
      { id: 'sub-mua-2', name: 'Titip Jual Konsinyasi ke Warung', tagline: 'Kemitraan Warung Sembako & RitelQu', icon: '🤝' },
      { id: 'sub-mua-3', name: 'Preloved & Barang Bekas Layak Pakai', tagline: 'Jual Beli Berkah Antar Tetangga', icon: '📦' },
      { id: 'sub-mua-4', name: 'Jasa & Keahlian Mandiri Warga', tagline: 'Servis AC, Jahit, Les & Panggilan', icon: '🛠️' },
    ],
  },
];

export const UsahaQuView: React.FC<UsahaQuViewProps> = ({
  currentUser,
  businesses,
  onSwitchToBaksoQu,
  onSwitchToBengkelQu,
  onSwitchToKlinikQu,
  onSwitchToRitelQu,
  onSwitchToKulinerQu,
  onSwitchToTransportasiQu,
  onSwitchToPelayananQu,
  onSwitchToProyekQu,
  onSwitchToLapakQu,
  onSwitchToMuamalahQu,
  onOpenAreaQu,
  onOpenChat,
  onUpdateBusinesses,
  showNotification,
  activeSubTab,
  onSelectSubTab,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  // Pricing & Trial State (Dynamic from Admin Configuration)
  const [pricing, setPricing] = useState<UsahaQuPricingConfig>(() =>
    AppQuStorageService.getUsahaQuPricing()
  );
  const [userSubs, setUserSubs] = useState<UserSubCategorySelection[]>(() =>
    AppQuStorageService.getUserSubCategories()
  );
  const [trialStatus, setTrialStatus] = useState(() =>
    AppQuStorageService.getRemainingTrialDays()
  );

  // Operational Mode: Kios / Mangkal / Keliling (Hanya pilih 1)
  const [operationalMode, setOperationalMode] = useState<'kios' | 'mangkal' | 'keliling'>(() =>
    AppQuStorageService.getUsahaQuOperationalMode()
  );

  // Drilldown View: null = show ONLY Categories. string = show Sub-Categories for this Category ID!
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Popup Information Modal State (Maksimal 3x otomatis sejak install)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    if (activeSubTab === 'katalog') {
      setSelectedCategoryId(null);
    } else if (activeSubTab === 'tarif') {
      setIsInfoModalOpen(true);
    }
  }, [activeSubTab]);
  const [popupViewCount, setPopupViewCount] = useState<number>(() =>
    AppQuStorageService.getUsahaQuPopupCount()
  );

  // Subscription Checkout Modal State (Strictly Popup Modal)
  const [selectedSubForCheckout, setSelectedSubForCheckout] = useState<{
    sub: { id: string; name: string; tagline: string; icon: string };
    category: BusinessCategoryDefinition;
  } | null>(null);

  // Checkout Plan: 1, 3, 6, 12 Bulan
  const [selectedDurationMonths, setSelectedDurationMonths] = useState<1 | 3 | 6 | 12>(1);
  const [checkoutStep, setCheckoutStep] = useState<'duration' | 'success'>('duration');
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);

  // Effect on mount: check if auto popup should show (maksimal 3x sejak install)
  useEffect(() => {
    const currentCount = AppQuStorageService.getUsahaQuPopupCount();
    if (currentCount < 3) {
      const nextCount = AppQuStorageService.incrementUsahaQuPopupCount();
      setPopupViewCount(nextCount);
      setIsInfoModalOpen(true);
    }
  }, []);

  // Synchronize dynamic pricing and user subscriptions across changes
  useEffect(() => {
    const handlePricingUpdated = (e: any) => {
      if (e.detail) {
        setPricing(e.detail);
        setTrialStatus(AppQuStorageService.getRemainingTrialDays());
      }
    };
    const handleSubsUpdated = (e: any) => {
      if (e.detail) {
        setUserSubs(e.detail);
      }
    };
    const handleModeUpdated = (e: any) => {
      if (e.detail) {
        setOperationalMode(e.detail);
      }
    };

    window.addEventListener('usahaqu_pricing_updated', handlePricingUpdated);
    window.addEventListener('usahaqu_subcategories_updated', handleSubsUpdated);
    window.addEventListener('usahaqu_operational_mode_updated', handleModeUpdated);

    return () => {
      window.removeEventListener('usahaqu_pricing_updated', handlePricingUpdated);
      window.removeEventListener('usahaqu_subcategories_updated', handleSubsUpdated);
      window.removeEventListener('usahaqu_operational_mode_updated', handleModeUpdated);
    };
  }, []);

  // Handle Select Operational Mode (Hanya Tampil 1 Statis: Kios / Mangkal / Motor/Gerobak)
  const handleSelectOperationalMode = (mode: 'kios' | 'mangkal' | 'keliling') => {
    setOperationalMode(mode);
    AppQuStorageService.saveUsahaQuOperationalMode(mode);
    const modeLabel =
      mode === 'kios'
        ? 'Kios (Tempat Tetap)'
        : mode === 'mangkal'
        ? 'Mangkal (Lapak Tenda / Pujasera)'
        : 'Motor / Gerobak';
    showNotification(`Tipe operasional usaha diatur ke: ${modeLabel}`);
  };

  // Helper: check if subcategory is active
  const getSubCategoryStatus = (subId: string) => {
    return userSubs.find((s) => s.subCategoryId === subId);
  };

  // Select First Free Sub-category
  const handleSelectFreeSubCategory = (
    sub: { id: string; name: string; tagline: string; icon: string },
    category: BusinessCategoryDefinition
  ) => {
    const newSub: UserSubCategorySelection = {
      subCategoryId: sub.id,
      subCategoryName: sub.name,
      categoryId: category.id,
      categoryName: category.name,
      isFreeTier: true,
      subscribedAt: new Date().toISOString(),
      expiresAt: null, // Free tier during trial/active
      paymentMethod: 'free_trial',
    };

    const updated = AppQuStorageService.subscribeSubCategory(newSub);
    setUserSubs(updated);
    showNotification(`Sub-kategori "${sub.name}" berhasil diaktifkan GRATIS sebagai Sub-Kategori ke-1!`);
  };

  // Open Checkout for 2nd+ Sub-Category
  const handleOpenCheckoutModal = (
    sub: { id: string; name: string; tagline: string; icon: string },
    category: BusinessCategoryDefinition
  ) => {
    setSelectedSubForCheckout({ sub, category });
    setSelectedDurationMonths(1);
    setCheckoutStep('duration');
    setCopiedNominal(false);
  };

  // Calculate pricing for chosen duration
  const calculateTotal = (months: 1 | 3 | 6 | 12) => {
    const days = months * 30;
    const base = days * pricing.dailyRate;
    let discountPercent = 0;
    if (months === 6) discountPercent = pricing.discount6MonthsPercent || 0;
    if (months === 12) discountPercent = pricing.discount12MonthsPercent || 0;
    const discountAmount = Math.round((base * discountPercent) / 100);
    return {
      days,
      base,
      discountPercent,
      discountAmount,
      total: Math.max(0, base - discountAmount),
    };
  };

  // Confirm Simulated Digital Community Payment
  const handleConfirmDigitalPayment = () => {
    if (!selectedSubForCheckout) return;

    setIsSimulatingPayment(true);

    setTimeout(() => {
      setIsSimulatingPayment(false);

      const calc = calculateTotal(selectedDurationMonths);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + calc.days);

      const paidSub: UserSubCategorySelection = {
        subCategoryId: selectedSubForCheckout.sub.id,
        subCategoryName: selectedSubForCheckout.sub.name,
        categoryId: selectedSubForCheckout.category.id,
        categoryName: selectedSubForCheckout.category.name,
        isFreeTier: false,
        subscribedAt: new Date().toISOString(),
        expiresAt: expiryDate.toISOString(),
        durationDays: calc.days,
        durationMonths: selectedDurationMonths,
        totalPaid: calc.total,
        paymentMethod: 'digital_usahaqu',
        transactionId: `PAY-UQ-${Date.now()}`,
      };

      const updated = AppQuStorageService.subscribeSubCategory(paidSub);
      setUserSubs(updated);
      setCheckoutStep('success');
      showNotification(`Aktivasi Langganan Rp ${calc.total.toLocaleString('id-ID')} Berhasil! Sub-kategori aktif.`);
    }, 1500);
  };

  // Remove / Unsubscribe Sub-Category
  const handleRemoveSubCategory = (subId: string, subName: string) => {
    if (window.confirm(`Hapus sub-kategori "${subName}" dari pilihan usaha Anda?`)) {
      const updated = AppQuStorageService.removeUserSubCategory(subId);
      setUserSubs(updated);
      showNotification(`Sub-kategori "${subName}" telah dihapus.`);
    }
  };

  // Launch Operational Module according to category
  const handleLaunchModule = (moduleKey: string) => {
    switch (moduleKey) {
      case 'kulinerqu':
        if (onSwitchToKulinerQu) onSwitchToKulinerQu();
        else onSwitchToBaksoQu();
        break;
      case 'pelayananqu':
        if (onSwitchToPelayananQu) onSwitchToPelayananQu();
        break;
      case 'bengkelqu':
        onSwitchToBengkelQu();
        break;
      case 'klinikqu':
        onSwitchToKlinikQu();
        break;
      case 'ritelqu':
        onSwitchToRitelQu();
        break;
      case 'proyekqu':
        if (onSwitchToProyekQu) onSwitchToProyekQu();
        break;
      case 'transportasiqu':
        if (onSwitchToTransportasiQu) onSwitchToTransportasiQu();
        break;
      case 'lapakqu':
        if (onSwitchToLapakQu) onSwitchToLapakQu();
        break;
      case 'muamalahqu':
        if (onSwitchToMuamalahQu) onSwitchToMuamalahQu();
        break;
      default:
        onSwitchToBaksoQu();
    }
  };

  // Copy nominal to clipboard
  const handleCopyNominal = (amount: number) => {
    navigator.clipboard.writeText(amount.toString());
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2000);
  };

  // Format Timer mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Currently selected category object (if drilled down)
  const currentCategory = USAHAQU_CATEGORIES.find((c) => c.id === selectedCategoryId);

  return (
    <div
      className={`flex-1 flex flex-col overflow-y-auto transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* ========================================================= */}
      {/* STREAMLINED OPERASIONAL & SUB-KATEGORI BAR                */}
      {/* (Header UsahaQu utama telah berada di Header Atas)         */}
      {/* ========================================================= */}
      <div
        className={`border-b px-3.5 py-2.5 shrink-0 flex items-center justify-between gap-2 shadow-2xs transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          {selectedCategoryId ? (
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="flex items-center gap-1 text-xs font-bold text-emerald-500 hover:text-emerald-400 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Semua Kategori</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                Tipe Operasional:
              </span>
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-black shadow-2xs ${
                  isDark
                    ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300'
                    : 'bg-emerald-50 border border-emerald-300 text-emerald-950'
                }`}
              >
                {operationalMode === 'kios' ? (
                  <>
                    <Building className="w-3 h-3 text-emerald-500" />
                    <span>Kios</span>
                  </>
                ) : operationalMode === 'mangkal' ? (
                  <>
                    <Tent className="w-3 h-3 text-amber-500" />
                    <span>Mangkal</span>
                  </>
                ) : (
                  <>
                    <Bike className="w-3 h-3 text-teal-500" />
                    <span>Motor / Gerobak</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={operationalMode}
            onChange={(e) => handleSelectOperationalMode(e.target.value as any)}
            className={`text-xs font-bold rounded-lg px-2 py-1 focus:outline-hidden cursor-pointer shadow-2xs ${
              isDark
                ? 'bg-slate-800 border border-slate-700 text-slate-200'
                : 'bg-white border border-stone-300 text-stone-800'
            }`}
          >
            <option value="kios">Kios</option>
            <option value="mangkal">Mangkal</option>
            <option value="keliling">Motor / Gerobak</option>
          </select>

          {/* Tombol Info Trial & Tarif (Popup On-Demand) */}
          <button
            type="button"
            onClick={() => setIsInfoModalOpen(true)}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              isDark
                ? 'bg-amber-950/70 hover:bg-amber-900 border border-amber-700 text-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900'
            }`}
            title="Informasi Trial & Tarif Pop-Up"
          >
            <Info className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden xs:inline">Info Trial</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAMPILAN 1: HANYA TAMPIL KATEGORI (SEBELUM DIPILIH)       */}
      {/* ========================================================= */}
      {!selectedCategoryId && (
        <div className="p-3 sm:p-4 space-y-3 pb-20">
          {/* Featured MuamalahQu Quick Launch Card */}
          {onSwitchToMuamalahQu && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-md flex items-center justify-between gap-3 border border-emerald-600/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Store className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-xs text-white">MuamalahQu</h3>
                    <span className="text-[9px] font-extrabold bg-amber-400 text-stone-950 px-1.5 py-0.2 rounded-full shadow-2xs">
                      Light / Dark Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100 mt-0.5 line-clamp-1">
                    Pasar Warga C2C (Jual Beli via WA) & Titip Jual Konsinyasi ke Warung
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onSwitchToMuamalahQu}
                className="px-3 py-1.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-black shadow-sm shrink-0 flex items-center gap-1 active:scale-95 cursor-pointer transition"
              >
                <span>Buka</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className={`flex items-center justify-between px-1 text-xs font-bold ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            <span>Daftar Kategori Usaha ({USAHAQU_CATEGORIES.length})</span>
            <span className={`text-[11px] font-normal ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              Ketuk untuk memilih sub-kategori
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {USAHAQU_CATEGORIES.map((category) => {
              const CategoryIcon = category.icon;
              const activeCountInCat = userSubs.filter(
                (s) => s.categoryId === category.id
              ).length;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 group cursor-pointer ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 shadow-2xs'
                      : 'bg-white border-stone-200/90 hover:border-emerald-500/50 hover:bg-emerald-50/20 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.bgGradient} text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <CategoryIcon className="w-6 h-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className={`font-black text-sm transition-colors ${
                          isDark ? 'text-white group-hover:text-emerald-400' : 'text-stone-900 group-hover:text-emerald-800'
                        }`}>
                          {category.name}
                        </h3>
                      </div>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                        {category.description}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>
                          {category.subCategories.length} Sub-Kategori
                        </span>

                        {activeCountInCat > 0 && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{activeCountInCat} Aktif</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isDark
                      ? 'bg-slate-800 group-hover:bg-emerald-600 group-hover:text-white text-slate-400'
                      : 'bg-stone-100 group-hover:bg-emerald-600 group-hover:text-white text-stone-400'
                  }`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAMPILAN 2: TAMPIL SUB-KATEGORI (SAAT KATEGORI DIPILIH)   */}
      {/* ========================================================= */}
      {selectedCategoryId && currentCategory && (
        <div className="p-3 sm:p-4 space-y-3.5 pb-20">
          {/* Back to Category List Button */}
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-black flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Pilihan Kategori</span>
          </button>

          {/* Active Category Header Card */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentCategory.bgGradient} text-white flex items-center justify-center shrink-0 shadow-md`}
              >
                {React.createElement(currentCategory.icon, { className: 'w-6 h-6' })}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-black text-stone-900">
                    {currentCategory.name}
                  </h2>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {currentCategory.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{currentCategory.description}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleLaunchModule(currentCategory.moduleKey)}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
            >
              <span>Buka Modul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub-Categories Grid of Chosen Category */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-stone-600 px-1">
              Pilih Sub-Kategori yang Anda Jalankan:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {currentCategory.subCategories.map((sub) => {
                const activeSub = getSubCategoryStatus(sub.id);
                const isSelected = !!activeSub;
                const isFree = activeSub?.isFreeTier;
                const canSelectAsFirstFree = !isSelected && userSubs.length === 0;

                return (
                  <div
                    key={sub.id}
                    className={`p-3.5 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                      isSelected
                        ? isFree
                          ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400/40 shadow-xs'
                          : 'bg-teal-50/80 border-teal-400 ring-1 ring-teal-400/40 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 shadow-2xs'
                    }`}
                  >
                    <div>
                      {/* Sub Status Badge */}
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="text-xl">{sub.icon}</span>
                        {isSelected ? (
                          isFree ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Sub-1: GRATIS</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-700 text-white flex items-center gap-1 shadow-2xs">
                              <CreditCard className="w-3 h-3" />
                              <span>Berbayar (Aktif)</span>
                            </span>
                          )
                        ) : canSelectAsFirstFree ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Pilih Gratis (Sub-1)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-stone-500" />
                            <span>Rp{pricing.dailyRate}/hari</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-stone-900 text-sm leading-snug">
                        {sub.name}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                        {sub.tagline}
                      </p>

                      {isSelected && !isFree && activeSub?.expiresAt && (
                        <div className="mt-2 text-[10px] text-teal-800 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Berlaku s/d:{' '}
                            <b>
                              {new Date(activeSub.expiresAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </b>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
                      {isSelected ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleLaunchModule(currentCategory.moduleKey)}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <span>Buka Fitur</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubCategory(sub.id, sub.name)}
                            title="Hapus Sub-Kategori"
                            className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : canSelectAsFirstFree ? (
                        <button
                          type="button"
                          onClick={() => handleSelectFreeSubCategory(sub, currentCategory)}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Aktifkan Gratis (Sub-1)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenCheckoutModal(sub, currentCategory)}
                          className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                          <span>Pilih Paket (QRIS)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. MODAL INFORMASI TRIAL & TARIF (POPUP MAKSIMAL 3x)      */}
      {/* ========================================================= */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-stone-900 border border-amber-500/50 rounded-3xl w-full max-w-md p-6 text-white shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setIsInfoModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7" />
              </div>

              <div className="flex items-center justify-center gap-2">
                <h2 className="text-lg font-black text-amber-400 tracking-tight">
                  Informasi Trial & Tarif UsahaQu
                </h2>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                Masa trial <b>{pricing.trialDays} hari</b> Anda tersisa{' '}
                <span className="text-amber-300 font-bold font-mono">
                  {trialStatus.remainingDays} Hari Lagi
                </span>
                .
              </p>

              <span className="inline-block text-[10px] font-mono text-stone-400 bg-stone-950 px-2.5 py-0.5 rounded-full border border-stone-800">
                Popup otomatis ke-{Math.min(3, popupViewCount)} dari 3x sejak instalasi
              </span>
            </div>

            {/* Highlights Poin Utama */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <b>Sub-Kategori ke-1: 100% GRATIS:</b> Usaha utama warga bebas biaya tanpa tagihan apapun.
                </p>
              </div>

              <div className="flex items-start gap-2.5 text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <b>Sub-Kategori ke-2 dst:</b> Cukup bayar{' '}
                  <span className="font-bold text-white underline">
                    Rp{pricing.dailyRate.toLocaleString('id-ID')}/hari
                  </span>{' '}
                  dengan paket pilihan 1, 3, 6, atau 12 bulan via QRIS.
                </p>
              </div>

              <div className="flex items-start gap-2.5 text-teal-300">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <b>Tipe Operasional:</b> Pilih salah satu antara Kios, Mangkal, atau Keliling langsung di menu atas.
                </p>
              </div>
            </div>

            {/* Simulasi Harga Paket */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block font-bold">1 Bln</span>
                <span className="text-white font-bold block mt-0.5">
                  Rp{(30 * pricing.dailyRate).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block font-bold">3 Bln</span>
                <span className="text-teal-300 font-bold block mt-0.5">
                  Rp{(90 * pricing.dailyRate).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block font-bold">6 Bln</span>
                <span className="text-amber-300 font-bold block mt-0.5">
                  Rp{(180 * pricing.dailyRate).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block font-bold">12 Bln</span>
                <span className="text-emerald-300 font-bold block mt-0.5">
                  Rp{(360 * pricing.dailyRate).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={() => setIsInfoModalOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs transition cursor-pointer shadow-md"
            >
              SAYA MENGERTI & TUTUP
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MODAL POPUP QRIS PEMBAYARAN (HANYA POP UP)             */}
      {/* ========================================================= */}
      {selectedSubForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md p-5 text-white shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setSelectedSubForCheckout(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: PILIH DURASI PAKET (1, 3, 6, 12 BULAN) */}
            {checkoutStep === 'duration' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedSubForCheckout.sub.icon}</span>
                    <h3 className="text-base font-black text-white">
                      Langganan Sub-Kategori ke-2
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400">
                    Sub-Kategori:{' '}
                    <span className="text-emerald-400 font-bold">
                      {selectedSubForCheckout.sub.name}
                    </span>{' '}
                    ({selectedSubForCheckout.category.name})
                  </p>
                  <p className="text-[11px] text-amber-300 font-medium">
                    Tarif Komunitas: Rp{pricing.dailyRate.toLocaleString('id-ID')} / hari
                  </p>
                </div>

                {/* Option Selector: 1, 3, 6, 12 Bulan */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-300">
                    Pilih Durasi Paket Berlangganan:
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { months: 1 as const, days: 30, label: '1 Bulan (30 Hari)' },
                      { months: 3 as const, days: 90, label: '3 Bulan (90 Hari)' },
                      { months: 6 as const, days: 180, label: '6 Bulan (180 Hari)' },
                      { months: 12 as const, days: 360, label: '12 Bulan (360 Hari)' },
                    ].map((opt) => {
                      const calc = calculateTotal(opt.months);
                      const isSelectedOpt = selectedDurationMonths === opt.months;

                      return (
                        <button
                          key={opt.months}
                          type="button"
                          onClick={() => setSelectedDurationMonths(opt.months)}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            isSelectedOpt
                              ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/30'
                              : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white">{opt.label}</span>
                            {isSelectedOpt && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <div className="mt-2">
                            <span className="text-base font-mono font-black text-emerald-400 block">
                              Rp{calc.total.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              (Rp{pricing.dailyRate}/hari)
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ringkasan Tagihan */}
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Durasi Terpilih</span>
                    <span className="font-bold text-white">
                      {selectedDurationMonths} Bulan ({selectedDurationMonths * 30} Hari)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Metode Aktivasi</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      Konfirmasi Langganan Komunitas
                    </span>
                  </div>
                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-sm">
                    <span className="font-black text-white">Total Biaya</span>
                    <span className="font-black font-mono text-emerald-400 text-base">
                      Rp{calculateTotal(selectedDurationMonths).total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Konfirmasi & Aktifkan Langsung */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={isSimulatingPayment}
                    onClick={handleConfirmDigitalPayment}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSimulatingPayment ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>MEMVERIFIKASI & MENGAKTIFKAN...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>KONFIRMASI & AKTIFKAN SUB-KATEGORI</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSubForCheckout(null)}
                    className="w-full py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SUKSES & AKTIFKAN SUB-KATEGORI */}
            {checkoutStep === 'success' && (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">Sub-Kategori Berhasil Diaktifkan!</h3>
                  <p className="text-xs text-stone-300 mt-1">
                    Sub-kategori{' '}
                    <span className="text-emerald-400 font-bold">
                      "{selectedSubForCheckout.sub.name}"
                    </span>{' '}
                    telah resmi aktif di akun UsahaQu Anda.
                  </p>
                </div>

                {/* Rincian Nota Sukses */}
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs space-y-1.5 text-left font-mono">
                  <div className="flex justify-between text-stone-400">
                    <span>Durasi</span>
                    <span className="text-white font-bold">
                      {selectedDurationMonths} Bulan ({selectedDurationMonths * 30} Hari)
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Total Biaya</span>
                    <span className="text-emerald-400 font-bold">
                      Rp{calculateTotal(selectedDurationMonths).total.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Status</span>
                    <span className="text-emerald-400 font-bold">LUNAS & AKTIF</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const modKey = selectedSubForCheckout.category.moduleKey;
                      setSelectedSubForCheckout(null);
                      handleLaunchModule(modKey);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>BUKA MODUL USAHA SEKARANG</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSubForCheckout(null)}
                    className="w-full py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition cursor-pointer"
                  >
                    Selesai & Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
