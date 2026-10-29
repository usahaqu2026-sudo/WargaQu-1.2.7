import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Utensils,
  Store,
  Wrench,
  Key,
  Mic,
  MicOff,
  Boxes,
  Receipt,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  Share2,
  Save,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Volume2,
} from 'lucide-react';

export type BizCategory = 'kuliner' | 'ritel' | 'jasa' | 'sewa';

export interface POSProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
}

export interface POSCartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  qty: number;
  note?: string;
}

export interface POSTransaction {
  id: string;
  timestamp: string;
  items: POSCartItem[];
  total: number;
  paymentMethod: 'Tunai' | 'QRIS';
  customerPhone?: string;
  category: BizCategory;
  meta?: {
    meja?: string;
    catatan?: string;
    nopol?: string;
    keluhan?: string;
    durasi?: string;
    jaminan?: string;
  };
}

export interface POSSettings {
  bizCategory: BizCategory;
  storeName: string;
  address: string;
  phone: string;
  headerMsg: string;
  footerMsg: string;
}

const SAMPLE_CATALOGS: Record<BizCategory, POSProduct[]> = {
  kuliner: [
    { id: 'P1', name: 'Ayam Bakar', price: 20000, stock: 15, unit: 'porsi' },
    { id: 'P2', name: 'Ayam Goreng', price: 18000, stock: 20, unit: 'porsi' },
    { id: 'P3', name: 'Es Teh Manis', price: 5000, stock: 50, unit: 'gelas' },
    { id: 'P4', name: 'Nasi Putih', price: 5000, stock: 40, unit: 'porsi' },
    { id: 'P5', name: 'Bakso Urat Jumbo', price: 22000, stock: 25, unit: 'mangkok' },
  ],
  ritel: [
    { id: 'P1', name: 'Minyak Goreng 1L', price: 17000, stock: 12, unit: 'pcs' },
    { id: 'P2', name: 'Beras Pandan Wangi 5kg', price: 72000, stock: 8, unit: 'sak' },
    { id: 'P3', name: 'Gula Pasir 1kg', price: 16000, stock: 25, unit: 'kg' },
    { id: 'P4', name: 'Sabun Cuci Piring', price: 10000, stock: 30, unit: 'pcs' },
    { id: 'P5', name: 'Telur Ayam 1kg', price: 28000, stock: 15, unit: 'kg' },
  ],
  jasa: [
    { id: 'P1', name: 'Servis Ringan + Ganti Oli', price: 85000, stock: 10, unit: 'slot' },
    { id: 'P2', name: 'Cuci Motor Kilat', price: 15000, stock: 20, unit: 'slot' },
    { id: 'P3', name: 'Cuci Mobil Premium', price: 45000, stock: 8, unit: 'slot' },
    { id: 'P4', name: 'Tune Up Mesin', price: 120000, stock: 5, unit: 'slot' },
    { id: 'P5', name: 'Tambal Ban Tubeless', price: 20000, stock: 30, unit: 'slot' },
  ],
  sewa: [
    { id: 'P1', name: 'Sewa Kamera DSLR Canon', price: 150000, stock: 3, unit: 'unit' },
    { id: 'P2', name: 'Lensa 50mm f/1.8', price: 50000, stock: 4, unit: 'unit' },
    { id: 'P3', name: 'Tripod Takara', price: 30000, stock: 5, unit: 'unit' },
    { id: 'P4', name: 'Lighting Softbox', price: 75000, stock: 2, unit: 'unit' },
    { id: 'P5', name: 'Sewa Tenda Dome 4P', price: 60000, stock: 6, unit: 'unit' },
  ],
};

const DEFAULT_SETTINGS: POSSettings = {
  bizCategory: 'kuliner',
  storeName: 'Kedai UsahaQu',
  address: 'Jl. Graha Kencana Blok C3 No. 12',
  phone: '081298765432',
  headerMsg: 'Selamat datang & Selamat menikmati!',
  footerMsg: 'Barang/Layanan yang sudah dibeli tidak dapat dibatalkan.',
};

interface SmartPOSAdaptifViewProps {
  onBackToAppQu: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const SmartPOSAdaptifView: React.FC<SmartPOSAdaptifViewProps> = ({
  onBackToAppQu,
  theme = 'dark',
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  // Tabs: 'kasir' | 'stok' | 'riwayat'
  const [activeTab, setActiveTab] = useState<'kasir' | 'stok' | 'riwayat'>('kasir');

  // Onboarding Wizard State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem('usahaqu_onboarding_done');
  });
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [selectedOnboardingCat, setSelectedOnboardingCat] = useState<BizCategory>('kuliner');
  const [obStoreName, setObStoreName] = useState('');
  const [obStoreUnit, setObStoreUnit] = useState('porsi');
  const [obStorePhone, setObStorePhone] = useState('');

