import {
  UserProfile,
  ResidentData,
  FeedPost,
  AgendaEvent,
  KasTransaction,
  SuratPengantar,
  LocalBusiness,
  EmergencyLog,
  PatrolCheckpoint,
  PatrolLog,
  MusibahItem,
  PiketTask,
  RoleTier,
  RoleDetail,
  AreaPoint,
  TransportasiCourier,
  SOSEphemeralRoom,
  ProyekRecord,
  VendorTukangExpense,
  ProyekProfile,
  UsahaQuPricingConfig,
  UserSubCategorySelection,
  UsahaQuTrialStatus,
} from '../types';

import bannerImg from '../assets/images/appqu_community_banner_1792459328196.jpg';
import baksoUratImg from '../assets/images/bakso_urat_jumbo_1790260587825.jpg';
import baksoKomplitImg from '../assets/images/bakso_komplit_1790260605375.jpg';
import esTehImg from '../assets/images/es_teh_manis_1790260616776.jpg';

const STORAGE_KEYS = {
  CURRENT_USER: 'appqu_current_user_v1',
  FEEDS: 'appqu_feeds_v1',
  AGENDA: 'appqu_agenda_v1',
  KAS: 'appqu_kas_v1',
  LETTERS: 'appqu_letters_v1',
  RESIDENTS: 'appqu_residents_v1',
  BUSINESSES: 'appqu_businesses_v1',
  EMERGENCIES: 'appqu_emergencies_v1',
  CHECKPOINTS: 'appqu_checkpoints_v1',
  PATROL_LOGS: 'appqu_patrol_logs_v1',
  MUSIBAH: 'appqu_musibah_v1',
  PIKET: 'appqu_piket_v1',
  AREA_POINTS: 'appqu_area_points_v1',
  COURIERS: 'appqu_couriers_v1',
  PENDING_VERIFICATIONS: 'appqu_pending_verifications_v1',
  SOS_ROOM: 'appqu_sos_room_v1',
  PROYEK_PROJECTS: 'appqu_proyek_projects_v1',
  PROYEK_EXPENSES: 'appqu_proyek_expenses_v1',
  PROYEK_PROFILE: 'appqu_proyek_profile_v1',
  USAHAQU_PRICING: 'appqu_usahaqu_pricing_v1',
  USER_SUBCATEGORIES: 'appqu_user_subcategories_v1',
  USAHAQU_TRIAL: 'appqu_usahaqu_trial_v1',
  USAHAQU_POPUP_COUNT: 'appqu_usahaqu_popup_count_v1',
  USAHAQU_OPERATIONAL_MODE: 'appqu_usahaqu_operational_mode_v1',
};

// Preset Users for RBAC Demonstration (Tier 1 & Tier 2 Saling Verifikasi & Validasi)
export const PRESET_USERS: Record<string, UserProfile> = {
  // --- TIER 1: WARGA & RELAWAN (AKAR RUMPUT) ---
  warga: {
    id: 'usr-warga-1',
    nik: '3201123456780001',
    noKk: '3201123456780099',
    name: 'Budi Santoso',
    roleTier: 'tier1_akar_rumput',
    roleDetail: 'warga',
    tierLevel: 'tier1',
    roleTitle: 'Warga Asli RT 04 (Tervalidasi 2 Saksi Tetangga)',
    blockNumber: 'Blok C3 No. 12',
    alamat: 'Jl. Kenanga Blok C3 No. 12, RT 04 / RW 09',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0812-8877-6655',
    emergencyContact: '0812-8877-6656 (Ibu Sri - Istri)',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [
      { id: 'w-1', name: 'Pak Agus Suparman (Hansip)', blockNumber: 'Pos Satpam', phone: '0857-1122-3344', confirmedAt: '2026-10-01' },
      { id: 'w-2', name: 'Siti Rahmawati', blockNumber: 'Blok B3 No. 16', phone: '0819-0987-6543', confirmedAt: '2026-10-03' },
    ],
    temporaryDaysLeft: 30,
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 1,
    deviceFingerprint: 'DEV-XIAOMI-REDMI7-9A1F',
    residentStatus: 'tetap',
    occupation: 'Karyawan Swasta',
    joinedAt: '2021-03-15',
  },
  warga_temporary: {
    id: 'usr-warga-1',
    nik: '3201123456780001',
    noKk: '3201123456780099',
    name: 'Budi Santoso',
    roleTier: 'tier1_akar_rumput',
    roleDetail: 'warga',
    tierLevel: 'tier1',
    roleTitle: 'Warga Asli RT 04 (Tervalidasi 2 Saksi Tetangga)',
    blockNumber: 'Blok C3 No. 12',
    alamat: 'Jl. Kenanga Blok C3 No. 12, RT 04 / RW 09',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0812-8877-6655',
    emergencyContact: '0812-8877-6656 (Ibu Sri - Istri)',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [
      { id: 'w-1', name: 'Pak Agus Suparman', blockNumber: 'Pos Satpam', phone: '0857-1122-3344', confirmedAt: '2026-10-01' },
      { id: 'w-2', name: 'Siti Rahmawati', blockNumber: 'Blok B3 No. 16', phone: '0819-0987-6543', confirmedAt: '2026-10-03' },
    ],
    temporaryDaysLeft: 18,
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 1,
    deviceFingerprint: 'DEV-XIAOMI-REDMI7-9A1F',
    residentStatus: 'tetap',
    occupation: 'Karyawan Swasta',
    joinedAt: '2021-03-15',
  },
  warga_baru_unverified: {
    id: 'usr-warga-new',
    nik: '3201123456780099',
    noKk: '3201123456780099',
    name: 'Dani Saputra (Warga Pendatang)',
    roleTier: 'tier1_akar_rumput',
    roleDetail: 'warga',
    tierLevel: 'tier1',
    roleTitle: 'Warga Pendatang (Menunggu Verifikasi & Validasi)',
    blockNumber: 'Kos Melati No. 03',
    alamat: 'Kos Pondok Asri Kamar 03, RT 04 / RW 09',
    statusKependudukan: 'pendatang',
    badgeValidasi: 'menunggu_validasi',
    phone: '0813-1122-3399',
    emergencyContact: '0813-1122-3300',
    isVerified: false,
    verificationStatus: 'unverified',
    witnessCount: 0,
    witnesses: [],
    temporaryDaysLeft: 0,
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 0,
    deviceFingerprint: 'DEV-SAMSUNG-A01-77BA',
    residentStatus: 'kontrak',
    occupation: 'Freelancer Desain',
    joinedAt: '2026-10-18',
  },
  relawan: {
    id: 'usr-relawan-1',
    nik: '3201123456780015',
    noKk: '3201123456780085',
    name: 'Rian Hidayat (Relawan)',
    roleTier: 'tier1_akar_rumput',
    roleDetail: 'relawan',
    tierLevel: 'tier1',
    roleTitle: 'Relawan Tanggap Musibah & Sosial (Tervalidasi)',
    blockNumber: 'Blok B1 No. 04',
    alamat: 'Jl. Melati Blok B1 No. 04, RT 04 / RW 09',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0812-4455-6677',
    emergencyContact: '0812-4455-6678',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 3,
    deviceFingerprint: 'DEV-INFINIX-HOT9-3C42',
    residentStatus: 'tetap',
    occupation: 'Mahasiswa / Relawan PMI',
    joinedAt: '2022-04-10',
  },
  keamanan_hansip: {
    id: 'usr-satpam-1',
    nik: '3201123456780005',
    noKk: '3201123456780095',
    name: 'Pak Agus Suparman (Hansip)',
    roleTier: 'tier1_akar_rumput',
    roleDetail: 'keamanan_hansip',
    tierLevel: 'tier1',
    roleTitle: 'Keamanan (Hansip / Pos Ronda Utama)',
    blockNumber: 'Pos Keamanan Gerbang Utama',
    alamat: 'Pos Keamanan Gerbang Utama, RT 04 / RW 09',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0857-1122-3344',
    emergencyContact: '0857-1122-3345',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 6,
    deviceFingerprint: 'DEV-OPPO-A15-88CD',
    residentStatus: 'tetap',
    occupation: 'Kepala Hansip / Satpam Lingkungan',
    joinedAt: '2018-06-01',
  },

  // --- TIER 2: PENGURUS RT, PAGUYUBAN & APARAT KEWILAYAHAN ---
  ketua_rt: {
    id: 'usr-rt-1',
    nik: '3201123456780002',
    noKk: '3201123456780098',
    name: 'Ir. H. Hendra Gunawan',
    roleTier: 'tier2_pengurus_rt',
    roleDetail: 'ketua_rt',
    tierLevel: 'tier2',
    jabatanTier2: 'rt',
    roleTitle: 'Ketua RT 04 (Hak Akses, Verifikasi & Kontrol SiagaQu)',
    blockNumber: 'Blok A1 No. 01',
    alamat: 'Jl. Melati Utama Blok A1 No. 01, RT 04 / RW 09',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0811-2233-4455',
    emergencyContact: '0811-2233-4456 (Ibu RT)',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 8,
    deviceFingerprint: 'DEV-REALME-C11-19EF',
    residentStatus: 'tetap',
    occupation: 'Wiraswasta / Ketua RT',
    joinedAt: '2019-01-10',
    masaJabatanStart: '2024-01-01',
    masaJabatanEnd: '2027-01-01',
    isMasaJabatanAktif: true,
    siagaQuAkses: 'aktif',
  },
  babinsa: {
    id: 'usr-babinsa-1',
    nik: '3201123456780055',
    noKk: '3201123456780055',
    name: 'Serma Suwandi (Babinsa)',
    roleTier: 'tier2_pengurus_rt',
    roleDetail: 'babinsa',
    tierLevel: 'tier2',
    jabatanTier2: 'babinsa',
    roleTitle: 'Babinsa TNI AD (Pembina Ketertiban Wilayah)',
    blockNumber: 'Koramil / Pos Babinsa',
    alamat: 'Kantor Koramil / Pos Binaan Babinsa RT 04',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0813-8899-7711',
    emergencyContact: '0813-8899-7712 (Piket Koramil)',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 2,
    deviceFingerprint: 'DEV-BABINSA-MIL-001X',
    residentStatus: 'tetap',
    occupation: 'Aparat Pembina Desa / TNI AD',
    joinedAt: '2022-01-15',
    masaJabatanStart: '2024-01-01',
    masaJabatanEnd: '2027-01-01',
    isMasaJabatanAktif: true,
    siagaQuAkses: 'aktif',
  },
  bhabinkamtibmas: {
    id: 'usr-bhabinkamtibmas-1',
    nik: '3201123456780066',
    noKk: '3201123456780066',
    name: 'Aipda Bambang Triyono (Bhabinkamtibmas)',
    roleTier: 'tier2_pengurus_rt',
    roleDetail: 'bhabinkamtibmas',
    tierLevel: 'tier2',
    jabatanTier2: 'bhabinkamtibmas',
    roleTitle: 'Bhabinkamtibmas POLRI (Keamanan & Ketertiban Masyarakat)',
    blockNumber: 'Polsek / Pos Polisi',
    alamat: 'Kantor Pos Polisi Pembina Kamtibmas Wilayah RT 04',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0812-7711-2233',
    emergencyContact: '110 (Call Center Polri)',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 3,
    deviceFingerprint: 'DEV-POLRI-KAMTIB-99P',
    residentStatus: 'tetap',
    occupation: 'Polri / Pembina Kamtibmas',
    joinedAt: '2021-08-10',
    masaJabatanStart: '2024-01-01',
    masaJabatanEnd: '2027-01-01',
    isMasaJabatanAktif: true,
    siagaQuAkses: 'aktif',
  },
  ketua_paguyuban: {
    id: 'usr-paguyuban-1',
    nik: '3201123456780008',
    noKk: '3201123456780092',
    name: 'Bpk. H. Mulyadi (Ketua Paguyuban)',
    roleTier: 'tier2_pengurus_rt',
    roleDetail: 'ketua_paguyuban',
    tierLevel: 'tier2',
    jabatanTier2: 'ketua_paguyuban',
    roleTitle: 'Ketua Paguyuban Warga (Hak Akses, Verifikasi & SiagaQu)',
    blockNumber: 'Blok C1 No. 03',
    alamat: 'Jl. Melati Indah Blok C1 No. 03, RT 04',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0811-9988-1122',
    emergencyContact: '0811-9988-1123',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 7,
    deviceFingerprint: 'DEV-XIAOMI-12T-77A1',
    residentStatus: 'tetap',
    occupation: 'Tokoh Masyarakat / Ketua Paguyuban',
    joinedAt: '2019-03-01',
    masaJabatanStart: '2024-01-01',
    masaJabatanEnd: '2027-01-01',
    isMasaJabatanAktif: true,
    siagaQuAkses: 'aktif',
  },
  wakil_rt: {
    id: 'usr-wakil-1',
    nik: '3201123456780007',
    noKk: '3201123456780093',
    name: 'Drs. Bambang Sudiro',
    roleTier: 'tier2_pengurus_rt',
    roleDetail: 'wakil_rt',
    tierLevel: 'tier2',
    jabatanTier2: 'wakil',
    roleTitle: 'Wakil Ketua RT / Paguyuban (Koordinator Lapangan)',
    blockNumber: 'Blok A2 No. 05',
    alamat: 'Jl. Melati Blok A2 No. 05, RT 04',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0812-9988-3344',
    emergencyContact: '0812-9988-3345',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 4,
    deviceFingerprint: 'DEV-OPPO-RENO-88B1',
    residentStatus: 'tetap',
    occupation: 'Pegawai BUMN',
    joinedAt: '2019-07-15',
    masaJabatanStart: '2024-01-01',
    masaJabatanEnd: '2027-01-01',
    isMasaJabatanAktif: true,
    siagaQuAkses: 'aktif',
  },
  sekretaris: {
    id: 'usr-sekretaris-1',
    nik: '3201123456780004',
    noKk: '3201123456780096',
    name: 'Ahmad Fauzi S.Kom',
    roleTier: 'tier2_pengurus_rt',
    roleDetail: 'sekretaris',
    tierLevel: 'tier2',
    jabatanTier2: 'sekretaris',
    roleTitle: 'Sekretaris RT (Admin Administrasi & Approval)',
    blockNumber: 'Blok B1 No. 08',
    alamat: 'Jl. Melati Blok B1 No. 08, RT 04',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0812-3344-5566',
    emergencyContact: '0812-3344-5567',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 5,
    deviceFingerprint: 'DEV-VIVO-Y12-44AE',
    residentStatus: 'tetap',
    occupation: 'Software Engineer',
    joinedAt: '2020-08-14',
    masaJabatanStart: '2024-01-01',
    masaJabatanEnd: '2027-01-01',
    isMasaJabatanAktif: true,
    siagaQuAkses: 'aktif',
  },
  bendahara: {
    id: 'usr-bendahara-1',
    nik: '3201123456780003',
    noKk: '3201123456780097',
    name: 'Dra. Hj. Nuraini M.Si',
    roleTier: 'tier2_pengurus_rt',
    roleDetail: 'bendahara',
    tierLevel: 'tier2',
    jabatanTier2: 'bendahara',
    roleTitle: 'Bendahara Paguyuban (Kas & Iuran Warga)',
    blockNumber: 'Blok B2 No. 05',
    alamat: 'Jl. Melati Blok B2 No. 05, RT 04',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'tervalidasi',
    phone: '0813-9988-7766',
    emergencyContact: '0813-9988-7767',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 4,
    deviceFingerprint: 'DEV-SAMSUNG-M11-92CD',
    residentStatus: 'tetap',
    occupation: 'Akuntan Publik',
    joinedAt: '2019-05-20',
    masaJabatanStart: '2024-01-01',
    masaJabatanEnd: '2027-01-01',
    isMasaJabatanAktif: true,
    siagaQuAkses: 'aktif',
  },
  pengurus_kadaluarsa: {
    id: 'usr-kadaluarsa-1',
    nik: '3201123456780009',
    noKk: '3201123456780091',
    name: 'Bpk. Yanto (Mantan Pengurus - Habis Jabatan)',
    roleTier: 'tier2_pengurus_rt',
    roleDetail: 'ketua_rt',
    tierLevel: 'tier2',
    jabatanTier2: 'rt',
    roleTitle: 'Mantan RT (Masa Jabatan Berakhir - Nonaktif Otomatis)',
    blockNumber: 'Blok D1 No. 09',
    alamat: 'Jl. Melati Blok D1 No. 09, RT 04',
    statusKependudukan: 'warga_asli',
    badgeValidasi: 'ditangguhkan',
    phone: '0813-7766-5544',
    emergencyContact: '0813-7766-5545',
    isVerified: true,
    verificationStatus: 'expired',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 0,
    guarantorUsedCount: 0,
    deviceFingerprint: 'DEV-MANTAN-RT-KADALUARSA',
    residentStatus: 'tetap',
    occupation: 'Pensiunan',
    joinedAt: '2015-01-01',
    masaJabatanStart: '2021-01-01',
    masaJabatanEnd: '2024-01-01', // Expired!
    isMasaJabatanAktif: false,
    siagaQuAkses: 'nonaktif',
  },

  // --- TIER 3: ADMINISTRASI MIKRO ---
  pengurus_rw: {
    id: 'usr-rw-1',
    nik: '3201123456780020',
    noKk: '3201123456780070',
    name: 'H. Sudrajat (Ketua RW 09)',
    roleTier: 'tier3_administrasi_mikro',
    roleDetail: 'pengurus_rw',
    roleTitle: 'Pengurus RW 09 (Tingkat Wilayah)',
    blockNumber: 'Kantor RW 09',
    phone: '0812-7788-9900',
    emergencyContact: '0812-7788-9901',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 9,
    deviceFingerprint: 'DEV-REDMI-8A-55BC',
    residentStatus: 'tetap',
    occupation: 'Tokoh Masyarakat',
    joinedAt: '2015-02-01',
  },
  lurah_kades: {
    id: 'usr-lurah-1',
    nik: '3201123456780006',
    noKk: '3201123456780094',
    name: 'Bambang Priyono S.STP (Lurah)',
    roleTier: 'tier3_administrasi_mikro',
    roleDetail: 'lurah_kades',
    roleTitle: 'Lurah Sukamaju (Administrasi Kelurahan)',
    blockNumber: 'Kantor Kelurahan Sukamaju',
    phone: '0812-9900-1122',
    emergencyContact: '0812-9900-1123',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 10,
    deviceFingerprint: 'DEV-GALAXY-A10-61FA',
    residentStatus: 'tetap',
    occupation: 'Aparatur Sipil Negara (Lurah)',
    joinedAt: '2017-01-01',
  },

  // --- TIER 4: PEMERINTAHAN ---
  camat: {
    id: 'usr-camat-1',
    nik: '3201123456780030',
    noKk: '3201123456780060',
    name: 'Drs. H. Mulyono M.AP (Camat)',
    roleTier: 'tier4_pemerintahan',
    roleDetail: 'camat',
    roleTitle: 'Camat Wilayah (Monitoring Pemerintahan)',
    blockNumber: 'Kantor Kecamatan',
    phone: '0811-9876-5432',
    emergencyContact: '0811-9876-5433',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 10,
    deviceFingerprint: 'DEV-SECURE-GOV-01',
    residentStatus: 'tetap',
    occupation: 'Aparatur Sipil Negara (Camat)',
    joinedAt: '2016-08-01',
  },

  // --- SPESIALIS: KURIR TRANSPORTASIQU ---
  kurir_transportasi: {
    id: 'usr-driver-1',
    nik: '3201123456780040',
    noKk: '3201123456780050',
    name: 'Kang Yanto (Driver TransportasiQu)',
    roleTier: 'tier1_akar_rumput',
    roleDetail: 'kurir_transportasiqu',
    roleTitle: 'Driver / Kurir Lokal TransportasiQu',
    blockNumber: 'Blok D1 No. 07',
    phone: '0858-9988-7711',
    emergencyContact: '0858-9988-7712',
    isVerified: true,
    verificationStatus: 'permanent_verified',
    witnessCount: 2,
    witnesses: [],
    guarantorMonthlyQuota: 10,
    guarantorUsedCount: 2,
    deviceFingerprint: 'DEV-MOTOR-REALME-C2-99',
    residentStatus: 'tetap',
    occupation: 'Driver & Kurir Lokal Warga',
    joinedAt: '2023-05-12',
  },
};

