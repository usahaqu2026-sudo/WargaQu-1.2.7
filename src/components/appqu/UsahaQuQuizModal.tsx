import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  Unlock,
  Store,
  Flame,
  ShoppingBag,
  Wrench,
  Activity,
  Scissors,
  Truck,
  Building,
  HardHat,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  Check,
  HelpCircle,
} from 'lucide-react';
import { UsahaQuLockedProfile } from '../../types';
import { AppQuStorageService } from '../../services/storageAppQu';

interface UsahaQuQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLockModule: (lockedProfile: UsahaQuLockedProfile) => void;
  currentLockedProfile?: UsahaQuLockedProfile | null;
  theme?: 'light' | 'dark';
}

interface QuestionOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  recommendedModule: string;
  operationalMode?: 'kios' | 'mangkal' | 'keliling';
}

const BUSINESS_TYPE_OPTIONS: QuestionOption[] = [
  {
    id: 'kuliner',
    title: 'Kuliner & Warung Makan',
    subtitle: 'Bakso, Mie Ayam, Soto, Kafe, Minuman, Snack & Katering',
    icon: '🍲',
    recommendedModule: 'kulinerqu',
  },
  {
    id: 'ritel',
    title: 'Toko Sembako, Sayur & Eceran',
    subtitle: 'Kelontong Madura, Sayur Mayur, PPOB/Pulsa, Plastik & Fashion',
    icon: '🥫',
    recommendedModule: 'ritelqu',
  },
  {
    id: 'otomotif',
    title: 'Bengkel & Servis Otomotif',
    subtitle: 'Bengkel Motor/Mobil, Tambal Ban, Ganti Oli & Sparepart',
    icon: '🔧',
    recommendedModule: 'bengkelqu',
  },
  {
    id: 'kesehatan',
    title: 'Klinik, Dokter & Apotek Warga',
    subtitle: 'Praktik Bidan, Klinik Pratama, Toko Obat & Terapi Refleksi',
    icon: '🩺',
    recommendedModule: 'klinikqu',
  },
  {
    id: 'jasa',
    title: 'Jasa & Pelayanan Harian',
    subtitle: 'Servis Elektronik, Barbershop, Laundry Kiloan, Penjahit',
    icon: '✂️',
    recommendedModule: 'pelayananqu',
  },
  {
    id: 'transportasi',
    title: 'Kurir, Ojek & Angkutan',
    subtitle: 'Kurir Paket Antar Gang, Ojek Sekolah, Sewa Pikap Pindahan',
    icon: '🛵',
    recommendedModule: 'transportasiqu',
  },
  {
    id: 'lapak',
    title: 'Sewa Lapak, Kios & Properti',
    subtitle: 'Sewa Kios Pasar, Kamar Kost, Garasi Mobil & Gedung Warga',
    icon: '🏪',
    recommendedModule: 'lapakqu',
  },
  {
    id: 'muamalah',
    title: 'Pasar Warga & Titip Jual',
    subtitle: 'Jual Beli Preloved Antar Warga & Titip Jual Konsinyasi Warung',
    icon: '🤝',
    recommendedModule: 'muamalahqu',
  },
  {
    id: 'proyek',
    title: 'Proyek, Las & Bangunan Borongan',
    subtitle: 'Bengkel Las Kanopi, Mebel/Kayu, RAB Material & Termin',
    icon: '🏗️',
    recommendedModule: 'proyekqu',
  },
];

