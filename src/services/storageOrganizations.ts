import { UserProfile } from '../types';

export type OrganizationType =
  | 'rt_rw'
  | 'dkm_masjid'
  | 'panti_asuhan'
  | 'partai'
  | 'ormas'
  | 'komunitas'
  | 'paguyuban';

export interface OrganizationMember {
  id: string;
  name: string;
  roleTitle: string; // e.g. "Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Anggota", "Relawan"
  roleTier: 'tier1' | 'tier2'; // Tier 1: Anggota biasa, Tier 2: Pengurus/Admin
  phone?: string;
  blockNumber?: string;
  joinedAt?: string;
  avatarLetter?: string;
}

export interface OrganizationTransaction {
  id: string;
  type: 'pemasukan' | 'pengeluaran';
  title: string;
  amount: number;
  category: string; // e.g. 'iuran_wajib', 'infak', 'sumbangan', 'operasional', 'sampah', 'konsumsi', 'perbaikan'
  paymentMethod: 'cash' | 'transfer' | 'qris';
  date: string;
  senderOrPayer: string;
  notes?: string;
  status: 'verified' | 'pending';
}

export interface OrganizationAgenda {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string; // 'ronda', 'kerja_bakti', 'rapat_pleno', 'pengajian', 'konsolidasi', 'santunan'
  status: 'akan_datang' | 'selesai';
  attendeesCount?: number;
}

export interface OrganizationSetting {
  iuranWajibNominal: number; // e.g. 65000 for RT, or 0 / custom for DKM
  iuranLabel: string; // e.g. "Iuran Kebersihan & Keamanan" / "Infaq Subuh" / "Iuran Wajib Kader"
  bankName: string; // e.g. "Bank Syariah Indonesia (BSI)"
  accountNumber: string; // e.g. "7123-4567-890"
  accountHolder: string; // e.g. "DKM Masjid Al-Hidayah"
  qrisCodeText?: string;
  ketuaName: string;
  wakilName: string;
  sekretarisName: string;
  bendaharaName: string;
  deskripsi: string;
}

export interface OrganizationData {
  id: string;
  name: string;
  shortCode: string;
  type: OrganizationType;
  tagline: string;
  iconName: string;
  colorTheme: 'emerald' | 'teal' | 'blue' | 'amber' | 'purple' | 'red';
  currentUserRole: string; // "Ketua" | "Bendahara" | "Wakil" | "Anggota" | etc.
  currentUserTier: 'tier1' | 'tier2';
  members: OrganizationMember[];
  transactions: OrganizationTransaction[];
  agendas: OrganizationAgenda[];
  announcements: { id: string; title: string; content: string; date: string; isPinned?: boolean }[];
  settings: OrganizationSetting;
}

const STORAGE_KEY_ORGANIZATIONS = 'appqu_organizations_data_v2';
const STORAGE_KEY_ACTIVE_ORG_ID = 'appqu_active_organization_id_v2';