// Seed Buku Induk Warga
export const SEED_RESIDENTS: ResidentData[] = [
  {
    ...PRESET_USERS.warga_temporary,
    familyMembersCount: 4,
    gender: 'L',
    birthDate: '1985-05-12',
    religion: 'Islam',
    bloodType: 'O',
  },
  {
    ...PRESET_USERS.ketua_rt,
    familyMembersCount: 3,
    gender: 'L',
    birthDate: '1974-11-20',
    religion: 'Islam',
    bloodType: 'A',
  },
  {
    ...PRESET_USERS.bendahara,
    familyMembersCount: 4,
    gender: 'P',
    birthDate: '1978-03-14',
    religion: 'Islam',
    bloodType: 'B',
  },
  {
    ...PRESET_USERS.sekretaris,
    familyMembersCount: 2,
    gender: 'L',
    birthDate: '1992-09-08',
    religion: 'Islam',
    bloodType: 'AB',
  },
  {
    id: 'res-5',
    nik: '3201123456780010',
    noKk: '3201123456780080',
    name: 'H. Sutisna (Owner Bakso Qu)',
    roleTier: 'warga',
    roleDetail: 'warga',
    roleTitle: 'Pelaku Usaha UMKM Warga',
    blockNumber: 'Blok C1 No. 04',
    phone: '0812-3456-7890',
    emergencyContact: '0812-3456-7899',
    isVerified: true,
    residentStatus: 'tetap',
    occupation: 'Pengusaha Kuliner (Bakso Qu)',
    joinedAt: '2019-04-10',
    familyMembersCount: 5,
    gender: 'L',
    birthDate: '1970-02-18',
    religion: 'Islam',
    bloodType: 'O',
  },
  {
    id: 'res-6',
    nik: '3201123456780011',
    noKk: '3201123456780081',
    name: 'Siti Rahmawati',
    roleTier: 'warga',
    roleDetail: 'warga',
    roleTitle: 'Warga RT 04',
    blockNumber: 'Blok B3 No. 16',
    phone: '0819-0987-6543',
    emergencyContact: '0819-0987-6544',
    isVerified: true,
    residentStatus: 'kontrak',
    occupation: 'Guru SD',
    joinedAt: '2023-01-05',
    familyMembersCount: 2,
    gender: 'P',
    birthDate: '1995-12-01',
    religion: 'Islam',
    bloodType: 'B',
  },
  {
    id: 'res-7',
    nik: '3201123456780012',
    noKk: '3201123456780082',
    name: 'Joko Prabowo',
    roleTier: 'warga',
    roleDetail: 'warga',
    roleTitle: 'Warga RT 04 (Service AC)',
    blockNumber: 'Blok D2 No. 09',
    phone: '0852-4455-6677',
    emergencyContact: '0852-4455-6678',
    isVerified: true,
    residentStatus: 'tetap',
    occupation: 'Teknisi Elektronik & AC',
    joinedAt: '2020-03-22',
    familyMembersCount: 3,
    gender: 'L',
    birthDate: '1988-07-25',
    religion: 'Islam',
    bloodType: 'A',
  },
];

// Seed Feeds & Polls
export const SEED_FEEDS: FeedPost[] = [
  {
    id: 'feed-1',
    authorId: 'usr-rt-1',
    authorName: 'Ir. H. Hendra Gunawan (Ketua RT 04)',
    authorRole: 'Ketua RT / Primary Approver',
    postType: 'pengumuman',
    title: 'Pengumuman Resmi: Jadwal Kerja Bakti Akbar & Fogging DBD Menyambut Musim Hujan',
    content:
      'Assalamu’alaikum Wr. Wb. Seluruh warga RT 04 / RW 09 Graha Kencana. Mengingat curah hujan mulai meningkat, pengurus RT bersama Koordinator Lingkungan menjadwalkan kerja bakti massal pembersihan selokan dan saluran air serta pelaksanaan fogging nyamuk DBD pada hari Minggu pagi pukul 06.30 WIB di Balai Warga. Diharapkan perwakilan tiap rumah membawa peralatan kebersihan.',
    isPinned: true,
    createdAt: '2026-10-18T08:00:00Z',
    likes: 34,
    hasLiked: false,
    commentsCount: 12,
  },
  {
    id: 'feed-2',
    authorId: 'usr-rt-1',
    authorName: 'Pengurus RT 04',
    authorRole: 'Koordinator Lingkungan',
    postType: 'polling',
    title: 'Polling Suara Warga: Penambahan Lampu Penerangan Jalan (PJU) Solar Cell di Blok C & D',
    content:
      'Untuk mengoptimalkan keamanan malam hari dan penghematan listrik kas RT, kami mengajukan usulan pengadaan 8 titik lampu PJU Solar Cell otomatis di sepanjang gang Blok C dan D.',
    isPinned: false,
    createdAt: '2026-10-17T14:30:00Z',
    likes: 27,
    commentsCount: 8,
    pollData: {
      question: 'Apakah Anda menyetujui alokasi kas RT untuk 8 titik PJU Solar Cell otomatis?',
      options: [
        { id: 'opt-1', text: 'Setuju sekali, lingkungan jadi lebih terang & aman', votes: 42 },
        { id: 'opt-2', text: 'Setuju dengan catatan dicoba 4 titik dulu', votes: 11 },
        { id: 'opt-3', text: 'Perlu musyawarah offline terlebih dahulu', votes: 3 },
      ],
      userVotedOptionId: 'opt-1',
      totalVotes: 56,
    },
  },
  {
    id: 'feed-3',
    authorId: 'usr-warga-1',
    authorName: 'Budi Santoso',
    authorRole: 'Warga Blok C3',
    postType: 'diskusi',
    title: 'Prakarsa Bank Sampah & Pemilahan Sampah Organik Mandiri',
    content:
      'Bapak/Ibu sekalian, bagaimana jika kita mulai program pilah sampah anorganik (kardus, botol plastik) di balai warga setiap Sabtu ke-2? Hasil penjualannya bisa langsung disalurkan ke kas kegiatan pemuda RT.',
    isPinned: false,
    createdAt: '2026-10-16T19:15:00Z',
    likes: 18,
    commentsCount: 6,
  },
];