const OPERATIONAL_NEED_OPTIONS: QuestionOption[] = [
  {
    id: 'kasir_meja',
    title: 'Kasir Meja Makan & Struk Dapur',
    subtitle: 'Perlu denah meja dine-in, pesanan bungkus & cetak Bluetooth',
    icon: '🧾',
    recommendedModule: 'kulinerqu',
  },
  {
    id: 'stok_barcode',
    title: 'Manajemen Stok & Scan Barcode',
    subtitle: 'Perlu katalog ribuan barang, stok rak & rekap laba eceran',
    icon: '📦',
    recommendedModule: 'ritelqu',
  },
  {
    id: 'antrean_servis',
    title: 'Antrean Servis & Catatan Sparepart',
    subtitle: 'Perlu pencatatan nomor plat motor, histori servis & garansi',
    icon: '⚙️',
    recommendedModule: 'bengkelqu',
  },
  {
    id: 'rekam_medis',
    title: 'Rekam Medis & Kartu Berobat Pasien',
    subtitle: 'Perlu data pasien warga, dosis resep & antrean konsultasi',
    icon: '💊',
    recommendedModule: 'klinikqu',
  },
  {
    id: 'nota_jasa',
    title: 'Nota Servis / Timbangan / Booking Jam',
    subtitle: 'Perlu tanda terima barang masuk, berat kiloan / jam reservasi',
    icon: '📋',
    recommendedModule: 'pelayananqu',
  },
  {
    id: 'jarak_order',
    title: 'Hitung Jarak Antar & Order Cepat',
    subtitle: 'Perlu hitung ongkir antar gang RT/RW & koordinasi kurir',
    icon: '📍',
    recommendedModule: 'transportasiqu',
  },
  {
    id: 'sewa_kontrak',
    title: 'Jatuh Tempo Sewa & Tagihan Bulanan',
    subtitle: 'Perlu pengingat tagihan sewa kios / kos & status okupansi',
    icon: '🏠',
    recommendedModule: 'lapakqu',
  },
  {
    id: 'etalase_wa',
    title: 'Etalase Online & Konsinyasi Warung',
    subtitle: 'Perlu katalog digital via WhatsApp & bagi hasil warung',
    icon: '🛍️',
    recommendedModule: 'muamalahqu',
  },
  {
    id: 'rab_termin',
    title: 'Kalkulasi RAB & Termin Bertahap (DP)',
    subtitle: 'Perlu hitung bahan baku, margin, bon tukang & termin bayar',
    icon: '📐',
    recommendedModule: 'proyekqu',
  },
];

const OPERATIONAL_PLACE_OPTIONS: { id: 'kios' | 'mangkal' | 'keliling'; title: string; subtitle: string; icon: string }[] = [
  {
    id: 'kios',
    title: 'Kios / Ruko / Rumah Tetap',
    subtitle: 'Lokasi usaha fisik menetap dengan ruang operasional khusus',
    icon: '🏢',
  },
  {
    id: 'mangkal',
    title: 'Mangkal (Lapak Tenda / Pujasera)',
    subtitle: 'Lapak semi-permanen, tenda pinggir jalan atau pujasera',
    icon: '⛺',
  },
  {
    id: 'keliling',
    title: 'Motor / Gerobak / Jasa Panggilan',
    subtitle: 'Mobile keliling antar wilayah atau panggilan ke rumah warga',
    icon: '🛵',
  },
];

interface ModuleCatalogItem {
  id: string;
  name: string;
  badge: string;
  categoryName: string;
  description: string;
  icon: string;
  tagline: string;
  bgGradient: string;
}