// Initial Seed Data with diverse modular organizations: RT, DKM, Panti, Ormas, Partai
export const DEFAULT_ORGANIZATIONS: OrganizationData[] = [
  {
    id: 'org-rt-04',
    name: 'Paguyuban Warga RT 04 Sukamaju',
    shortCode: 'RT 04',
    type: 'rt_rw',
    tagline: 'Guyub Rukun, Aman & Sejahtera',
    iconName: 'Users',
    colorTheme: 'emerald',
    currentUserRole: 'Ketua Paguyuban RT',
    currentUserTier: 'tier2',
    settings: {
      iuranWajibNominal: 65000,
      iuranLabel: 'Iuran Sampah & Keamanan Wajib',
      bankName: 'Bank BCA',
      accountNumber: '8210-9988-7711',
      accountHolder: 'Kas Paguyuban RT 04 Sukamaju',
      qrisCodeText: 'QRIS-RT04-SUKAMAJU-VERIFIED',
      ketuaName: 'Budi Santoso',
      wakilName: 'Agus Suparman',
      sekretarisName: 'Hendri Gunawan',
      bendaharaName: 'Hj. Siti Rahmawati',
      deskripsi: 'Paguyuban resmi warga RT 04 / RW 09 Kelurahan Sukamaju.',
    },
    members: [
      { id: 'm-1', name: 'Budi Santoso', roleTitle: 'Ketua RT', roleTier: 'tier2', phone: '0812-8877-6655', blockNumber: 'Blok C3 No. 12', joinedAt: '2021-03-15' },
      { id: 'm-2', name: 'Agus Suparman', roleTitle: 'Wakil Ketua & Hansip', roleTier: 'tier2', phone: '0857-1122-3344', blockNumber: 'Pos Satpam RT', joinedAt: '2020-01-10' },
      { id: 'm-3', name: 'Hj. Siti Rahmawati', roleTitle: 'Bendahara Paguyuban', roleTier: 'tier2', phone: '0819-0987-6543', blockNumber: 'Blok B3 No. 16', joinedAt: '2021-04-12' },
      { id: 'm-4', name: 'Hendri Gunawan', roleTitle: 'Sekretaris', roleTier: 'tier2', phone: '0813-2233-4455', blockNumber: 'Blok A1 No. 04', joinedAt: '2022-02-20' },
      { id: 'm-5', name: 'Drs. H. Bambang Wijaya', roleTitle: 'Warga / Penasihat', roleTier: 'tier1', phone: '0811-9988-7766', blockNumber: 'Blok A2 No. 01', joinedAt: '2019-05-18' },
      { id: 'm-6', name: 'Rina Marlina', roleTitle: 'Warga (PKK)', roleTier: 'tier1', phone: '0818-7766-5544', blockNumber: 'Blok C1 No. 08', joinedAt: '2023-01-15' },
      { id: 'm-7', name: 'Yayan Ruhian', roleTitle: 'Warga (Karang Taruna)', roleTier: 'tier1', phone: '0856-4433-2211', blockNumber: 'Blok B1 No. 09', joinedAt: '2023-08-10' },
    ],
    transactions: [
      { id: 'tx-1', type: 'pemasukan', title: 'Iuran Wajib Warga Blok A & B', amount: 975000, category: 'iuran_wajib', paymentMethod: 'transfer', date: '2026-10-24', senderOrPayer: '15 KK Blok A & B', status: 'verified', notes: 'Iuran rutin bulan Oktober 2026' },
      { id: 'tx-2', type: 'pemasukan', title: 'Iuran Kas Tunai Pos Satpam', amount: 455000, category: 'iuran_wajib', paymentMethod: 'cash', date: '2026-10-25', senderOrPayer: '7 KK Blok C', status: 'verified', notes: 'Diserahkan langsung ke Bendahara' },
      { id: 'tx-3', type: 'pengeluaran', title: 'Gaji & Honor 2 Petugas Hansip/Ronda', amount: 800000, category: 'operasional', paymentMethod: 'cash', date: '2026-10-25', senderOrPayer: 'Pak Agus & Tim', status: 'verified', notes: 'Honor paruh bulan Oktober' },
      { id: 'tx-4', type: 'pengeluaran', title: 'Retribusi Iuran Angkut Sampah DLH', amount: 350000, category: 'sampah', paymentMethod: 'transfer', date: '2026-10-22', senderOrPayer: 'Dinas Lingkungan Hidup', status: 'verified', notes: 'Tagihan resmi truk sampah perumahan' },
      { id: 'tx-5', type: 'pengeluaran', title: 'Perbaikan Lampu LED Penerangan Gang 2', amount: 125000, category: 'perbaikan', paymentMethod: 'cash', date: '2026-10-20', senderOrPayer: 'Toko Listrik Terang', status: 'verified', notes: 'Penggantian 3 fitting lampu jalan' },
    ],
    agendas: [
      { id: 'ag-1', title: 'Ronda Malam Bergilir Regu C', date: '2026-10-27', time: '22:00 - 04:00', location: 'Pos Satpam Utama RT 04', description: 'Patroli keliling blok & pengecekan gembok portal gang.', category: 'ronda', status: 'akan_datang', attendeesCount: 6 },
      { id: 'ag-2', title: 'Kerja Bakti Saluran Air & Fogging', date: '2026-10-29', time: '07:30 - 10:30', location: 'Sepanjang Selokan Blok A-C', description: 'Pembersihan endapan lumpur menjelang musim hujan.', category: 'kerja_bakti', status: 'akan_datang', attendeesCount: 22 },
      { id: 'ag-3', title: 'Rapat Pleno Penyusunan Laporan Tahunan RT', date: '2026-10-18', time: '19:30 - 21:30', location: 'Balai Warga Serbaguna', description: 'Evaluasi pemasukan iuran & program fasum.', category: 'rapat_pleno', status: 'selesai', attendeesCount: 18 },
    ],
    announcements: [
      { id: 'ann-1', title: 'Pengingat Pembayaran Iuran Wajib RT Bulan Oktober', content: 'Bagi bapak/ibu warga RT 04 yang belum melunasi iuran Rp65.000, mohon dapat transfer ke rek Kas RT atau via petugas bendahara.', date: '2026-10-24', isPinned: true },
      { id: 'ann-2', title: 'Himbauan Penguncian Portal Gang Jam 23:00 WIB', content: 'Untuk menjaga ketertiban dan keamanan bersama, seluruh portal samping dikunci mulai pukul 23:00 WIB.', date: '2026-10-22' },
    ],
  },
  {
    id: 'org-dkm-hidayah',
    name: 'DKM Masjid Al-Hidayah',
    shortCode: 'DKM',
    type: 'dkm_masjid',
    tagline: 'Memakmurkan Masjid, Menebar Berkah Ummat',
    iconName: 'Building2',
    colorTheme: 'teal',
    currentUserRole: 'Bendahara DKM',
    currentUserTier: 'tier2',
    settings: {
      iuranWajibNominal: 0,
      iuranLabel: 'Infak & Sedekah Sukarela Subuh',
      bankName: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '7144-8899-001',
      accountHolder: 'DKM Masjid Al Hidayah Sukamaju',
      qrisCodeText: 'QRIS-DKM-ALHIDAYAH-OFFICIAL',
      ketuaName: 'Ustadz Ahmad Fauzi',
      wakilName: 'H. Mulyadi Saputra',
      sekretarisName: 'Ir. Zulkifli Rahman',
      bendaharaName: 'Budi Santoso',
      deskripsi: 'Dewan Kemakmuran Masjid Al-Hidayah RT 04 / RW 09.',
    },
    members: [
      { id: 'm-dkm-1', name: 'Ustadz Ahmad Fauzi', roleTitle: 'Ketua DKM & Imam', roleTier: 'tier2', phone: '0812-7788-9900', blockNumber: 'Blok B2 No. 03', joinedAt: '2020-01-01' },
      { id: 'm-dkm-2', name: 'H. Mulyadi Saputra', roleTitle: 'Wakil Ketua DKM', roleTier: 'tier2', phone: '0813-8899-0011', blockNumber: 'Blok A1 No. 07', joinedAt: '2020-02-15' },
      { id: 'm-dkm-3', name: 'Budi Santoso', roleTitle: 'Bendahara Keuangan', roleTier: 'tier2', phone: '0812-8877-6655', blockNumber: 'Blok C3 No. 12', joinedAt: '2021-03-15' },
      { id: 'm-dkm-4', name: 'Ir. Zulkifli Rahman', roleTitle: 'Sekretaris DKM', roleTier: 'tier2', phone: '0815-6677-8899', blockNumber: 'Blok B3 No. 05', joinedAt: '2021-06-10' },
      { id: 'm-dkm-5', name: 'Ust. Marzuki (Marbot)', roleTitle: 'Pelayan & Marbot Masjid', roleTier: 'tier1', phone: '0878-1122-3344', blockNumber: 'Paviliun Masjid', joinedAt: '2019-11-20' },
      { id: 'm-dkm-6', name: 'Fadhil Pratama', roleTitle: 'Ketua Remaja Masjid (RISMA)', roleTier: 'tier1', phone: '0857-9988-1122', blockNumber: 'Blok C2 No. 14', joinedAt: '2022-09-01' },
    ],
    transactions: [
      { id: 'tx-dkm-1', type: 'pemasukan', title: 'Kotak Infak Sholat Jumat Berkah', amount: 2450000, category: 'infak', paymentMethod: 'cash', date: '2026-10-24', senderOrPayer: 'Jamaah Sholat Jumat', status: 'verified', notes: 'Dihitung bersama saksi 2 marbot' },
      { id: 'tx-dkm-2', type: 'pemasukan', title: 'Sedekah Subuh via QRIS BSI', amount: 680000, category: 'infak', paymentMethod: 'qris', date: '2026-10-25', senderOrPayer: 'Jamaah Subuh Online', status: 'verified', notes: 'QRIS Statis Masjid' },
      { id: 'tx-dkm-3', type: 'pengeluaran', title: 'Honor Guru Ngaji TPA & Imam Rawatib', amount: 1500000, category: 'operasional', paymentMethod: 'transfer', date: '2026-10-25', senderOrPayer: '3 Asatidz TPA', status: 'verified', notes: 'Bulan Oktober 2026' },
      { id: 'tx-dkm-4', type: 'pengeluaran', title: 'Tagihan Listrik PLN & Air Bersih Masjid', amount: 520000, category: 'operasional', paymentMethod: 'transfer', date: '2026-10-21', senderOrPayer: 'PLN & PDAM', status: 'verified', notes: 'Kapasitas AC 4 unit + Pompa air' },
      { id: 'tx-dkm-5', type: 'pengeluaran', title: 'Service Pembersihan AC & Karpet Sholat', amount: 400000, category: 'perbaikan', paymentMethod: 'cash', date: '2026-10-19', senderOrPayer: 'Berkah AC Mandiri', status: 'verified', notes: 'Cuci 4 unit AC ruang utama' },
    ],
    agendas: [
      { id: 'ag-dkm-1', title: 'Kajian Rutin Ahad Subuh: Fiqih Muamalah', date: '2026-11-01', time: '05:00 - 06:30', location: 'Ruang Utama Masjid Al-Hidayah', description: 'Bersama Ustadz Dr. H. Abdul Malik, Lc. Dilanjutkan sarapan bubur bersama.', category: 'pengajian', status: 'akan_datang', attendeesCount: 85 },
      { id: 'ag-dkm-2', title: 'Santunan Bulanan 25 Anak Yatim & Dhuafa', date: '2026-10-31', time: '16:00 - 17:30', location: 'Serambi Masjid Al-Hidayah', description: 'Penyaluran paket sembako & santunan tunai dana infak.', category: 'santunan', status: 'akan_datang', attendeesCount: 40 },
      { id: 'ag-dkm-3', title: 'Bakti Bersih Tempat Wudhu & Kamar Mandi', date: '2026-10-23', time: '08:00 - 10:00', location: 'Area Sanitasi Masjid', description: 'Pembersihan lumut & penggantian keran air rusak.', category: 'kerja_bakti', status: 'selesai', attendeesCount: 12 },
    ],
    announcements: [
      { id: 'ann-dkm-1', title: 'Laporan Rekapitulasi Kas Masjid Pekan ke-4 Oktober 2026', content: 'Saldo akhir kas masjid per 25 Oktober: Rp6.890.000. Jazakumullah khairan katsiran kepada seluruh muzakki dan donatur.', date: '2026-10-25', isPinned: true },
      { id: 'ann-dkm-2', title: 'Pendaftaran Murid Baru TPA Anak-Anak Dibuka', content: 'Kelas mengaji Iqro dan Al-Quran setiap ba’da Ashar gratis untuk putra-putri warga.', date: '2026-10-20' },
    ],
  },
  {
    id: 'org-panti-kasih',
    name: 'Panti Asuhan Kasih Bunda',
    shortCode: 'PANTI',
    type: 'panti_asuhan',
    tagline: 'Mendidik & Menyayangi Generasi Mandiri',
    iconName: 'Heart',
    colorTheme: 'purple',
    currentUserRole: 'Wakil Ketua Yayasan',
    currentUserTier: 'tier2',
    settings: {
      iuranWajibNominal: 100000,
      iuranLabel: 'Paket Donasi Orang Tua Asuh',
      bankName: 'Bank Mandiri',
      accountNumber: '133-00-998877-66',
      accountHolder: 'Yayasan Panti Asuhan Kasih Bunda',
      qrisCodeText: 'QRIS-PANTI-KASIHBUNDA',
      ketuaName: 'Dra. Hj. Nurjanah, M.Pd',
      wakilName: 'Budi Santoso',
      sekretarisName: 'Ratna Dewi, S.Sos',
      bendaharaName: 'Farhan Maulana',
      deskripsi: 'Panti asuhan menaungi 32 anak yatim piatu usia sekolah SD sampai SMA.',
    },
    members: [
      { id: 'm-p-1', name: 'Dra. Hj. Nurjanah, M.Pd', roleTitle: 'Ketua Yayasan Panti', roleTier: 'tier2', phone: '0812-3344-5566', blockNumber: 'Kantor Yayasan', joinedAt: '2018-04-10' },
      { id: 'm-p-2', name: 'Budi Santoso', roleTitle: 'Wakil Ketua / Pembina', roleTier: 'tier2', phone: '0812-8877-6655', blockNumber: 'Blok C3 No. 12', joinedAt: '2021-03-15' },
      { id: 'm-p-3', name: 'Ratna Dewi, S.Sos', roleTitle: 'Sekretaris & Pengasuh', roleTier: 'tier2', phone: '0813-4455-6677', blockNumber: 'Asrama Putri', joinedAt: '2020-07-01' },
      { id: 'm-p-4', name: 'Farhan Maulana', roleTitle: 'Bendahara Keuangan', roleTier: 'tier2', phone: '0816-7788-9900', blockNumber: 'Blok B1 No. 02', joinedAt: '2021-01-10' },
      { id: 'm-p-5', name: 'Kak Dimas Pratama', roleTitle: 'Tutor Relawan Belajar', roleTier: 'tier1', phone: '0858-1122-3344', blockNumber: 'Asrama Putra', joinedAt: '2023-02-15' },
    ],
    transactions: [
      { id: 'tx-p-1', type: 'pemasukan', title: 'Donasi Rutin Orang Tua Asuh (8 Donatur)', amount: 1600000, category: 'sumbangan', paymentMethod: 'transfer', date: '2026-10-24', senderOrPayer: 'Komunitas Donatur Tetap', status: 'verified', notes: 'Biaya SPP & buku sekolah anak asuh' },
      { id: 'tx-p-2', type: 'pemasukan', title: 'Sedekah Sembako & Uang Kas Hajatan', amount: 850000, category: 'sumbangan', paymentMethod: 'cash', date: '2026-10-23', senderOrPayer: 'Keluarga Bpk. H. Sukardi', status: 'verified', notes: 'Tasyakuran kelahiran cucu' },
      { id: 'tx-p-3', type: 'pengeluaran', title: 'Belanja Beras, Lauk & Sayuran 1 Pekan', amount: 920000, category: 'operasional', paymentMethod: 'cash', date: '2026-10-25', senderOrPayer: 'Pasar Induk Sayur', status: 'verified', notes: 'Kebutuhan konsumsi 32 anak asuh' },
      { id: 'tx-p-4', type: 'pengeluaran', title: 'Pelunasan SPP 12 Siswa SMK/SMA', amount: 1200000, category: 'operasional', paymentMethod: 'transfer', date: '2026-10-21', senderOrPayer: 'SMK Negeri 2', status: 'verified', notes: 'SPP bulan berjalan' },
    ],
    agendas: [
      { id: 'ag-p-1', title: 'Pelatihan Keterampilan Komputer & Desain Grafis', date: '2026-10-28', time: '14:00 - 16:30', location: 'Lab Komputer Panti Asuhan', description: 'Pelatihan dasar Canva & Office untuk anak asuh tingkat SMP & SMA.', category: 'konsolidasi', status: 'akan_datang', attendeesCount: 16 },
      { id: 'ag-p-2', title: 'Pemeriksaan Kesehatan Gigi & Mata Gratis', date: '2026-10-15', time: '09:00 - 12:00', location: 'Klinik Warga RT 04', description: 'Kerjasama dengan dokter relawan KlinikQu.', category: 'santunan', status: 'selesai', attendeesCount: 32 },
    ],
    announcements: [
      { id: 'ann-p-1', title: 'Terima Kasih atas Donasi 5 Karung Beras dari Warga RT 04', content: 'Alhamdulillah pasokan dapur aman untuk 2 pekan ke depan. Semoga rezeki para donatur dilipatgandakan.', date: '2026-10-23', isPinned: true },
    ],
  },
  {
    id: 'org-ormas-pemuda',
    name: 'Ormas Pemuda Berkarya Sukamaju',
    shortCode: 'ORMAS',
    type: 'ormas',
    tagline: 'Kompak, Berdaya & Berjiwa Sosial',
    iconName: 'Shield',
    colorTheme: 'blue',
    currentUserRole: 'Ketua Bidang Sosial & Logistik',
    currentUserTier: 'tier2',
    settings: {
      iuranWajibNominal: 25000,
      iuranLabel: 'Iuran Kas Anggota Pemuda',
      bankName: 'Bank BRI',
      accountNumber: '0129-01-054321-50-8',
      accountHolder: 'Ormas Pemuda Berkarya Sukamaju',
      qrisCodeText: 'QRIS-PEMUDA-BERKARYA',
      ketuaName: 'Rian Hidayatullah',
      wakilName: 'Budi Santoso',
      sekretarisName: 'Taufik Akbar',
      bendaharaName: 'Bambang Sudiro',
      deskripsi: 'Organisasi kemasyarakatan kepemudaan bidang sosial, tanggap bencana, dan ketertiban lingkungan.',
    },
    members: [
      { id: 'm-o-1', name: 'Rian Hidayatullah', roleTitle: 'Ketua Umum Ormas', roleTier: 'tier2', phone: '0813-9900-1122', blockNumber: 'Sekretariat Ormas', joinedAt: '2019-08-17' },
      { id: 'm-o-2', name: 'Budi Santoso', roleTitle: 'Ketua Bidang Sosial', roleTier: 'tier2', phone: '0812-8877-6655', blockNumber: 'Blok C3 No. 12', joinedAt: '2021-03-15' },
      { id: 'm-o-3', name: 'Taufik Akbar', roleTitle: 'Sekretaris Jenderal', roleTier: 'tier2', phone: '0817-2233-4455', blockNumber: 'Blok A3 No. 10', joinedAt: '2020-05-20' },
      { id: 'm-o-4', name: 'Bambang Sudiro', roleTitle: 'Bendahara Umum', roleTier: 'tier2', phone: '0818-6655-4433', blockNumber: 'Blok B2 No. 08', joinedAt: '2021-02-14' },
      { id: 'm-o-5', name: 'Eko Wahyudi', roleTitle: 'Anggota Satgas Keamanan', roleTier: 'tier1', phone: '0857-3322-1100', blockNumber: 'Blok C1 No. 05', joinedAt: '2022-06-10' },
      { id: 'm-o-6', name: 'Junaedi', roleTitle: 'Anggota Satgas Tanggap Darurat', roleTier: 'tier1', phone: '0859-4455-6677', blockNumber: 'Blok B1 No. 11', joinedAt: '2023-03-21' },
    ],
    transactions: [
      { id: 'tx-o-1', type: 'pemasukan', title: 'Iuran Wajib Kader Bulan Oktober (22 Anggota)', amount: 550000, category: 'iuran_wajib', paymentMethod: 'cash', date: '2026-10-24', senderOrPayer: 'Kader Ormas Sukamaju', status: 'verified', notes: 'Iuran bulanan Rp25.000/orang' },
      { id: 'tx-o-2', type: 'pengeluaran', title: 'Pengadaan 4 Rompi & Senter Satgas Malam', amount: 280000, category: 'operasional', paymentMethod: 'cash', date: '2026-10-22', senderOrPayer: 'Toko Perlengkapan Taktis', status: 'verified', notes: 'Perlengkapan patroli malam pemuda' },
      { id: 'tx-o-3', type: 'pengeluaran', title: 'Bantuan Logistik Sembako Bencana Longsor', amount: 350000, category: 'santunan', paymentMethod: 'cash', date: '2026-10-18', senderOrPayer: 'Dapur Umum Bencana', status: 'verified', notes: 'Penyaluran beras & mie instan' },
    ],
    agendas: [
      { id: 'ag-o-1', title: 'Apel Siaga & Konsolidasi Kader Pemuda', date: '2026-10-30', time: '19:30 - 21:00', location: 'Halaman Sekretariat Pemuda', description: 'Persiapan pengamanan kegiatan malam tahun baru & ronda bersama.', category: 'konsolidasi', status: 'akan_datang', attendeesCount: 25 },
      { id: 'ag-o-2', title: 'Turnamen Futsal Persahabatan Antar RW', date: '2026-10-20', time: '15:30 - 18:00', location: 'Lapangan Futsal Champion', description: 'Menjalin silaturahmi pemuda lintas wilayah.', category: 'kerja_bakti', status: 'selesai', attendeesCount: 30 },
    ],
    announcements: [
      { id: 'ann-o-1', title: 'Instruksi Siaga Satgas Lingkungan Musim Hujan', content: 'Diharapkan kader satgas standby memantau titik-titik rawan banjir di RT 04 dan sekitarnya.', date: '2026-10-24', isPinned: true },
    ],
  },
  {
    id: 'org-partai-harapan',
    name: 'DPC Partai Harapan Rakyat',
    shortCode: 'PARTAI',
    type: 'partai',
    tagline: 'Aspiratif, Merakyat & Berintegritas',
    iconName: 'Flag',
    colorTheme: 'red',
    currentUserRole: 'Wakil Ketua Bidang Kaderisasi',
    currentUserTier: 'tier2',
    settings: {
      iuranWajibNominal: 50000,
      iuranLabel: 'Iuran Wajib Pengurus & Kader',
      bankName: 'Bank BNI',
      accountNumber: '088-7766-5544-33',
      accountHolder: 'DPC Partai Harapan Rakyat',
      qrisCodeText: 'QRIS-PARTAI-HARAPAN-DPC',
      ketuaName: 'H. Sudrajat, S.H',
      wakilName: 'Budi Santoso',
      sekretarisName: 'Iwan Setiawan',
      bendaharaName: 'Dewi Lestari, S.E',
      deskripsi: 'Dewan Pimpinan Cabang Partai Harapan Rakyat tingkat kecamatan / ranting.',
    },
    members: [
      { id: 'm-pr-1', name: 'H. Sudrajat, S.H', roleTitle: 'Ketua DPC', roleTier: 'tier2', phone: '0811-2233-4455', blockNumber: 'Kantor DPC', joinedAt: '2019-01-10' },
      { id: 'm-pr-2', name: 'Budi Santoso', roleTitle: 'Wakil Ketua Kaderisasi', roleTier: 'tier2', phone: '0812-8877-6655', blockNumber: 'Blok C3 No. 12', joinedAt: '2021-03-15' },
      { id: 'm-pr-3', name: 'Iwan Setiawan', roleTitle: 'Sekretaris DPC', roleTier: 'tier2', phone: '0812-6677-8899', blockNumber: 'Blok A2 No. 05', joinedAt: '2020-03-12' },
      { id: 'm-pr-4', name: 'Dewi Lestari, S.E', roleTitle: 'Bendahara DPC', roleTier: 'tier2', phone: '0813-1122-3344', blockNumber: 'Blok B2 No. 10', joinedAt: '2020-08-20' },
      { id: 'm-pr-5', name: 'Kurniawan', roleTitle: 'Kader Penggerak Ranting', roleTier: 'tier1', phone: '0856-7788-9900', blockNumber: 'Blok C2 No. 09', joinedAt: '2022-05-10' },
    ],
    transactions: [
      { id: 'tx-pr-1', type: 'pemasukan', title: 'Iuran Fraksi & Pengurus Harian', amount: 1500000, category: 'iuran_wajib', paymentMethod: 'transfer', date: '2026-10-23', senderOrPayer: 'Pengurus Harian DPC', status: 'verified', notes: 'Iuran rutin bulanan partai' },
      { id: 'tx-pr-2', type: 'pengeluaran', title: 'Operasional Kantor & Sewa Alat Suara', amount: 650000, category: 'operasional', paymentMethod: 'transfer', date: '2026-10-22', senderOrPayer: 'Sekretariat DPC', status: 'verified', notes: 'Listrik, wifi & konsumsi rapat pleno' },
    ],
    agendas: [
      { id: 'ag-pr-1', title: 'Rapat Pleno Pengurus & Konsolidasi Ranting', date: '2026-10-31', time: '13:30 - 16:00', location: 'Ruang Rapat Kantor DPC', description: 'Pembahasan program kerja advokasi warga dan serap aspirasi.', category: 'rapat_pleno', status: 'akan_datang', attendeesCount: 20 },
    ],
    announcements: [
      { id: 'ann-pr-1', title: 'Biro Advokasi dan Layanan Warga Gratis', content: 'Posko dibuka setiap hari kerja untuk pendampingan administrasi warga dan konsultasi hukum cuma-cuma.', date: '2026-10-20', isPinned: true },
    ],
  },
];