// Seed Agenda RT
export const SEED_AGENDA: AgendaEvent[] = [
  {
    id: 'agenda-1',
    title: 'Kerja Bakti Akbar & Fogging DBD Lingkungan',
    date: 'Minggu, 25 Okt 2026',
    time: '06:30 - 10:00 WIB',
    location: 'Titik Kumpul Balai Warga RT 04',
    description: 'Pembersihan saluran drainase utama, pemotongan dahan pohon rimbun, dan fogging nyamuk demam berdarah.',
    category: 'kerja_bakti',
    rsvpCount: { hadir: 38, tidak: 4 },
    userRsvp: 'hadir',
    isCompleted: false,
    presensiCode: 'QR-KB-20261025',
  },
  {
    id: 'agenda-2',
    title: 'Rapat Pleno Triwulan & Pertanggungjawaban Kas RT',
    date: 'Jumat, 30 Okt 2026',
    time: '19:30 - 21:30 WIB',
    location: 'Ruang Serbaguna Balai Warga & Hybrid Zoom',
    description: 'Penyampaian laporan realisasi kas periode Q3 2026 oleh Bendahara dan evaluasi keamanan ronda malam.',
    category: 'rapat',
    rsvpCount: { hadir: 29, tidak: 7 },
    userRsvp: undefined,
    isCompleted: false,
  },
  {
    id: 'agenda-3',
    title: 'Senam Sehat Bugar Bersama Warga & Lansia',
    date: 'Sabtu, 31 Okt 2026',
    time: '06:00 - 07:30 WIB',
    location: 'Lapangan Depan Pos Ronda Blok A',
    description: 'Senam aerobik bersama instruktur profesional dilanjutkan sarapan bubur kacang ijo gratis sumbangan warga.',
    category: 'senam',
    rsvpCount: { hadir: 45, tidak: 2 },
    userRsvp: 'hadir',
    isCompleted: false,
  },
];

// Seed Kas RT (Transparency ledger)
export const SEED_KAS: KasTransaction[] = [
  {
    id: 'kas-1',
    userId: 'usr-warga-1',
    userName: 'Budi Santoso',
    blockNumber: 'Blok C3 No. 12',
    type: 'iuran',
    title: 'Iuran Warga Periode Oktober 2026',
    amount: 50000,
    date: '2026-10-15',
    status: 'verified',
    category: 'Iuran Bulanan',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    ocrData: {
      bank: 'BCA Mobile',
      sender: 'BUDI SANTOSO',
      amount: 50000,
      transactionTime: '2026-10-15 08:32:10',
      matchScore: 99.4,
    },
  },
  {
    id: 'kas-2',
    userId: 'res-5',
    userName: 'H. Sutisna (Bakso Qu)',
    blockNumber: 'Blok C1 No. 04',
    type: 'iuran',
    title: 'Iuran Warga + Retribusi Kebersihan Usaha Okt 2026',
    amount: 150000,
    date: '2026-10-14',
    status: 'verified',
    category: 'Iuran & Retribusi Usaha',
  },
  {
    id: 'kas-3',
    userName: 'Pengurus RT 04 (Sie Lingkungan)',
    blockNumber: 'Pengurus',
    type: 'pengeluaran',
    title: 'Pembelian Cat Gapura & Lampu PJU Blok B',
    amount: 650000,
    date: '2026-10-12',
    status: 'verified',
    category: 'Pemeliharaan Fasum',
    notes: 'Nota toko bangunan No. TB-882 terlampir di arsip sekretariat.',
  },
  {
    id: 'kas-4',
    userName: 'Pengurus RT 04 (Sie Keamanan)',
    blockNumber: 'Pengurus',
    type: 'pengeluaran',
    title: 'Honorarium Petugas Satpam & Ronda Malam (3 Personel)',
    amount: 4500000,
    date: '2026-10-01',
    status: 'verified',
    category: 'Keamanan Lingkungan',
  },
  {
    id: 'kas-5',
    userId: 'res-6',
    userName: 'Siti Rahmawati',
    blockNumber: 'Blok B3 No. 16',
    type: 'iuran',
    title: 'Iuran Warga Periode Oktober 2026 (Pending Approval)',
    amount: 50000,
    date: '2026-10-19',
    status: 'pending',
    category: 'Iuran Bulanan',
    ocrData: {
      bank: 'Mandiri Livin',
      sender: 'SITI RAHMAWATI',
      amount: 50000,
      transactionTime: '2026-10-19 14:10:02',
      matchScore: 98.2,
    },
  },
];

// Seed Surat Pengantar Digital
export const SEED_LETTERS: SuratPengantar[] = [
  {
    id: 'surat-1',
    letterNumber: '04/SP-RT04/X/2026',
    userId: 'usr-warga-1',
    userName: 'Budi Santoso',
    nik: '3201123456780001',
    noKk: '3201123456780099',
    blockNumber: 'Blok C3 No. 12',
    type: 'skck',
    purpose: 'Pengurusan Perpanjangan SKCK di Polsek Sukamaju untuk Syarat Promosi Jabatan',
    status: 'approved',
    notes: 'Pemohon merupakan warga tetap yang berkelakuan baik dan tertib administrasi.',
    createdAt: '2026-10-14T09:00:00Z',
    approvedAt: '2026-10-14T11:20:00Z',
    approvedBy: 'Ir. H. Hendra Gunawan (Ketua RT 04)',
    digitalSignatureQr: 'VERIFIED-RT04-04-SP-RT04-X-2026-BUDI-SANTOSO',
  },
  {
    id: 'surat-2',
    letterNumber: '05/SP-RT04/X/2026',
    userId: 'res-6',
    userName: 'Siti Rahmawati',
    nik: '3201123456780011',
    noKk: '3201123456780081',
    blockNumber: 'Blok B3 No. 16',
    type: 'domisili',
    purpose: 'Surat Keterangan Domisili Tinggal Sementara untuk Keperluan Syarat Sertifikasi Guru',
    status: 'pending_ketua',
    notes: 'Sudah diverifikasi berkas KTP dan buku induk oleh Sekretaris. Menunggu tanda tangan Ketua RT.',
    createdAt: '2026-10-18T10:15:00Z',
  },
  {
    id: 'surat-3',
    letterNumber: '06/SP-RT04/X/2026',
    userId: 'res-7',
    userName: 'Joko Prabowo',
    nik: '3201123456780012',
    noKk: '3201123456780082',
    blockNumber: 'Blok D2 No. 09',
    type: 'izin_usaha',
    purpose: 'Pengantar Izin Usaha Mikro Jasa Service AC & Pendingin (NIB Online OSS)',
    status: 'pending_sekretaris',
    createdAt: '2026-10-19T07:45:00Z',
  },
];

