import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Wallet,
  Calendar,
  Settings,
  Building2,
  Heart,
  Shield,
  Flag,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Search,
  Filter,
  CreditCard,
  Banknote,
  QrCode,
  Edit3,
  Trash2,
  RefreshCw,
  X,
  Phone,
  UserCheck,
  ChevronRight,
  HelpCircle,
  Megaphone,
  Pin,
  ExternalLink,
} from 'lucide-react';

import { UserProfile, FeedPost, AgendaEvent, KasTransaction, SuratPengantar } from '../../types';
import {
  OrganizationData,
  OrganizationMember,
  OrganizationTransaction,
  OrganizationAgenda,
  OrganizationType,
  OrganizationStorageService,
} from '../../services/storageOrganizations';

export type PaguyubanSubTabKey = 'beranda' | 'anggota' | 'kas' | 'agenda' | 'setting_org';

interface PaguyubanViewProps {
  currentUser: UserProfile;
  feeds?: FeedPost[];
  agenda?: AgendaEvent[];
  kas?: KasTransaction[];
  letters?: SuratPengantar[];
  onUpdateFeeds?: (feeds: FeedPost[]) => void;
  onUpdateAgenda?: (agenda: AgendaEvent[]) => void;
  onUpdateKas?: (kas: KasTransaction[]) => void;
  onUpdateLetters?: (letters: SuratPengantar[]) => void;
  showNotification: (msg: string) => void;
  activeSubTab?: PaguyubanSubTabKey;
  onSelectSubTab?: (tab: PaguyubanSubTabKey) => void;
  theme?: 'light' | 'dark';
  hideInternalHeader?: boolean;
  isSwitchOrgModalOpen?: boolean;
  onCloseSwitchOrgModal?: () => void;
  isAddOrgModalOpen?: boolean;
  onCloseAddOrgModal?: () => void;
  onOrganizationChanged?: (org: OrganizationData) => void;
}

