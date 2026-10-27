import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X, RefreshCw, CheckCircle2, Smartphone } from 'lucide-react';
import { pwaService } from '../../services/pwaService';

export const PWAInstallBanner: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    // Cek apakah sudah running standalone
    const standalone = pwaService.isStandalone();
    setIsStandalone(standalone);
    setIsIOS(pwaService.isIOS());

    // Cek ketersediaan prompt install
    const unsubscribeInstall = pwaService.onInstallAvailabilityChange((available) => {
      setCanInstall(available);
    });

    // Cek ketersediaan update
    const unsubscribeUpdate = pwaService.onUpdateAvailable(() => {
      setHasUpdate(true);
    });

    // Cek apakah user pernah dismiss baru-baru ini
    const dismissedTime = localStorage.getItem('wargaqu_pwa_banner_dismissed');
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 24 * 60 * 60 * 1000) {
      setIsDismissed(true);
    }

    return () => {
      unsubscribeInstall();
      unsubscribeUpdate();
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    const success = await pwaService.promptInstall();
    if (success) {
      setCanInstall(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('wargaqu_pwa_banner_dismissed', Date.now().toString());
  };

  const handleUpdate = () => {
    pwaService.updateNow();
  };

  // Jika update tersedia, selalu prioritaskan banner update
  if (hasUpdate) {
    return (
      <div className="fixed top-3 left-3 right-3 max-w-md mx-auto z-50 animate-bounce">
        <div className="bg-emerald-900 border border-emerald-400 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
            <div>
              <p className="text-xs font-bold">Pembaruan WargaQu Siap!</p>
              <p className="text-[11px] text-emerald-200">Muat ulang untuk fitur & performa terbaru.</p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-stone-900 text-xs font-black rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
          >
            Perbarui
          </button>
        </div>
      </div>
    );
  }

  // Jika sudah standalone atau ditutup user atau tidak bisa diinstall
  if (isStandalone || isDismissed || (!canInstall && !isIOS)) {
    return null;
  }

  return (
    <>
      {/* Banner Floating Install di bawah layar sebelum navbar */}
      <div className="fixed bottom-20 left-3 right-3 max-w-md mx-auto z-40">
        <div className="bg-stone-900/95 dark:bg-stone-950/95 border border-emerald-500/40 text-stone-100 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shrink-0 shadow-md border border-white/20">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate flex items-center gap-1.5 text-white">
                Pasang WargaQu 1.2.7
                <span className="text-[9px] bg-emerald-500/30 text-emerald-300 font-mono px-1.5 py-0.5 rounded-full border border-emerald-500/30">Offline</span>
              </p>
              <p className="text-[11px] text-stone-400 truncate">
                {isIOS ? 'Tambahkan ke Layar Utama iPhone' : 'Akses cepat & hemat kuota di Android'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Petunjuk Khusus iOS (Safari) */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-900 border border-emerald-600/40 rounded-3xl p-5 max-w-sm w-full text-stone-100 shadow-2xl relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white bg-stone-800/80 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                WQ
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Pasang di iPhone / iPad</h3>
                <p className="text-xs text-stone-400">Petunjuk PWA iOS Safari</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-300 bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <p>
                  Ketuk tombol <strong className="text-emerald-300 inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Bagikan (Share)</strong> pada bilah bawah browser Safari Anda.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <p>
                  Gulir ke bawah dan pilih opsi <strong className="text-emerald-300 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5" /> Tambah ke Layar Utama</strong> (Add to Home Screen).
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <p>
                  Ketuk <strong className="text-white">Tambah</strong> di sudut kanan atas. Ikon WargaQu 1.2.7 akan siap dibuka kapan saja dari layar ponsel Anda!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};
