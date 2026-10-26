import { MuamalahProduk, MuamalahKonsinyasi } from '../types';

export const DEFAULT_MUAMALAH_PRODUK: MuamalahProduk[] = [
  {
    id: 1,
    nama: 'Kripik Singkong Balado',
    kategori: 'Kuliner',
    harga: 12000,
    penjual: 'Ibu Siti (Blok G)',
    wa: '628123456789',
    deskripsi: 'Renyah pedas manis khas olahan rumahan warga RT 04.',
  },
  {
    id: 2,
    nama: 'Telur Ayam Petelur Segar (1 Kg)',
    kategori: 'Sembako',
    harga: 26000,
    penjual: 'Kandang Bageur (Blok G No.11)',
    wa: '628123456789',
    deskripsi: 'Telur segar diambil langsung tiap pagi, bersih & higienis.',
  },
  {
    id: 3,
    nama: 'Sepeda Anak Bekas Layak Pakai',
    kategori: 'Preloved',
    harga: 150000,
    penjual: 'Pak Budi (Blok C)',
    wa: '628123456789',
    deskripsi: 'Kondisi 85% mulus, rem pakem, cocok usia 4-7 tahun.',
  },
  {
    id: 4,
    nama: 'Jasa Servis & Cuci AC Rumah',
    kategori: 'Jasa',
    harga: 75000,
    penjual: 'Mas Joko (Blok D)',
    wa: '628123456789',
    deskripsi: 'Cuci steam AC split, isi freon, dan cek kebocoran teknisi warga.',
  },
];

export const DEFAULT_MUAMALAH_KONSINYASI: MuamalahKonsinyasi[] = [
  {
    id: 1,
    produk: 'Rempeyek Kacang',
    produsen: 'Bu Ani (Blok F)',
    warung: 'Warung Sembako Bu Wati',
    jumlah: 15,
    harga: 8000,
    status: 'Aktif Titip',
    tanggalTitip: '2026-10-24',
  },
  {
    id: 2,
    produk: 'Kue Lapis Legit',
    produsen: 'Pak Joko (Blok B)',
    warung: 'RitelQu Utama',
    jumlah: 10,
    harga: 5000,
    status: 'Terjual Sebagian',
    tanggalTitip: '2026-10-23',
  },
];

export const MuamalahStorageService = {
  getProduk(): MuamalahProduk[] {
    try {
      const data = localStorage.getItem('muamalah_produk');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Gagal membaca muamalah_produk dari localStorage', e);
    }
    return DEFAULT_MUAMALAH_PRODUK;
  },

  saveProduk(items: MuamalahProduk[]): void {
    try {
      localStorage.setItem('muamalah_produk', JSON.stringify(items));
    } catch (e) {
      console.warn('Gagal menyimpan muamalah_produk ke localStorage', e);
    }
  },

  getKonsinyasi(): MuamalahKonsinyasi[] {
    try {
      const data = localStorage.getItem('muamalah_konsinyasi');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Gagal membaca muamalah_konsinyasi dari localStorage', e);
    }
    return DEFAULT_MUAMALAH_KONSINYASI;
  },

  saveKonsinyasi(items: MuamalahKonsinyasi[]): void {
    try {
      localStorage.setItem('muamalah_konsinyasi', JSON.stringify(items));
    } catch (e) {
      console.warn('Gagal menyimpan muamalah_konsinyasi ke localStorage', e);
    }
  },

  getTheme(): 'light' | 'dark' {
    try {
      const mode = localStorage.getItem('wargaqu_theme_mode') || localStorage.getItem('muamalah_theme_mode');
      if (mode === 'dark' || mode === 'light') return mode;
    } catch (e) {
      console.warn('Gagal membaca muamalah_theme_mode', e);
    }
    return 'light';
  },

  saveTheme(mode: 'light' | 'dark'): void {
    try {
      localStorage.setItem('wargaqu_theme_mode', mode);
      localStorage.setItem('muamalah_theme_mode', mode);
      if (typeof document !== 'undefined') {
        if (mode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (e) {
      console.warn('Gagal menyimpan muamalah_theme_mode', e);
    }
  },
};
