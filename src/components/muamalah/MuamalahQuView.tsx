import React, { useState, useEffect } from 'react';
import {
  Store,
  Handshake,
  Plus,
  Search,
  MessageCircle,
  ShieldCheck,
  ArrowLeft,
  Sun,
  Moon,
  Trash2,
  X,
  ExternalLink,
  CheckCircle2,
  Info,
  Building2,
  Tag,
  ShoppingBag,
  PackageCheck,
  User,
  Phone,
  Filter,
} from 'lucide-react';
import { UserProfile, MuamalahProduk, MuamalahKonsinyasi } from '../../types';
import { MuamalahStorageService } from '../../services/storageMuamalah';

interface MuamalahQuViewProps {
  currentUser?: UserProfile;
  onBackToAppQu: () => void;
  showNotification: (msg: string) => void;
  showBackButton?: boolean;
  onNavigateToModule?: (module: 'paguyuban' | 'usaha' | 'area' | 'siaga' | 'chat') => void;
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
  hideHeader?: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const MuamalahQuView: React.FC<MuamalahQuViewProps> = ({
  currentUser,
  onBackToAppQu,
  showNotification,
  showBackButton = true,
  onNavigateToModule,
  activeSubTab,
  onSelectSubTab,
  hideHeader = false,
  theme: propTheme,
  onToggleTheme,
}) => {
  // Theme Mode State: Light or Dark
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(() => MuamalahStorageService.getTheme());
  const theme = propTheme || localTheme;

  // Navigation Tab: 'pasar' or 'konsinyasi'
  const [activeTab, setActiveTab] = useState<'pasar' | 'konsinyasi'>('pasar');

  useEffect(() => {
    if (activeSubTab === 'pasar') {
      setActiveTab('pasar');
    } else if (activeSubTab === 'konsinyasi') {
      setActiveTab('konsinyasi');
    } else if (activeSubTab === 'tambah') {
      setIsModalProdukOpen(true);
    }
  }, [activeSubTab]);

  // Data states
  const [produkList, setProdukList] = useState<MuamalahProduk[]>(() =>
    MuamalahStorageService.getProduk()
  );
  const [konsinyasiList, setKonsinyasiList] = useState<MuamalahKonsinyasi[]>(() =>
    MuamalahStorageService.getKonsinyasi()
  );

  // Filter & Search states
  const [currentKategori, setCurrentKategori] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterKonsinyasiStatus, setFilterKonsinyasiStatus] = useState<string>('Semua');

  // Modal states
  const [isModalProdukOpen, setIsModalProdukOpen] = useState(false);
  const [isModalKonsinyasiOpen, setIsModalKonsinyasiOpen] = useState(false);

  // Form states - Produk
  const [formNama, setFormNama] = useState('');
  const [formKategori, setFormKategori] = useState('Kuliner');
  const [formHarga, setFormHarga] = useState<number | ''>('');
  const [formPenjual, setFormPenjual] = useState(
    currentUser ? `${currentUser.name} (${currentUser.blockNumber || 'Warga RT 04'})` : ''
  );
  const [formWa, setFormWa] = useState(
    currentUser?.phone ? currentUser.phone.replace(/[^0-9]/g, '') : '628123456789'
  );
  const [formDeskripsi, setFormDeskripsi] = useState('');

  // Form states - Konsinyasi
  const [formKNama, setFormKNama] = useState('');
  const [formKProdusen, setFormKProdusen] = useState(
    currentUser ? `${currentUser.name} (${currentUser.blockNumber || 'Blok Warga'})` : ''
  );
  const [formKWarung, setFormKWarung] = useState('RitelQu Utama / Warung RT');
  const [formKJumlah, setFormKJumlah] = useState<number | ''>(10);
  const [formKHarga, setFormKHarga] = useState<number | ''>(5000);