  // Core POS Data States
  const [settings, setSettings] = useState<POSSettings>(() => {
    try {
      const raw = localStorage.getItem('usahaqu_settings');
      return raw ? JSON.parse(raw) : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  });

  const [products, setProducts] = useState<POSProduct[]>(() => {
    try {
      const raw = localStorage.getItem('usahaqu_products');
      if (raw) return JSON.parse(raw);
      const cat = (localStorage.getItem('usahaqu_settings')
        ? JSON.parse(localStorage.getItem('usahaqu_settings')!).bizCategory
        : 'kuliner') as BizCategory;
      return [...SAMPLE_CATALOGS[cat] || SAMPLE_CATALOGS.kuliner];
    } catch {
      return [...SAMPLE_CATALOGS.kuliner];
    }
  });

  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [transactions, setTransactions] = useState<POSTransaction[]>(() => {
    try {
      const raw = localStorage.getItem('usahaqu_transactions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Category-specific order metadata
  const [customOrderMeta, setCustomOrderMeta] = useState<{
    meja?: string;
    catatan?: string;
    nopol?: string;
    keluhan?: string;
    durasi?: string;
    jaminan?: string;
  }>({});

  // Payment form states
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS'>('Tunai');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  // Voice recognition states
  const [isListeningOrder, setIsListeningOrder] = useState<boolean>(false);
  const [orderVoiceTranscript, setOrderVoiceTranscript] = useState<string>('');
  const [isListeningStock, setIsListeningStock] = useState<boolean>(false);
  const [stockVoiceTranscript, setStockVoiceTranscript] = useState<string>('');

  // Product Form states (Add/Edit)
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formProdName, setFormProdName] = useState('');
  const [formProdPrice, setFormProdPrice] = useState<number | ''>('');
  const [formProdStock, setFormProdStock] = useState<number | ''>('');
  const [formProdUnit, setFormProdUnit] = useState('porsi');

  // Receipt Settings Form
  const [settingStoreName, setSettingStoreName] = useState(settings.storeName);
  const [settingAddress, setSettingAddress] = useState(settings.address);
  const [settingPhone, setSettingPhone] = useState(settings.phone);
  const [settingHeaderMsg, setSettingHeaderMsg] = useState(settings.headerMsg);
  const [settingFooterMsg, setSettingFooterMsg] = useState(settings.footerMsg);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning'>('success');

  // Print Preview Modal
  const [printTransaction, setPrintTransaction] = useState<POSTransaction | null>(null);

  const orderRecognitionRef = useRef<any>(null);
  const stockRecognitionRef = useRef<any>(null);

  const showToast = (msg: string, type: 'success' | 'warning' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync state to LocalStorage
  const saveProducts = (updatedProds: POSProduct[]) => {
    setProducts(updatedProds);
    localStorage.setItem('usahaqu_products', JSON.stringify(updatedProds));
  };

  const saveTransactions = (updatedTrx: POSTransaction[]) => {
    setTransactions(updatedTrx);
    localStorage.setItem('usahaqu_transactions', JSON.stringify(updatedTrx));
  };

  const saveSettings = (updatedSettings: POSSettings) => {
    setSettings(updatedSettings);
    localStorage.setItem('usahaqu_settings', JSON.stringify(updatedSettings));
  };

  // Web Speech API Initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      // Order Voice Recognition
      const orderRec = new SpeechRecognition();
      orderRec.lang = 'id-ID';
      orderRec.continuous = false;

      orderRec.onstart = () => {
        setIsListeningOrder(true);
        setOrderVoiceTranscript('Silakan katakan pesanan Anda...');
      };

      orderRec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setOrderVoiceTranscript(`"${text}"`);
        parseOrderVoiceText(text);
      };

      orderRec.onerror = () => setIsListeningOrder(false);
      orderRec.onend = () => setIsListeningOrder(false);
      orderRecognitionRef.current = orderRec;

      // Stock Voice Recognition
      const stockRec = new SpeechRecognition();
      stockRec.lang = 'id-ID';
      stockRec.continuous = false;

      stockRec.onstart = () => {
        setIsListeningStock(true);
        setStockVoiceTranscript('Mendengarkan instruksi stok...');
      };

      stockRec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setStockVoiceTranscript(`"${text}"`);
        parseStockVoiceText(text);
      };

      stockRec.onerror = () => setIsListeningStock(false);
      stockRec.onend = () => setIsListeningStock(false);
      stockRecognitionRef.current = stockRec;
    }
  }, [products]);

  // Toggle Voice Order
  const toggleVoiceOrder = () => {
    if (!orderRecognitionRef.current) {
      showToast('Voice Recognition tidak didukung browser ini.', 'warning');
      return;
    }
    if (isListeningOrder) {
      orderRecognitionRef.current.stop();
    } else {
      orderRecognitionRef.current.start();
    }
  };

  // Toggle Voice Stock
  const toggleVoiceStock = () => {
    if (!stockRecognitionRef.current) {
      showToast('Voice Recognition tidak didukung browser ini.', 'warning');
      return;
    }
    if (isListeningStock) {
      stockRecognitionRef.current.stop();
    } else {
      stockRecognitionRef.current.start();
    }
  };