// Seed UsahaQu (Local Businesses) with POS modules integrated
export const SEED_BUSINESSES: LocalBusiness[] = [
  {
    id: 'biz-proyekqu',
    name: 'UsahaQu - Proyek (Estimator & RAB Borongan)',
    category: 'jasa',
    ownerName: 'Mandor Supri & Paguyuban Proyek RT 04',
    blockNumber: 'Sentra Konstruksi & Workshop Blok E No. 05',
    phone: '0813-8899-0022',
    description: 'Manajemen Proyek Borongan & Estimasi RAB Akurat: Besi/Las, Furniture/Kayu, Aluminium, Renovasi Sipil, Pengeboran Lapangan, EO/Event/Sound, dan Web Design & Percetakan. Dilengkapi kalkulator volume (m², m\', m kedalaman, Ha, paket), rincian upah tukang, vendor material, serta pembayaran bertahap (DP -> Termin -> Pelunasan).',
    rating: 4.96,
    isPosActive: true,
    posModuleKey: 'proyekqu',
    badge: 'Modul Proyek & RAB',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
    products: [
      { id: 'pr-1', name: 'Estimasi RAB Kanopi & Pagar Las', price: 450000, unit: 'm²', description: 'Besi holo galvanis & atap alderon' },
      { id: 'pr-2', name: 'Kitchen Set Minimalis HPL Taco', price: 1850000, unit: "m'", description: 'Multiplek 18mm engsel slow motion' },
      { id: 'pr-3', name: 'Kusen & Jendela Aluminium 3-4 Inch', price: 120000, unit: "m'", description: 'Aluminium Alexindo / Dacon + kaca 5mm' },
      { id: 'pr-4', name: 'Pengeboran Sumur Air Bersih', price: 250000, unit: 'm', description: 'Pengeboran pipa PVC submersible hingga 40m' },
    ],
  },
  {
    id: 'biz-pelayananqu',
    name: 'PelayananQu (6 Sub-Kategori Layanan Jasa Warga)',
    category: 'jasa',
    ownerName: 'Bang Dani & Komunitas Jasa Warga RT 04',
    blockNumber: 'Sentra Servis & Jasa Blok D2 No. 03',
    phone: '0812-9988-7711',
    description: 'Pusat kasir & manajemen 6 Sub-Kategori Usaha Layanan Akar Rumput: Servis & Bengkel, Barbershop & Salon, Laundry & Cuci, Penjahit & Permak, Rental & Sewa, serta Jasa Panggilan & Tukang AC. Dilengkapi cetak struk nota thermal 58mm & integrasi WhatsApp.',
    rating: 4.97,
    isPosActive: true,
    posModuleKey: 'pelayananqu',
    badge: 'Unit Usaha JasaQu',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
    products: [
      { id: 'pj-1', name: 'Servis Ringan / Elektronik', price: 45000, unit: 'layanan', description: 'Pemeriksaan & perbaikan unit elektronik' },
      { id: 'pj-2', name: 'Paket Cukur Dewasa + Styling', price: 20000, unit: 'orang', description: 'Potong rapi, cuci rambut & pomade' },
      { id: 'pj-3', name: 'Cuci Komplit Kiloan (Reguler/Express)', price: 7000, unit: 'kg', description: 'Bersih wangi higienis 1-2 hari selesai' },
      { id: 'pj-4', name: 'Permak & Jahit Pakaian Warga', price: 15000, unit: 'pcs', description: 'Potong celana, ganti resleting & kancing' },
      { id: 'pj-5', name: 'Rental Alat / Terop / Genset', price: 100000, unit: 'hari', description: 'Sewa perlengkapan hajatan warga' },
      { id: 'pj-6', name: 'Jasa Tukang & Cuci AC Rumah', price: 65000, unit: 'unit', description: 'Pembersihan filter, evaporator & cek freon' },
    ],
  },
  {
    id: 'biz-kulinerqu',
    name: 'KulinerQu (Kios, Mangkal & Keliling)',
    category: 'kuliner',
    ownerName: 'Pakde Warno & Paguyuban Gerobak',
    blockNumber: 'Sentra Kuliner Blok C No. 08',
    phone: '0812-3344-5566',
    description: 'Sistem POS Kasir Cepat Kuliner: Kios/Ruko (Hold Order Meja), Mangkal/Gerobak (Preset Porsi & Uang Pas), dan Keliling/Asongan (Simulasi Suara & Sisa Porsi).',
    rating: 4.92,
    isPosActive: true,
    posModuleKey: 'kulinerqu',
    badge: 'POS Kuliner Offline',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
    products: [
      { id: 'pk-1', name: 'Paket Porsi Biasa', price: 15000, unit: 'porsi', description: 'Porsi standar komplit' },
      { id: 'pk-2', name: 'Paket Porsi Jumbo + Telur', price: 22000, unit: 'porsi', description: 'Porsi ekstra kenyang' },
      { id: 'pk-3', name: 'Es Teh Manis Segar', price: 5000, unit: 'gelas', description: 'Teh melati seduh dingin' },
    ],
  },
  {
    id: 'biz-transportasiqu',
    name: 'TransportasiQu (Angkutan, Kurir & Carter)',
    category: 'jasa',
    ownerName: 'Bang Joko & Paguyuban Driver RT 04',
    blockNumber: 'Pangkalan Pos Blok B',
    phone: '0813-7788-9900',
    description: 'Manajemen 6 Sub-Kategori Transportasi & Logistik: Ojek & Penumpang, Angkot & Bus Kota, Angkut Barang & Kurir, Travel & Carter, Towing & Storing, serta Jastip Belanja.',
    rating: 4.94,
    isPosActive: true,
    posModuleKey: 'transportasiqu',
    badge: 'Logistik & Angkutan',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500',
    products: [
      { id: 'pt-1', name: 'Tarif Ojek Zona 1 (< 3 KM)', price: 10000, unit: 'trip', description: 'Antar jemput warga dalam lingkungan' },
      { id: 'pt-2', name: 'Angkut Barang Pickup / Rit', price: 85000, unit: 'rit', description: 'Sewa mobil pickup pindahan/belanja' },
      { id: 'pt-3', name: 'Jasa Kuli Angkut / Bongkar', price: 35000, unit: 'orang', description: 'Bantuan tenaga angkat barang' },
    ],
  },
  {
    id: 'biz-baksoqu',
    name: 'Bakso Qu 1.0 (Unit Usaha Unggulan)',
    category: 'kuliner',
    ownerName: 'H. Sutisna (Warga Blok C1)',
    blockNumber: 'Blok C1 No. 04 / Ruko Barat',
    phone: '0812-3456-7890',
    description: 'Spesialis Bakso Urat & Daging Sapi 100% Pilihan Asli dengan Kuah Rempah Istimewa. Dilengkapi Sistem Kasir POS Mandiri, Meja Interaktif, Cetak Thermal Bluetooth 58mm/80mm, & Stok Bahan.',
    rating: 4.9,
    isPosActive: true,
    posModuleKey: 'baksoqu',
    badge: 'POS Terintegrasi',
    imageUrl: baksoUratImg,
    products: [
      { id: 'p-1', name: 'Bakso Urat Jumbo Super', price: 25000, unit: 'porsi', description: 'Bakso urat jumbo kenyal dengan kuah kaldu sapi kaya rempah' },
      { id: 'p-2', name: 'Bakso Komplit Telur', price: 28000, unit: 'porsi', description: 'Bakso telur ayam utuh + pangsit goreng renyah + tahu' },
      { id: 'p-3', name: 'Es Teh Manis Melati Solo', price: 5000, unit: 'gelas', description: 'Teh melati seduh harum gula asli' },
    ],
  },
  {
    id: 'biz-bengkelqu',
    name: 'BengkelQu (Bengkel Motor & Asisten Pintar)',
    category: 'otomotif',
    ownerName: 'Mas Yanto & Tim Montir (Warga Blok D1)',
    blockNumber: 'Blok D1 No. 01 / Samping Pos',
    phone: '0812-8877-6655',
    description: 'Pusat Servis Injeksi, Tune Up, Perawatan CVT, Ganti Oli, & Suku Cadang Motor Resmi. Dilengkapi Smart Service Estimator, Ceklis Fisik, WA Template Generator, & Asisten Pintar AI BengkelQu (100% Gratis).',
    rating: 4.95,
    isPosActive: true,
    posModuleKey: 'bengkelqu',
    badge: 'Unit Terintegrasi 100% Gratis',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500',
    products: [
      { id: 'bp-1', name: 'Jasa Servis Ringan & Tune Up Injeksi', price: 45000, unit: 'servis', description: 'Cek 10 poin keselamatan & reset injeksi' },
      { id: 'bp-2', name: 'Servis CVT + Greasing Hi-Temp', price: 35000, unit: 'servis', description: 'Bersih rumah roller & pulley anti gredek' },
      { id: 'bp-3', name: 'Paket Ganti Oli MPX2 + Oli Gardan', price: 70000, unit: 'paket', description: 'Bundling hemat oli mesin & transmisi' },
    ],
  },
  {
    id: 'biz-klinikqu',
    name: 'KlinikQu (Faskes & Layanan Medis Warga)',
    category: 'kesehatan',
    ownerName: 'dr. Farhan Malik, Sp.PD (Warga Blok B2)',
    blockNumber: 'Blok B2 No. 05 / Balai Medis',
    phone: '0812-7788-9900',
    description: 'Pusat Layanan Kesehatan Warga, Dokter Umum, Tindakan Medis Injeksi, Terapi Infus, Cek Laboratorium Kolesterol & Gula Darah, serta Rekam Medis Terpadu RT 04. Dilengkapi Kasir Medis Minimalis & Struk Cetak Thermal Bluetooth.',
    rating: 4.98,
    isPosActive: true,
    posModuleKey: 'klinikqu',
    badge: 'Layanan Medis Warga',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500',
    products: [
      { id: 'kp-1', name: 'Pemeriksaan Dokter Umum', price: 75000, unit: 'sesi', description: 'Konsultasi dan diagnosa awal pasien' },
      { id: 'kp-2', name: 'Tindakan Injeksi / Suntik', price: 35000, unit: 'tindakan', description: 'Pemberian obat injeksi medis' },
      { id: 'kp-3', name: 'Pemasangan Infus', price: 120000, unit: 'sesi', description: 'Terapi hidrasi cairan infus' },
      { id: 'kp-4', name: 'Cek Kolesterol', price: 30000, unit: 'tes', description: 'Pemeriksaan darah kapiler stik' },
      { id: 'kp-5', name: 'Cek Gula Darah', price: 20000, unit: 'tes', description: 'Tes kadar glukosa darah instan' },
      { id: 'kp-6', name: 'Nebulizer (Uap)', price: 65000, unit: 'terapi', description: 'Terapi melegakan pernafasan' },
    ],
  },
  {
    id: 'biz-sembako',
    name: 'RitelQu - Warung Berkah Sembako Bu RT',
    category: 'sembako',
    ownerName: 'Ibu Hj. Hendra (Warga Blok A1)',
    blockNumber: 'Blok A1 No. 02',
    phone: '0813-8822-1100',
    description: 'Penyedia kebutuhan sembako & kelontong warga: minyak goreng 2L, beras premium 5kg, gula pasir, mie instan dus, telur ayam, tabung gas 3kg, dan galon air mineral. Terintegrasi POS Kasir RitelQu & manajemen stok.',
    rating: 4.88,
    isPosActive: true,
    posModuleKey: 'ritelqu',
    badge: 'Toko Kelontong & POS',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500',
    products: [
      { id: 'p-4', name: 'Minyak Goreng 2L Pouch', price: 34000, unit: 'pouch', description: 'Minyak goreng sawit jernih 2x penyaringan' },
      { id: 'p-5', name: 'Beras Premium 5KG', price: 72500, unit: 'sak', description: 'Beras pulen wangi kualitas super' },
      { id: 'p-6', name: 'Gula Pasir 1KG', price: 17000, unit: 'pcs', description: 'Gula pasir tebu asli kristal putih' },
      { id: 'p-7', name: 'Mie Instan Goreng (Karton)', price: 112000, unit: 'dus', description: 'Mie instan sedap 1 karton isi 40' },
    ],
  },
  {
    id: 'biz-laundry',
    name: 'Berkah Express Laundry & Dry Clean (PelayananQu)',
    category: 'laundry',
    ownerName: 'Mbak Dewi (Warga Blok B2)',
    blockNumber: 'Blok B2 No. 11',
    phone: '0858-7711-2299',
    description: 'Jasa cuci kiloan harum higienis 1 hari selesai, cuci selimut/bedcover, setrika uap rapi tanpa kusut. Sub-kategori Laundry PelayananQu.',
    rating: 4.85,
    isPosActive: true,
    posModuleKey: 'pelayananqu',
    badge: 'PelayananQu Laundry',
    imageUrl: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=500',
    products: [
      { id: 'p-7', name: 'Cuci Setrika Reguler 2 Hari', price: 7000, unit: 'kg', description: 'Pakaian wangi rapi terbungkus plastik sealer' },
      { id: 'p-8', name: 'Cuci Kilat Express 5 Jam Jadi', price: 12000, unit: 'kg', description: 'Layanan darurat cepat kering dan setrika langsung' },
      { id: 'p-9', name: 'Cuci Bedcover Jumbo', price: 25000, unit: 'pcs', description: 'Pembersihan mendalam anti tungau' },
    ],
  },
  {
    id: 'biz-service',
    name: 'Jaya Teknik Service AC & Kulkas (PelayananQu)',
    category: 'jasa',
    ownerName: 'Pak Joko Prabowo (Warga Blok D2)',
    blockNumber: 'Blok D2 No. 09',
    phone: '0852-4455-6677',
    description: 'Servis panggilan spesialis pendingin rumah tangga: cuci AC split, tambah freon R32/R410, perbaikan modul inverter, dan servis kulkas. Sub-kategori Servis PelayananQu.',
    rating: 4.95,
    isPosActive: true,
    posModuleKey: 'pelayananqu',
    badge: 'PelayananQu Servis',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
    products: [
      { id: 'p-10', name: 'Cuci AC Split Standar 0.5 - 1 PK', price: 65000, unit: 'unit', description: 'Cuci evaporator indoor, pembersihan outdoor, dan cek tekanan' },
      { id: 'p-11', name: 'Isi / Tambah Freon R32 Ramah Lingkungan', price: 120000, unit: 'layanan', description: 'Freon murni optimalisasi pendinginan maksimal' },
    ],
  },
];

// Seed SiagaQu (Internal Security, Patroli, Checkpoints, & CCTV)
export const SEED_CHECKPOINTS: PatrolCheckpoint[] = [
  {
    id: 'cp-1',
    code: 'CP-POS-UTAMA',
    name: 'Pos Keamanan & Gerbang Utama',
    locationDesc: 'Pintu gerbang portal utama depan akses masuk perumahan',
    lastScannedAt: '2026-10-19T21:15:00Z',
    lastScannedBy: 'Pak Agus Suparman (Satpam)',
    status: 'safe',
  },
  {
    id: 'cp-2',
    code: 'CP-BLOK-A',
    name: 'Sudut Perumahan Blok A (Belakang Taman)',
    locationDesc: 'Pertigaan tiang PJU Blok A dekat rumah Ketua RT',
    lastScannedAt: '2026-10-19T21:40:00Z',
    lastScannedBy: 'Pak Agus Suparman (Satpam)',
    status: 'safe',
  },
  {
    id: 'cp-3',
    code: 'CP-BLOK-C',
    name: 'Area Drainase & Fasum Blok C',
    locationDesc: 'Samping Balai Warga & Lapangan Badminton RT 04',
    lastScannedAt: '2026-10-19T22:05:00Z',
    lastScannedBy: 'Pak Agus Suparman (Satpam)',
    status: 'safe',
  },
  {
    id: 'cp-4',
    code: 'CP-PINTU-BELAKANG',
    name: 'Pintu Keluar Belakang Blok D',
    locationDesc: 'Pintu besi batas perkampungan luar (wajib dikunci jam 22.00)',
    lastScannedAt: '2026-10-19T22:20:00Z',
    lastScannedBy: 'Pak Agus Suparman (Satpam)',
    status: 'safe',
  },
];

export const SEED_PATROL_LOGS: PatrolLog[] = [
  {
    id: 'pl-1',
    officerId: 'usr-satpam-1',
    officerName: 'Pak Agus Suparman',
    checkpointCode: 'CP-POS-UTAMA',
    checkpointName: 'Pos Keamanan & Gerbang Utama',
    condition: 'safe',
    timestamp: '2026-10-19T21:15:00Z',
    notes: 'Portal tertutup rapi, arus keluar masuk kendaraan tamu terdata dengan baik.',
  },
  {
    id: 'pl-2',
    officerId: 'usr-satpam-1',
    officerName: 'Pak Agus Suparman',
    checkpointCode: 'CP-BLOK-A',
    checkpointName: 'Sudut Perumahan Blok A',
    condition: 'safe',
    timestamp: '2026-10-19T21:40:00Z',
    notes: 'Suasana tenang, kendaraan warga terparkir aman di carport masing-masing.',
  },
  {
    id: 'pl-3',
    officerId: 'usr-satpam-1',
    officerName: 'Pak Agus Suparman',
    checkpointCode: 'CP-BLOK-C',
    checkpointName: 'Area Drainase & Fasum Blok C',
    condition: 'safe',
    timestamp: '2026-10-19T22:05:00Z',
    notes: 'Penerangan cukup, lampu balai warga padam sesuai jadwal hemat energi.',
  },
];

// Seed Musibah & Dompet Solidaritas Digital
export const SEED_MUSIBAH: MusibahItem[] = [
  {
    id: 'msb-1',
    title: 'Berita Duka Cita (Lelayu): Telah Berpulang Bapak H. Sudirman',
    victimFamily: 'Keluarga Besar Alm. Bpk H. Sudirman',
    blockNumber: 'Blok B1 No. 04',
    date: '18 Oktober 2026',
    type: 'kematian',
    description:
      'Innalillahi wa inna ilaihi raji’un. Telah berpulang ke rahmatullah tetangga kita Bpk. H. Sudirman (68 th) pada hari Minggu pukul 04.30 WIB di RSUD. Jenazah telah disemayamkan di rumah duka dan dimakamkan di TPU Karanganyar. Mohon doa keikhlasan dari seluruh warga RT 04.',
    donationTarget: 5000000,
    donationCollected: 4850000,
    isUrgent: true,
    donators: [
      { id: 'dn-1', name: 'Budi Santoso', amount: 200000, time: '18 Okt, 08:30', block: 'Blok C3' },
      { id: 'dn-2', name: 'Ir. H. Hendra Gunawan', amount: 500000, time: '18 Okt, 09:15', block: 'Blok A1' },
      { id: 'dn-3', name: 'H. Sutisna (Bakso Qu)', amount: 1000000, time: '18 Okt, 10:00', block: 'Blok C1' },
      { id: 'dn-4', name: 'Kas Paguyuban RT 04 (Alokasi Duka)', amount: 1500000, time: '18 Okt, 10:30', block: 'Kas RT' },
      { id: 'dn-5', name: 'Dra. Hj. Nuraini', amount: 300000, time: '18 Okt, 11:45', block: 'Blok B2' },
      { id: 'dn-6', name: 'Joko Prabowo', amount: 150000, time: '18 Okt, 13:20', block: 'Blok D2' },
      { id: 'dn-7', name: 'Hamba Allah (Warga Blok B)', amount: 200000, time: '18 Okt, 15:10', block: 'Blok B' },
      { id: 'dn-8', name: 'Siti Rahmawati', amount: 100000, time: '18 Okt, 16:40', block: 'Blok B3' },
    ],
  },
];

export const SEED_PIKET: PiketTask[] = [
  {
    id: 'pkt-1',
    musibahId: 'msb-1',
    taskType: 'takziah',
    assignedFamily: 'Keluarga Bpk. Hendra (Blok A1) & Bpk. Budi (Blok C3)',
    blockNumber: 'Blok A & C',
    shiftTime: 'Malam ke-1 s/d ke-3 (19:30 WIB)',
    isDone: true,
  },
  {
    id: 'pkt-2',
    musibahId: 'msb-1',
    taskType: 'konsumsi_tenda',
    assignedFamily: 'Ibu-ibu Dawis Melati Blok B (Sie Konsumsi)',
    blockNumber: 'Blok B',
    shiftTime: 'Persiapan konsumsi tahlilan harian',
    isDone: true,
  },
  {
    id: 'pkt-3',
    musibahId: 'msb-1',
    taskType: 'keamanan_parkir',
    assignedFamily: 'Petugas Satpam Pos & Pemuda Karang Taruna',
    blockNumber: 'Gerbang Masuk',
    shiftTime: 'Pengaturan parkir pelayat mobil & motor',
    isDone: true,
  },
  {
    id: 'pkt-4',
    musibahId: 'msb-1',
    taskType: 'takziah',
    assignedFamily: 'Keluarga Bpk. Joko (Blok D2) & Warga Blok D',
    blockNumber: 'Blok D',
    shiftTime: 'Malam ke-7 Doa Bersama (24 Okt)',
    isDone: false,
  },
];