  // Toggle Theme mode
  const toggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
      return;
    }
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setLocalTheme(nextTheme);
    MuamalahStorageService.saveTheme(nextTheme);
    showNotification(`Mode tampilan diubah ke: ${nextTheme === 'light' ? '☀️ Terang (Light Mode)' : '🌙 Gelap (Dark Mode)'}`);
  };

  // Save new Product
  const handleSimpanProduk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formHarga || Number(formHarga) <= 0) {
      showNotification('Mohon lengkapi nama produk dan harga yang valid.');
      return;
    }

    // Standardize WhatsApp number format
    let cleanWa = formWa.replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('0')) {
      cleanWa = '62' + cleanWa.slice(1);
    } else if (!cleanWa.startsWith('62')) {
      cleanWa = '62' + cleanWa;
    }

    const baru: MuamalahProduk = {
      id: Date.now(),
      nama: formNama.trim(),
      kategori: formKategori,
      harga: Number(formHarga),
      penjual: formPenjual.trim() || 'Warga RT',
      wa: cleanWa,
      deskripsi: formDeskripsi.trim() || undefined,
    };

    const updated = [baru, ...produkList];
    setProdukList(updated);
    MuamalahStorageService.saveProduk(updated);

    // Reset Form & Close
    setFormNama('');
    setFormHarga('');
    setFormDeskripsi('');
    setIsModalProdukOpen(false);
    showNotification(`Produk "${baru.nama}" berhasil ditayangkan di Pasar Warga!`);
  };

  // Delete Product
  const handleHapusProduk = (id: string | number, nama: string) => {
    if (confirm(`Hapus produk "${nama}" dari Pasar Warga?`)) {
      const updated = produkList.filter((p) => p.id !== id);
      setProdukList(updated);
      MuamalahStorageService.saveProduk(updated);
      showNotification(`Produk "${nama}" telah dihapus.`);
    }
  };

  // Save new Konsinyasi
  const handleSimpanKonsinyasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKNama.trim() || !formKJumlah || !formKHarga) {
      showNotification('Mohon lengkapi seluruh data titip jual.');
      return;
    }

    const baru: MuamalahKonsinyasi = {
      id: Date.now(),
      produk: formKNama.trim(),
      produsen: formKProdusen.trim() || 'Warga RT',
      warung: formKWarung.trim() || 'Warung Mitra',
      jumlah: Number(formKJumlah),
      harga: Number(formKHarga),
      status: 'Aktif Titip',
      tanggalTitip: new Date().toISOString().split('T')[0],
    };

    const updated = [baru, ...konsinyasiList];
    setKonsinyasiList(updated);
    MuamalahStorageService.saveKonsinyasi(updated);

    // Reset Form & Close
    setFormKNama('');
    setFormKJumlah(10);
    setFormKHarga(5000);
    setIsModalKonsinyasiOpen(false);
    showNotification(`Pengajuan titip jual "${baru.produk}" berhasil diajukan!`);
  };

  // Cycle status of Konsinyasi
  const handleCycleStatus = (id: string | number) => {
    const updated = konsinyasiList.map((k) => {
      if (k.id === id) {
        let nextStatus = 'Aktif Titip';
        if (k.status === 'Aktif Titip') nextStatus = 'Terjual Sebagian';
        else if (k.status === 'Terjual Sebagian') nextStatus = 'Selesai / Lunas';
        else nextStatus = 'Aktif Titip';
        return { ...k, status: nextStatus };
      }
      return k;
    });
    setKonsinyasiList(updated);
    MuamalahStorageService.saveKonsinyasi(updated);
    showNotification('Status titip jual berhasil diperbarui.');
  };

  // Delete Konsinyasi
  const handleHapusKonsinyasi = (id: string | number, produk: string) => {
    if (confirm(`Hapus catatan titip jual "${produk}"?`)) {
      const updated = konsinyasiList.filter((k) => k.id !== id);
      setKonsinyasiList(updated);
      MuamalahStorageService.saveKonsinyasi(updated);
      showNotification(`Catatan "${produk}" telah dihapus.`);
    }
  };

  // Filtered Products
  const filteredProduk = produkList.filter((p) => {
    const matchesKat = currentKategori === 'Semua' || p.kategori === currentKategori;
    const matchesSearch =
      searchQuery === '' ||
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.penjual.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesKat && matchesSearch;
  });

  // Filtered Konsinyasi
  const filteredKonsinyasi = konsinyasiList.filter((k) => {
    const matchesStatus =
      filterKonsinyasiStatus === 'Semua' || k.status === filterKonsinyasiStatus;
    const matchesSearch =
      searchQuery === '' ||
      k.produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.produsen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.warung.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const totalNilaiKonsinyasi = konsinyasiList.reduce(
    (acc, k) => acc + k.jumlah * k.harga,
    0
  );

  const isDark = theme === 'dark';

  return (
    <div
      className={`flex-1 flex flex-col min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* ==================================================== */}
      {/* 1. TOP HEADER WITH THEME SWITCH & APPQU RETURN       */}
      {/* ==================================================== */}
      {!hideHeader && (
        <header
          className={`sticky top-0 z-30 px-3.5 py-2.5 border-b backdrop-blur-md transition-colors ${
            isDark
              ? 'bg-slate-900/95 border-slate-800 text-white shadow-lg'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Brand & Back Button */}
          <div className="flex items-center gap-2 truncate">
            {showBackButton !== false && (
              <button
                type="button"
                onClick={onBackToAppQu}
                className={`p-1.5 rounded-xl transition cursor-pointer flex items-center justify-center shrink-0 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
                    : 'bg-slate-100 hover:bg-slate-200 text-emerald-700'
                }`}
                title="Kembali ke Ekosistem AppQu"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/30 shrink-0">
              <Store className="w-4 h-4" />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm leading-tight truncate">
                  MuamalahQu
                </h1>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider shrink-0 ${
                    isDark
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  Pasar Warga
                </span>
              </div>
              <p
                className={`text-[10px] font-medium leading-none truncate ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                }`}
              >
                Ekonomi Bersih & Pasar Warga
              </p>
            </div>
          </div>

          {/* Action Tools: Switch Light/Dark + Badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* SWITCH LIGHT / DARK MODE BUTTON */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
              }`}
              title={isDark ? 'Ubah ke Mode Terang (Light Mode)' : 'Ubah ke Mode Gelap (Dark Mode)'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700 fill-slate-700" />
                  <span className="text-[11px]">Dark</span>
                </>
              )}
            </button>

            {/* Standalone HTML link */}
            <a
              href="./muamalahqu.html"
              target="_blank"
              rel="noreferrer"
              className={`p-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
              title="Buka Halaman Standalone HTML"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>
      )}

      {/* ==================================================== */}
      {/* 2. MAIN CONTENT BODY                                 */}
      {/* ==================================================== */}
      <main className="flex-1 max-w-md w-full mx-auto p-3.5 space-y-3.5 pb-20 overflow-y-auto">
        {/* Cross-Module Quick Shortcuts */}
        {onNavigateToModule && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className={`text-[10px] font-bold shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Pintas:
            </span>
            <button
              type="button"
              onClick={() => onNavigateToModule('usaha')}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition shrink-0 cursor-pointer flex items-center gap-1 ${
                isDark
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Store className="w-2.5 h-2.5" />
              <span>UsahaQu</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToModule('chat')}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition shrink-0 cursor-pointer flex items-center gap-1 ${
                isDark
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <MessageCircle className="w-2.5 h-2.5" />
              <span>Chat Warga</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToModule('paguyuban')}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition shrink-0 cursor-pointer flex items-center gap-1 ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <User className="w-2.5 h-2.5" />
              <span>Paguyuban</span>
            </button>
          </div>
        )}
        {/* Search Bar */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
          }`}
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'pasar'
                ? 'Cari produk, kuliner, penjual, atau blok...'
                : 'Cari titipan produk, produsen, atau warung...'
            }
            className="w-full bg-transparent text-xs focus:outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* -------------------------------------------------- */}
        {/* TAB 1: PASAR WARGA (C2C MARKETPLACE)               */}
        {/* -------------------------------------------------- */}
        {activeTab === 'pasar' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Header Etalase & Add Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2
                  className={`text-xs font-extrabold uppercase tracking-wider ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  Etalase Produk Warga
                </h2>
                <p className="text-[10px] text-slate-500">
                  Transaksi mandiri langsung antar-warga via WhatsApp
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalProdukOpen(true)}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold transition shadow-sm flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Jual Barang</span>
              </button>
            </div>

            {/* Filter Kategori */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {['Semua', 'Kuliner', 'Sembako', 'Preloved', 'Jasa'].map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setCurrentKategori(kat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs ${
                    currentKategori === kat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isDark
                      ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            {/* Grid Produk Warga */}
            {filteredProduk.length === 0 ? (
              <div
                className={`text-center py-12 rounded-2xl border border-dashed p-6 ${
                  isDark ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-400'
                }`}
              >
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">Belum ada produk untuk kategori ini.</p>
                <button
                  onClick={() => setIsModalProdukOpen(true)}
                  className="mt-3 text-xs text-emerald-600 hover:underline font-bold"
                >
                  + Jadilah yang pertama menjual barang!
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {filteredProduk.map((p) => (
                  <div
                    key={p.id}
                    className={`rounded-2xl p-3 flex flex-col justify-between space-y-2 border transition-all duration-200 ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-emerald-600/50 shadow-md'
                        : 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                            isDark
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {p.kategori}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleHapusProduk(p.id, p.nama)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <h3
                        className={`font-bold text-xs mt-2 line-clamp-2 leading-snug ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {p.nama}
                      </h3>

                      <p className="text-emerald-600 font-black text-sm mt-1">
                        Rp {p.harga.toLocaleString('id-ID')}
                      </p>

                      {p.deskripsi && (
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 italic">
                          {p.deskripsi}
                        </p>
                      )}

                      <p
                        className={`text-[10px] font-medium mt-1.5 flex items-center gap-1 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{p.penjual}</span>
                      </p>
                    </div>

                    {/* Tombol Pesan WhatsApp */}
                    <a
                      href={`https://wa.me/${p.wa}?text=${encodeURIComponent(
                        `Halo, saya tertarik mau pesan "${p.nama}" (Rp ${p.harga.toLocaleString(
                          'id-ID'
                        )}) yang ada di etalase MuamalahQu RT 04.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer mt-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Pesan</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 2: TITIP JUAL / KONSINYASI (B2B WARUNG LOKAL)  */}
        {/* -------------------------------------------------- */}
        {activeTab === 'konsinyasi' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Header Titip Jual & Add Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2
                  className={`text-xs font-extrabold uppercase tracking-wider ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  Titip Jual ke Warung Mitra
                </h2>
                <p className="text-[10px] text-slate-500">
                  Konsinyasi produk rumahan ke Warung Sembako / RitelQu
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalKonsinyasiOpen(true)}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold transition shadow-sm flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajukan Titipan</span>
              </button>
            </div>

            {/* Info Banner Konsep Muamalah Syariah & Transparan */}
            <div
              className={`p-3 rounded-2xl border text-xs font-medium space-y-1 ${
                isDark
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kerjasama Penitipan Transparan & Halal</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Produk rumahan (kue, kerupuk, rempeyek, bumbu) dititipkan ke warung tetangga atau
                RitelQu. Bagi hasil dan pembayaran disepakati bersama secara adil dan berkah.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold border-t border-emerald-500/20">
                <span>Total Estimasi Titipan Aktif:</span>
                <span className="font-mono text-emerald-600">
                  Rp {totalNilaiKonsinyasi.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {['Semua', 'Aktif Titip', 'Terjual Sebagian', 'Selesai / Lunas'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterKonsinyasiStatus(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs ${
                    filterKonsinyasiStatus === st
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isDark
                      ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* List Konsinyasi */}
            {filteredKonsinyasi.length === 0 ? (
              <div
                className={`text-center py-12 rounded-2xl border border-dashed p-6 ${
                  isDark ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-400'
                }`}
              >
                <PackageCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">Belum ada pengajuan titip jual.</p>
                <button
                  onClick={() => setIsModalKonsinyasiOpen(true)}
                  className="mt-3 text-xs text-emerald-600 hover:underline font-bold"
                >
                  + Buat pengajuan titipan sekarang!
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredKonsinyasi.map((k) => (
                  <div
                    key={k.id}
                    className={`rounded-2xl p-3.5 space-y-2.5 border transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 shadow-md'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3
                          className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}
                        >
                          {k.produk}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Produsen: <strong className="text-slate-300">{k.produsen}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCycleStatus(k.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                            k.status === 'Aktif Titip'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : k.status === 'Terjual Sebagian'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                          title="Klik untuk ubah status secara berantai"
                        >
                          {k.status} ↻
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHapusKonsinyasi(k.id, k.produk)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition cursor-pointer"
                          title="Hapus Titipan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl border text-[11px] flex justify-between items-center ${
                        isDark
                          ? 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>
                        Titip di: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{k.warung}</strong>
                      </span>
                      <span>
                        Jml: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{k.jumlah} pcs</strong> (@ Rp{' '}
                        {k.harga.toLocaleString('id-ID')})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Tanggal: {k.tanggalTitip || 'Hari ini'}</span>
                      <span className="font-semibold text-emerald-600">
                        Total Titip: Rp {(k.jumlah * k.harga).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sub Navigation Tabs Docked Above Bottom Navbar */}
      <nav
        className={`shrink-0 z-20 px-3 py-1.5 border-t backdrop-blur-md transition-colors shadow-[0_-2px_6px_rgba(0,0,0,0.04)] ${
          isDark
            ? 'bg-slate-900/95 border-slate-800'
            : 'bg-white/95 border-slate-200'
        }`}
      >
        <div className="max-w-md mx-auto flex items-center justify-around gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('pasar')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'pasar'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5 shrink-0" />
            <span>Pasar Warga</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'pasar'
                  ? 'bg-emerald-700 text-white'
                  : isDark
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {produkList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('konsinyasi')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'konsinyasi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Handshake className="w-3.5 h-3.5 shrink-0" />
            <span>Titip Jual</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'konsinyasi'
                  ? 'bg-emerald-700 text-white'
                  : isDark
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {konsinyasiList.length}
            </span>
          </button>
        </div>
      </nav>

      {/* ==================================================== */}
      {/* 4. MODAL TAMBAH PRODUK PASAR                         */}
      {/* ==================================================== */}
      {isModalProdukOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl border transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex justify-between items-center border-b pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm">Tambah Produk / Jasa Warga</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalProdukOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimpanProduk} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Produk / Jasa</label>
                <input
                  type="text"
                  required
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Misal: Kripik Singkong Balado / Jahit Baju"
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Kategori Produk</label>
                <select
                  value={formKategori}
                  onChange={(e) => setFormKategori(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Kuliner">Kuliner & Minuman</option>
                  <option value="Sembako">Sembako & Sayur Segar</option>
                  <option value="Preloved">Preloved (Barang Bekas Layak)</option>
                  <option value="Jasa">Jasa Warga (Servis / Les / Cuci)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={formHarga}
                  onChange={(e) => setFormHarga(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Misal: 15000"
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nama Penjual & Blok Rumah</label>
                <input
                  type="text"
                  required
                  value={formPenjual}
                  onChange={(e) => setFormPenjual(e.target.value)}
                  placeholder="Misal: Ibu Siti (Blok G No. 5)"
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nomor WhatsApp (untuk pemesanan)</label>
                <input
                  type="text"
                  required
                  value={formWa}
                  onChange={(e) => setFormWa(e.target.value)}
                  placeholder="08xxxxxxxxxx atau 628xxxxxxxxxx"
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  placeholder="Keterangan rasa, ukuran, atau ketentuan pemesanan..."
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition shadow mt-3 active:scale-95 cursor-pointer"
              >
                Simpan & Tayangkan ke Pasar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. MODAL TAMBAH KONSINYASI                           */}
      {/* ==================================================== */}
      {isModalKonsinyasiOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl border transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex justify-between items-center border-b pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                  <Handshake className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm">Pengajuan Titip Jual (Konsinyasi)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalKonsinyasiOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimpanKonsinyasi} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Produk Titipan</label>
                <input
                  type="text"
                  required
                  value={formKNama}
                  onChange={(e) => setFormKNama(e.target.value)}
                  placeholder="Misal: Kue Basah / Rempeyek Kacang"
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nama Produsen & Blok</label>
                <input
                  type="text"
                  required
                  value={formKProdusen}
                  onChange={(e) => setFormKProdusen(e.target.value)}
                  placeholder="Misal: Bu Ani (Blok F No. 8)"
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Warung Penitipan Tujuan</label>
                <input
                  type="text"
                  required
                  value={formKWarung}
                  onChange={(e) => setFormKWarung(e.target.value)}
                  placeholder="Misal: Warung Sembako Bu Wati / RitelQu Blok G"
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Jumlah Titip (pcs)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formKJumlah}
                    onChange={(e) =>
                      setFormKJumlah(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="10"
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Harga Titip / pcs (Rp)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={formKHarga}
                    onChange={(e) =>
                      setFormKHarga(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="5000"
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-emerald-600 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border text-[11px] ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                }`}
              >
                <span>Estimasi Nilai Total Titipan: </span>
                <strong className="text-emerald-600 font-mono">
                  Rp{' '}
                  {(
                    (Number(formKJumlah) || 0) * (Number(formKHarga) || 0)
                  ).toLocaleString('id-ID')}
                </strong>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition shadow mt-3 active:scale-95 cursor-pointer"
              >
                Ajukan Titip Jual ke Warung
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