  // Parse Voice Order Text
  const parseOrderVoiceText = (text: string) => {
    const lowerText = text.toLowerCase();
    let addedCount = 0;
    const numberMap: Record<string, number> = {
      satu: 1,
      dua: 2,
      tiga: 3,
      empat: 4,
      lima: 5,
      enam: 6,
      tujuh: 7,
      delapan: 8,
      sembilan: 9,
      sepuluh: 10,
    };

    // Metadata extraction
    if (lowerText.includes('meja')) {
      const mejaMatch = lowerText.match(/meja\s*(\d+|satu|dua|tiga|empat|lima)/);
      if (mejaMatch) {
        const val = mejaMatch[1];
        const mejaNum = parseInt(val) || numberMap[val] || val;
        setCustomOrderMeta((prev) => ({ ...prev, meja: `Meja ${mejaNum}` }));
      }
    }

    if (lowerText.includes('plat') || lowerText.includes('nopol')) {
      const nopolMatch = lowerText.match(/(plat|nopol)\s*([a-z0-9\s]+)/);
      if (nopolMatch) {
        setCustomOrderMeta((prev) => ({
          ...prev,
          nopol: nopolMatch[2].toUpperCase().trim(),
        }));
      }
    }

    // Match products
    products.forEach((p) => {
      const pName = p.name.toLowerCase();
      if (lowerText.includes(pName)) {
        const afterName = lowerText.split(pName)[1] || '';
        const match = afterName.match(
          /(\d+|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh)/
        );
        let qty = 1;
        if (match) {
          const val = match[1];
          qty = parseInt(val) || numberMap[val] || 1;
        }
        addToCart(p.id, qty);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      showToast(`Ditambahkan ${addedCount} item dari suara!`);
    } else {
      showToast('Nama item tidak terdeteksi dari ucapan.', 'warning');
    }
  };

  // Parse Voice Stock Text
  const parseStockVoiceText = (text: string) => {
    const lowerText = text.toLowerCase();
    const matchedProduct = products.find((p) => lowerText.includes(p.name.toLowerCase()));

    if (!matchedProduct) {
      showToast('Item tidak ditemukan di katalog.', 'warning');
      return;
    }

    const numberMatch = lowerText.match(/\d+/);
    if (!numberMatch) {
      showToast('Angka jumlah stok tidak terdeteksi.', 'warning');
      return;
    }
    const amount = parseInt(numberMatch[0]);

    if (lowerText.includes('tambah') || lowerText.includes('masuk')) {
      const updated = products.map((p) =>
        p.id === matchedProduct.id ? { ...p, stock: p.stock + amount } : p
      );
      saveProducts(updated);
      showToast(`Stok ${matchedProduct.name} bertambah +${amount}`);
    } else if (lowerText.includes('koreksi') || lowerText.includes('sisa')) {
      const updated = products.map((p) =>
        p.id === matchedProduct.id ? { ...p, stock: amount } : p
      );
      saveProducts(updated);
      showToast(`Stok ${matchedProduct.name} dikoreksi ke ${amount}`);
    }
  };

  // Add to Cart
  const addToCart = (productId: string, qtyToAdd = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === productId);
      if (existing) {
        return prev.map((i) =>
          i.id === productId ? { ...i, qty: i.qty + qtyToAdd } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          qty: qtyToAdd,
          note: '',
        },
      ];
    });
  };

  // Update Cart Item Qty
  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as POSCartItem[];
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
    setCustomOrderMeta({});
  };

  // Validate Cart Stock
  const stockWarnings = cart
    .map((item) => {
      const prod = products.find((p) => p.id === item.id);
      if (!prod || item.qty > prod.stock) {
        return {
          name: item.name,
          requested: item.qty,
          available: prod ? prod.stock : 0,
        };
      }
      return null;
    })
    .filter(Boolean);

  const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Complete Checkout
  const processCheckout = (actionType: 'SAVE' | 'WA' | 'PRINT') => {
    if (cart.length === 0) {
      showToast('Keranjang belanjaan masih kosong!', 'warning');
      return;
    }

    if (stockWarnings.length > 0) {
      alert('Jumlah pesanan melebihi stok yang tersedia. Kurangi pesanan.');
      return;
    }

    const trxId = 'TRX-' + Date.now().toString().slice(-6);
    const newTrx: POSTransaction = {
      id: trxId,
      timestamp: new Date().toISOString(),
      items: [...cart],
      total: totalCartPrice,
      paymentMethod,
      customerPhone: customerPhone.trim() || undefined,
      category: settings.bizCategory,
      meta: { ...customOrderMeta },
    };

    // Deduct stock
    const updatedProducts = products.map((p) => {
      const cartItem = cart.find((ci) => ci.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
      }
      return p;
    });
    saveProducts(updatedProducts);

    const updatedTrxList = [newTrx, ...transactions];
    saveTransactions(updatedTrxList);

    if (actionType === 'WA') {
      sendReceiptWA(newTrx);
    } else if (actionType === 'PRINT') {
      setPrintTransaction(newTrx);
    } else {
      showToast(`Transaksi ${trxId} berhasil disimpan!`);
    }

    clearCart();
    setCustomerPhone('');
  };

  // Send Receipt via WhatsApp
  const sendReceiptWA = (trx: POSTransaction) => {
    let phone = trx.customerPhone || '';
    if (phone.startsWith('0')) phone = '62' + phone.slice(1);

    let text = `*${settings.storeName.toUpperCase()}*\n`;
    if (settings.address) text += `${settings.address}\n`;
    text += `--------------------------------\n`;
    text += `No Nota: ${trx.id}\n`;
    text += `Tanggal: ${new Date(trx.timestamp).toLocaleString('id-ID')}\n`;
    text += `Bayar: ${trx.paymentMethod}\n`;

    if (trx.meta) {
      if (trx.meta.meja) text += `Info: ${trx.meta.meja}\n`;
      if (trx.meta.nopol) text += `Nopol: ${trx.meta.nopol}\n`;
      if (trx.meta.durasi) text += `Durasi: ${trx.meta.durasi}\n`;
      if (trx.meta.catatan) text += `Catatan: ${trx.meta.catatan}\n`;
    }

    text += `--------------------------------\n`;
    trx.items.forEach((i) => {
      text += `• ${i.name} x${i.qty} = Rp ${(i.price * i.qty).toLocaleString('id-ID')}\n`;
    });
    text += `--------------------------------\n`;
    text += `*TOTAL: Rp ${trx.total.toLocaleString('id-ID')}*\n\n`;
    text += `${settings.footerMsg || 'Terima kasih atas kunjungan Anda!'}`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Onboarding Completion
  const completeOnboarding = (useDefault = false) => {
    const updated = {
      ...settings,
      bizCategory: selectedOnboardingCat,
      storeName: !useDefault && obStoreName.trim() ? obStoreName.trim() : settings.storeName,
      phone: !useDefault && obStorePhone.trim() ? obStorePhone.trim() : settings.phone,
    };
    saveSettings(updated);
    localStorage.setItem('usahaqu_onboarding_done', 'true');

    // Load sample products of chosen category
    const sample = SAMPLE_CATALOGS[selectedOnboardingCat];
    saveProducts([...sample]);

    setIsOnboardingOpen(false);
    showToast(`Konfigurasi profil usaha (${selectedOnboardingCat.toUpperCase()}) berhasil diterapkan!`);
  };

  // Reset to default
  const handleQuickReset = () => {
    if (confirm('Kembalikan data katalog dan transaksi ke contoh awal?')) {
      const def = { ...DEFAULT_SETTINGS };
      saveSettings(def);
      saveProducts([...SAMPLE_CATALOGS.kuliner]);
      saveTransactions([]);
      localStorage.removeItem('usahaqu_onboarding_done');
      setIsOnboardingOpen(true);
      showToast('Data berhasil di-reset!');
    }
  };

  // Add / Edit Product Submit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProdName.trim() || formProdPrice === '' || formProdStock === '') return;

    if (editingProductId) {
      const updated = products.map((p) =>
        p.id === editingProductId
          ? {
              ...p,
              name: formProdName.trim(),
              price: Number(formProdPrice),
              stock: Number(formProdStock),
              unit: formProdUnit.trim() || 'porsi',
            }
          : p
      );
      saveProducts(updated);
      showToast('Item berhasil diperbarui.');
    } else {
      const newProd: POSProduct = {
        id: 'P' + Date.now().toString().slice(-4),
        name: formProdName.trim(),
        price: Number(formProdPrice),
        stock: Number(formProdStock),
        unit: formProdUnit.trim() || 'porsi',
      };
      saveProducts([...products, newProd]);
      showToast('Item baru ditambahkan ke katalog.');
    }

    setEditingProductId(null);
    setFormProdName('');
    setFormProdPrice('');
    setFormProdStock('');
    setFormProdUnit('porsi');
  };

  const startEditProduct = (p: POSProduct) => {
    setEditingProductId(p.id);
    setFormProdName(p.name);
    setFormProdPrice(p.price);
    setFormProdStock(p.stock);
    setFormProdUnit(p.unit);
    setActiveTab('stok');
  };

  const deleteProduct = (id: string) => {
    if (confirm('Hapus item ini dari katalog?')) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
      showToast('Item dihapus.');
    }
  };

  // Save Receipt Settings
  const handleSaveReceiptSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: POSSettings = {
      ...settings,
      storeName: settingStoreName.trim(),
      address: settingAddress.trim(),
      phone: settingPhone.trim(),
      headerMsg: settingHeaderMsg.trim(),
      footerMsg: settingFooterMsg.trim(),
    };
    saveSettings(updated);
    showToast('Pengaturan struk berhasil disimpan!');
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* ========================================================= */}
      {/* 1. ONBOARDING WIZARD MODAL                                */}
      {/* ========================================================= */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className={`border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Step Indicator Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-lg">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg">Konfigurasi UsahaQu</h2>
                  <p className="text-xs text-slate-400">Sesuaikan aplikasi dengan kategori bisnis Anda</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                Langkah {onboardingStep}/2
              </span>
            </div>

            {/* STEP 1: PILIH KATEGORI USAHA */}
            {onboardingStep === 1 && (
              <div className="space-y-3.5">
                <p className="text-xs font-semibold text-slate-300">
                  Pilih Jenis / Kategori Usaha Anda:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Kuliner */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOnboardingCat('kuliner');
                      setObStoreUnit('porsi');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition space-y-2 cursor-pointer ${
                      selectedOnboardingCat === 'kuliner'
                        ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                        : isDark
                        ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm">Kuliner / F&B</h4>
                      <p className="text-[10px] text-slate-400">
                        Resto, Kedai, Kafe (No. Meja, Pedas/Varian, Porsi)
                      </p>
                    </div>
                  </button>

                  {/* Ritel */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOnboardingCat('ritel');
                      setObStoreUnit('pcs');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition space-y-2 cursor-pointer ${
                      selectedOnboardingCat === 'ritel'
                        ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                        : isDark
                        ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm">Ritel / Toko</h4>
                      <p className="text-[10px] text-slate-400">
                        Warung, Minimarket (Stok Fisik, Pcs/Pack)
                      </p>
                    </div>
                  </button>

                  {/* Jasa */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOnboardingCat('jasa');
                      setObStoreUnit('slot');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition space-y-2 cursor-pointer ${
                      selectedOnboardingCat === 'jasa'
                        ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                        : isDark
                        ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-lg">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm">Jasa / Servis</h4>
                      <p className="text-[10px] text-slate-400">
                        Bengkel, Salon, Laundry (Nopol, Keluhan, Slot)
                      </p>
                    </div>
                  </button>

                  {/* Sewa */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOnboardingCat('sewa');
                      setObStoreUnit('unit');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition space-y-2 cursor-pointer ${
                      selectedOnboardingCat === 'sewa'
                        ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                        : isDark
                        ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm">Sewa / Rental</h4>
                      <p className="text-[10px] text-slate-400">
                        Rental Kamera, Otomotif (Durasi, Jaminan KTP)
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DETAIL PROFIL USAHA */}
            {onboardingStep === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Nama Usaha / Toko
                  </label>
                  <input
                    type="text"
                    value={obStoreName}
                    onChange={(e) => setObStoreName(e.target.value)}
                    placeholder="Contoh: Kedai Bageur / Servis Cepat"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Satuan Stok Utama
                  </label>
                  <input
                    type="text"
                    value={obStoreUnit}
                    onChange={(e) => setObStoreUnit(e.target.value)}
                    placeholder="porsi / pcs / unit / jam / slot"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    No. WhatsApp Toko / Kasir
                  </label>
                  <input
                    type="tel"
                    value={obStorePhone}
                    onChange={(e) => setObStorePhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* FOOTER WIZARD BUTTONS */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
              {onboardingStep === 2 ? (
                <button
                  type="button"
                  onClick={() => setOnboardingStep(1)}
                  className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => completeOnboarding(true)}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Gunakan Default
                </button>
              )}

              <div className="flex gap-2 ml-auto">
                {onboardingStep === 1 ? (
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(2)}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => completeOnboarding(false)}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Selesai & Kunci</span>
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TOP HEADER                                             */}
      {/* ========================================================= */}
      <header
        className={`border-b sticky top-0 z-30 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 shadow-xs transition-colors ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-white'
            : 'bg-white/95 border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBackToAppQu}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-black'
            }`}
            title="Kembali ke Dashboard Utama WargaQu"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-base shadow-md shrink-0">
            UQ
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-extrabold text-sm sm:text-base leading-tight truncate">
                {settings.storeName || 'Kedai UsahaQu'}
              </h1>
              <span className="px-2 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 font-extrabold text-[9px] uppercase border border-emerald-500/30 shrink-0">
                {settings.bizCategory}
              </span>
            </div>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Smart POS Adaptif UsahaQu</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-lg border transition cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-amber-300'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              title="Ganti Mode Gelap/Terang"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setSelectedOnboardingCat(settings.bizCategory);
              setObStoreName(settings.storeName);
              setObStorePhone(settings.phone);
              setOnboardingStep(1);
              setIsOnboardingOpen(true);
            }}
            title="Ubah Profil & Kategori Usaha"
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-emerald-400 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-emerald-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ubah Profil</span>
          </button>

          <button
            type="button"
            onClick={handleQuickReset}
            title="Reset Contoh Data"
            className={`p-2 rounded-lg border transition cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-500 hover:text-rose-600'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. MAIN WORKSPACE CONTAINER (GRID KONTEN + SIDEBAR KASIR) */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* ================= SECTION KONTEN (TAB 1, 2, 3) ================= */}
        <section className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* TAB NAVIGATION BAR */}
          <div
            className={`flex p-1.5 rounded-2xl border gap-1.5 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTab('kasir')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'kasir'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Kasir / Order</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stok')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'stok'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>Stok & Produk</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('riwayat')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'riwayat'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Struk & Riwayat</span>
            </button>
          </div>

          {/* ================= TAB 1: KASIR / SMART ORDER ================= */}
          {activeTab === 'kasir' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* SMART VOICE ORDER CARD */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 relative overflow-hidden shadow-xl text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Volume2 className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-sm">Smart Voice Order</h3>
                      <p className="text-xs text-slate-400">
                        {settings.bizCategory === 'kuliner'
                          ? 'Contoh ucapan: "Ayam bakar dua pedas meja 4"'
                          : settings.bizCategory === 'jasa'
                          ? 'Contoh ucapan: "Ganti oli vario nopol B 1234 CD"'
                          : settings.bizCategory === 'sewa'
                          ? 'Contoh ucapan: "Sewa kamera DSLR 2 hari jaminan KTP"'
                          : 'Contoh ucapan: "Minyak goreng dua beras satu"'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleVoiceOrder}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer ${
                      isListeningOrder
                        ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    }`}
                  >
                    {isListeningOrder ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span>{isListeningOrder ? 'Stop Mendengarkan...' : 'Mulai Bicara Pesanan'}</span>
                  </button>
                </div>

                {orderVoiceTranscript && (
                  <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-emerald-300 italic flex items-center justify-between">
                    <span>{orderVoiceTranscript}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>
                )}
              </div>

              {/* KATALOG MANUAL SEARCH & GRID */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
                  <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-500" />
                    <span>Pilih Katalog Item / Menu</span>
                  </h3>
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Cari katalog..."
                      className={`w-full text-xs rounded-xl pl-8 pr-3 py-2 border focus:outline-hidden ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Grid Katalog Produk */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-xs text-slate-500">
                      Item tidak ditemukan di katalog
                    </div>
                  ) : (
                    filteredProducts.map((p) => {
                      const isOutOfStock = p.stock <= 0;
                      const isLowStock = p.stock > 0 && p.stock < 5;

                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (!isOutOfStock) addToCart(p.id);
                          }}
                          className={`p-3 rounded-xl border transition flex flex-col justify-between cursor-pointer select-none ${
                            isOutOfStock
                              ? 'bg-slate-900/30 border-slate-800 opacity-60 cursor-not-allowed'
                              : isDark
                              ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 active:scale-95'
                              : 'bg-slate-50 border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/30 active:scale-95'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span className="font-bold text-xs line-clamp-2">{p.name}</span>
                              {isLowStock && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                                  Kritis
                                </span>
                              )}
                              {isOutOfStock && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">
                                  Habis
                                </span>
                              )}
                            </div>
                            <p className="text-emerald-500 font-black text-xs">
                              Rp {p.price.toLocaleString('id-ID')}
                            </p>
                          </div>

                          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/40">
                            <span>
                              Sisa: <b>{p.stock}</b> {p.unit}
                            </span>
                            <Plus className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: SMART STOK & MANAJEMEN PRODUK ================= */}
          {activeTab === 'stok' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* SMART VOICE STOK */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 p-4 rounded-2xl border border-sky-500/30 shadow-xl text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm">Smart Voice Update Stok</h3>
                    <p className="text-xs text-slate-400">
                      Perintah cepat: "Tambah stok [nama] 10" atau "Koreksi stok [nama] 5"
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleVoiceStock}
                  className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer ${
                    isListeningStock
                      ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
                  }`}
                >
                  {isListeningStock ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span>{isListeningStock ? 'Mendengarkan Instruksi...' : 'Bicara Update Stok'}</span>
                </button>

                {stockVoiceTranscript && (
                  <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-sky-300 italic">
                    <span>{stockVoiceTranscript}</span>
                  </div>
                )}
              </div>

              {/* FORM TAMBAH / EDIT PRODUK MANUAL */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-500" />
                    <span>{editingProductId ? 'Edit Katalog Item' : 'Tambah Items / Layanan Baru'}</span>
                  </h3>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProductId(null);
                        setFormProdName('');
                        setFormProdPrice('');
                        setFormProdStock('');
                        setFormProdUnit('porsi');
                      }}
                      className="text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Nama Item / Menu / Layanan
                    </label>
                    <input
                      type="text"
                      required
                      value={formProdName}
                      onChange={(e) => setFormProdName(e.target.value)}
                      placeholder="Contoh: Ayam Bakar / Ganti Oli"
                      className={`w-full text-xs rounded-xl px-3 py-2 border focus:outline-hidden ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Harga Satuan (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      value={formProdPrice}
                      onChange={(e) => setFormProdPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="10000"
                      className={`w-full text-xs rounded-xl px-3 py-2 border focus:outline-hidden ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Jumlah Stok / Slot Tersedia
                    </label>
                    <input
                      type="number"
                      required
                      value={formProdStock}
                      onChange={(e) => setFormProdStock(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="25"
                      className={`w-full text-xs rounded-xl px-3 py-2 border focus:outline-hidden ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Satuan (porsi, pcs, slot, unit)
                    </label>
                    <input
                      type="text"
                      required
                      value={formProdUnit}
                      onChange={(e) => setFormProdUnit(e.target.value)}
                      placeholder="porsi"
                      className={`w-full text-xs rounded-xl px-3 py-2 border focus:outline-hidden ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-2 pt-1">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingProductId ? 'Perbarui Katalog' : 'Simpan ke Katalog'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* DAFTAR INVENTORY / STOK PRODUK */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-emerald-500" />
                  <span>Daftar Katalog & Ketersediaan ({products.length} Items)</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead
                      className={`uppercase font-semibold ${
                        isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <tr>
                        <th className="p-3">Nama Item</th>
                        <th className="p-3">Harga</th>
                        <th className="p-3">Stok / Slot</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {products.map((p) => {
                        const isLow = p.stock < 5;
                        return (
                          <tr key={p.id} className="hover:bg-slate-800/20 transition">
                            <td className="p-3 font-semibold">{p.name}</td>
                            <td className="p-3">Rp {p.price.toLocaleString('id-ID')}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  isLow
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-200'
                                }`}
                              >
                                {p.stock} {p.unit}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                type="button"
                                onClick={() => startEditProduct(p)}
                                className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteProduct(p.id)}
                                className="text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: PENGATURAN STRUK & RIWAYAT ================= */}
          {activeTab === 'riwayat' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* PENGATURAN STRUK TOKO */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <span>Pengaturan Struk & Profil Usaha</span>
                </h3>
                <form onSubmit={handleSaveReceiptSettings} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Nama Toko / Usaha</label>
                      <input
                        type="text"
                        required
                        value={settingStoreName}
                        onChange={(e) => setSettingStoreName(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2 border focus:outline-hidden ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Kategori Usaha Aktif</label>
                      <select
                        value={settings.bizCategory}
                        onChange={(e) => {
                          const newCat = e.target.value as BizCategory;
                          if (
                            confirm(
                              `Ganti kategori ke ${newCat.toUpperCase()}? Contoh katalog akan dimuat ulang.`
                            )
                          ) {
                            saveSettings({ ...settings, bizCategory: newCat });
                            saveProducts([...SAMPLE_CATALOGS[newCat]]);
                            showToast(`Kategori berganti ke ${newCat.toUpperCase()}`);
                          }
                        }}
                        className={`w-full rounded-xl px-3 py-2 border focus:outline-hidden font-bold text-emerald-400 ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="kuliner">Kuliner / F&B</option>
                        <option value="ritel">Ritel / Toko</option>
                        <option value="jasa">Jasa / Servis / Bengkel</option>
                        <option value="sewa">Sewa / Rental</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Alamat Usaha</label>
                    <input
                      type="text"
                      value={settingAddress}
                      onChange={(e) => setSettingAddress(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 border focus:outline-hidden ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">No. WhatsApp Kasir</label>
                    <input
                      type="text"
                      value={settingPhone}
                      onChange={(e) => setSettingPhone(e.target.value)}
                      placeholder="08123456789"
                      className={`w-full rounded-xl px-3 py-2 border focus:outline-hidden ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Pesan Header Struk</label>
                      <input
                        type="text"
                        value={settingHeaderMsg}
                        onChange={(e) => setSettingHeaderMsg(e.target.value)}
                        placeholder="Selamat Datang!"
                        className={`w-full rounded-xl px-3 py-2 border focus:outline-hidden ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Pesan Footer Struk</label>
                      <input
                        type="text"
                        value={settingFooterMsg}
                        onChange={(e) => setSettingFooterMsg(e.target.value)}
                        placeholder="Terima Kasih Atas Kunjungan Anda"
                        className={`w-full rounded-xl px-3 py-2 border focus:outline-hidden ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="submit"
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Pengaturan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOnboardingOpen(true)}
                      className="text-xs text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Buka Wizard Kuesioner</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* RIWAYAT TRANSAKSI */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-500" />
                    <span>Riwayat Transaksi ({transactions.length})</span>
                  </h3>
                  {transactions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Hapus seluruh riwayat transaksi?')) {
                          saveTransactions([]);
                          showToast('Riwayat transaksi dibersihkan.');
                        }
                      }}
                      className="text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      Hapus Riwayat
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {transactions.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">
                      Belum ada riwayat transaksi tersimpan.
                    </p>
                  ) : (
                    transactions.map((trx) => {
                      const itemNames = trx.items
                        .map((i) => `${i.name} (${i.qty})`)
                        .join(', ');
                      const dateStr = new Date(trx.timestamp).toLocaleString('id-ID', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      });

                      return (
                        <div
                          key={trx.id}
                          className={`p-3 rounded-xl border space-y-2 text-xs ${
                            isDark
                              ? 'bg-slate-950 border-slate-800'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-emerald-400">{trx.id}</span>
                            <span className="text-slate-400 font-normal text-[11px]">{dateStr}</span>
                          </div>
                          <p className="line-clamp-1">{itemNames}</p>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-800/40">
                            <span className="font-extrabold text-white">
                              Rp {trx.total.toLocaleString('id-ID')} ({trx.paymentMethod})
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => sendReceiptWA(trx)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-700/40 text-emerald-300 hover:bg-emerald-700 font-semibold cursor-pointer"
                              >
                                WA
                              </button>
                              <button
                                type="button"
                                onClick={() => setPrintTransaction(trx)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold cursor-pointer"
                              >
                                Cetak
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ================= SIDEBAR / RINGKASAN KERANJANG ================= */}
        <section className="lg:col-span-5 xl:col-span-4">
          <div
            className={`border rounded-2xl p-4 sticky top-16 shadow-2xl flex flex-col h-[calc(100vh-80px)] max-h-[750px] ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* HEADER KERANJANG */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-sm sm:text-base">Keranjang Order</h2>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan</span>
                </button>
              )}
            </div>

            {/* DYNAMIC CATEGORY FIELDS */}
            <div
              className={`mt-2.5 p-2.5 rounded-xl border text-xs space-y-2 ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {settings.bizCategory === 'kuliner' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-0.5 text-[11px]">No. Meja / Dine-in</label>
                    <input
                      type="text"
                      value={customOrderMeta.meja || ''}
                      onChange={(e) => setCustomOrderMeta((prev) => ({ ...prev, meja: e.target.value }))}
                      placeholder="Meja 05 / Takeaway"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 focus:outline-hidden text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5 text-[11px]">Catatan Dapur</label>
                    <input
                      type="text"
                      value={customOrderMeta.catatan || ''}
                      onChange={(e) => setCustomOrderMeta((prev) => ({ ...prev, catatan: e.target.value }))}
                      placeholder="Pedas / Tanpa Bawang"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 focus:outline-hidden text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {settings.bizCategory === 'jasa' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-0.5 text-[11px]">No. Plat / Nopol</label>
                    <input
                      type="text"
                      value={customOrderMeta.nopol || ''}
                      onChange={(e) => setCustomOrderMeta((prev) => ({ ...prev, nopol: e.target.value }))}
                      placeholder="B 1234 CD"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 focus:outline-hidden text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5 text-[11px]">Keluhan / Mekanik</label>
                    <input
                      type="text"
                      value={customOrderMeta.keluhan || ''}
                      onChange={(e) => setCustomOrderMeta((prev) => ({ ...prev, keluhan: e.target.value }))}
                      placeholder="Rem blong / Mas Budi"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 focus:outline-hidden text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {settings.bizCategory === 'sewa' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-0.5 text-[11px]">Durasi Sewa</label>
                    <input
                      type="text"
                      value={customOrderMeta.durasi || ''}
                      onChange={(e) => setCustomOrderMeta((prev) => ({ ...prev, durasi: e.target.value }))}
                      placeholder="2 Hari / 12 Jam"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 focus:outline-hidden text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5 text-[11px]">Jaminan (KTP/SIM)</label>
                    <input
                      type="text"
                      value={customOrderMeta.jaminan || ''}
                      onChange={(e) => setCustomOrderMeta((prev) => ({ ...prev, jaminan: e.target.value }))}
                      placeholder="KTP a.n. Budi"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 focus:outline-hidden text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {settings.bizCategory === 'ritel' && (
                <div>
                  <label className="block text-slate-400 mb-0.5 text-[11px]">Catatan Pembelian</label>
                  <input
                    type="text"
                    value={customOrderMeta.catatan || ''}
                    onChange={(e) => setCustomOrderMeta((prev) => ({ ...prev, catatan: e.target.value }))}
                    placeholder="Diskon member / Kemasan kardus"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 focus:outline-hidden text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* WARNING STOK BOX */}
            {stockWarnings.length > 0 && (
              <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 space-y-1">
                {stockWarnings.map((w, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>
                      <b>{w?.name}</b> minta {w?.requested}, sisa {w?.available}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* DAFTAR ITEM DI KERANJANG */}
            <div className="flex-1 my-2 overflow-y-auto divide-y divide-slate-800/40 pr-1">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-6 space-y-2">
                  <ShoppingCart className="w-8 h-8 text-slate-600" />
                  <p>
                    Keranjang masih kosong.
                    <br />
                    Bicarakan pesanan atau ketuk katalog item.
                  </p>
                </div>
              ) : (
                cart.map((item) => {
                  const subtotal = item.price * item.qty;

                  return (
                    <div key={item.id} className="py-2.5 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-xs">{item.name}</p>
                          <p className="text-[10px] text-slate-400">
                            Rp {item.price.toLocaleString('id-ID')} / {item.unit}
                          </p>
                        </div>
                        <p className="font-bold text-xs text-emerald-400">
                          Rp {subtotal.toLocaleString('id-ID')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={item.note || ''}
                          placeholder="Catatan item..."
                          onChange={(e) => {
                            const val = e.target.value;
                            setCart((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, note: val } : i))
                            );
                          }}
                          className={`text-[10px] rounded-lg px-2 py-1 flex-1 border focus:outline-hidden ${
                            isDark
                              ? 'bg-slate-950 border-slate-800 text-slate-300 focus:border-emerald-500'
                              : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-600'
                          }`}
                        />
                        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, -1)}
                            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-white">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, 1)}
                            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* SUMMARY & CHECKOUT BUTTONS */}
            <div className="pt-2.5 border-t border-slate-800/60 space-y-2.5">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Total Items</span>
                  <span className="font-semibold text-white">{totalCartQty} item</span>
                </div>
                <div className="flex justify-between text-slate-200 text-base font-extrabold pt-1 border-t border-slate-800/40">
                  <span>TOTAL BAYAR</span>
                  <span className="text-emerald-400 font-black text-lg">
                    Rp {totalCartPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* PAYMENT METHOD & CUSTOMER WA */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px] font-medium">Metode Bayar</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-1.5 focus:outline-hidden text-xs"
                  >
                    <option value="Tunai">Tunai / Cash</option>
                    <option value="QRIS">QRIS / Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px] font-medium">No. WA Pelanggan</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0812xxx (opsional)"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-1.5 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS (SIMPAN, WA, CETAK) */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => processCheckout('SAVE')}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex flex-col items-center justify-center gap-1 transition border border-slate-700 active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>Simpan</span>
                </button>
                <button
                  type="button"
                  onClick={() => processCheckout('WA')}
                  className="py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex flex-col items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-white" />
                  <span>Kirim WA</span>
                </button>
                <button
                  type="button"
                  onClick={() => processCheckout('PRINT')}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex flex-col items-center justify-center gap-1 transition shadow-lg shadow-emerald-600/30 active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-white" />
                  <span>Cetak</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* 4. MODAL CETAK STRUK THERMAL                              */}
      {/* ========================================================= */}
      {printTransaction && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-stone-900 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 font-mono text-xs">
            <div className="text-center space-y-0.5 border-b border-dashed pb-3">
              <h2 className="text-base font-black uppercase tracking-wider">{settings.storeName}</h2>
              <p className="text-[11px] text-stone-600">{settings.address}</p>
              <p className="text-[11px] text-stone-600">WA: {settings.phone}</p>
              {settings.headerMsg && (
                <p className="text-[10px] italic text-stone-500 mt-1">{settings.headerMsg}</p>
              )}
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>No: {printTransaction.id}</span>
                <span>{new Date(printTransaction.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between">
                <span>Tgl: {new Date(printTransaction.timestamp).toLocaleDateString('id-ID')}</span>
                <span>{printTransaction.paymentMethod}</span>
              </div>
              {printTransaction.meta?.meja && <div>Info: {printTransaction.meta.meja}</div>}
              {printTransaction.meta?.nopol && <div>Nopol: {printTransaction.meta.nopol}</div>}
              {printTransaction.meta?.durasi && <div>Durasi: {printTransaction.meta.durasi}</div>}
            </div>

            <div className="border-t border-b border-dashed py-2 space-y-1.5">
              {printTransaction.items.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <span>
                    {i.name} x{i.qty}
                  </span>
                  <span>Rp {(i.price * i.qty).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="text-right text-sm font-black">
              TOTAL: Rp {printTransaction.total.toLocaleString('id-ID')}
            </div>

            {settings.footerMsg && (
              <p className="text-center text-[10px] text-stone-500 border-t border-dashed pt-2">
                {settings.footerMsg}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPrintTransaction(null)}
                className="flex-1 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Struk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. TOAST NOTIFICATION                                     */}
      {/* ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs max-w-sm animate-in slide-in-from-bottom duration-200">
          {toastType === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