const MODULE_CATALOG: ModuleCatalogItem[] = [
  {
    id: 'kulinerqu',
    name: 'KulinerQu (POS Restoran & Warung)',
    badge: 'POS Meja & Dapur',
    categoryName: 'Kuliner & Warung Makan',
    description: 'Kasir denah meja, pesanan bungkus, cetak struk Bluetooth dapur, manajemen bahan baku & rekap omset harian.',
    icon: '🍲',
    tagline: 'Solusi lengkap warung makan, bakso, kafe & kuliner warga',
    bgGradient: 'from-amber-600 to-orange-700',
  },
  {
    id: 'ritelqu',
    name: 'RitelQu (Kasir & Toko Kelontong)',
    badge: '7 Kategori Eceran',
    categoryName: 'Ritel, Toko & Kelontong',
    description: 'Manajemen stok ribuan barang, barcode scanner, 7 kategori eceran (sembako, sayur, pulsa, atk) & rekap laba.',
    icon: '🥫',
    tagline: 'Kasir toko kelontong madura, minimarket & sembako warga',
    bgGradient: 'from-emerald-700 to-teal-800',
  },
  {
    id: 'bengkelqu',
    name: 'BengkelQu (Kasir & Servis Bengkel)',
    badge: 'Servis & Sparepart',
    categoryName: 'Bengkel & Otomotif',
    description: 'Antrean kendaraan, riwayat servis plat motor/mobil, cetak nota servis, stok suku cadang & garansi pekerjaan.',
    icon: '🔧',
    tagline: 'Manajemen antrean servis motor, mobil & ganti oli terpercaya',
    bgGradient: 'from-teal-700 to-emerald-900',
  },
  {
    id: 'klinikqu',
    name: 'KlinikQu (Faskes & Apotek Warga)',
    badge: 'Rekam Medis & Obat',
    categoryName: 'Kesehatan & Klinik Warga',
    description: 'Pendaftaran pasien, rekam medis ringkas, kartu berobat, kasir apotek mikro, resep obat & jadwal praktek.',
    icon: '🩺',
    tagline: 'Sistem layanan kesehatan terpercaya untuk klinik & bidan mandiri',
    bgGradient: 'from-cyan-700 to-teal-900',
  },
  {
    id: 'pelayananqu',
    name: 'PelayananQu (Jasa & Servis Warga)',
    badge: 'Jasa Akar Rumput',
    categoryName: 'Jasa & Pelayanan Warga',
    description: 'Manajemen order servis elektronik (HP/TV/AC), antrean pangkas rambut, laundry kiloan, penjahit & sewa alat hajatan.',
    icon: '✂️',
    tagline: 'Nota tanda terima & sistem operasional jasa terpercaya warga',
    bgGradient: 'from-orange-600 to-amber-700',
  },
  {
    id: 'transportasiqu',
    name: 'TransportasiQu (Kurir & Logistik)',
    badge: 'Ojek & Angkutan',
    categoryName: 'Transportasi & Logistik',
    description: 'Jasa kurir titip belanja & paket antar gang, ojek langganan sekolah, sewa mobil pikap angkutan & tarif jarak.',
    icon: '🚚',
    tagline: 'Jaringan kurir & angkutan tetangga terpercaya RT/RW',
    bgGradient: 'from-teal-800 to-emerald-950',
  },
  {
    id: 'lapakqu',
    name: 'LapakQu (Sewa Kios & Properti)',
    badge: 'Sewa Properti',
    categoryName: 'Sewa Properti & Kios',
    description: 'Penyewaan kios usaha, kamar kost, kontrakan, garasi penitipan motor/mobil & gedung serbaguna warga.',
    icon: '🏪',
    tagline: 'Kontrak sewa teratur, kontrol okupansi & pengingat tagihan',
    bgGradient: 'from-[#556B2F] to-[#2c3817]',
  },
  {
    id: 'muamalahqu',
    name: 'MuamalahQu (Pasar & Konsinyasi)',
    badge: 'C2C & B2B Lokal',
    categoryName: 'Pasar Warga & Konsinyasi',
    description: 'Etalase pasar produk warga via WhatsApp, jual beli barang bekas berkualitas & sistem titip jual konsinyasi ke warung.',
    icon: '🤝',
    tagline: 'Pasar warga berkah tanpa biaya perantara komersial',
    bgGradient: 'from-emerald-800 to-teal-900',
  },
  {
    id: 'proyekqu',
    name: 'ProyekQu (Bengkel Las & Bangunan)',
    badge: 'RAB & Termin',
    categoryName: 'Proyek & Bengkel Las',
    description: 'Pembuatan Rencana Anggaran Biaya (RAB), termin pembayaran bertahap (DP/Termin/Pelunasan) & catatan bon material.',
    icon: '🏗️',
    tagline: 'Kalkulator RAB presisi untuk tukang las, mebel & pemborong',
    bgGradient: 'from-stone-900 to-neutral-950',
  },
];