// AppQu Storage Service
export const AppQuStorageService = {
  // Evaluasi dan perbarui masa jabatan Tier 2 secara otomatis
  checkAndUpdateMasaJabatan(user: UserProfile): UserProfile {
    if (!user) return user;
    const isTier2 =
      user.tierLevel === 'tier2' ||
      user.roleTier === 'tier2_pengurus_rt' ||
      user.roleTier === 'pengurus' ||
      user.roleTier === 'governance';

    if (isTier2 && user.masaJabatanEnd) {
      const endTimestamp = new Date(user.masaJabatanEnd).getTime();
      const nowTimestamp = Date.now();
      const isExpired = endTimestamp < nowTimestamp;

      return {
        ...user,
        isMasaJabatanAktif: !isExpired,
        badgeValidasi: isExpired ? 'ditangguhkan' : user.badgeValidasi || 'tervalidasi',
        siagaQuAkses: isExpired ? 'ditangguhkan' : user.siagaQuAkses || 'aktif',
      };
    }
    return user;
  },

  // Evaluasi kelayakan akses & aktivasi SiagaQu (Min 2 Warga & 30 Hari < 10 Warga)
  getSiagaQuEligibility(currentUser: UserProfile, residents: ResidentData[]): {
    canActivate: boolean;
    isSuspended: boolean;
    activeWargaCount: number;
    reason: string;
    canToggle: boolean;
  } {
    const activeWargaCount = residents ? residents.length : 0;
    const isOfficer =
      currentUser.jabatanTier2 === 'rt' ||
      currentUser.jabatanTier2 === 'ketua_paguyuban' ||
      currentUser.roleDetail === 'ketua_rt' ||
      currentUser.roleDetail === 'ketua_paguyuban';

    // Cek masa jabatan Tier 2
    if (currentUser.tierLevel === 'tier2' && currentUser.isMasaJabatanAktif === false) {
      return {
        canActivate: false,
        isSuspended: true,
        activeWargaCount,
        reason: 'Masa jabatan pengurus telah berakhir. Hak akses SiagaQu dinonaktifkan otomatis.',
        canToggle: false,
      };
    }

    // Syarat 1: Minimal 2 akun warga binaan terdaftar
    if (activeWargaCount < 2) {
      return {
        canActivate: false,
        isSuspended: true,
        activeWargaCount,
        reason: 'RT / Ketua Paguyuban butuh minimal 2 akun warga terdaftar sebelum SiagaQu dapat diaktifkan.',
        canToggle: false,
      };
    }

    // Syarat 2: Jika 30 hari warga kurang dari 10, status temporer / ditangguhkan
    // Cek durasi joinedAt atau simulasi 30 hari
    const daysSinceJoined = currentUser.joinedAt
      ? Math.floor((Date.now() - new Date(currentUser.joinedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 35; // Default simulasi wilayah telah aktif > 30 hari

    if (daysSinceJoined >= 30 && activeWargaCount < 10) {
      return {
        canActivate: false,
        isSuspended: true,
        activeWargaCount,
        reason: `Status Temporer: Wilayah telah berjalan ${daysSinceJoined} hari namun jumlah warga baru ${activeWargaCount} (kurang dari 10). Hak akses SiagaQu ditangguhkan sampai warga minimal 10 orang.`,
        canToggle: false,
      };
    }

    // Syarat terpenuhi
    return {
      canActivate: true,
      isSuspended: false,
      activeWargaCount,
      reason: isOfficer
        ? `Syarat terpenuhi (${activeWargaCount} warga aktif). RT/Paguyuban memiliki wewenang penuh mengaktifkan/menonaktifkan SiagaQu.`
        : `SiagaQu aktif untuk seluruh warga wilayah RT 04.`,
      canToggle: isOfficer,
    };
  },

  // Kompresi otomatis foto / selfie via Canvas (hemat storage & kuota)
  async compressImageClient(
    file: File,
    maxWidth = 480,
    maxHeight = 480,
    quality = 0.72
  ): Promise<{ dataUrl: string; originalSize: number; compressedSize: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              dataUrl: e.target?.result as string,
              originalSize: file.size,
              compressedSize: file.size,
            });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          // Estimasi ukuran byte dataUrl: (panjang string * 3/4)
          const approxBytes = Math.round((dataUrl.length * 3) / 4);

          resolve({
            dataUrl,
            originalSize: file.size,
            compressedSize: approxBytes,
          });
        };
        img.onerror = () => reject(new Error('Gagal memproses gambar foto.'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file foto.'));
      reader.readAsDataURL(file);
    });
  },

  getCurrentUser(): UserProfile {
    const fallbackUser: UserProfile =
      PRESET_USERS.warga ||
      PRESET_USERS.warga_temporary ||
      Object.values(PRESET_USERS)[0];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!raw) {
        const checked = this.checkAndUpdateMasaJabatan(fallbackUser);
        this.saveCurrentUser(checked);
        return checked;
      }
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.name && parsed.roleTier) {
        return this.checkAndUpdateMasaJabatan(parsed);
      }
      const checked = this.checkAndUpdateMasaJabatan(fallbackUser);
      this.saveCurrentUser(checked);
      return checked;
    } catch {
      return this.checkAndUpdateMasaJabatan(fallbackUser);
    }
  },

  saveCurrentUser(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  getResidents(): ResidentData[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RESIDENTS);
    if (!raw) {
      this.saveResidents(SEED_RESIDENTS);
      return SEED_RESIDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_RESIDENTS;
    }
  },

  saveResidents(list: ResidentData[]): void {
    localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(list));
  },

  getFeeds(): FeedPost[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDS);
    if (!raw) {
      this.saveFeeds(SEED_FEEDS);
      return SEED_FEEDS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_FEEDS;
    }
  },

  saveFeeds(feeds: FeedPost[]): void {
    localStorage.setItem(STORAGE_KEYS.FEEDS, JSON.stringify(feeds));
  },

  getAgenda(): AgendaEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AGENDA);
    if (!raw) {
      this.saveAgenda(SEED_AGENDA);
      return SEED_AGENDA;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_AGENDA;
    }
  },

  saveAgenda(agenda: AgendaEvent[]): void {
    localStorage.setItem(STORAGE_KEYS.AGENDA, JSON.stringify(agenda));
  },

  getKas(): KasTransaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.KAS);
    if (!raw) {
      this.saveKas(SEED_KAS);
      return SEED_KAS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_KAS;
    }
  },

  saveKas(kas: KasTransaction[]): void {
    localStorage.setItem(STORAGE_KEYS.KAS, JSON.stringify(kas));
  },

  getLetters(): SuratPengantar[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LETTERS);
    if (!raw) {
      this.saveLetters(SEED_LETTERS);
      return SEED_LETTERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_LETTERS;
    }
  },

  saveLetters(letters: SuratPengantar[]): void {
    localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(letters));
  },

  getBusinesses(): LocalBusiness[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (!raw) {
      this.saveBusinesses(SEED_BUSINESSES);
      return SEED_BUSINESSES;
    }
    try {
      const stored: LocalBusiness[] = JSON.parse(raw);
      // Ensure seed businesses like PelayananQu, KulinerQu, TransportasiQu exist
      const missing = SEED_BUSINESSES.filter(
        (seed) => !stored.some((b) => b.id === seed.id || (seed.posModuleKey && b.posModuleKey === seed.posModuleKey))
      );
      if (missing.length > 0) {
        const merged = [...missing, ...stored];
        this.saveBusinesses(merged);
        return merged;
      }
      return stored;
    } catch {
      return SEED_BUSINESSES;
    }
  },

  saveBusinesses(list: LocalBusiness[]): void {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(list));
  },

  getCheckpoints(): PatrolCheckpoint[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
    if (!raw) {
      this.saveCheckpoints(SEED_CHECKPOINTS);
      return SEED_CHECKPOINTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_CHECKPOINTS;
    }
  },

  saveCheckpoints(list: PatrolCheckpoint[]): void {
    localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(list));
  },

  getPatrolLogs(): PatrolLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PATROL_LOGS);
    if (!raw) {
      this.savePatrolLogs(SEED_PATROL_LOGS);
      return SEED_PATROL_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_PATROL_LOGS;
    }
  },

  savePatrolLogs(list: PatrolLog[]): void {
    localStorage.setItem(STORAGE_KEYS.PATROL_LOGS, JSON.stringify(list));
  },

  getMusibah(): MusibahItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MUSIBAH);
    if (!raw) {
      this.saveMusibah(SEED_MUSIBAH);
      return SEED_MUSIBAH;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_MUSIBAH;
    }
  },

  saveMusibah(list: MusibahItem[]): void {
    localStorage.setItem(STORAGE_KEYS.MUSIBAH, JSON.stringify(list));
  },

  getPiket(): PiketTask[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PIKET);
    if (!raw) {
      this.savePiket(SEED_PIKET);
      return SEED_PIKET;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_PIKET;
    }
  },

  savePiket(list: PiketTask[]): void {
    localStorage.setItem(STORAGE_KEYS.PIKET, JSON.stringify(list));
  },

  // AreaQu Points & Digital Stall
  getAreaPoints(): AreaPoint[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AREA_POINTS);
    if (!raw) {
      this.saveAreaPoints(SEED_AREA_POINTS);
      return SEED_AREA_POINTS;
    }
    try {
      const parsed: AreaPoint[] = JSON.parse(raw);
      // Auto-migrate if stored points are using old coordinates
      if (parsed.length > 0 && Math.abs(parsed[0].lat - (-7.7956)) < 0.1) {
        this.saveAreaPoints(SEED_AREA_POINTS);
        return SEED_AREA_POINTS;
      }
      return parsed;
    } catch {
      return SEED_AREA_POINTS;
    }
  },

  saveAreaPoints(points: AreaPoint[]): void {
    localStorage.setItem(STORAGE_KEYS.AREA_POINTS, JSON.stringify(points));
  },

  // TransportasiQu Couriers
  getCouriers(): TransportasiCourier[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COURIERS);
    if (!raw) {
      this.saveCouriers(SEED_COURIERS);
      return SEED_COURIERS;
    }
    try {
      const parsed: TransportasiCourier[] = JSON.parse(raw);
      // Auto-migrate if stored couriers are using old coordinates
      if (parsed.length > 0 && Math.abs(parsed[0].lat - (-7.7954)) < 0.1) {
        this.saveCouriers(SEED_COURIERS);
        return SEED_COURIERS;
      }
      return parsed;
    } catch {
      return SEED_COURIERS;
    }
  },

  saveCouriers(couriers: TransportasiCourier[]): void {
    localStorage.setItem(STORAGE_KEYS.COURIERS, JSON.stringify(couriers));
  },

  // Pending Resident Approvals (Chain of Trust)
  getPendingVerifications(): PendingVerificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_VERIFICATIONS);
    if (!raw) {
      this.savePendingVerifications(SEED_PENDING_VERIFICATIONS);
      return SEED_PENDING_VERIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_PENDING_VERIFICATIONS;
    }
  },

  savePendingVerifications(items: PendingVerificationItem[]): void {
    localStorage.setItem(STORAGE_KEYS.PENDING_VERIFICATIONS, JSON.stringify(items));
  },

  // SOS Ephemeral Room
  getSosRoom(): SOSEphemeralRoom {
    const raw = localStorage.getItem(STORAGE_KEYS.SOS_ROOM);
    if (!raw) {
      this.saveSosRoom(SEED_SOS_ROOM);
      return SEED_SOS_ROOM;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_SOS_ROOM;
    }
  },

  saveSosRoom(room: SOSEphemeralRoom): void {
    localStorage.setItem(STORAGE_KEYS.SOS_ROOM, JSON.stringify(room));
  },

  // ==========================================
  // PUSAT PEMULIHAN DATA (BACKUP, RESTORE & RESET)
  // ==========================================
  exportAllDataJson(): string {
    const backupObj: Record<string, any> = {
      app: 'AppQu Ecosystem',
      version: '1.2.2',
      exportedAt: new Date().toISOString(),
      data: {},
    };

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('appqu_') || key.startsWith('baksoqu_'))) {
          try {
            const val = localStorage.getItem(key);
            if (val !== null) {
              backupObj.data[key] = JSON.parse(val);
            }
          } catch {
            backupObj.data[key!] = localStorage.getItem(key);
          }
        }
      }
    } catch (e) {
      console.warn('Backup export error:', e);
    }
    return JSON.stringify(backupObj, null, 2);
  },

  importAllDataJson(jsonString: string): { success: boolean; keysCount: number; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object' || !parsed.data) {
        return {
          success: false,
          keysCount: 0,
          message: 'Format file tidak valid. Pastikan file adalah hasil cadangan (backup) resmi AppQu.',
        };
      }
      const data = parsed.data;
      let count = 0;
      for (const key of Object.keys(data)) {
        if (key.startsWith('appqu_') || key.startsWith('baksoqu_')) {
          const val = data[key];
          localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
          count++;
        }
      }
      return {
        success: true,
        keysCount: count,
        message: `Berhasil memulihkan ${count} modul data aplikasi AppQu.`,
      };
    } catch (err: any) {
      return {
        success: false,
        keysCount: 0,
        message: 'Gagal memproses file cadangan JSON: ' + (err?.message || 'Format rusak'),
      };
    }
  },

  factoryResetAllData(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('appqu_') || key.startsWith('baksoqu_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },

  // ==========================================
  // USAHAQU - PROYEK (PROYEKQU) STORAGE METHODS
  // ==========================================
  getProyekProjects(): ProyekRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROYEK_PROJECTS);
    if (!raw) {
      this.saveProyekProjects(SEED_PROYEK_PROJECTS);
      return SEED_PROYEK_PROJECTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_PROYEK_PROJECTS;
    }
  },

  saveProyekProjects(projects: ProyekRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.PROYEK_PROJECTS, JSON.stringify(projects));
  },

  getProyekExpenses(): VendorTukangExpense[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROYEK_EXPENSES);
    if (!raw) {
      this.saveProyekExpenses(SEED_PROYEK_EXPENSES);
      return SEED_PROYEK_EXPENSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_PROYEK_EXPENSES;
    }
  },

  saveProyekExpenses(expenses: VendorTukangExpense[]): void {
    localStorage.setItem(STORAGE_KEYS.PROYEK_EXPENSES, JSON.stringify(expenses));
  },

  getProyekProfile(): ProyekProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROYEK_PROFILE);
    if (!raw) {
      this.saveProyekProfile(SEED_PROYEK_PROFILE);
      return SEED_PROYEK_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_PROYEK_PROFILE;
    }
  },

  saveProyekProfile(profile: ProyekProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROYEK_PROFILE, JSON.stringify(profile));
  },

  // ==========================================
  // USAHAQU DYNAMIC PRICING, TRIAL & SUBCATEGORIES
  // ==========================================
  getUsahaQuPricing(): UsahaQuPricingConfig {
    const defaultPricing: UsahaQuPricingConfig = {
      dailyRate: 1000, // Rp 1.000 / hari
      trialDays: 10, // 10 hari trial gratis
      warningDays: 2, // H-2 peringatan popup
      discount6MonthsPercent: 0,
      discount12MonthsPercent: 0,
      qrisMerchantName: 'AppQu UMKM Digital RT 04',
      qrisNmid: 'ID1020304050607',
      updatedAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USAHAQU_PRICING);
      if (!raw) {
        this.saveUsahaQuPricing(defaultPricing);
        return defaultPricing;
      }
      const parsed = JSON.parse(raw);
      return { ...defaultPricing, ...parsed };
    } catch {
      return defaultPricing;
    }
  },

  saveUsahaQuPricing(config: UsahaQuPricingConfig): void {
    config.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.USAHAQU_PRICING, JSON.stringify(config));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('usahaqu_pricing_updated', { detail: config }));
    }
  },

  resetUsahaQuPricing(): UsahaQuPricingConfig {
    const defaultPricing: UsahaQuPricingConfig = {
      dailyRate: 1000,
      trialDays: 10,
      warningDays: 2,
      discount6MonthsPercent: 0,
      discount12MonthsPercent: 0,
      qrisMerchantName: 'AppQu UMKM Digital RT 04',
      qrisNmid: 'ID1020304050607',
      updatedAt: new Date().toISOString(),
    };
    this.saveUsahaQuPricing(defaultPricing);
    return defaultPricing;
  },

  getUsahaQuTrial(): UsahaQuTrialStatus {
    const pricing = this.getUsahaQuPricing();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USAHAQU_TRIAL);
      if (!raw) {
        const initialTrial: UsahaQuTrialStatus = {
          trialStartDate: new Date().toISOString(),
          trialDurationDays: pricing.trialDays,
          hasSeenH2WarningModal: false,
        };
        this.saveUsahaQuTrial(initialTrial);
        return initialTrial;
      }
      return JSON.parse(raw);
    } catch {
      const fallback: UsahaQuTrialStatus = {
        trialStartDate: new Date().toISOString(),
        trialDurationDays: pricing.trialDays,
        hasSeenH2WarningModal: false,
      };
      return fallback;
    }
  },

  saveUsahaQuTrial(trial: UsahaQuTrialStatus): void {
    localStorage.setItem(STORAGE_KEYS.USAHAQU_TRIAL, JSON.stringify(trial));
  },

  getRemainingTrialDays(): { remainingDays: number; isExpired: boolean; isH2Warning: boolean } {
    const pricing = this.getUsahaQuPricing();
    const trial = this.getUsahaQuTrial();
    const startDate = new Date(trial.trialStartDate).getTime();
    const now = Date.now();
    const elapsedDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const totalDays = pricing.trialDays || 10;
    const remainingDays = Math.max(0, totalDays - elapsedDays);
    const isExpired = remainingDays === 0;
    const isH2Warning = remainingDays <= (pricing.warningDays || 2);

    return { remainingDays, isExpired, isH2Warning };
  },

  getUserSubCategories(): UserSubCategorySelection[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_SUBCATEGORIES);
      if (!raw) {
        // Default 1st sub-category: Free Tier
        const defaultSubs: UserSubCategorySelection[] = [
          {
            subCategoryId: 'sub-kuliner-1',
            subCategoryName: 'Bakso & Mie Ayam',
            categoryId: 'kuliner',
            categoryName: 'Kuliner & Warung Makan',
            isFreeTier: true,
            subscribedAt: new Date().toISOString(),
            expiresAt: null, // Lifetime free trial
            paymentMethod: 'free_trial',
          },
        ];
        this.saveUserSubCategories(defaultSubs);
        return defaultSubs;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveUserSubCategories(list: UserSubCategorySelection[]): void {
    localStorage.setItem(STORAGE_KEYS.USER_SUBCATEGORIES, JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('usahaqu_subcategories_updated', { detail: list }));
    }
  },

  subscribeSubCategory(sub: UserSubCategorySelection): UserSubCategorySelection[] {
    const list = this.getUserSubCategories().filter((s) => s.subCategoryId !== sub.subCategoryId);
    list.push(sub);
    this.saveUserSubCategories(list);
    return list;
  },

  removeUserSubCategory(subCategoryId: string): UserSubCategorySelection[] {
    const list = this.getUserSubCategories().filter((s) => s.subCategoryId !== subCategoryId);
    this.saveUserSubCategories(list);
    return list;
  },

  getUsahaQuPopupCount(): number {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USAHAQU_POPUP_COUNT);
      return raw ? parseInt(raw, 10) || 0 : 0;
    } catch {
      return 0;
    }
  },

  incrementUsahaQuPopupCount(): number {
    const current = this.getUsahaQuPopupCount();
    const next = current + 1;
    localStorage.setItem(STORAGE_KEYS.USAHAQU_POPUP_COUNT, next.toString());
    return next;
  },

  getUsahaQuOperationalMode(): 'kios' | 'mangkal' | 'keliling' {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USAHAQU_OPERATIONAL_MODE);
      if (raw === 'kios' || raw === 'mangkal' || raw === 'keliling') {
        return raw;
      }
      return 'kios';
    } catch {
      return 'kios';
    }
  },

  saveUsahaQuOperationalMode(mode: 'kios' | 'mangkal' | 'keliling'): void {
    localStorage.setItem(STORAGE_KEYS.USAHAQU_OPERATIONAL_MODE, mode);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('usahaqu_operational_mode_updated', { detail: mode }));
    }
  },

  // ==========================================
  // TIER 1 & TIER 2 GOVERNANCE & SIAGAQU RULES
  // ==========================================
  checkTier2Term(user: UserProfile): { isExpired: boolean; daysLeft: number; statusText: string } {
    if (user.roleTier !== 'tier2_pengurus_rt' && user.tierLevel !== 'tier2') {
      return { isExpired: false, daysLeft: 999, statusText: 'Tier 1: Warga / Relawan' };
    }
    const end = user.masaJabatanEnd || '2027-01-01';
    const endTime = new Date(end).getTime();
    const now = Date.now();
    const diffDays = Math.ceil((endTime - now) / (1000 * 60 * 60 * 24));
    const isExpired = diffDays <= 0;
    return {
      isExpired,
      daysLeft: Math.max(0, diffDays),
      statusText: isExpired
        ? 'Masa Jabatan Berakhir (Hak Akses Non-Aktif Otomatis)'
        : `Masa Jabatan Aktif (Sisa ${diffDays} Hari)`,
    };
  },

  checkSiagaQuEligibility(): {
    canActivate: boolean;
    isPending10: boolean;
    verifiedWargaCount: number;
    daysActive: number;
    message: string;
  } {
    const residents = this.getResidents();
    const verifiedWargaCount = residents.filter(
      (r) => r.residentStatus === 'tetap' || r.isVerified || r.verificationStatus === 'permanent_verified'
    ).length;

    let initTimestamp = localStorage.getItem('appqu_community_init_time_v1');
    if (!initTimestamp) {
      initTimestamp = (Date.now() - 12 * 86400000).toString();
      localStorage.setItem('appqu_community_init_time_v1', initTimestamp);
    }
    const daysActive = Math.floor((Date.now() - parseInt(initTimestamp, 10)) / (1000 * 60 * 60 * 24));

    // Rule 1: RT / Ketua Paguyuban minimal 2 akun warga baru bisa aktif
    if (verifiedWargaCount < 2) {
      return {
        canActivate: false,
        isPending10: false,
        verifiedWargaCount,
        daysActive,
        message: `Membutuhkan minimal 2 akun warga terverifikasi untuk mengaktifkan SiagaQu (Saat ini: ${verifiedWargaCount}/2 warga).`,
      };
    }

    // Rule 2: Jika 30 hari warga kurang dari 10 status temporer/hak akses siagaqu ditangguhkan/pending
    const isPending10 = daysActive >= 30 && verifiedWargaCount < 10;
    if (isPending10) {
      return {
        canActivate: false,
        isPending10: true,
        verifiedWargaCount,
        daysActive,
        message: `Hak akses SiagaQu ditangguhkan: Sudah melewati 30 hari (${daysActive} hari) namun warga terdaftar kurang dari 10 (${verifiedWargaCount}/10 warga). Hak akses akan pulih setelah warga mencapai minimal 10 orang.`,
      };
    }

    return {
      canActivate: true,
      isPending10: false,
      verifiedWargaCount,
      daysActive,
      message: `SiagaQu Aktif & Terlindungi (${verifiedWargaCount} Warga Terverifikasi).`,
    };
  },
};