export const OrganizationStorageService = {
  // Get all organizations
  getOrganizations(): OrganizationData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORGANIZATIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    this.saveOrganizations(DEFAULT_ORGANIZATIONS);
    return DEFAULT_ORGANIZATIONS;
  },

  // Save all organizations
  saveOrganizations(orgs: OrganizationData[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_ORGANIZATIONS, JSON.stringify(orgs));
    } catch {}
  },

  // Get active organization ID
  getActiveOrgId(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_ORG_ID);
      if (stored) return stored;
    } catch {}
    return DEFAULT_ORGANIZATIONS[0].id;
  },

  // Set active organization ID
  setActiveOrgId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ORG_ID, id);
    } catch {}
  },

  // Get currently active organization
  getActiveOrganization(): OrganizationData {
    const orgs = this.getOrganizations();
    const activeId = this.getActiveOrgId();
    const found = orgs.find((o) => o.id === activeId);
    return found || orgs[0] || DEFAULT_ORGANIZATIONS[0];
  },

  // Update a specific organization
  updateOrganization(updated: OrganizationData): void {
    const orgs = this.getOrganizations();
    const index = orgs.findIndex((o) => o.id === updated.id);
    if (index !== -1) {
      orgs[index] = updated;
    } else {
      orgs.push(updated);
    }
    this.saveOrganizations(orgs);
  },

  // Add a new organization
  addOrganization(newOrg: OrganizationData): void {
    const orgs = this.getOrganizations();
    orgs.push(newOrg);
    this.saveOrganizations(orgs);
    this.setActiveOrgId(newOrg.id);
  },

  // Delete an organization (cannot delete if it's the last one)
  deleteOrganization(id: string): boolean {
    const orgs = this.getOrganizations();
    if (orgs.length <= 1) return false;
    const filtered = orgs.filter((o) => o.id !== id);
    this.saveOrganizations(filtered);
    if (this.getActiveOrgId() === id) {
      this.setActiveOrgId(filtered[0].id);
    }
    return true;
  },
};