export const UsahaQuQuizModal: React.FC<UsahaQuQuizModalProps> = ({
  isOpen,
  onClose,
  onLockModule,
  currentLockedProfile,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  // Wizard tab: 'quiz' | 'catalog'
  const [activeTab, setActiveTab] = useState<'quiz' | 'catalog'>('quiz');

  // Step state: 1 (Jenis Usaha) -> 2 (Kebutuhan Operasional) -> 3 (Tempat Operasional) -> 4 (Rekomendasi & Kunci)
  const [step, setStep] = useState<number>(1);

  // Selected Answers
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('kuliner');
  const [selectedOperationalNeed, setSelectedOperationalNeed] = useState<string>('kasir_meja');
  const [selectedOperatingPlace, setSelectedOperatingPlace] = useState<'kios' | 'mangkal' | 'keliling'>('kios');

  if (!isOpen) return null;

  // Compute recommendation based on answers
  const computeRecommendation = (): ModuleCatalogItem => {
    // Priority: look at business type first
    const byType = MODULE_CATALOG.find((m) => {
      if (selectedBusinessType === 'kuliner') return m.id === 'kulinerqu';
      if (selectedBusinessType === 'ritel') return m.id === 'ritelqu';
      if (selectedBusinessType === 'otomotif') return m.id === 'bengkelqu';
      if (selectedBusinessType === 'kesehatan') return m.id === 'klinikqu';
      if (selectedBusinessType === 'jasa') return m.id === 'pelayananqu';
      if (selectedBusinessType === 'transportasi') return m.id === 'transportasiqu';
      if (selectedBusinessType === 'lapak') return m.id === 'lapakqu';
      if (selectedBusinessType === 'muamalah') return m.id === 'muamalahqu';
      if (selectedBusinessType === 'proyek') return m.id === 'proyekqu';
      return false;
    });

    if (byType) return byType;
    return MODULE_CATALOG[0];
  };

  const recommendation = computeRecommendation();

  // Handle Lock confirmation
  const handleConfirmLock = (mod: ModuleCatalogItem, mode?: 'kios' | 'mangkal' | 'keliling') => {
    const chosenMode = mode || selectedOperatingPlace || 'kios';
    const locked: UsahaQuLockedProfile = {
      moduleId: mod.id,
      moduleName: mod.name,
      badge: mod.badge,
      categoryName: mod.categoryName,
      operationalMode: chosenMode,
      tagline: mod.tagline,
      lockedAt: new Date().toISOString(),
      isLocked: true,
      questionnaireAnswers: {
        businessType: selectedBusinessType,
        operationalNeed: selectedOperationalNeed,
        operatingPlace: chosenMode,
      },
    };

    AppQuStorageService.saveUsahaQuLockedProfile(locked);
    AppQuStorageService.saveUsahaQuOperationalMode(chosenMode);
    onLockModule(locked);
    onClose();
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setStep(1);
    setSelectedBusinessType('kuliner');
    setSelectedOperationalNeed('kasir_meja');
    setSelectedOperatingPlace('kios');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border transition-all ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* ========================================================= */}
        {/* HEADER MODAL                                              */}
        {/* ========================================================= */}
        <div
          className={`px-4 sm:px-5 py-3.5 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-stone-50 border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold truncate flex items-center gap-1.5">
                <span>Pilih & Kunci Modul Usaha</span>
                {currentLockedProfile?.isLocked && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    🔒 Terkunci
                  </span>
                )}
              </h2>
              <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                Sesuaikan sistem dengan jenis & kebutuhan harian bisnis Anda
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition active:scale-90 shrink-0 ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-stone-200 text-stone-600'
            }`}
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* NAV TAB SWITCHER: KUESIONER vs KATALOG LANGSUNG           */}
        {/* ========================================================= */}
        <div className={`px-4 pt-2.5 pb-2 border-b flex items-center justify-between gap-2 shrink-0 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-stone-200'
        }`}>
          <div className="flex items-center gap-1.5 w-full">
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Kuesioner Cerdas (Rekomendasi)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Katalog 9 Modul (Pilih Bebas)</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CONTENT AREA: KUESIONER (WIZARD STEPS)                    */}
        {/* ========================================================= */}
        {activeTab === 'quiz' ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between gap-1 text-[11px] font-bold pb-1">
              <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-emerald-500' : isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  step >= 1 ? 'bg-emerald-600 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-stone-200 text-stone-600'
                }`}>1</span>
                <span>Bidang</span>
              </span>
              <span className={`h-0.5 flex-1 mx-1 ${step >= 2 ? 'bg-emerald-500' : isDark ? 'bg-slate-800' : 'bg-stone-200'}`} />
              <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-emerald-500' : isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  step >= 2 ? 'bg-emerald-600 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-stone-200 text-stone-600'
                }`}>2</span>
                <span>Fitur</span>
              </span>
              <span className={`h-0.5 flex-1 mx-1 ${step >= 3 ? 'bg-emerald-500' : isDark ? 'bg-slate-800' : 'bg-stone-200'}`} />
              <span className={`flex items-center gap-1.5 ${step >= 3 ? 'text-emerald-500' : isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  step >= 3 ? 'bg-emerald-600 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-stone-200 text-stone-600'
                }`}>3</span>
                <span>Tempat</span>
              </span>
              <span className={`h-0.5 flex-1 mx-1 ${step >= 4 ? 'bg-emerald-500' : isDark ? 'bg-slate-800' : 'bg-stone-200'}`} />
              <span className={`flex items-center gap-1.5 ${step >= 4 ? 'text-emerald-500' : isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  step >= 4 ? 'bg-emerald-600 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-stone-200 text-stone-600'
                }`}>4</span>
                <span>Kunci</span>
              </span>
            </div>

            {/* ================= STEP 1: JENIS USAHA ================= */}
            {step === 1 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="text-left">
                  <h3 className="text-xs font-black uppercase text-emerald-600 tracking-wider">
                    Langkah 1 dari 3:
                  </h3>
                  <h2 className="text-sm font-extrabold mt-0.5">
                    Apa bidang usaha atau aktivitas ekonomi utama Anda?
                  </h2>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                    Pilih salah satu yang paling mendekati kegiatan sehari-hari Anda:
                  </p>
                </div>

                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {BUSINESS_TYPE_OPTIONS.map((opt) => {
                    const isSelected = selectedBusinessType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedBusinessType(opt.id)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer active:scale-98 ${
                          isSelected
                            ? isDark
                              ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40 text-white'
                              : 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/30 text-stone-950'
                            : isDark
                            ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-200'
                            : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{opt.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black truncate">{opt.title}</h4>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-1" />
                            )}
                          </div>
                          <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                            {opt.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= STEP 2: KEBUTUHAN OPERASIONAL ================= */}
            {step === 2 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="text-left">
                  <h3 className="text-xs font-black uppercase text-emerald-600 tracking-wider">
                    Langkah 2 dari 3:
                  </h3>
                  <h2 className="text-sm font-extrabold mt-0.5">
                    Fitur operasional apa yang paling krusial setiap hari?
                  </h2>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                    Sistem akan menyesuaikan alur kerja agar kasir & rekap transaksi lebih cepat:
                  </p>
                </div>

                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {OPERATIONAL_NEED_OPTIONS.map((opt) => {
                    const isSelected = selectedOperationalNeed === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedOperationalNeed(opt.id)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer active:scale-98 ${
                          isSelected
                            ? isDark
                              ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40 text-white'
                              : 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/30 text-stone-950'
                            : isDark
                            ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-200'
                            : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{opt.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black truncate">{opt.title}</h4>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-1" />
                            )}
                          </div>
                          <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                            {opt.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= STEP 3: TEMPAT OPERASIONAL ================= */}
            {step === 3 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="text-left">
                  <h3 className="text-xs font-black uppercase text-emerald-600 tracking-wider">
                    Langkah 3 dari 3:
                  </h3>
                  <h2 className="text-sm font-extrabold mt-0.5">
                    Di mana dan bagaimana lokasi usaha Anda beroperasi?
                  </h2>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                    Ini akan menentukan tata letak tombol cetak struk dan visibilitas pada Peta AreaQu:
                  </p>
                </div>

                <div className="space-y-2.5">
                  {OPERATIONAL_PLACE_OPTIONS.map((opt) => {
                    const isSelected = selectedOperatingPlace === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedOperatingPlace(opt.id)}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition cursor-pointer active:scale-98 ${
                          isSelected
                            ? isDark
                              ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40 text-white'
                              : 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/30 text-stone-950'
                            : isDark
                            ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-200'
                            : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800'
                        }`}
                      >
                        <span className="text-3xl shrink-0">{opt.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black">{opt.title}</h4>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-1" />
                            )}
                          </div>
                          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                            {opt.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= STEP 4: HASIL REKOMENDASI & KUNCI ================= */}
            {step === 4 && (
              <div className="space-y-3.5 animate-in zoom-in-95 duration-150 text-left">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white shadow-xl border border-emerald-500/40 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-stone-950" />
                      <span>Rekomendasi 100% Pas</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-200">
                      Tipe: {selectedOperatingPlace === 'kios' ? 'Kios Tetap' : selectedOperatingPlace === 'mangkal' ? 'Mangkal' : 'Motor/Gerobak'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-4xl shrink-0 drop-shadow">{recommendation.icon}</span>
                    <div className="min-w-0">
                      <h3 className="text-base font-black leading-tight text-white">
                        {recommendation.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-emerald-200 mt-0.5">
                        {recommendation.badge} • {recommendation.categoryName}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-white/90 mt-3 leading-relaxed bg-black/25 p-2.5 rounded-xl border border-white/10">
                    {recommendation.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-200 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Setelah dikunci, aplikasi akan langsung membuka modul ini tanpa bingung memilih.</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl border text-xs space-y-1.5 bg-stone-50 dark:bg-slate-800/60 dark:border-slate-700">
                  <div className="font-bold flex items-center justify-between text-stone-700 dark:text-slate-300">
                    <span>Ringkasan Jawaban Anda:</span>
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="text-emerald-600 hover:text-emerald-500 font-extrabold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Ulangi Pertanyaan</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-slate-400">
                    • <strong>Bidang:</strong> {BUSINESS_TYPE_OPTIONS.find(o => o.id === selectedBusinessType)?.title}<br />
                    • <strong>Fitur Utama:</strong> {OPERATIONAL_NEED_OPTIONS.find(o => o.id === selectedOperationalNeed)?.title}<br />
                    • <strong>Operasional:</strong> {OPERATIONAL_PLACE_OPTIONS.find(o => o.id === selectedOperatingPlace)?.title}
                  </div>
                </div>

                {/* Primary Action to Lock Module */}
                <button
                  type="button"
                  onClick={() => handleConfirmLock(recommendation)}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  <span>Kunci & Mulai Gunakan Modul Ini Sekarang</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* CONTENT AREA: KATALOG 9 MODUL USAHAQU                     */
          /* ========================================================= */
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[60vh]">
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              Pilih langsung modul yang Anda inginkan dan tekan <strong>Kunci</strong>:
            </p>

            <div className="space-y-2">
              {MODULE_CATALOG.map((mod) => {
                const isCurrentLocked = currentLockedProfile?.moduleId === mod.id;

                return (
                  <div
                    key={mod.id}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      isCurrentLocked
                        ? isDark
                          ? 'bg-emerald-950/60 border-emerald-500/80 ring-2 ring-emerald-500/30'
                          : 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30'
                        : isDark
                        ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-3xl shrink-0">{mod.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-black">{mod.name}</h4>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            isDark ? 'bg-slate-700 text-slate-300' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {mod.badge}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                          {mod.tagline}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleConfirmLock(mod, selectedOperatingPlace)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition active:scale-95 shrink-0 shadow-xs ${
                        isCurrentLocked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>{isCurrentLocked ? 'Terkunci' : 'Kunci'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* FOOTER CONTROLS & WIZARD NAVIGATION                       */}
        {/* ========================================================= */}
        <div
          className={`px-4 py-3 border-t flex items-center justify-between gap-2 shrink-0 ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-stone-50 border-stone-200'
          }`}
        >
          {activeTab === 'quiz' ? (
            <>
              {step > 1 && step <= 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 ${
                    isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Lewati Kuesioner
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleConfirmLock(recommendation)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Kunci Modul Ini</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                  isDark ? 'text-slate-400 hover:text-slate-200' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ← Kembali ke Kuesioner
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