// ==========================================
// SEED DATA: USAHAQU - PROYEK (PROYEKQU)
// ==========================================
export const SEED_PROYEK_PROFILE: ProyekProfile = {
  namaWorkshop: 'Bengkel Las & Karya Mandiri RT 04',
  penanggungJawab: 'Mandor Supriyanto',
  kontak: '0813-8899-0022',
  alamatWorkshop: 'Jl. Melati Blok E No. 05, RT 04 / RW 09',
  bankRekening: 'BCA 8820-192-331 a.n Supriyanto',
  qrisPayload: '00020101021126570014ID.GO.QRIS.WWW01189360099900010203040215ID10203040506075204581253033605802ID5919BENGKEL PROYEK MANDIRI6007BANDUNG61054011562070703A01630489A1',
  headerSurat: 'BENGKEL LAS, FURNITURE & KONSTRUKSI SIPIL "KARYA MANDIRI"\nSpesialis Borongan, Kanopi, Kitchen Set, Kusen Aluminium & Sumur Bor',
  footerSurat: 'Garansi pengerjaan 3 bulan setelah serah terima unit/pekerjaan.\nPembayaran bertahap via Transfer/Tunai sesuai termin progress yang disepakati.',
};

export const SEED_PROYEK_PROJECTS: ProyekRecord[] = [
  {
    id: 'prj-001',
    kodeProyek: 'PRJ-2610-001',
    namaProyek: 'Kanopi Carport Holo Galvanis & Alderon RS',
    kategori: 'besi_las',
    klienNama: 'Bpk. Hendro Wicaksono',
    klienKontak: '0812-7766-5544',
    klienAlamat: 'Blok B2 No. 08, RT 04',
    statusProyek: 'sedang_dikerjakan',
    dimensi: {
      unit: 'm2',
      panjang: 6,
      lebar: 4,
      kedalaman: 0,
      jumlah: 1,
      calculatedVolume: 24,
      unitLabel: 'm²',
    },
    rab: {
      bahanBakuUtama: 4800000, // Besi holo 4x8 & 4x4 galvanis
      aksesoris: 1200000, // Atap Alderon RS, baut roofing, sealant, cat anti karat
      upahTukang: 1800000, // 2 Tukang las x 3 hari
      transportMobilisasi: 350000, // Sewa pickup & solar
      subtotalModal: 8150000,
      marginPercent: 25,
      nominalMargin: 2037500,
      totalBiayaPenawaran: 10187500,
    },
    rincianBahan: [
      { id: 'mat-1', nama: 'Besi Holo 4x8 Galvanis 1.4mm', qty: 6, satuan: 'batang', hargaSatuan: 220000, total: 1320000 },
      { id: 'mat-2', nama: 'Besi Holo 4x4 Galvanis 1.4mm', qty: 10, satuan: 'batang', hargaSatuan: 145000, total: 1450000 },
      { id: 'mat-3', nama: 'Atap Alderon RS Single Layer', qty: 24, satuan: 'meter', hargaSatuan: 84500, total: 2030000 },
      { id: 'mat-4', nama: 'Baut Roofing & Fisher Dinabolt 12mm', qty: 1, satuan: 'dus', hargaSatuan: 350000, total: 350000, isAksesoris: true },
      { id: 'mat-5', nama: 'Cat Primer Zink Chromate & Finish Hitam Doff', qty: 2, satuan: 'kaleng', hargaSatuan: 185000, total: 370000, isAksesoris: true },
      { id: 'mat-6', nama: 'Kawat Las RB-26 2.6mm & Sealant Neutral', qty: 1, satuan: 'paket', hargaSatuan: 480000, total: 480000, isAksesoris: true },
    ],
    rincianTukang: [
      { id: 'tuk-1', peran: 'Tukang Las Utama', namaPekerja: 'Mas Joko (Las)', jumlahOrang: 1, durasiHari: 3, upahHarian: 180000, total: 540000 },
      { id: 'tuk-2', peran: 'Asisten Tukang / Kenek', namaPekerja: 'Dedi (Kenek)', jumlahOrang: 1, durasiHari: 3, upahHarian: 130000, total: 390000 },
      { id: 'tuk-3', peran: 'Tukang Pasang Atap & Finishing', namaPekerja: 'Mas Bambang & Tim', jumlahOrang: 2, durasiHari: 2, upahHarian: 217500, total: 870000 },
    ],
    terminList: [
      {
        id: 'term-1',
        stageType: 'dp',
        stageName: 'DP (Uang Muka 30% / Kunci Jadwal & Beli Besi)',
        targetPercent: 30,
        nominalTarget: 3056250,
        nominalDibayar: 3056250,
        status: 'lunas',
        tglBayar: '2026-10-15',
        metode: 'transfer',
        catatan: 'BCA Transfer a.n Pak Hendro - Lunas',
      },
      {
        id: 'term-2',
        stageType: 'termin_1',
        stageName: 'Termin 1 (Progress 40% - Rangka Las Terpasang)',
        targetPercent: 40,
        nominalTarget: 4075000,
        nominalDibayar: 4075000,
        status: 'lunas',
        tglBayar: '2026-10-20',
        metode: 'transfer',
        catatan: 'Rangka holo tegak & cat dasar selesai',
      },
      {
        id: 'term-3',
        stageType: 'pelunasan',
        stageName: 'Pelunasan (Sisa 30% - Serah Terima & Pasang Atap)',
        targetPercent: 30,
        nominalTarget: 3056250,
        nominalDibayar: 0,
        status: 'belum',
        catatan: 'Menunggu pemasangan atap alderon & perapian',
      },
    ],
    catatanSpesifikasi: 'Tiang utama holo 4x8 double, rangka jari-jari 4x4 jarak 60cm, atap alderon warna putih doff, cat besi hitam doff semi gloss anti karat.',
    tanggalMulai: '2026-10-16',
    targetSelesai: '2026-10-25',
    createdAt: '2026-10-14T08:30:00Z',
    updatedAt: '2026-10-21T11:20:00Z',
  },
  {
    id: 'prj-002',
    kodeProyek: 'PRJ-2610-002',
    namaProyek: 'Kitchen Set Minimalis HPL Taco Grey & Top Marmer',
    kategori: 'furniture_kayu',
    klienNama: 'Ibu Ratna Dewi',
    klienKontak: '0813-2211-9988',
    klienAlamat: 'Blok A1 No. 04, RT 04',
    statusProyek: 'dp_terbayar',
    dimensi: {
      unit: 'mlari',
      panjang: 4.5,
      lebar: 1,
      kedalaman: 0,
      jumlah: 1,
      calculatedVolume: 4.5,
      unitLabel: "m'",
    },
    rab: {
      bahanBakuUtama: 3850000, // Multiplek 18mm & HPL Taco
      aksesoris: 1650000, // Engsel slow motion Huben, rel laci double track, rak piring stainless
      upahTukang: 1900000, // Tukang kayu custom interior 4 hari
      transportMobilisasi: 250000, // Ongkos kirim workshop ke lokasi
      subtotalModal: 7650000,
      marginPercent: 30,
      nominalMargin: 2295000,
      totalBiayaPenawaran: 9945000,
    },
    rincianBahan: [
      { id: 'f-1', nama: 'Multiplek Meranti Super 18mm', qty: 4, satuan: 'lembar', hargaSatuan: 275000, total: 1100000 },
      { id: 'f-2', nama: 'HPL Taco Solid Grey Textured', qty: 5, satuan: 'lembar', hargaSatuan: 210000, total: 1050000 },
      { id: 'f-3', nama: 'Multiplek 9mm Backpanel & Blok', qty: 3, satuan: 'lembar', hargaSatuan: 165000, total: 495000 },
      { id: 'f-4', nama: 'Lem Kuning Aica Aibon 2.5kg', qty: 2, satuan: 'kaleng', hargaSatuan: 140000, total: 280000 },
      { id: 'f-5', nama: 'Edging PVC Taco Grey 1mm', qty: 1, satuan: 'roll', hargaSatuan: 180000, total: 180000 },
      { id: 'f-6', nama: 'Top Table Granit Sintetis Hitam', qty: 4.5, satuan: "m'", hargaSatuan: 165000, total: 742500 },
      { id: 'f-7', nama: 'Engsel Soft-Close Huben & Rel Double Track', qty: 1, satuan: 'set', hargaSatuan: 950000, total: 950000, isAksesoris: true },
      { id: 'f-8', nama: 'Rak Piring Stainless Kabinet Bawah', qty: 1, satuan: 'unit', hargaSatuan: 700000, total: 700000, isAksesoris: true },
    ],
    rincianTukang: [
      { id: 'tuk-f1', peran: 'Tukang Kayu Interior', namaPekerja: 'Pakde Marto', jumlahOrang: 1, durasiHari: 4, upahHarian: 250000, total: 1000000 },
      { id: 'tuk-f2', peran: 'Asisten Perakitan & Finishing HPL', namaPekerja: 'Rudi Interior', jumlahOrang: 1, durasiHari: 4, upahHarian: 150000, total: 600000 },
      { id: 'tuk-f3', peran: 'Instalasi Lapangan & Fitting', namaPekerja: 'Tim Pemasang', jumlahOrang: 2, durasiHari: 1, upahHarian: 150000, total: 300000 },
    ],
    terminList: [
      {
        id: 'term-f1',
        stageType: 'dp',
        stageName: 'DP (Uang Muka 40% / Belanja Bahan Multiplek & HPL)',
        targetPercent: 40,
        nominalTarget: 3978000,
        nominalDibayar: 3978000,
        status: 'lunas',
        tglBayar: '2026-10-18',
        metode: 'transfer',
        catatan: 'DP Masuk, bahan sudah dipotong di workshop',
      },
      {
        id: 'term-f2',
        stageType: 'termin_1',
        stageName: 'Termin 1 (Progress 35% - Modul Terakit Siap Pasang)',
        targetPercent: 35,
        nominalTarget: 3480750,
        nominalDibayar: 0,
        status: 'belum',
        catatan: 'Rencana serah modul hari Sabtu',
      },
      {
        id: 'term-f3',
        stageType: 'pelunasan',
        stageName: 'Pelunasan (Sisa 25% - Pemasangan & Finishing Bersih)',
        targetPercent: 25,
        nominalTarget: 2486250,
        nominalDibayar: 0,
        status: 'belum',
        catatan: 'Pengecekan engsel & silikon edging',
      },
    ],
    catatanSpesifikasi: 'Tinggi kabinet bawah 85cm, kabinet atas 70cm, edging PVC tebal tahan lembap, lubang kompor tanam 2 tungku rinnai.',
    tanggalMulai: '2026-10-19',
    targetSelesai: '2026-10-30',
    createdAt: '2026-10-17T09:00:00Z',
    updatedAt: '2026-10-18T14:30:00Z',
  },
  {
    id: 'prj-003',
    kodeProyek: 'PRJ-2610-003',
    namaProyek: 'Pengeboran Sumur Jetpump Dalam 36 Meter & Toren Air',
    kategori: 'pengeboran_lapangan',
    klienNama: 'Bpk. Sugeng Waluyo',
    klienKontak: '0812-4455-6677',
    klienAlamat: 'Blok C2 No. 15, RT 04',
    statusProyek: 'selesai_pelunasan',
    dimensi: {
      unit: 'mkedalaman',
      panjang: 0,
      lebar: 0,
      kedalaman: 36,
      jumlah: 1,
      calculatedVolume: 36,
      unitLabel: 'meter',
    },
    rab: {
      bahanBakuUtama: 2450000, // Pipa PVC 4" Rucika AW & Pipa hisap
      aksesoris: 1100000, // Otomatis radar, tusen klep, kabel pompa, sok drat kuningan
      upahTukang: 1800000, // 2 Operator rig bor x 3 hari
      transportMobilisasi: 300000, // Mobilisasi alat bor diesel & sirkulasi air
      subtotalModal: 5650000,
      marginPercent: 25,
      nominalMargin: 1412500,
      totalBiayaPenawaran: 7062500,
    },
    rincianBahan: [
      { id: 'b-1', nama: 'Pipa PVC 4 Inch Rucika AW Casing', qty: 9, satuan: 'batang', hargaSatuan: 165000, total: 1485000 },
      { id: 'b-2', nama: 'Pipa PVC 1 Inch & 1.25 Inch Hisap', qty: 8, satuan: 'batang', hargaSatuan: 72000, total: 576000 },
      { id: 'b-3', nama: 'Pasir Silika & Koral Filter Dasar', qty: 5, satuan: 'karung', hargaSatuan: 45000, total: 225000 },
      { id: 'b-4', nama: 'Tusen Klep Kuningan 1 Inch & Otomatis', qty: 1, satuan: 'set', hargaSatuan: 380000, total: 380000, isAksesoris: true },
      { id: 'b-5', nama: 'Kabel Listrik Eterna 3x1.5mm & Lem PVC', qty: 1, satuan: 'paket', hargaSatuan: 320000, total: 320000, isAksesoris: true },
    ],
    rincianTukang: [
      { id: 'tuk-b1', peran: 'Master Operator Bor Diesel', namaPekerja: 'Bang Somad', jumlahOrang: 1, durasiHari: 3, upahHarian: 220000, total: 660000 },
      { id: 'tuk-b2', peran: 'Kru Lapangan & Sirkulasi Lumpur', namaPekerja: 'Agus & Ilham', jumlahOrang: 2, durasiHari: 3, upahHarian: 150000, total: 900000 },
      { id: 'tuk-b3', peran: 'Instalasi Pompa & Kuras Air Keruh', namaPekerja: 'Bang Somad', jumlahOrang: 1, durasiHari: 1, upahHarian: 240000, total: 240000 },
    ],
    terminList: [
      {
        id: 'term-b1',
        stageType: 'dp',
        stageName: 'DP (Uang Muka 35% - Mobilisasi Mesin & Pipa)',
        targetPercent: 35,
        nominalTarget: 2471875,
        nominalDibayar: 2471875,
        status: 'lunas',
        tglBayar: '2026-10-10',
        metode: 'tunai',
        catatan: 'Diterima tunai di lokasi',
      },
      {
        id: 'term-b2',
        stageType: 'termin_1',
        stageName: 'Termin 1 (Progress 35% - Tembus Sumber Air 36m)',
        targetPercent: 35,
        nominalTarget: 2471875,
        nominalDibayar: 2471875,
        status: 'lunas',
        tglBayar: '2026-10-12',
        metode: 'transfer',
        catatan: 'Air keluar deras & jernih',
      },
      {
        id: 'term-b3',
        stageType: 'pelunasan',
        stageName: 'Pelunasan (Sisa 30% - Kuras Selesai & Sambung Toren)',
        targetPercent: 30,
        nominalTarget: 2118750,
        nominalDibayar: 2118750,
        status: 'lunas',
        tglBayar: '2026-10-14',
        metode: 'transfer',
        catatan: 'Proyek tuntas 100% tanpa kendala',
      },
    ],
    catatanSpesifikasi: 'Casing 4 inch ditanam 28 meter, screen pipa bawah disaring koral pasir silika, kedalaman total 36 meter, air dites jernih tidak bau.',
    tanggalMulai: '2026-10-10',
    targetSelesai: '2026-10-14',
    createdAt: '2026-10-09T10:00:00Z',
    updatedAt: '2026-10-14T17:00:00Z',
  },
];