export const PaguyubanView: React.FC<PaguyubanViewProps> = ({
  currentUser,
  showNotification,
  activeSubTab = 'beranda',
  onSelectSubTab,
  theme = 'light',
  hideInternalHeader = true,
  isSwitchOrgModalOpen: isSwitchOrgModalOpenProp,
  onCloseSwitchOrgModal,
  isAddOrgModalOpen: isAddOrgModalOpenProp,
  onCloseAddOrgModal,
  onOrganizationChanged,
}) => {
  const isDark = theme === 'dark';

  // Organizations List & Active Org
  const [organizations, setOrganizations] = useState<OrganizationData[]>(() =>
    OrganizationStorageService.getOrganizations()
  );
  const [activeOrgId, setActiveOrgId] = useState<string>(() =>
    OrganizationStorageService.getActiveOrgId()
  );

  // Active Organization Computed
  const activeOrg = useMemo(() => {
    return organizations.find((o) => o.id === activeOrgId) || organizations[0];
  }, [organizations, activeOrgId]);

  // Sync to parent if activeOrg changes
  useEffect(() => {
    if (activeOrg && onOrganizationChanged) {
      onOrganizationChanged(activeOrg);
    }
  }, [activeOrgId]);

  // Local fallback subTab if not supplied from parent bottom navbar
  const [localSubTab, setLocalSubTab] = useState<PaguyubanSubTabKey>('beranda');
  const currentSubTab: PaguyubanSubTabKey = activeSubTab || localSubTab;

  const setSubTab = (tab: PaguyubanSubTabKey) => {
    setLocalSubTab(tab);
    onSelectSubTab?.(tab);
  };

  // Modals States - Synced with Parent Header & Internal
  const [internalSwitchOrgOpen, setInternalSwitchOrgOpen] = useState(false);
  const [internalAddOrgOpen, setInternalAddOrgOpen] = useState(false);

  const isSwitchOrgModalOpen =
    isSwitchOrgModalOpenProp !== undefined ? isSwitchOrgModalOpenProp : internalSwitchOrgOpen;
  const setIsSwitchOrgModalOpen = (open: boolean) => {
    setInternalSwitchOrgOpen(open);
    if (!open && onCloseSwitchOrgModal) onCloseSwitchOrgModal();
  };

  const isAddOrgModalOpen =
    isAddOrgModalOpenProp !== undefined ? isAddOrgModalOpenProp : internalAddOrgOpen;
  const setIsAddOrgModalOpen = (open: boolean) => {
    setInternalAddOrgOpen(open);
    if (!open && onCloseAddOrgModal) onCloseAddOrgModal();
  };
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [transactionFormType, setTransactionFormType] = useState<'pemasukan' | 'pengeluaran'>('pemasukan');
  const [isAddAgendaModalOpen, setIsAddAgendaModalOpen] = useState(false);
  const [isAddAnnouncementModalOpen, setIsAddAnnouncementModalOpen] = useState(false);

  // Filter States
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState<'all' | 'tier2' | 'tier1'>('all');
  const [kasTabFilter, setKasTabFilter] = useState<'all' | 'pemasukan' | 'pengeluaran'>('all');
  const [agendaStatusFilter, setAgendaStatusFilter] = useState<'all' | 'akan_datang' | 'selesai'>('all');

  // Form States - Add Organization
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgShortCode, setNewOrgShortCode] = useState('');
  const [newOrgType, setNewOrgType] = useState<OrganizationType>('dkm_masjid');
  const [newOrgTagline, setNewOrgTagline] = useState('');
  const [newOrgIuran, setNewOrgIuran] = useState<number>(0);
  const [newOrgIuranLabel, setNewOrgIuranLabel] = useState('Iuran / Infak Rutin');
  const [newOrgBank, setNewOrgBank] = useState('Bank Syariah Indonesia (BSI)');
  const [newOrgRek, setNewOrgRek] = useState('');
  const [newOrgRekHolder, setNewOrgRekHolder] = useState('');
  const [newOrgUserRole, setNewOrgUserRole] = useState('Pengurus');

  // Form States - Add Member
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Anggota');
  const [newMemberTier, setNewMemberTier] = useState<'tier1' | 'tier2'>('tier1');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberBlock, setNewMemberBlock] = useState('');

  // Form States - Add Transaction
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState<number | ''>('');
  const [txCategory, setTxCategory] = useState('iuran_wajib');
  const [txMethod, setTxMethod] = useState<'cash' | 'transfer' | 'qris'>('cash');
  const [txDate, setTxDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [txSender, setTxSender] = useState('');
  const [txNotes, setTxNotes] = useState('');

  // Form States - Add Agenda
  const [agTitle, setAgTitle] = useState('');
  const [agDate, setAgDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [agTime, setAgTime] = useState('19:30');
  const [agLocation, setAgLocation] = useState('');
  const [agCategory, setAgCategory] = useState('rapat_pleno');
  const [agDesc, setAgDesc] = useState('');

  // Form States - Add Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annIsPinned, setAnnIsPinned] = useState(false);

  // Form States - Edit Settings
  const [editOrgName, setEditOrgName] = useState(activeOrg.name);
  const [editOrgTagline, setEditOrgTagline] = useState(activeOrg.tagline);
  const [editOrgType, setEditOrgType] = useState<OrganizationType>(activeOrg.type);
  const [editIuranNominal, setEditIuranNominal] = useState<number>(activeOrg.settings.iuranWajibNominal);
  const [editIuranLabel, setEditIuranLabel] = useState(activeOrg.settings.iuranLabel);
  const [editBankName, setEditBankName] = useState(activeOrg.settings.bankName);
  const [editAccountNumber, setEditAccountNumber] = useState(activeOrg.settings.accountNumber);
  const [editAccountHolder, setEditAccountHolder] = useState(activeOrg.settings.accountHolder);
  const [editQrisText, setEditQrisText] = useState(activeOrg.settings.qrisCodeText || '');
  const [editKetuaName, setEditKetuaName] = useState(activeOrg.settings.ketuaName);
  const [editWakilName, setEditWakilName] = useState(activeOrg.settings.wakilName);
  const [editSekretarisName, setEditSekretarisName] = useState(activeOrg.settings.sekretarisName);
  const [editBendaharaName, setEditBendaharaName] = useState(activeOrg.settings.bendaharaName);
  const [editDeskripsi, setEditDeskripsi] = useState(activeOrg.settings.deskripsi);

  // Sync settings form when activeOrg changes
  useEffect(() => {
    setEditOrgName(activeOrg.name);
    setEditOrgTagline(activeOrg.tagline);
    setEditOrgType(activeOrg.type);
    setEditIuranNominal(activeOrg.settings.iuranWajibNominal);
    setEditIuranLabel(activeOrg.settings.iuranLabel);
    setEditBankName(activeOrg.settings.bankName);
    setEditAccountNumber(activeOrg.settings.accountNumber);
    setEditAccountHolder(activeOrg.settings.accountHolder);
    setEditQrisText(activeOrg.settings.qrisCodeText || '');
    setEditKetuaName(activeOrg.settings.ketuaName);
    setEditWakilName(activeOrg.settings.wakilName);
    setEditSekretarisName(activeOrg.settings.sekretarisName);
    setEditBendaharaName(activeOrg.settings.bendaharaName);
    setEditDeskripsi(activeOrg.settings.deskripsi);
  }, [activeOrg]);

  // Haptic feedback
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
  };

  // Helper calculation for financial balance
  const financialSummary = useMemo(() => {
    const totalMasuk = activeOrg.transactions
      .filter((t) => t.type === 'pemasukan' && t.status === 'verified')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalKeluar = activeOrg.transactions
      .filter((t) => t.type === 'pengeluaran' && t.status === 'verified')
      .reduce((sum, t) => sum + t.amount, 0);

    const saldoBersih = totalMasuk - totalKeluar;
    return { totalMasuk, totalKeluar, saldoBersih };
  }, [activeOrg.transactions]);

  // Format currency IDR
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Switch Organization Handler
  const handleSwitchOrganization = (orgId: string) => {
    triggerHaptic();
    setActiveOrgId(orgId);
    OrganizationStorageService.setActiveOrgId(orgId);
    setIsSwitchOrgModalOpen(false);
    const target = organizations.find((o) => o.id === orgId);
    showNotification(`Beralih ke organisasi: ${target?.name || orgId}`);
  };

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: OrganizationData = {
      ...activeOrg,
      name: editOrgName.trim() || activeOrg.name,
      tagline: editOrgTagline.trim() || activeOrg.tagline,
      type: editOrgType,
      settings: {
        ...activeOrg.settings,
        iuranWajibNominal: Number(editIuranNominal) || 0,
        iuranLabel: editIuranLabel.trim() || activeOrg.settings.iuranLabel,
        bankName: editBankName.trim() || activeOrg.settings.bankName,
        accountNumber: editAccountNumber.trim() || activeOrg.settings.accountNumber,
        accountHolder: editAccountHolder.trim() || activeOrg.settings.accountHolder,
        qrisCodeText: editQrisText.trim(),
        ketuaName: editKetuaName.trim() || activeOrg.settings.ketuaName,
        wakilName: editWakilName.trim() || activeOrg.settings.wakilName,
        sekretarisName: editSekretarisName.trim() || activeOrg.settings.sekretarisName,
        bendaharaName: editBendaharaName.trim() || activeOrg.settings.bendaharaName,
        deskripsi: editDeskripsi.trim() || activeOrg.settings.deskripsi,
      },
    };

    OrganizationStorageService.updateOrganization(updated);
    setOrganizations(OrganizationStorageService.getOrganizations());
    showNotification(`Pengaturan organisasi ${updated.name} berhasil disimpan!`);
  };

  // Create New Organization Handler
  const handleCreateOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    const newOrg: OrganizationData = {
      id: `org-${Date.now()}`,
      name: newOrgName.trim(),
      shortCode: newOrgShortCode.trim() || newOrgName.slice(0, 5).toUpperCase(),
      type: newOrgType,
      tagline: newOrgTagline.trim() || 'Organisasi Terpercaya & Berdaya',
      iconName: newOrgType === 'dkm_masjid' ? 'Building2' : newOrgType === 'panti_asuhan' ? 'Heart' : 'Users',
      colorTheme: newOrgType === 'dkm_masjid' ? 'teal' : newOrgType === 'partai' ? 'red' : 'emerald',
      currentUserRole: newOrgUserRole,
      currentUserTier: 'tier2',
      settings: {
        iuranWajibNominal: Number(newOrgIuran) || 0,
        iuranLabel: newOrgIuranLabel.trim() || 'Iuran Bulanan',
        bankName: newOrgBank.trim(),
        accountNumber: newOrgRek.trim() || '1234567890',
        accountHolder: newOrgRekHolder.trim() || newOrgName.trim(),
        qrisCodeText: `QRIS-${Date.now()}`,
        ketuaName: currentUser.name,
        wakilName: 'Wakil Ketua',
        sekretarisName: 'Sekretaris',
        bendaharaName: 'Bendahara',
        deskripsi: `Organisasi ${newOrgName} dibentuk mandiri di platform PaguyubanQu.`,
      },
      members: [
        {
          id: `m-init-${Date.now()}`,
          name: currentUser.name,
          roleTitle: newOrgUserRole,
          roleTier: 'tier2',
          phone: currentUser.phone,
          blockNumber: currentUser.blockNumber,
          joinedAt: new Date().toISOString().split('T')[0],
        },
      ],
      transactions: [],
      agendas: [],
      announcements: [
        {
          id: `ann-init-${Date.now()}`,
          title: `Selamat Datang di ${newOrgName.trim()}`,
          content: 'Organisasi ini siap digunakan untuk pencatatan kas, buku anggota, dan agenda bersama.',
          date: new Date().toISOString().split('T')[0],
          isPinned: true,
        },
      ],
    };

    OrganizationStorageService.addOrganization(newOrg);
    setOrganizations(OrganizationStorageService.getOrganizations());
    setActiveOrgId(newOrg.id);
    setIsAddOrgModalOpen(false);
    // Reset form
    setNewOrgName('');
    setNewOrgShortCode('');
    setNewOrgTagline('');
    setNewOrgRek('');
    setNewOrgRekHolder('');
    showNotification(`Organisasi "${newOrg.name}" berhasil dibuat & langsung aktif!`);
  };

  // Add Member Handler
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newM: OrganizationMember = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      roleTitle: newMemberRole.trim() || 'Anggota',
      roleTier: newMemberTier,
      phone: newMemberPhone.trim() || '0812-xxxx-xxxx',
      blockNumber: newMemberBlock.trim() || 'Unit Aktif',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    const updated: OrganizationData = {
      ...activeOrg,
      members: [newM, ...activeOrg.members],
    };

    OrganizationStorageService.updateOrganization(updated);
    setOrganizations(OrganizationStorageService.getOrganizations());
    setIsAddMemberModalOpen(false);
    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberBlock('');
    showNotification(`Anggota baru ${newM.name} (${newM.roleTitle}) berhasil didaftarkan.`);
  };

  // Add Transaction Handler
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle.trim() || !txAmount || Number(txAmount) <= 0) return;

    const newTx: OrganizationTransaction = {
      id: `tx-${Date.now()}`,
      type: transactionFormType,
      title: txTitle.trim(),
      amount: Number(txAmount),
      category: txCategory,
      paymentMethod: txMethod,
      date: txDate,
      senderOrPayer: txSender.trim() || (transactionFormType === 'pemasukan' ? 'Hamba Allah' : 'Kasir/Penyedia'),
      notes: txNotes.trim(),
      status: 'verified',
    };

    const updated: OrganizationData = {
      ...activeOrg,
      transactions: [newTx, ...activeOrg.transactions],
    };

    OrganizationStorageService.updateOrganization(updated);
    setOrganizations(OrganizationStorageService.getOrganizations());
    setIsAddTransactionModalOpen(false);
    setTxTitle('');
    setTxAmount('');
    setTxSender('');
    setTxNotes('');
    showNotification(
      `${transactionFormType === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'} senilai ${formatRupiah(newTx.amount)} berhasil dicatat.`
    );
  };

  // Add Agenda Handler
  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agTitle.trim() || !agDate) return;

    const newAg: OrganizationAgenda = {
      id: `ag-${Date.now()}`,
      title: agTitle.trim(),
      date: agDate,
      time: agTime,
      location: agLocation.trim() || 'Lokasi Bersama',
      description: agDesc.trim(),
      category: agCategory,
      status: 'akan_datang',
      attendeesCount: 1,
    };

    const updated: OrganizationData = {
      ...activeOrg,
      agendas: [newAg, ...activeOrg.agendas],
    };

    OrganizationStorageService.updateOrganization(updated);
    setOrganizations(OrganizationStorageService.getOrganizations());
    setIsAddAgendaModalOpen(false);
    setAgTitle('');
    setAgLocation('');
    setAgDesc('');
    showNotification(`Agenda "${newAg.title}" berhasil dijadwalkan.`);
  };

  // Toggle Agenda Status
  const handleToggleAgendaStatus = (agId: string) => {
    const updatedAgendas = activeOrg.agendas.map((ag) =>
      ag.id === agId
        ? {
            ...ag,
            status: (ag.status === 'akan_datang' ? 'selesai' : 'akan_datang') as 'akan_datang' | 'selesai',
          }
        : ag
    );
    const updated: OrganizationData = {
      ...activeOrg,
      agendas: updatedAgendas,
    };
    OrganizationStorageService.updateOrganization(updated);
    setOrganizations(OrganizationStorageService.getOrganizations());
    showNotification('Status agenda berhasil diperbarui.');
  };

  // Helper icon for organization type
  const getOrgTypeIcon = (type: OrganizationType) => {
    switch (type) {
      case 'dkm_masjid':
        return Building2;
      case 'panti_asuhan':
        return Heart;
      case 'ormas':
        return Shield;
      case 'partai':
        return Flag;
      default:
        return Users;
    }
  };

  const OrgIcon = getOrgTypeIcon(activeOrg.type);

  // Filtered Members
  const filteredMembers = useMemo(() => {
    return activeOrg.members.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.roleTitle.toLowerCase().includes(memberSearch.toLowerCase()) ||
        (m.blockNumber && m.blockNumber.toLowerCase().includes(memberSearch.toLowerCase()));
      if (!matchSearch) return false;
      if (memberRoleFilter === 'tier2') return m.roleTier === 'tier2';
      if (memberRoleFilter === 'tier1') return m.roleTier === 'tier1';
      return true;
    });
  }, [activeOrg.members, memberSearch, memberRoleFilter]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return activeOrg.transactions.filter((t) => {
      if (kasTabFilter === 'pemasukan') return t.type === 'pemasukan';
      if (kasTabFilter === 'pengeluaran') return t.type === 'pengeluaran';
      return true;
    });
  }, [activeOrg.transactions, kasTabFilter]);

  // Filtered Agendas
  const filteredAgendas = useMemo(() => {
    return activeOrg.agendas.filter((ag) => {
      if (agendaStatusFilter === 'akan_datang') return ag.status === 'akan_datang';
      if (agendaStatusFilter === 'selesai') return ag.status === 'selesai';
      return true;
    });
  }, [activeOrg.agendas, agendaStatusFilter]);

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden select-none transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* 1. TOP HEADER: UNIFIED IN MAIN TOP HEADER (ONLY SHOWN IF hideInternalHeader IS FALSE) */}
      {!hideInternalHeader && (
        <div className="bg-stone-900 border-b border-stone-800 px-3.5 py-2.5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1.5px] shadow-sm shrink-0">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center">
                <OrgIcon className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  PaguyubanQu
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-800 text-stone-300 border border-stone-700 font-semibold truncate">
                  {activeOrg.type === 'dkm_masjid'
                    ? 'DKM Masjid'
                    : activeOrg.type === 'panti_asuhan'
                    ? 'Panti Asuhan'
                    : activeOrg.type === 'ormas'
                    ? 'Ormas'
                    : activeOrg.type === 'partai'
                    ? 'Partai'
                    : 'RT / RW'}
                </span>
              </div>
              <h1 className="text-xs font-black text-white truncate max-w-[200px] xs:max-w-[240px]">
                {activeOrg.name}
              </h1>
            </div>
          </div>

          {/* Switch Organization & Add Org Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                triggerHaptic();
                setIsSwitchOrgModalOpen(true);
              }}
              title="Ganti Organisasi (DKM, Panti, Ormas, RT, dll)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-300 text-[11px] font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline">Ganti</span>
              <span>Org</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic();
                setIsAddOrgModalOpen(true);
              }}
              title="Tambah Organisasi Baru"
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all active:scale-95 cursor-pointer border border-stone-700"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Area (Based on activeSubTab) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* ========================================================= */}
        {/* TAB 1: 🏠 BERANDA (DASHBOARD)                              */}
        {/* ========================================================= */}
        {currentSubTab === 'beranda' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            {/* Active Organization Info Banner */}
            <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white rounded-2xl p-4 border border-stone-800 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-stone-300">
                    Sedang Mengaktifkan:
                  </span>
                </div>
                <button
                  onClick={() => setIsSwitchOrgModalOpen(true)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer"
                >
                  Ubah Organisasi ➔
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <OrgIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="truncate">{activeOrg.name}</span>
              </h2>

              <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                {activeOrg.tagline}
              </p>

              {/* Status Peran Anda */}
              <div className="mt-3 pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-400">Status Peran Anda:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-extrabold flex items-center gap-1 shadow-xs">
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    {activeOrg.currentUserRole}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    activeOrg.currentUserTier === 'tier2'
                      ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                      : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  {activeOrg.currentUserTier === 'tier2' ? 'Tier 2 (Pengurus/Admin)' : 'Tier 1 (Anggota)'}
                </span>
              </div>
            </div>

            {/* Ringkasan Saldo Kas Saat Ini (Pemasukan vs Pengeluaran) */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Saldo Kas Organisasi Saat Ini
                  </span>
                  <div className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
                    {formatRupiah(financialSummary.saldoBersih)}
                  </div>
                </div>

                <button
                  onClick={() => setSubTab('kas')}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Buku Kas</span>
                </button>
              </div>

              {/* Grid 2 Kolom Pemasukan vs Pengeluaran */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
                  <div className="flex items-center justify-between text-emerald-800 mb-1">
                    <span className="text-[11px] font-bold">Total Pemasukan</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm font-extrabold text-emerald-900">
                    {formatRupiah(financialSummary.totalMasuk)}
                  </div>
                  <span className="text-[9px] text-emerald-700 block mt-0.5">
                    Iuran, infak & sumbangan
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/70">
                  <div className="flex items-center justify-between text-red-800 mb-1">
                    <span className="text-[11px] font-bold">Total Pengeluaran</span>
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-sm font-extrabold text-red-900">
                    {formatRupiah(financialSummary.totalKeluar)}
                  </div>
                  <span className="text-[9px] text-red-700 block mt-0.5">
                    Operasional & fasilitas
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setTransactionFormType('pemasukan');
                  setIsAddTransactionModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-center cursor-pointer active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-1.5 shadow-2xs">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-extrabold text-stone-800">
                  + Pemasukan
                </div>
                <div className="text-[9px] text-stone-500">Iuran / Infak</div>
              </button>

              <button
                onClick={() => {
                  setTransactionFormType('pengeluaran');
                  setIsAddTransactionModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-red-400 hover:bg-red-50/30 transition-all text-center cursor-pointer active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-800 mx-auto flex items-center justify-center mb-1.5 shadow-2xs">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-extrabold text-stone-800">
                  - Pengeluaran
                </div>
                <div className="text-[9px] text-stone-500">Biaya / Operasional</div>
              </button>

              <button
                onClick={() => setIsAddAgendaModalOpen(true)}
                className="p-3 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-teal-400 hover:bg-teal-50/30 transition-all text-center cursor-pointer active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 mx-auto flex items-center justify-center mb-1.5 shadow-2xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-extrabold text-stone-800">
                  + Agenda
                </div>
                <div className="text-[9px] text-stone-500">Rapat / Kegiatan</div>
              </button>
            </div>

            {/* Pengumuman & Agenda Terdekat */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-amber-600" />
                  Pengumuman Organisasi
                </span>
                <button
                  onClick={() => setIsAddAnnouncementModalOpen(true)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
                >
                  + Tambah Info
                </button>
              </div>

              {activeOrg.announcements.length === 0 ? (
                <div className="bg-white rounded-2xl p-4 text-center text-xs text-stone-500 border border-dashed border-stone-300">
                  Belum ada pengumuman untuk organisasi ini.
                </div>
              ) : (
                activeOrg.announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                        {ann.isPinned && (
                          <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 rotate-45 shrink-0" />
                        )}
                        <span>{ann.title}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 shrink-0">{ann.date}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Agenda Terdekat Widget */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Agenda Mendatang
                </span>
                <button
                  onClick={() => setSubTab('agenda')}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
                >
                  Lihat Semua ({activeOrg.agendas.length}) ➔
                </button>
              </div>

              {activeOrg.agendas.filter((a) => a.status === 'akan_datang').length === 0 ? (
                <div className="bg-white rounded-2xl p-4 text-center text-xs text-stone-500 border border-dashed border-stone-300">
                  Tidak ada agenda mendatang saat ini.
                </div>
              ) : (
                activeOrg.agendas
                  .filter((a) => a.status === 'akan_datang')
                  .slice(0, 2)
                  .map((ag) => (
                    <div
                      key={ag.id}
                      className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase">
                            {ag.category}
                          </span>
                          <span className="text-[11px] text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ag.date} • {ag.time}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-stone-900 truncate">
                          {ag.title}
                        </h4>
                        <div className="text-[10px] text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span className="truncate">{ag.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleAgendaStatus(ag.id)}
                        title="Tandai Selesai"
                        className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 text-[11px] font-bold transition-all shrink-0 cursor-pointer"
                      >
                        Selesai
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: 👥 WARGA / ANGGOTA                                  */}
        {/* ========================================================= */}
        {currentSubTab === 'anggota' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Header Anggota & Quick Add */}
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-stone-900">
                    Buku Anggota & Pengurus
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {activeOrg.members.length} Anggota terdaftar di {activeOrg.name}
                  </p>
                </div>
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Anggota</span>
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Cari nama, peran, atau blok..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl border border-stone-200 shrink-0 text-[10px] font-bold">
                  <button
                    onClick={() => setMemberRoleFilter('all')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      memberRoleFilter === 'all'
                        ? 'bg-white text-stone-900 shadow-xs font-extrabold'
                        : 'text-stone-500'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setMemberRoleFilter('tier2')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      memberRoleFilter === 'tier2'
                        ? 'bg-white text-emerald-800 shadow-xs font-extrabold'
                        : 'text-stone-500'
                    }`}
                  >
                    Pengurus
                  </button>
                  <button
                    onClick={() => setMemberRoleFilter('tier1')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      memberRoleFilter === 'tier1'
                        ? 'bg-white text-stone-800 shadow-xs font-extrabold'
                        : 'text-stone-500'
                    }`}
                  >
                    Warga
                  </button>
                </div>
              </div>
            </div>

            {/* List Kartu Anggota */}
            <div className="space-y-2">
              {filteredMembers.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-stone-500 text-xs border border-dashed border-stone-300">
                  Tidak ditemukan anggota yang sesuai pencarian.
                </div>
              ) : (
                filteredMembers.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${
                          m.roleTier === 'tier2'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 ring-2 ring-emerald-400/20'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {m.name.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-extrabold text-stone-900 truncate">
                            {m.name}
                          </h4>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                              m.roleTier === 'tier2'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {m.roleTier === 'tier2' ? 'Tier 2 • Pengurus' : 'Tier 1 • Anggota'}
                          </span>
                        </div>

                        <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                          {m.roleTitle}
                        </div>

                        <div className="text-[10px] text-stone-400 flex items-center gap-2 mt-0.5">
                          {m.blockNumber && <span>{m.blockNumber}</span>}
                          {m.phone && <span>• {m.phone}</span>}
                        </div>
                      </div>
                    </div>

                    {m.phone && (
                      <a
                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Kirim Pesan WhatsApp"
                        className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: 💰 KAS & KEUANGAN                                   */}
        {/* ========================================================= */}
        {currentSubTab === 'kas' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Top Financial Summary Card */}
            <div className="bg-stone-900 text-white rounded-2xl p-4 border border-stone-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Saldo Kas {activeOrg.shortCode}
                  </span>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">
                    {formatRupiah(financialSummary.saldoBersih)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Iuran Wajib:</span>
                  <span className="text-xs font-bold text-amber-300">
                    {activeOrg.settings.iuranWajibNominal > 0
                      ? `${formatRupiah(activeOrg.settings.iuranWajibNominal)}/bln`
                      : 'Sukarela / Infak'}
                  </span>
                </div>
              </div>

              {/* Rekening Info Pill */}
              {activeOrg.settings.accountNumber && (
                <div className="bg-stone-950/80 rounded-xl p-2.5 border border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="text-[11px]">
                      <span className="font-bold text-white">
                        {activeOrg.settings.bankName}:
                      </span>{' '}
                      <span className="font-mono text-emerald-300">
                        {activeOrg.settings.accountNumber}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 truncate max-w-[120px]">
                    a.n {activeOrg.settings.accountHolder}
                  </span>
                </div>
              )}

              {/* Action Buttons: Pemasukan & Pengeluaran */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setTransactionFormType('pemasukan');
                    setIsAddTransactionModalOpen(true);
                  }}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Catat Pemasukan</span>
                </button>

                <button
                  onClick={() => {
                    setTransactionFormType('pengeluaran');
                    setIsAddTransactionModalOpen(true);
                  }}
                  className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>- Catat Pengeluaran</span>
                </button>
              </div>
            </div>

            {/* Filter Sub-Menu Pemasukan / Pengeluaran */}
            <div className="flex items-center justify-between bg-white p-1 rounded-2xl border border-stone-200 shadow-xs text-xs font-bold">
              <button
                onClick={() => setKasTabFilter('all')}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  kasTabFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua ({activeOrg.transactions.length})
              </button>
              <button
                onClick={() => setKasTabFilter('pemasukan')}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  kasTabFilter === 'pemasukan'
                    ? 'bg-emerald-800 text-white shadow-xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setKasTabFilter('pengeluaran')}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  kasTabFilter === 'pengeluaran'
                    ? 'bg-red-800 text-white shadow-xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Pengeluaran
              </button>
            </div>

            {/* List Transaksi */}
            <div className="space-y-2">
              {filteredTransactions.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-stone-500 text-xs border border-dashed border-stone-300">
                  Belum ada catatan transaksi pada kategori ini.
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'pemasukan'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tx.type === 'pemasukan' ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-stone-900 truncate">
                          {tx.title}
                        </h4>
                        <div className="text-[10px] text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <span className="uppercase font-semibold text-stone-600">
                            {tx.paymentMethod}
                          </span>
                          <span>•</span>
                          <span className="truncate">{tx.senderOrPayer}</span>
                        </div>
                        {tx.notes && (
                          <p className="text-[9.5px] text-stone-400 italic mt-0.5 truncate">
                            &quot;{tx.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-xs font-black ${
                          tx.type === 'pemasukan' ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        {tx.type === 'pemasukan' ? '+' : '-'} {formatRupiah(tx.amount)}
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600">
                        {tx.category}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: 📅 AGENDA / KEGIATAN                                 */}
        {/* ========================================================= */}
        {currentSubTab === 'agenda' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Header Agenda & Quick Add */}
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-stone-900">
                  Agenda & Kegiatan Organisasi
                </h3>
                <p className="text-[11px] text-stone-500">
                  Jadwal rutin ronda, kerja bakti, pengajian, dan rapat pleno
                </p>
              </div>

              <button
                onClick={() => setIsAddAgendaModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agenda</span>
              </button>
            </div>

            {/* Filter Status: Akan Datang vs Selesai */}
            <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setAgendaStatusFilter('all')}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  agendaStatusFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs font-extrabold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua ({activeOrg.agendas.length})
              </button>
              <button
                onClick={() => setAgendaStatusFilter('akan_datang')}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  agendaStatusFilter === 'akan_datang'
                    ? 'bg-teal-800 text-white shadow-xs font-extrabold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Akan Datang
              </button>
              <button
                onClick={() => setAgendaStatusFilter('selesai')}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  agendaStatusFilter === 'selesai'
                    ? 'bg-stone-800 text-white shadow-xs font-extrabold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Selesai
              </button>
            </div>

            {/* List Agenda */}
            <div className="space-y-2.5">
              {filteredAgendas.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-stone-500 text-xs border border-dashed border-stone-300">
                  Belum ada jadwal kegiatan pada kategori ini.
                </div>
              ) : (
                filteredAgendas.map((ag) => (
                  <div
                    key={ag.id}
                    className={`bg-white rounded-2xl p-4 border shadow-xs space-y-2.5 ${
                      ag.status === 'selesai'
                        ? 'border-stone-200 opacity-75'
                        : 'border-teal-200/80 ring-1 ring-teal-500/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ag.status === 'akan_datang'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {ag.category}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            ag.status === 'akan_datang'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {ag.status === 'akan_datang' ? 'Akan Datang' : 'Selesai'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleAgendaStatus(ag.id)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                          ag.status === 'akan_datang'
                            ? 'bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {ag.status === 'akan_datang' ? 'Tandai Selesai' : 'Buka Kembali'}
                      </button>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-stone-900">
                        {ag.title}
                      </h4>
                      {ag.description && (
                        <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                          {ag.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-500 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-semibold text-stone-700">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {ag.date} • {ag.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {ag.location}
                        </span>
                      </div>

                      {ag.attendeesCount !== undefined && (
                        <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-md text-stone-600 font-bold">
                          👥 {ag.attendeesCount} Peserta
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ⚙️ SETTING KHUSUS ORGANISASI                         */}
        {/* ========================================================= */}
        {currentSubTab === 'setting_org' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            {/* Form Setting Spesifik Organisasi */}
            <form
              onSubmit={handleSaveSettings}
              className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-4"
            >
              <div className="border-b border-stone-100 pb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-stone-900">
                    Pengaturan Khusus: {activeOrg.name}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Atur nama, nominal iuran, rekening penerimaan dana, dan struktur kepengurusan
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  ⚙️
                </div>
              </div>

              {/* Ganti Nama Organisasi & Jenis */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Nama Organisasi / Paguyuban
                  </label>
                  <input
                    type="text"
                    value={editOrgName}
                    onChange={(e) => setEditOrgName(e.target.value)}
                    required
                    placeholder="Contoh: DKM Al-Hidayah / RT 04 Sukamaju / Panti Kasih"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Nama ini akan tampil di seluruh menu, kwitansi kas, dan dashboard.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Jenis Organisasi
                    </label>
                    <select
                      value={editOrgType}
                      onChange={(e) => setEditOrgType(e.target.value as OrganizationType)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    >
                      <option value="rt_rw">RT / RW / Perumahan</option>
                      <option value="dkm_masjid">DKM Masjid / Musholla</option>
                      <option value="panti_asuhan">Panti Asuhan / Yayasan</option>
                      <option value="ormas">Ormas / Komunitas</option>
                      <option value="partai">Partai / Sayap Politik</option>
                      <option value="paguyuban">Paguyuban Sosial / Alumni</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Slogan / Tagline
                    </label>
                    <input
                      type="text"
                      value={editOrgTagline}
                      onChange={(e) => setEditOrgTagline(e.target.value)}
                      placeholder="Slogan atau visi misi"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>
              </div>

              {/* Atur Nominal Iuran Wajib */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2.5">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  Aturan Iuran / Donasi Wajib
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Nominal Iuran Wajib (Rp)
                    </label>
                    <input
                      type="number"
                      value={editIuranNominal}
                      onChange={(e) => setEditIuranNominal(Number(e.target.value))}
                      placeholder="65000 (0 jika sukarela)"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                    <span className="text-[9.5px] text-stone-400 mt-0.5 block">
                      Khusus RT misal Rp65.000, DKM misal 0
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Label / Jenis Iuran
                    </label>
                    <input
                      type="text"
                      value={editIuranLabel}
                      onChange={(e) => setEditIuranLabel(e.target.value)}
                      placeholder="Iuran Sampah & Keamanan"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>
              </div>

              {/* Rekening Bank & QRIS Khusus Organisasi */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2.5">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                  Rekening Penerimaan Dana / QRIS
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Nama Bank
                    </label>
                    <input
                      type="text"
                      value={editBankName}
                      onChange={(e) => setEditBankName(e.target.value)}
                      placeholder="BSI / BCA / Mandiri"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-bold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      value={editAccountNumber}
                      onChange={(e) => setEditAccountNumber(e.target.value)}
                      placeholder="Contoh: 7144-8899-001"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-mono font-bold text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Nama Pemilik Rekening (a.n)
                    </label>
                    <input
                      type="text"
                      value={editAccountHolder}
                      onChange={(e) => setEditAccountHolder(e.target.value)}
                      placeholder="Nama organisasi resmi"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Kode QRIS Khusus
                    </label>
                    <input
                      type="text"
                      value={editQrisText}
                      onChange={(e) => setEditQrisText(e.target.value)}
                      placeholder="QRIS-ID"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-mono text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Struktur Kepengurusan */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2.5">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  Struktur Kepengurusan Organisasi
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Ketua / Pimpinan
                    </label>
                    <input
                      type="text"
                      value={editKetuaName}
                      onChange={(e) => setEditKetuaName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-semibold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Wakil Ketua
                    </label>
                    <input
                      type="text"
                      value={editWakilName}
                      onChange={(e) => setEditWakilName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-semibold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Sekretaris
                    </label>
                    <input
                      type="text"
                      value={editSekretarisName}
                      onChange={(e) => setEditSekretarisName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-semibold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Bendahara
                    </label>
                    <input
                      type="text"
                      value={editBendaharaName}
                      onChange={(e) => setEditBendaharaName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-semibold text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Pengaturan Organisasi Ini</span>
              </button>
            </form>

            {/* Organisasi Management Actions */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
              <h4 className="text-xs font-extrabold text-stone-800">
                Kelola Ragam Organisasi Lainnya
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsAddOrgModalOpen(true)}
                  className="p-3 rounded-xl border border-stone-300 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50/40 text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800 mb-0.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Org Baru</span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    DKM, Ormas, Panti, Partai, dll
                  </p>
                </button>

                <button
                  onClick={() => setIsSwitchOrgModalOpen(true)}
                  className="p-3 rounded-xl border border-stone-300 hover:border-teal-500 bg-stone-50 hover:bg-teal-50/40 text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-teal-800 mb-0.5">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Beralih Organisasi</span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    Pilih dari {organizations.length} organisasi
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: SWITCH ORGANISASI PICKER                         */}
      {/* ========================================================= */}
      {isSwitchOrgModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsSwitchOrgModalOpen(false)}
        >
          <div
            className="bg-stone-900 border-t sm:border border-stone-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Pilih & Beralih Organisasi
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Tersedia {organizations.length} modul organisasi aktif
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSwitchOrgModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List Organisasi */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {organizations.map((org) => {
                const ItemIcon = getOrgTypeIcon(org.type);
                const isSelected = org.id === activeOrgId;

                return (
                  <button
                    key={org.id}
                    onClick={() => handleSwitchOrganization(org.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-stone-950'
                            : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        <ItemIcon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-black text-white truncate">
                            {org.name}
                          </h4>
                          {isSelected && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-400 text-stone-950">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                          {org.tagline}
                        </p>
                        <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-2">
                          <span>Peran: {org.currentUserRole}</span>
                          <span>•</span>
                          <span>{org.members.length} Anggota</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Bottom Add Action */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setIsSwitchOrgModalOpen(false);
                  setIsAddOrgModalOpen(true);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Buat Organisasi Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TAMBAH ORGANISASI BARU FORM                       */}
      {/* ========================================================= */}
      {isAddOrgModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddOrgModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-900">
                    Tambah Organisasi Baru
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    DKM Masjid, Panti Asuhan, Ormas, Partai, atau Komunitas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOrgModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateOrganization}
              className="flex-1 overflow-y-auto py-3 space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nama Organisasi *
                </label>
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  required
                  placeholder="Misal: DKM Al-Ikhlas / Panti Yatim Sejahtera"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Jenis Organisasi
                  </label>
                  <select
                    value={newOrgType}
                    onChange={(e) => setNewOrgType(e.target.value as OrganizationType)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                  >
                    <option value="dkm_masjid">DKM Masjid</option>
                    <option value="panti_asuhan">Panti Asuhan</option>
                    <option value="ormas">Ormas / LSM</option>
                    <option value="partai">Partai Politik</option>
                    <option value="rt_rw">RT / RW</option>
                    <option value="komunitas">Komunitas / Paguyuban</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Kode Singkat
                  </label>
                  <input
                    type="text"
                    value={newOrgShortCode}
                    onChange={(e) => setNewOrgShortCode(e.target.value)}
                    placeholder="Contoh: DKM / PANTI"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Tagline / Visi Singkat
                </label>
                <input
                  type="text"
                  value={newOrgTagline}
                  onChange={(e) => setNewOrgTagline(e.target.value)}
                  placeholder="Contoh: Menyejahterakan anak asuh & ummat"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Nominal Iuran Wajib (Rp)
                  </label>
                  <input
                    type="number"
                    value={newOrgIuran}
                    onChange={(e) => setNewOrgIuran(Number(e.target.value))}
                    placeholder="0 jika sukarela"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Peran Anda di Sini
                  </label>
                  <input
                    type="text"
                    value={newOrgUserRole}
                    onChange={(e) => setNewOrgUserRole(e.target.value)}
                    placeholder="Ketua / Bendahara / Anggota"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOrgModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-md"
                >
                  Simpan & Aktifkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: TAMBAH ANGGOTA BARU                               */}
      {/* ========================================================= */}
      {isAddMemberModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddMemberModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-black text-stone-900">
                Tambah Anggota / Pengurus
              </h3>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="py-3 space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  required
                  placeholder="Nama warga atau kader"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Jabatan / Peran
                  </label>
                  <input
                    type="text"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    placeholder="Ketua, Bendahara, Anggota"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Tingkat / Tier
                  </label>
                  <select
                    value={newMemberTier}
                    onChange={(e) => setNewMemberTier(e.target.value as 'tier1' | 'tier2')}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                  >
                    <option value="tier1">Tier 1 - Anggota Biasa</option>
                    <option value="tier2">Tier 2 - Pengurus / Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    No. HP / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Alamat / Blok / Unit
                  </label>
                  <input
                    type="text"
                    value={newMemberBlock}
                    onChange={(e) => setNewMemberBlock(e.target.value)}
                    placeholder="Blok C3 No. 12"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-md"
                >
                  Daftarkan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: CATAT TRANSAKSI (PEMASUKAN / PENGELUARAN)         */}
      {/* ========================================================= */}
      {isAddTransactionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddTransactionModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-black text-stone-900">
                {transactionFormType === 'pemasukan' ? '+ Catat Pemasukan Kas' : '- Catat Pengeluaran Kas'}
              </h3>
              <button
                onClick={() => setIsAddTransactionModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="py-3 space-y-3">
              {/* Type Switcher */}
              <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTransactionFormType('pemasukan')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    transactionFormType === 'pemasukan'
                      ? 'bg-emerald-800 text-white shadow-xs font-extrabold'
                      : 'text-stone-600'
                  }`}
                >
                  Pemasukan (Masuk)
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionFormType('pengeluaran')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    transactionFormType === 'pengeluaran'
                      ? 'bg-red-800 text-white shadow-xs font-extrabold'
                      : 'text-stone-600'
                  }`}
                >
                  Pengeluaran (Keluar)
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Keterangan / Judul Transaksi *
                </label>
                <input
                  type="text"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  required
                  placeholder={
                    transactionFormType === 'pemasukan'
                      ? 'Iuran Rutin Warga Blok B / Infak Subuh'
                      : 'Biaya Iuran Sampah / Konsumsi Rapat'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Nominal (Rp) *
                  </label>
                  <input
                    type="number"
                    value={txAmount}
                    onChange={(e) => setTxAmount(Number(e.target.value))}
                    required
                    placeholder="Contoh: 65000"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={txMethod}
                    onChange={(e) => setTxMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                  >
                    <option value="cash">Cash / Tunai</option>
                    <option value="transfer">Transfer Bank</option>
                    <option value="qris">QRIS Digital</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {transactionFormType === 'pemasukan' ? 'Penyetor / Donatur' : 'Penerima / Toko'}
                  </label>
                  <input
                    type="text"
                    value={txSender}
                    onChange={(e) => setTxSender(e.target.value)}
                    placeholder="Nama pihak terkait"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  placeholder="Catatan nomor kwitansi / invoice"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                />
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTransactionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white text-xs font-black shadow-md ${
                    transactionFormType === 'pemasukan'
                      ? 'bg-emerald-800 hover:bg-emerald-700'
                      : 'bg-red-800 hover:bg-red-700'
                  }`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: BUAT AGENDA BARU                                  */}
      {/* ========================================================= */}
      {isAddAgendaModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddAgendaModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-black text-stone-900">
                Jadwalkan Agenda / Kegiatan
              </h3>
              <button
                onClick={() => setIsAddAgendaModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAgenda} className="py-3 space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nama Kegiatan / Agenda *
                </label>
                <input
                  type="text"
                  value={agTitle}
                  onChange={(e) => setAgTitle(e.target.value)}
                  required
                  placeholder="Misal: Ronda Malam Regu 2 / Rapat Pleno / Pengajian"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={agDate}
                    onChange={(e) => setAgDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Waktu
                  </label>
                  <input
                    type="text"
                    value={agTime}
                    onChange={(e) => setAgTime(e.target.value)}
                    placeholder="19:30 - 21:00 WIB"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Kategori
                  </label>
                  <select
                    value={agCategory}
                    onChange={(e) => setAgCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                  >
                    <option value="ronda">Ronda Malam</option>
                    <option value="kerja_bakti">Kerja Bakti</option>
                    <option value="rapat_pleno">Rapat Pleno</option>
                    <option value="pengajian">Pengajian / Ibadah</option>
                    <option value="konsolidasi">Konsolidasi</option>
                    <option value="santunan">Santunan / Bakti Sosial</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Lokasi Kegiatan
                  </label>
                  <input
                    type="text"
                    value={agLocation}
                    onChange={(e) => setAgLocation(e.target.value)}
                    placeholder="Balai Warga / Masjid / Pos"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Deskripsi / Catatan Agenda
                </label>
                <textarea
                  value={agDesc}
                  onChange={(e) => setAgDesc(e.target.value)}
                  rows={2}
                  placeholder="Rincian persiapan atau perlengkapan yang perlu dibawa..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAgendaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-black shadow-md"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: BUAT PENGUMUMAN BARU                              */}
      {/* ========================================================= */}
      {isAddAnnouncementModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddAnnouncementModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-black text-stone-900">
                Buat Pengumuman Organisasi
              </h3>
              <button
                onClick={() => setIsAddAnnouncementModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!annTitle.trim() || !annContent.trim()) return;

                const newAnn = {
                  id: `ann-${Date.now()}`,
                  title: annTitle.trim(),
                  content: annContent.trim(),
                  date: new Date().toISOString().split('T')[0],
                  isPinned: annIsPinned,
                };

                const updated: OrganizationData = {
                  ...activeOrg,
                  announcements: [newAnn, ...activeOrg.announcements],
                };

                OrganizationStorageService.updateOrganization(updated);
                setOrganizations(OrganizationStorageService.getOrganizations());
                setIsAddAnnouncementModalOpen(false);
                setAnnTitle('');
                setAnnContent('');
                showNotification('Pengumuman baru berhasil diterbitkan.');
              }}
              className="py-3 space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  required
                  placeholder="Misal: Himbauan Iuran / Kerja Bakti Warga"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Isi Pengumuman *
                </label>
                <textarea
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  required
                  rows={4}
                  placeholder="Tuliskan isi pengumuman atau instruksi untuk anggota..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={annIsPinned}
                  onChange={(e) => setAnnIsPinned(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="pinCheck" className="text-xs font-bold text-stone-700 cursor-pointer">
                  Sematkan di Atas (Pin Pengumuman)
                </label>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAnnouncementModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-md"
                >
                  Siarkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