export const SEED_PROYEK_EXPENSES: VendorTukangExpense[] = [
  {
    id: 'exp-001',
    proyekId: 'prj-001',
    proyekNama: 'Kanopi Carport Holo Galvanis & Alderon RS',
    kategori: 'vendor_material',
    namaPihak: 'TB. Sinar Logam Baja Abadi',
    rincian: 'Besi Holo Galvanis 4x8 (6 btg) & 4x4 (10 btg)',
    nominal: 2770000,
    tglTransaksi: '2026-10-16',
    statusBayar: 'lunas',
    noHp: '0812-3344-8899',
    notaRef: 'NOTA-SLB-8812',
  },
  {
    id: 'exp-002',
    proyekId: 'prj-001',
    proyekNama: 'Kanopi Carport Holo Galvanis & Alderon RS',
    kategori: 'vendor_material',
    namaPihak: 'Depo Atap Alderon Cemerlang',
    rincian: 'Alderon RS 24 meter + baut roofing 1 dus',
    nominal: 2380000,
    tglTransaksi: '2026-10-17',
    statusBayar: 'bon_hutang',
    noHp: '0818-4455-6611',
    notaRef: 'BON-DAC-1044',
  },
  {
    id: 'exp-003',
    proyekId: 'prj-001',
    proyekNama: 'Kanopi Carport Holo Galvanis & Alderon RS',
    kategori: 'upah_tukang',
    namaPihak: 'Mas Joko (Las Utama) & Dedi (Kenek)',
    rincian: 'Upah pengerjaan las potong & rakit rangka (3 hari)',
    nominal: 930000,
    tglTransaksi: '2026-10-19',
    statusBayar: 'lunas',
    noHp: '0857-1122-3344',
  },
  {
    id: 'exp-004',
    proyekId: 'prj-002',
    proyekNama: 'Kitchen Set Minimalis HPL Taco Grey',
    kategori: 'vendor_material',
    namaPihak: 'Toko Kayu Indah Multiplek & Taco',
    rincian: 'Multiplek Meranti 18mm (4 lbr) & HPL Taco Grey (5 lbr)',
    nominal: 2150000,
    tglTransaksi: '2026-10-19',
    statusBayar: 'lunas',
    noHp: '0878-9988-1234',
    notaRef: 'INV-TKI-9901',
  },
  {
    id: 'exp-005',
    proyekId: 'prj-002',
    proyekNama: 'Kitchen Set Minimalis HPL Taco Grey',
    kategori: 'upah_tukang',
    namaPihak: 'Pakde Marto (Tukang Kayu Interior)',
    rincian: 'Panjar upah potong pola & laminasi HPL tahap 1',
    nominal: 600000,
    tglTransaksi: '2026-10-20',
    statusBayar: 'lunas',
    noHp: '0812-6655-4433',
  },
];

// ==========================================
// SEED AREAQU POINTS (PETA GARIS & SEWA LAPAK DIGITAL)
// ==========================================
// SEED AREAQU POINTS (MAP POINTS & DIGITAL STALLS)
// OpenStreetMap Base: https://www.openstreetmap.org/#map=19/-6.467323/106.777665
// ==========================================
export const SEED_AREA_POINTS: AreaPoint[] = [
  {
    id: 'area-1',
    name: 'Bakso Qu 1.0 (Lapak Prioritas)',
    category: 'kuliner',
    businessMode: 'mode_a_pos',
    osmTag: 'amenity=restaurant',
    lat: -6.467323,
    lng: 106.777665,
    distanceMeters: 0,
    ownerName: 'H. Sutisna',
    phone: '0812-3456-7890',
    blockNumber: 'Jl. H. Suhaemi No. 12',
    rating: 4.9,
    isDigitalStallRented: true,
    digitalStallTrialDaysLeft: 9, // Trial 10 hari aktif (Rp 30.000/bln)
    isPoliticalOrNeutralOnly: false,
    description: 'Bakso urat jumbo, mie ayam & es teh segar. Melayani dine-in & takeaway.',
    catalogCount: 8,
  },
  {
    id: 'area-2',
    name: 'RitelQu Sembako Warga Bu Siti',
    category: 'sembako',
    businessMode: 'mode_a_pos',
    osmTag: 'shop=convenience',
    lat: -6.467210,
    lng: 106.777820,
    distanceMeters: 22,
    ownerName: 'Siti Rahmawati',
    phone: '0819-0987-6543',
    blockNumber: 'Gang Warga No. 04',
    rating: 4.8,
    isDigitalStallRented: true,
    digitalStallTrialDaysLeft: 7,
    isPoliticalOrNeutralOnly: false,
    description: 'Sembako lengkap: beras, telur, minyak, gula pasir, air galon & gas LPG.',
    catalogCount: 16,
  },
  {
    id: 'area-3',
    name: 'BengkelQu Motor Cepat Mas Bejo',
    category: 'bengkel',
    businessMode: 'mode_a_pos',
    osmTag: 'shop=motorcycle_repair',
    lat: -6.467450,
    lng: 106.777510,
    distanceMeters: 26,
    ownerName: 'Bejo Santoso',
    phone: '0857-4433-2211',
    blockNumber: 'Akses Jalan Depan',
    rating: 4.7,
    isDigitalStallRented: false,
    isPoliticalOrNeutralOnly: false,
    description: 'Servis injeksi, ganti oli matic/bebek, tambal ban & sparepart motor murah.',
    catalogCount: 12,
  },
  {
    id: 'area-4',
    name: 'Klinik & Faskes Pratama SehatQu',
    category: 'klinik',
    businessMode: 'mode_b_katalog',
    osmTag: 'amenity=clinic',
    lat: -6.467550,
    lng: 106.777850,
    distanceMeters: 38,
    ownerName: 'dr. Faisal Rahman',
    phone: '0811-3322-1100',
    blockNumber: 'Jl. Utama No. 8',
    rating: 4.9,
    isDigitalStallRented: false,
    isPoliticalOrNeutralOnly: false,
    description: 'Pemeriksaan dokter umum, cek lab gula darah & tensi, obat resep BPJS subsidi.',
    catalogCount: 6,
  },
  {
    id: 'area-5',
    name: 'Kafe Kopi Sudut Mawar (Etalase)',
    category: 'kuliner',
    businessMode: 'mode_b_katalog',
    osmTag: 'amenity=cafe',
    lat: -6.467120,
    lng: 106.777480,
    distanceMeters: 32,
    ownerName: 'Kevin Ardiansyah',
    phone: '0878-1234-9988',
    blockNumber: 'Sudut Mawar No. 02',
    rating: 4.6,
    isDigitalStallRented: true,
    digitalStallTrialDaysLeft: 5,
    isPoliticalOrNeutralOnly: false,
    description: 'Manual brew kopi lokal, camilan roti bakar & mocktail segar.',
    catalogCount: 14,
  },
  {
    id: 'area-6',
    name: 'Pos Keamanan & Ronda Gerbang Utama',
    category: 'fasum',
    lat: -6.467380,
    lng: 106.777250,
    distanceMeters: 46,
    blockNumber: 'Gerbang Portal Utama',
    rating: 5.0,
    isDigitalStallRented: false,
    isPoliticalOrNeutralOnly: false,
    description: 'Pusat komando ronda malam, portal keluar masuk & panic button RT 04.',
  },
  {
    id: 'area-7',
    name: 'Balai Pertemuan & Sekretariat RT 04',
    category: 'fasum',
    lat: -6.467480,
    lng: 106.777980,
    distanceMeters: 41,
    blockNumber: 'Balai Warga',
    rating: 5.0,
    isDigitalStallRented: false,
    isPoliticalOrNeutralOnly: false,
    description: 'Ruang musyawarah warga, posyandu balita & tempat administrasi surat pengantar.',
  },
  {
    id: 'area-8',
    name: 'Sekretariat Parpol & Ormas Wilayah (Titik Netral)',
    category: 'titik_netral',
    lat: -6.467850,
    lng: 106.778250,
    distanceMeters: 88,
    blockNumber: 'Jalan Raya Kav 14',
    rating: 3.5,
    isDigitalStallRented: false,
    isPoliticalOrNeutralOnly: true, // Kebijakan Netralitas: Dilarang Sewa Lapak / Iklan
    description: 'Kantor koordinasi partai/ormas. Sesuai Kebijakan Netralitas AppQu: DILARANG promosi, sewa lapak digital, atau komando SOS.',
  },
];

// ==========================================
// SEED TRANSPORTASIQU COURIERS (DRIVERS)
// ==========================================
export const SEED_COURIERS: TransportasiCourier[] = [
  {
    id: 'courier-1',
    driverName: 'Kang Yanto',
    phone: '0858-9988-7711',
    vehiclePlate: 'B 4321 SJK',
    vehicleType: 'motor',
    lat: -6.467260,
    lng: 106.777620,
    speedKmh: 24,
    batteryPercent: 88,
    status: 'mengantar',
    currentTask: 'Mengantar BaksoQu ke Jl. H. Suhaemi No. 12',
    lastHeartbeatSeconds: 4,
  },
  {
    id: 'courier-2',
    driverName: 'Mas Dedi',
    phone: '0813-7766-5544',
    vehiclePlate: 'B 6789 TZX',
    vehicleType: 'motor',
    lat: -6.467390,
    lng: 106.777350,
    speedKmh: 0,
    batteryPercent: 94,
    status: 'standby',
    currentTask: 'Standby di Pos Ronda Gerbang Utama',
    lastHeartbeatSeconds: 7,
  },
];

// ==========================================
// SEED PENDING RESIDENT VERIFICATIONS (APPROVAL LIST RT)
// ==========================================
export interface PendingVerificationItem {
  id: string;
  name: string;
  nik: string;
  blockNumber: string;
  phone: string;
  submittedAt: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  witnesses: { name: string; blockNumber: string; confirmedAt: string }[];
  temporaryDaysLeft: number;
  deviceFingerprint: string;
  notes?: string;
}

export const SEED_PENDING_VERIFICATIONS: PendingVerificationItem[] = [
  {
    id: 'pv-1',
    name: 'Dani Saputra',
    nik: '3201123456780099',
    blockNumber: 'Blok D2 No. 03',
    phone: '0813-1122-3399',
    submittedAt: '2026-10-18',
    status: 'pending_approval',
    witnesses: [
      { name: 'Budi Santoso', blockNumber: 'Blok C3 No. 12', confirmedAt: '2026-10-18' },
      { name: 'Pak Agus Suparman (Hansip)', blockNumber: 'Pos Satpam', confirmedAt: '2026-10-19' },
    ],
    temporaryDaysLeft: 27,
    deviceFingerprint: 'DEV-SAMSUNG-A01-77BA',
    notes: 'KTP Asli terlampir, status mengontrak di rumah Ibu Endang.',
  },
  {
    id: 'pv-2',
    name: 'Rina Marlina',
    nik: '3201123456780088',
    blockNumber: 'Blok A3 No. 09',
    phone: '0812-9988-1122',
    submittedAt: '2026-10-12',
    status: 'pending_approval',
    witnesses: [
      { name: 'Ir. Hendra Gunawan', blockNumber: 'Blok A1 No. 01', confirmedAt: '2026-10-12' },
      { name: 'Dra. Hj. Nuraini', blockNumber: 'Blok B2 No. 05', confirmedAt: '2026-10-13' },
    ],
    temporaryDaysLeft: 21,
    deviceFingerprint: 'DEV-OPPO-A16-43EF',
    notes: 'Warga baru beli rumah di Blok A3 No. 09.',
  },
];

// ==========================================
// SEED SOS EPHEMERAL ROOM
// ==========================================
export const SEED_SOS_ROOM: SOSEphemeralRoom = {
  id: 'sos-room-04',
  reporterId: 'usr-warga-1',
  reporterName: 'Budi Santoso',
  reporterBlock: 'Blok C3 No. 12',
  reporterPhone: '0812-8877-6655',
  type: 'kemalingan',
  status: 'active',
  createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  expiresAt: new Date(Date.now() + 71 * 3600 * 1000).toISOString(), // 72 jam auto-purge
  hoursRemaining: 71,
  liveLocation: {
    lat: -7.7956,
    lng: 110.3695,
    address: 'Depan Rumah Blok C3 No. 12, RT 04 / RW 09',
    geofenceValid: true,
  },
  audioRecorded: true,
  audioDurationSeconds: 15,
  audioSummaryText: 'Auto-Text: "Ada gerak-gerik orang tidak dikenal mencurigakan berputar di depan pagar dan membawa alat di portal gang..."',
  messages: [
    {
      id: 'msg-1',
      senderId: 'system',
      senderName: 'Sistem SiagaQu',
      senderRole: 'Serverless Realtime',
      text: '🚨 PANIC BUTTON DIAKTIFKAN: Ephemeral SOS Room dibuka. Geofence RT 04 terverifikasi (GPS Valid). Notifikasi alarm sirine dibroadcast ke HP seluruh warga RT 04, Hansip, dan Kurir TransportasiQu terdekat.',
      timestamp: '15:10',
    },
    {
      id: 'msg-2',
      senderId: 'usr-warga-1',
      senderName: 'Budi Santoso (Pelapor)',
      senderRole: 'Warga RT 04',
      text: 'Tolong! Ada 2 orang mencurigakan pakai jaket hitam mengintai motor di depan garasi!',
      timestamp: '15:11',
    },
    {
      id: 'msg-3',
      senderId: 'system',
      senderName: 'Smart Rekaman 15s (Auto-Text Summary)',
      senderRole: 'Web Speech API',
      text: '🎙️ Auto-Text: "Ada gerak-gerik orang tidak dikenal mencurigakan berputar di depan pagar dan membawa alat di portal gang..."',
      timestamp: '15:11',
      isAudioSummary: true,
    },
    {
      id: 'msg-4',
      senderId: 'usr-satpam-1',
      senderName: 'Pak Agus Suparman (Hansip)',
      senderRole: 'Keamanan RT 04',
      text: 'Saya meluncur ke Blok C3 sekarang! Mas Dedi tolong blokir portal gerbang utama!',
      timestamp: '15:12',
      isAction: true,
    },
    {
      id: 'msg-5',
      senderId: 'usr-driver-1',
      senderName: 'Kang Yanto (Kurir)',
      senderRole: 'Driver TransportasiQu',
      text: 'Saya sedang di Blok D1, langsung merapat ke portal barat untuk cegat.',
      timestamp: '15:13',
      isAction: true,
    },
  ],
  quickActionsTriggered: ['Saya Meluncur', 'Blokir Portal Gang'],
  escalatedToWhatsApp: false,
};
